import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Copy, Search } from "lucide-react";
import { toast } from "sonner";
import { listMyOrders } from "@/lib/account.functions";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/_authenticated/orders")({
  head: () => ({
    meta: [
      { title: "Orders — NEXORA" },
      { name: "description", content: "Track the status of every NEXORA order." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: OrdersPage,
});

function OrdersPage() {
  const fetchOrders = useServerFn(listMyOrders);
  const { data, isLoading } = useQuery({ queryKey: ["orders"], queryFn: () => fetchOrders() });
  const [query, setQuery] = useState("");

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (data ?? []).filter(
      (o) =>
        !q ||
        o.service_name.toLowerCase().includes(q) ||
        o.id.toLowerCase().includes(q) ||
        o.link.toLowerCase().includes(q),
    );
  }, [data, query]);

  return (
    <DashboardShell title="Orders" description="Every order you have placed">
      <div className="relative mb-5 max-w-sm">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search orders"
          className="h-11 rounded-xl pl-9"
        />
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-2xl" />
          ))}
        </div>
      ) : rows.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card px-6 py-16 text-center">
          <p className="font-display text-lg font-semibold">No orders found</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Once you place an order it will appear here with live status updates.
          </p>
          <Button asChild className="mt-5 rounded-full">
            <Link to="/new-order">Place an order</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {rows.map((o) => (
            <div key={o.id} className="rounded-2xl border border-border bg-card p-4 sm:p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-semibold">{o.service_name}</p>
                    <StatusBadge status={o.status} />
                  </div>
                  <p className="mt-1 truncate text-xs text-muted-foreground">{o.link}</p>
                  <button
                    onClick={() => {
                      void navigator.clipboard.writeText(o.id);
                      toast.success("Order ID copied");
                    }}
                    className="mt-2 inline-flex items-center gap-1.5 text-[11px] text-muted-foreground hover:text-primary"
                  >
                    <Copy className="size-3" /> #{o.id.slice(0, 8)}
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-4 text-right sm:gap-6">
                  <Meta label="Quantity" value={o.quantity.toLocaleString()} />
                  <Meta label="Charge" value={`$${o.charge.toFixed(2)}`} />
                  <Meta label="Date" value={new Date(o.created_at).toLocaleDateString()} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardShell>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-sm font-medium">{value}</p>
    </div>
  );
}
