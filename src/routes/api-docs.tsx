import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/site/PageShell";

export const Route = createFileRoute("/api-docs")({
  head: () => ({
    meta: [
      { title: "Reseller API — NEXORA" },
      {
        name: "description",
        content:
          "NEXORA's reseller API lets approved accounts list services, place orders, check status and read balance programmatically.",
      },
      { property: "og:title", content: "NEXORA reseller API" },
      { property: "og:description", content: "Services, orders, status and balance endpoints." },
    ],
  }),
  component: ApiDocsPage,
});

const endpoints = [
  { action: "services", desc: "Returns the active service catalogue with rates and limits." },
  { action: "add", desc: "Creates an order. Requires service, link and quantity." },
  { action: "status", desc: "Returns the status, start count and remaining volume of an order." },
  { action: "balance", desc: "Returns the current account balance and currency." },
];

function ApiDocsPage() {
  return (
    <PageShell>
      <PageHero
        title="Reseller API"
        subtitle="Approved accounts can generate an API key from the dashboard and drive NEXORA programmatically."
      />
      <section className="mx-auto max-w-3xl space-y-6 px-4 py-14 sm:px-6">
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="font-display text-base font-semibold">Authentication</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Every request is authenticated with your API key. Keys are stored hashed, are rate
            limited, and can be regenerated at any time from the dashboard.
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card">
          <div className="border-b border-border px-6 py-4">
            <h2 className="font-display text-base font-semibold">Endpoints</h2>
          </div>
          <ul className="divide-y divide-border">
            {endpoints.map((e) => (
              <li key={e.action} className="px-6 py-4">
                <code className="rounded-md bg-surface-2 px-2 py-1 text-xs text-primary">
                  action={e.action}
                </code>
                <p className="mt-2 text-sm text-muted-foreground">{e.desc}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </PageShell>
  );
}
