import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/site/PageShell";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of service — NEXORA" },
      { name: "description", content: "The terms that govern the use of the NEXORA platform." },
      { property: "og:title", content: "NEXORA terms of service" },
      { property: "og:description", content: "Terms governing accounts, orders and refunds." },
    ],
  }),
  component: TermsPage,
});

const sections = [
  {
    h: "Accounts",
    p: "You are responsible for the accuracy of the links you submit and for keeping your login credentials secure. One person or business may not operate multiple accounts to abuse promotional pricing.",
  },
  {
    h: "Orders and delivery",
    p: "Delivery estimates are indicative. Orders are dispatched to third-party providers and completion times may vary. Do not change your profile privacy or username while an order is running.",
  },
  {
    h: "Refunds",
    p: "Cancelled or partially completed orders are refunded to your NEXORA wallet automatically. Wallet balances are for platform use and are not redeemable for cash unless required by law.",
  },
  {
    h: "Acceptable use",
    p: "You may not use NEXORA for unlawful activity, harassment, or to interact with accounts you do not own or have permission to promote.",
  },
];

function TermsPage() {
  return (
    <PageShell>
      <PageHero title="Terms of service" subtitle="The rules that apply when you use NEXORA." />
      <section className="mx-auto max-w-3xl space-y-6 px-4 py-14 sm:px-6">
        {sections.map((s) => (
          <article key={s.h}>
            <h2 className="font-display text-lg font-semibold">{s.h}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.p}</p>
          </article>
        ))}
      </section>
    </PageShell>
  );
}
