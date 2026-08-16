import { cn } from "@/lib/utils";

const map: Record<string, { label: string; className: string }> = {
  pending: { label: "Pending", className: "bg-warning/15 text-warning" },
  processing: { label: "Processing", className: "bg-primary/15 text-primary" },
  in_progress: { label: "In progress", className: "bg-primary/15 text-primary" },
  completed: { label: "Completed", className: "bg-success/15 text-success" },
  partial: { label: "Partial", className: "bg-accent/20 text-accent" },
  cancelled: { label: "Cancelled", className: "bg-destructive/15 text-destructive" },
  failed: { label: "Failed", className: "bg-destructive/15 text-destructive" },
};

export function StatusBadge({ status }: { status: string }) {
  const entry = map[status] ?? { label: status, className: "bg-muted text-muted-foreground" };
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-[11px] font-medium",
        entry.className,
      )}
    >
      {entry.label}
    </span>
  );
}
