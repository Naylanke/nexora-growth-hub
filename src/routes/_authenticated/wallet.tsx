import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Loader2, ShieldCheck } from "lucide-react";
import {
  createPaymentIntent,
  getDashboardData,
  listMyTransactions,
} from "@/lib/account.functions";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/_authenticated/wallet")({
  head: () => ({
    meta: [
      { title: "Wallet — NEXORA" },
      { name: "description", content: "Add funds and review your NEXORA wallet ledger." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: WalletPage,
});

const methods = [
  { value: "mpesa", label: "M-Pesa" },
  { value: "card", label: "Card payment" },
  { value: "mobile_money", label: "Mobile money" },
] as const;

function WalletPage() {
  const fetchDashboard = useServerFn(getDashboardData);
  const fetchTransactions = useServerFn(listMyTransactions);
  const startPayment = useServerFn(createPaymentIntent);

  const { data: dashboard } = useQuery({
    queryKey: ["dashboard"],
    queryFn: () => fetchDashboard(),
  });
  const { data: transactions, isLoading } = useQuery({
    queryKey: ["transactions"],
    queryFn: () => fetchTransactions(),
  });

  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<string>("mpesa");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const value = Number(amount);
    if (!(value >= 1)) {
      toast.error("Enter an amount of at least $1");
      return;
    }
    setBusy(true);
    try {
      await startPayment({ data: { amount: value, provider: method as "mpesa" } });
      toast.success(
        "Payment request created. Your wallet is credited only after the payment is verified.",
      );
      setAmount("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not start the payment");
    } finally {
      setBusy(false);
    }
  }

  return (
    <DashboardShell title="Wallet" description="Add funds and review every balance change">
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-1">
          <div className="glow-surface rounded-2xl p-6">
            <p className="text-sm text-muted-foreground">Available balance</p>
            <p className="mt-2 font-display text-4xl font-semibold">
              ${(dashboard?.profile.balance ?? 0).toFixed(2)}
            </p>
          </div>

          <form onSubmit={submit} className="space-y-4 rounded-2xl border border-border bg-card p-5">
            <h2 className="font-display text-base font-semibold">Add funds</h2>
            <div className="space-y-1.5">
              <Label>Amount (USD)</Label>
              <Input
                type="number"
                min={1}
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="25.00"
                className="h-11 rounded-xl"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Payment method</Label>
              <Select value={method} onValueChange={setMethod}>
                <SelectTrigger className="h-11 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {methods.map((m) => (
                    <SelectItem key={m.value} value={m.value}>
                      {m.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button disabled={busy} className="h-11 w-full rounded-xl">
              {busy && <Loader2 className="mr-2 size-4 animate-spin" />}
              Continue
            </Button>
            <p className="flex items-start gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-primary" />
              Funds are credited only after the payment provider confirms the transaction on our
              servers.
            </p>
          </form>
        </div>

        <div className="rounded-2xl border border-border bg-card lg:col-span-2">
          <div className="border-b border-border px-5 py-4">
            <h2 className="font-display text-base font-semibold">Transactions</h2>
          </div>
          {isLoading ? (
            <div className="space-y-3 p-5">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-14 rounded-xl" />
              ))}
            </div>
          ) : (transactions ?? []).length === 0 ? (
            <p className="px-5 py-16 text-center text-sm text-muted-foreground">
              No transactions yet. Deposits, order charges and refunds will appear here.
            </p>
          ) : (
            <ul className="divide-y divide-border">
              {(transactions ?? []).map((t) => (
                <li key={t.id} className="flex items-center justify-between px-5 py-4">
                  <div className="min-w-0">
                    <p className="text-sm font-medium capitalize">{t.type}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {t.description ?? "—"} · {new Date(t.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-sm font-semibold ${t.amount < 0 ? "text-destructive" : "text-success"}`}
                    >
                      {t.amount < 0 ? "-" : "+"}${Math.abs(t.amount).toFixed(2)}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      Balance ${t.balance_after.toFixed(2)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
