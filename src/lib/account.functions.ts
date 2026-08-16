import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type DashboardData = {
  profile: {
    full_name: string | null;
    username: string | null;
    balance: number;
    currency: string;
    referral_code: string | null;
    referral_earnings: number;
    role: string;
  };
  counts: {
    total: number;
    completed: number;
    processing: number;
    pending: number;
    cancelled: number;
  };
  spending: Array<{ day: string; amount: number }>;
  recentOrders: Array<{
    id: string;
    service_name: string;
    quantity: number;
    charge: number;
    status: string;
    created_at: string;
  }>;
};

export const getDashboardData = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<DashboardData> => {
    const { supabase, userId } = context;

    const [{ data: profile }, { data: roles }, { data: orders }] = await Promise.all([
      supabase
        .from("profiles")
        .select("full_name, username, balance, currency, referral_code, referral_earnings")
        .eq("id", userId)
        .maybeSingle(),
      supabase.from("user_roles").select("role").eq("user_id", userId),
      supabase
        .from("orders")
        .select("id, service_name, quantity, charge, status, created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(200),
    ]);

    const all = orders ?? [];
    const counts = {
      total: all.length,
      completed: all.filter((o) => o.status === "completed").length,
      processing: all.filter((o) => o.status === "processing" || o.status === "in_progress").length,
      pending: all.filter((o) => o.status === "pending").length,
      cancelled: all.filter((o) => o.status === "cancelled" || o.status === "failed").length,
    };

    const days: Array<{ day: string; amount: number }> = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const amount = all
        .filter((o) => o.created_at.slice(0, 10) === key)
        .reduce((sum, o) => sum + Number(o.charge), 0);
      days.push({ day: key.slice(5), amount: Math.round(amount * 100) / 100 });
    }

    const role = roles?.some((r) => r.role === "admin")
      ? "admin"
      : roles?.some((r) => r.role === "reseller")
        ? "reseller"
        : "user";

    return {
      profile: {
        full_name: profile?.full_name ?? null,
        username: profile?.username ?? null,
        balance: Number(profile?.balance ?? 0),
        currency: profile?.currency ?? "USD",
        referral_code: profile?.referral_code ?? null,
        referral_earnings: Number(profile?.referral_earnings ?? 0),
        role,
      },
      counts,
      spending: days,
      recentOrders: all.slice(0, 8).map((o) => ({
        id: o.id,
        service_name: o.service_name,
        quantity: o.quantity,
        charge: Number(o.charge),
        status: o.status,
        created_at: o.created_at,
      })),
    };
  });

export const listMyOrders = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("orders")
      .select(
        "id, service_name, category, link, quantity, charge, currency, status, provider_order_id, created_at",
      )
      .eq("user_id", context.userId)
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) throw new Error(error.message);
    return (data ?? []).map((o) => ({ ...o, charge: Number(o.charge) }));
  });

export const listMyTransactions = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("wallet_transactions")
      .select("id, type, amount, balance_after, description, created_at")
      .eq("user_id", context.userId)
      .order("created_at", { ascending: false })
      .limit(100);
    if (error) throw new Error(error.message);
    return (data ?? []).map((t) => ({
      ...t,
      amount: Number(t.amount),
      balance_after: Number(t.balance_after),
    }));
  });

/**
 * Creates a pending payment intent. Wallet credit NEVER happens here — it only
 * happens after a provider webhook verifies the payment server-side.
 */
export const createPaymentIntent = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { amount: number; provider: string }) =>
    z
      .object({
        amount: z.number().min(1).max(10000),
        provider: z.enum(["mpesa", "card", "mobile_money"]),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: payment, error } = await supabaseAdmin
      .from("payments")
      .insert({
        user_id: context.userId,
        amount: data.amount,
        provider: data.provider,
        status: "pending",
      })
      .select("id, amount, provider, status")
      .single();
    if (error) throw new Error(error.message);
    return payment;
  });
