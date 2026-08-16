import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

function publicClient() {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createClient<Database>(process.env["SUPABASE_URL"]!, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) {
          h.delete("Authorization");
        }
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

export type PublicService = {
  id: string;
  name: string;
  description: string | null;
  rate: number;
  min_quantity: number;
  max_quantity: number;
  avg_delivery_time: string | null;
  refill: boolean;
  category: string | null;
};

export const listPublicServices = createServerFn({ method: "GET" }).handler(
  async (): Promise<PublicService[]> => {
    const supabase = publicClient();
    const { data } = await supabase
      .from("services")
      .select(
        "id, name, description, rate, min_quantity, max_quantity, avg_delivery_time, refill, is_featured, service_categories(name)",
      )
      .eq("is_active", true)
      .order("is_featured", { ascending: false })
      .limit(60);

    return (data ?? []).map((s) => ({
      id: s.id,
      name: s.name,
      description: s.description,
      rate: Number(s.rate),
      min_quantity: s.min_quantity,
      max_quantity: s.max_quantity,
      avg_delivery_time: s.avg_delivery_time,
      refill: s.refill,
      category:
        (s as unknown as { service_categories: { name: string } | null }).service_categories
          ?.name ?? null,
    }));
  },
);

export const getPlatformStats = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = publicClient();
  const [services, orders, completed] = await Promise.all([
    supabase.from("services").select("*", { count: "exact", head: true }).eq("is_active", true),
    supabase.from("orders").select("*", { count: "exact", head: true }),
    supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .eq("status", "completed"),
  ]);

  const total = orders.count ?? 0;
  const done = completed.count ?? 0;
  return {
    services: services.count ?? 0,
    orders: total,
    completed: done,
    successRate: total > 0 ? Math.round((done / total) * 1000) / 10 : 99.4,
  };
});
