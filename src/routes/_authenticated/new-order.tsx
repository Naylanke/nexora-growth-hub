import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Loader2, Clock, RefreshCw, Info } from "lucide-react";
import { listPublicServices } from "@/lib/public.functions";
import { placeOrder } from "@/lib/orders.functions";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/_authenticated/new-order")({
  head: () => ({
    meta: [
      { title: "New order — NEXORA" },
      { name: "description", content: "Place a new social media growth order on NEXORA." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: NewOrderPage,
});

function NewOrderPage() {
  const fetchServices = useServerFn(listPublicServices);
  const submitOrder = useServerFn(placeOrder);
  const queryClient = useQueryClient();

  const { data: services, isLoading } = useQuery({
    queryKey: ["services"],
    queryFn: () => fetchServices(),
  });

  const [category, setCategory] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [link, setLink] = useState("");
  const [quantity, setQuantity] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  const categories = useMemo(
    () => Array.from(new Set((services ?? []).map((s) => s.category ?? "Other"))).sort(),
    [services],
  );
  const filtered = useMemo(
    () => (services ?? []).filter((s) => !category || (s.category ?? "Other") === category),
    [services, category],
  );
  const service = useMemo(() => services?.find((s) => s.id === serviceId), [services, serviceId]);
  const qty = Number(quantity);
  const total = service && qty > 0 ? (service.rate * qty) / 1000 : 0;

  const quantityError =
    service && qty > 0 && (qty < service.min_quantity || qty > service.max_quantity)
      ? `Quantity must be between ${service.min_quantity.toLocaleString()} and ${service.max_quantity.toLocaleString()}`
      : null;

  function openConfirm(e: React.FormEvent) {
    e.preventDefault();
    if (!service) {
      toast.error("Choose a service first");
      return;
    }
    if (quantityError) {
      toast.error(quantityError);
      return;
    }
    setConfirmOpen(true);
  }

  async function confirm() {
    if (!service) return;
    setBusy(true);
    try {
      await submitOrder({ data: { serviceId: service.id, link: link.trim(), quantity: qty } });
      toast.success("Order placed successfully");
      setLink("");
      setQuantity("");
      await queryClient.invalidateQueries();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not place the order");
    } finally {
      setBusy(false);
      setConfirmOpen(false);
    }
  }

  return (
    <DashboardShell title="New order" description="Choose a service and place your order">
      {isLoading ? (
        <div className="grid gap-4 lg:grid-cols-3">
          <Skeleton className="h-96 rounded-2xl lg:col-span-2" />
          <Skeleton className="h-64 rounded-2xl" />
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-3">
          <form
            onSubmit={openConfirm}
            className="space-y-5 rounded-2xl border border-border bg-card p-5 lg:col-span-2"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Category</Label>
                <Select
                  value={category}
                  onValueChange={(v) => {
                    setCategory(v);
                    setServiceId("");
                  }}
                >
                  <SelectTrigger className="h-11 rounded-xl">
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label>Service</Label>
                <Select value={serviceId} onValueChange={setServiceId}>
                  <SelectTrigger className="h-11 rounded-xl">
                    <SelectValue placeholder="Choose a service" />
                  </SelectTrigger>
                  <SelectContent>
                    {filtered.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Link</Label>
              <Input
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="https://tiktok.com/@yourhandle/video/123"
                className="h-11 rounded-xl"
                maxLength={500}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label>Quantity</Label>
              <Input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="1000"
                className="h-11 rounded-xl"
                required
              />
              {quantityError && <p className="text-xs text-destructive">{quantityError}</p>}
            </div>

            <div className="flex items-center justify-between rounded-xl bg-surface-2 px-4 py-4">
              <span className="text-sm text-muted-foreground">Your order total</span>
              <span className="font-display text-2xl font-semibold">${total.toFixed(2)}</span>
            </div>

            <Button className="h-11 w-full rounded-xl" disabled={!service}>
              Review order
            </Button>
          </form>

          <aside className="rounded-2xl border border-border bg-card p-5">
            <h2 className="font-display text-base font-semibold">Service details</h2>
            {!service ? (
              <p className="mt-3 text-sm text-muted-foreground">
                Select a service to see pricing, limits and delivery information.
              </p>
            ) : (
              <div className="mt-4 space-y-4 text-sm">
                <div>
                  <p className="font-medium">{service.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{service.description}</p>
                </div>
                <dl className="space-y-2 text-xs">
                  <Row label="Rate (per 1000)" value={`$${service.rate.toFixed(2)}`} />
                  <Row label="Minimum" value={service.min_quantity.toLocaleString()} />
                  <Row label="Maximum" value={service.max_quantity.toLocaleString()} />
                  <Row label="Avg. delivery" value={service.avg_delivery_time ?? "—"} />
                  <Row label="Refill" value={service.refill ? "Available" : "Not available"} />
                </dl>
                <div className="flex items-start gap-2 rounded-xl bg-surface-2 p-3 text-xs text-muted-foreground">
                  <Info className="mt-0.5 size-3.5 shrink-0" />
                  Make sure your profile or post is public before ordering.
                </div>
              </div>
            )}
          </aside>
        </div>
      )}

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm your order</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-2 text-sm">
                <p className="text-muted-foreground">{service?.name}</p>
                <div className="rounded-xl bg-surface-2 p-3 text-xs">
                  <div className="flex justify-between py-0.5">
                    <span className="text-muted-foreground">Quantity</span>
                    <span>{qty.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-0.5">
                    <span className="text-muted-foreground">Link</span>
                    <span className="max-w-[60%] truncate">{link}</span>
                  </div>
                  <div className="flex justify-between py-0.5 font-semibold">
                    <span>Total charge</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
                <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="size-3" /> {service?.avg_delivery_time ?? "Varies"} ·{" "}
                  <RefreshCw className="size-3" />{" "}
                  {service?.refill ? "Refill available" : "No refill"}
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-full">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="rounded-full"
              disabled={busy}
              onClick={(e) => {
                e.preventDefault();
                void confirm();
              }}
            >
              {busy && <Loader2 className="mr-2 size-4 animate-spin" />}
              Confirm & pay
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardShell>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-border/60 pb-1.5">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  );
}
