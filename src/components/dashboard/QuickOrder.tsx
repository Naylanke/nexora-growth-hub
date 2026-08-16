import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Loader2, Rocket } from "lucide-react";
import { listPublicServices } from "@/lib/public.functions";
import { placeOrder } from "@/lib/orders.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

export function QuickOrder() {
  const fetchServices = useServerFn(listPublicServices);
  const submitOrder = useServerFn(placeOrder);
  const queryClient = useQueryClient();

  const { data: services, isLoading } = useQuery({
    queryKey: ["services"],
    queryFn: () => fetchServices(),
  });

  const [serviceId, setServiceId] = useState("");
  const [link, setLink] = useState("");
  const [quantity, setQuantity] = useState("");
  const [busy, setBusy] = useState(false);

  const service = useMemo(
    () => services?.find((s) => s.id === serviceId),
    [services, serviceId],
  );
  const total = service && Number(quantity) > 0 ? (service.rate * Number(quantity)) / 1000 : 0;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!service) {
      toast.error("Select a service");
      return;
    }
    setBusy(true);
    try {
      await submitOrder({
        data: { serviceId: service.id, link: link.trim(), quantity: Number(quantity) },
      });
      toast.success("Order placed");
      setLink("");
      setQuantity("");
      await queryClient.invalidateQueries();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not place the order");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="rounded-2xl border border-border bg-card p-5">
      <div className="mb-4 flex items-center gap-2">
        <Rocket className="size-4 text-primary" />
        <h2 className="font-display text-base font-semibold">Quick order</h2>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-11 rounded-xl" />
          <Skeleton className="h-11 rounded-xl" />
          <Skeleton className="h-11 rounded-xl" />
        </div>
      ) : (
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label className="text-xs">Service</Label>
            <Select value={serviceId} onValueChange={setServiceId}>
              <SelectTrigger className="h-11 rounded-xl">
                <SelectValue placeholder="Choose a service" />
              </SelectTrigger>
              <SelectContent>
                {(services ?? []).map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Link</Label>
            <Input
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://instagram.com/yourprofile"
              className="h-11 rounded-xl"
              maxLength={500}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">
              Quantity
              {service && (
                <span className="ml-1 text-muted-foreground">
                  ({service.min_quantity.toLocaleString()}–{service.max_quantity.toLocaleString()})
                </span>
              )}
            </Label>
            <Input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="1000"
              className="h-11 rounded-xl"
              required
            />
          </div>

          <div className="flex items-center justify-between rounded-xl bg-surface-2 px-4 py-3">
            <span className="text-xs text-muted-foreground">Order total</span>
            <span className="font-display text-lg font-semibold">${total.toFixed(2)}</span>
          </div>

          <Button disabled={busy} className="h-11 w-full rounded-xl">
            {busy && <Loader2 className="mr-2 size-4 animate-spin" />}
            Place order
          </Button>
        </div>
      )}
    </form>
  );
}
