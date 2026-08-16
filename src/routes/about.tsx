import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/site/PageShell";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About NEXORA — growth infrastructure for creators" },
      {
        name: "description",
        content:
          "NEXORA builds automated, transparent social media growth infrastructure for creators, agencies and resellers.",
      },
      { property: "og:title", content: "About NEXORA" },
      {
        property: "og:description",
        content: "Automated growth infrastructure for creators, agencies and resellers.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <PageShell>
      <PageHero
        title="Growth infrastructure, not guesswork"
        subtitle="NEXORA exists because ordering social growth should feel like using a modern fintech product: fast, transparent and accountable."
      />
      <section className="mx-auto max-w-3xl space-y-6 px-4 py-14 text-sm leading-relaxed text-muted-foreground sm:px-6">
        <p>
          Every order placed on NEXORA runs through an automated pipeline: the charge is calculated
          server-side from the stored service rate, your wallet is debited inside a single ledger
          transaction, and the order is dispatched to a delivery provider. Nothing is manual, and
          nothing about your pricing is guessed by the browser.
        </p>
        <p>
          Order statuses synchronise continuously. When a provider cancels or only partially
          completes a job, the unused amount returns to your wallet as a refund transaction — once,
          never twice.
        </p>
        <p>
          Resellers get the same engine through an API, with their own key, balance and markup, so
          they can build a panel on top of NEXORA without touching provider credentials.
        </p>
      </section>
    </PageShell>
  );
}
