import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { PageShell, PageHero } from "@/components/site/PageShell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing & reseller tiers — NEXORA" },
      {
        name: "description",
        content:
          "Pay only for what you order. NEXORA has no subscription, no minimum spend and discounted reseller rates.",
      },
      { property: "og:title", content: "NEXORA pricing" },
      { property: "og:description", content: "No subscription. Pay-as-you-grow SMM pricing." },
    ],
  }),
  component: PricingPage,
});

const tiers = [
  {
    name: "Starter",
    price: "Pay as you go",
    text: "For creators testing the waters.",
    perks: ["Full service catalogue", "Wallet ledger", "Real-time order tracking", "Email support"],
  },
  {
    name: "Reseller",
    price: "Volume rates",
    text: "For agencies and panel owners.",
    perks: ["Discounted per-1000 rates", "API key + endpoints", "Custom markup", "Priority support"],
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    text: "For high-volume operations.",
    perks: ["Dedicated rates", "Higher API limits", "Custom integrations", "Account manager"],
  },
];

function PricingPage() {
  return (
    <PageShell>
      <PageHero
        title="Simple, usage-based pricing"
        subtitle="No subscriptions or hidden fees. You fund your wallet, and each order is charged at the published per-1000 rate."
      />
      <section className="mx-auto grid max-w-5xl gap-4 px-4 py-14 sm:px-6 md:grid-cols-3">
        {tiers.map((t) => (
          <div
            key={t.name}
            className={
              t.featured
                ? "rounded-2xl border border-primary/40 bg-card p-6 shadow-glow"
                : "rounded-2xl border border-border bg-card p-6"
            }
          >
            <h2 className="font-display text-lg font-semibold">{t.name}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{t.text}</p>
            <p className="mt-4 font-display text-2xl font-semibold text-gradient">{t.price}</p>
            <ul className="mt-5 space-y-2">
              {t.perks.map((p) => (
                <li key={p} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                  {p}
                </li>
              ))}
            </ul>
            <Button asChild className="mt-6 w-full rounded-full" variant={t.featured ? "default" : "outline"}>
              <Link to="/auth">Get started</Link>
            </Button>
          </div>
        ))}
      </section>
    </PageShell>
  );
}
