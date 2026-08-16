import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Search, Clock, RefreshCw } from "lucide-react";
import { listPublicServices } from "@/lib/public.functions";
import { PageShell, PageHero } from "@/components/site/PageShell";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "SMM Services & Rates — NEXORA" },
      {
        name: "description",
        content:
          "Browse NEXORA's social media growth services with live per-1000 rates, minimum and maximum quantities and delivery estimates.",
      },
      { property: "og:title", content: "SMM Services & Rates — NEXORA" },
      {
        property: "og:description",
        content: "Compare rates, limits and delivery times across every NEXORA service.",
      },
    ],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  const fetchServices = useServerFn(listPublicServices);
  const { data, isLoading } = useQuery({ queryKey: ["services"], queryFn: () => fetchServices() });
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState<"price" | "name">("price");

  const categories = useMemo(
    () => ["All", ...Array.from(new Set((data ?? []).map((s) => s.category ?? "Other"))).sort()],
    [data],
  );

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (data ?? [])
      .filter((s) => category === "All" || (s.category ?? "Other") === category)
      .filter((s) => !q || s.name.toLowerCase().includes(q))
      .sort((a, b) => (sort === "price" ? a.rate - b.rate : a.name.localeCompare(b.name)));
  }, [data, query, category, sort]);

  return (
    <PageShell>
      <PageHero
        title="Services & pricing"
        subtitle="Transparent per-1000 rates across every platform we support. Rates update automatically when our provider catalogue changes."
      />

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search services"
              className="h-11 rounded-xl pl-9"
            />
          </div>
          <button
            onClick={() => setSort((s) => (s === "price" ? "name" : "price"))}
            className="self-start rounded-full border border-border px-4 py-2 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            Sort: {sort === "price" ? "Lowest price" : "Name"}
          </button>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={cn(
                "rounded-full border px-4 py-1.5 text-xs transition-colors",
                category === c
                  ? "border-primary/40 bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:text-foreground",
              )}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading &&
            Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-44 rounded-2xl" />)}

          {!isLoading && rows.length === 0 && (
            <p className="col-span-full rounded-2xl border border-border bg-card px-6 py-16 text-center text-sm text-muted-foreground">
              No services match your search.
            </p>
          )}

          {rows.map((s) => (
            <article
              key={s.id}
              className="group rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-glow"
            >
              <span className="text-[11px] uppercase tracking-wide text-primary">
                {s.category ?? "Other"}
              </span>
              <h2 className="mt-2 text-sm font-semibold">{s.name}</h2>
              <p className="mt-1.5 line-clamp-2 text-xs text-muted-foreground">{s.description}</p>
              <div className="mt-4 flex items-end justify-between">
                <div>
                  <p className="font-display text-2xl font-semibold">${s.rate.toFixed(2)}</p>
                  <p className="text-[11px] text-muted-foreground">per 1,000</p>
                </div>
                <div className="text-right text-[11px] text-muted-foreground">
                  <p className="flex items-center justify-end gap-1">
                    <Clock className="size-3" /> {s.avg_delivery_time ?? "Varies"}
                  </p>
                  {s.refill && (
                    <p className="mt-1 flex items-center justify-end gap-1 text-success">
                      <RefreshCw className="size-3" /> Refill
                    </p>
                  )}
                  <p className="mt-1">
                    {s.min_quantity.toLocaleString()}–{s.max_quantity.toLocaleString()}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
