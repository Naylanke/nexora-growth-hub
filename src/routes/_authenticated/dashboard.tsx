import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ArrowUpRight, Wallet, PlusCircle, Receipt } from "lucide-react";
import { getDashboardData } from "@/lib/account.functions";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { QuickOrder } from "@/components/dashboard/QuickOrder";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — NEXORA" },
      { name: "description", content: "Your NEXORA balance, orders and spending overview." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const fetchDashboard = useServerFn(getDashboardData);
  const { data, isLoading, isError } = useQuery({
    queryKey: ["dashboard"],
    queryFn: () => fetchDashboard(),
  });

  return (
    <DashboardShell title="Dashboard" description="Overview of your account activity">
      {isLoading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
      )}

      {isError && (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-6 text-sm">
          We couldn't load your dashboard. Please refresh the page.
        </div>
      )}

      {data && (
        <div className="space-y-6">
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="glow-surface relative overflow-hidden rounded-2xl p-6 lg:col-span-1">
              <div
                className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full opacity-40"
                style={{ backgroundImage: "var(--gradient-brand)", filter: "blur(60px)" }}
                aria-hidden
              />
              <p className="text-sm text-muted-foreground">Wallet balance</p>
              <p className="mt-2 font-display text-4xl font-semibold">
                ${data.profile.balance.toFixed(2)}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {data.profile.role === "user" ? "Standard account" : `${data.profile.role} account`}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <Button asChild size="sm" className="rounded-full">
                  <Link to="/wallet">
                    <PlusCircle className="mr-1.5 size-4" /> Add funds
                  </Link>
                </Button>
                <Button asChild size="sm" variant="outline" className="rounded-full">
                  <Link to="/wallet">
                    <Receipt className="mr-1.5 size-4" /> Transactions
                  </Link>
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 lg:col-span-2 lg:grid-cols-3">
              <StatCard label="Total orders" value={data.counts.total} />
              <StatCard label="Completed" value={data.counts.completed} tone="success" />
              <StatCard label="Processing" value={data.counts.processing} tone="primary" />
              <StatCard label="Pending" value={data.counts.pending} tone="warning" />
              <StatCard label="Cancelled" value={data.counts.cancelled} tone="destructive" />
              <StatCard
                label="Referral earned"
                value={`$${data.profile.referral_earnings.toFixed(2)}`}
              />
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <div className="rounded-2xl border border-border bg-card p-5 lg:col-span-2">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-display text-base font-semibold">Spending — last 14 days</h2>
                <Wallet className="size-4 text-muted-foreground" />
              </div>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.spending}>
                    <defs>
                      <linearGradient id="spend" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.5} />
                        <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="var(--color-border)" vertical={false} />
                    <XAxis
                      dataKey="day"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      width={34}
                      tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "var(--color-popover)",
                        border: "1px solid var(--color-border)",
                        borderRadius: 12,
                        fontSize: 12,
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="amount"
                      stroke="var(--color-chart-1)"
                      strokeWidth={2}
                      fill="url(#spend)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <QuickOrder />
          </div>

          <div className="rounded-2xl border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <h2 className="font-display text-base font-semibold">Recent orders</h2>
              <Link
                to="/orders"
                className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
              >
                View all <ArrowUpRight className="size-3" />
              </Link>
            </div>

            {data.recentOrders.length === 0 ? (
              <div className="px-5 py-12 text-center">
                <p className="text-sm text-muted-foreground">No orders yet.</p>
                <Button asChild size="sm" className="mt-4 rounded-full">
                  <Link to="/new-order">Place your first order</Link>
                </Button>
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {data.recentOrders.map((o) => (
                  <li
                    key={o.id}
                    className="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{o.service_name}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        #{o.id.slice(0, 8)} · {o.quantity.toLocaleString()} ·{" "}
                        {new Date(o.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold">${o.charge.toFixed(2)}</span>
                      <StatusBadge status={o.status} />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </DashboardShell>
  );
}

function StatCard({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: number | string;
  tone?: "default" | "success" | "primary" | "warning" | "destructive";
}) {
  const toneClass = {
    default: "text-foreground",
    success: "text-success",
    primary: "text-primary",
    warning: "text-warning",
    destructive: "text-destructive",
  }[tone];

  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={`mt-1.5 font-display text-2xl font-semibold ${toneClass}`}>{value}</p>
    </div>
  );
}
