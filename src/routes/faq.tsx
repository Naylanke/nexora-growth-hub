import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/site/PageShell";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FAQS } from "@/lib/content";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "Frequently asked questions — NEXORA" },
      {
        name: "description",
        content:
          "Answers about NEXORA delivery times, refunds, wallet funding, account safety and the reseller API.",
      },
      { property: "og:title", content: "NEXORA FAQ" },
      { property: "og:description", content: "Delivery, refunds, safety and API answers." },
    ],
  }),
  component: FaqPage,
});

function FaqPage() {
  return (
    <PageShell>
      <PageHero
        title="Frequently asked questions"
        subtitle="Everything you need to know about ordering, delivery, refunds and reseller access."
      />
      <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
        <Accordion type="single" collapsible className="space-y-3">
          {FAQS.map((f, i) => (
            <AccordionItem
              key={f.q}
              value={`item-${i}`}
              className="rounded-2xl border border-border bg-card px-5"
            >
              <AccordionTrigger className="text-left text-sm font-medium hover:no-underline">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </PageShell>
  );
}
