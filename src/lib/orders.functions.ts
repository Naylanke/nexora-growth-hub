import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const orderInputSchema = z.object({
  serviceId: z.string().uuid(),
  link: z.string().trim().url("Enter a valid link").max(500),
  quantity: z.number().int().min(1).max(10_000_000),
});

/**
 * Places an order. The charge is always computed on the server from the stored
 * service rate — client supplied prices are never trusted.
 */
export const placeOrder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => orderInputSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    const { data: service, error: serviceError } = await supabase
      .from("services")
      .select(
        "id, name, rate, min_quantity, max_quantity, is_active, provider_service_id, service_categories(name)",
      )
      .eq("id", data.serviceId)
      .maybeSingle();

    if (serviceError) throw new Error(serviceError.message);
    if (!service || !service.is_active) throw new Error("This service is not available");
    if (data.quantity < service.min_quantity || data.quantity > service.max_quantity) {
      throw new Error(
        `Quantity must be between ${service.min_quantity} and ${service.max_quantity}`,
      );
    }

    const charge = Math.round((Number(service.rate) * data.quantity) / 1000 * 10000) / 10000;

    const { data: profile } = await supabase
      .from("profiles")
      .select("balance")
      .eq("id", userId)
      .maybeSingle();

    if (!profile || Number(profile.balance) < charge) {
      throw new Error("Insufficient wallet balance. Please add funds first.");
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert({
        user_id: userId,
        service_id: service.id,
        service_name: service.name,
        category:
          (service as unknown as { service_categories: { name: string } | null })
            .service_categories?.name ?? null,
        link: data.link,
        quantity: data.quantity,
        charge,
        status: "pending",
      })
      .select("id")
      .single();

    if (orderError) throw new Error(orderError.message);

    const { error: walletError } = await supabaseAdmin.rpc("apply_wallet_change", {
      _user_id: userId,
      _amount: -charge,
      _type: "order",
      _description: `Order — ${service.name}`,
      _reference_id: order.id,
      _created_by: userId,
    } as never);

    if (walletError) {
      await supabaseAdmin
        .from("orders")
        .update({ status: "failed", provider_status: "wallet_error" })
        .eq("id", order.id);
      throw new Error("Could not charge your wallet. The order was not placed.");
    }

    // Dispatch to the provider when credentials are configured.
    try {
      const { isProviderConfigured, provider } = await import("@/lib/smm-provider.server");
      if (isProviderConfigured() && service.provider_service_id) {
        const result = await provider.createOrder({
          service: service.provider_service_id,
          link: data.link,
          quantity: data.quantity,
        });
        if (result.order) {
          await supabaseAdmin
            .from("orders")
            .update({ provider_order_id: String(result.order), status: "processing" })
            .eq("id", order.id);
        }
      }
    } catch (err) {
      console.error("provider dispatch failed", err);
    }

    await supabaseAdmin.from("notifications").insert({
      user_id: userId,
      title: "Order created",
      body: `${service.name} × ${data.quantity}`,
      kind: "order",
    });

    return { orderId: order.id, charge };
  });

export const getOrder = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string }) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { data: order, error } = await context.supabase
      .from("orders")
      .select("*")
      .eq("id", data.id)
      .eq("user_id", context.userId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!order) throw new Error("Order not found");
    return { ...order, charge: Number(order.charge) };
  });
