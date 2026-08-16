import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/site/PageShell";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy policy — NEXORA" },
      { name: "description", content: "How NEXORA collects, stores and protects your data." },
      { property: "og:title", content: "NEXORA privacy policy" },
      { property: "og:description", content: "What we store, why we store it and how it is protected." },
    ],
  }),
  component: PrivacyPage,
});

const sections = [
  {
    h: "What we collect",
    p: "Your email address, optional display name, wallet balance, order history and payment records. We never ask for your social media passwords.",
  },
  {
    h: "How we use it",
    p: "To operate your account: authenticating you, processing orders, keeping your wallet ledger accurate and providing support.",
  },
  {
    h: "How it is protected",
    p: "Data is stored with row-level security so each account can only read its own records. Provider and payment credentials live exclusively on our servers and are never exposed to the browser.",
  },
  {
    h: "Your choices",
    p: "You can request a copy of your data or the deletion of your account at any time by contacting support.",
  },
];

function PrivacyPage() {
  return (
    <PageShell>
      <PageHero title="Privacy policy" subtitle="What we store, why we store it, and how it stays protected." />
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
