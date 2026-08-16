import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  Zap,
  Bot,
  ShieldCheck,
  Activity,
  Code2,
  Tag,
  ArrowRight,
  Clock,
  RefreshCw,
} from "lucide-react";
import { getPlatformStats, listPublicServices } from "@/lib/public.functions";
import { PageShell } from "@/components/site/PageShell";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FAQS, FEATURES, HOW_IT_WORKS } from "@/lib/content";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NEXORA — Grow Your Social Presence. Smarter." },
      {
        name: "description",
        content:
          "NEXORA delivers fast, affordable social media growth through an automated platform with wallet billing, real-time tracking and a reseller API.",
      },
      { property: "og:title", content: "NEXORA — Grow Your Social Presence. Smarter." },
      {
        property: "og:description",
        content:
          "Automated social media growth with transparent pricing, instant delivery and live order tracking.",
      },
    ],
  }),
  component: Landing,
});

const featureIcons = { zap: Zap, bot: Bot, shield: ShieldCheck, activity: Activity, code: Code2, tag: Tag };

function Landing() {
  const fetchStats = useServerFn(getPlatformStats);
  const fetchServices = useServerFn(listPublicServices);

  const { data: stats } = useQuery({ queryKey: ["stats"], queryFn: () => fetchStats() });
  const { data: services, isLoading } = useQuery({
    queryKey: ["services"],
    queryFn: () => fetchServices(),
  });

  return (
    <PageShell>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0"
          style={{ backgroundImage: "var(--gradient-glow)" }}
          aria-hidden
        />
        <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-16 sm:px-6 sm:pb-24 sm:pt-24">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-3.5 py-1.5 text-xs text-muted-foreground">
              <span className="size-1.5 rounded-full bg-primary" />
              Automated growth, 24/7
            </span>
            <h1 className="animate-fade-up mt-6 text-balance font-display text-4xl font-semibold leading-[1.05] sm:text-6xl">
              Grow Your Social Presence.{" "}
              <span className="text-gradient">Smarter.</span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-balance text-muted-foreground sm:text-lg">
              NEXORA gives you fast, affordable social media growth through one automated platform —
              wallet billing, instant dispatch and real-time order tracking.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button asChild size="lg" className="h-12 rounded-full px-7">
                <Link to="/auth">
                  Get Started <ArrowRight className="ml-1.5 size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 rounded-full px-7">
                <Link to="/services">Explore Services</Link>
              </Button>
            </div>
          </div>

          {/* Dashboard preview */}
          <div className="glow-surface mx-auto mt-14 max-w-4xl rounded-3xl p-3 sm:p-4">
            <div className="rounded-2xl border border-border bg-background/70 p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Wallet balance</p>
                  <p className="font-display text-2xl font-semibold sm:text-3xl">$1,284.50</p>
                </div>
                <span className="rounded-full bg-success/15 px-3 py-1 text-[11px] text-success">
                  All systems operational
                </span>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  ["Total orders", "3,412"],
                  ["Completed", "3,301"],
                  ["Processing", "94"],
                  ["Pending", "17"],
                ].map(([l, v]) => (
                  <div key={l} className="rounded-xl border border-border bg-card p-3">
                    <p className="text-[11px] text-muted-foreground">{l}</p>
                    <p className="mt-1 font-display text-lg font-semibold">{v}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex h-24 items-end gap-1.5 rounded-xl border border-border bg-card p-3">
                {[38, 52, 31, 64, 47, 72, 58, 81, 66, 90, 74, 96].map((h, i) => (
                  <span
                    key={i}
                    className="flex-1 rounded-t-md bg-brand-gradient opacity-80"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border/60 bg-surface/30">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-12 sm:px-6 lg:grid-cols-4">
          <Stat label="Active users" value="12,400+" />
          <Stat label="Orders completed" value={(stats?.completed ?? 0).toLocaleString()} />
          <Stat label="Available services" value={(stats?.services ?? 0).toLocaleString()} />
          <Stat label="Success rate" value={`${stats?.successRate ?? 99.4}%`} />
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <SectionHeading
          title="How it works"
          subtitle="Four steps from sign-up to your first delivered order."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {HOW_IT_WORKS.map((s) => (
            <div key={s.step} className="rounded-2xl border border-border bg-card p-6">
              <span className="font-display text-sm text-primary">{s.step}</span>
              <h3 className="mt-3 text-base font-semibold">{s.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="border-y border-border/60 bg-surface/30">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <SectionHeading
            title="Built like a product, not a panel"
            subtitle="Everything you need to run growth campaigns reliably."
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => {
              const Icon = featureIcons[f.icon as keyof typeof featureIcons];
              return (
                <div
                  key={f.title}
                  className="rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-glow"
                >
                  <span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="size-5" />
                  </span>
                  <h3 className="mt-4 text-base font-semibold">{f.title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">{f.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Popular services */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <SectionHeading title="Popular services" subtitle="Live rates from our catalogue." />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading &&
            Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-40 rounded-2xl" />
            ))}
          {(services ?? []).slice(0, 6).map((s) => (
            <article key={s.id} className="rounded-2xl border border-border bg-card p-5">
              <span className="text-[11px] uppercase tracking-wide text-primary">
                {s.category ?? "Other"}
              </span>
              <h3 className="mt-2 text-sm font-semibold">{s.name}</h3>
              <p className="mt-1.5 line-clamp-2 text-xs text-muted-foreground">{s.description}</p>
              <div className="mt-4 flex items-end justify-between">
                <p className="font-display text-xl font-semibold">
                  ${s.rate.toFixed(2)}
                  <span className="ml-1 text-[11px] font-normal text-muted-foreground">/1k</span>
                </p>
                <div className="text-right text-[11px] text-muted-foreground">
                  <p className="flex items-center justify-end gap-1">
                    <Clock className="size-3" /> {s.avg_delivery_time ?? "Varies"}
                  </p>
                  {s.refill && (
                    <p className="mt-1 flex items-center justify-end gap-1 text-success">
                      <RefreshCw className="size-3" /> Refill
                    </p>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Button asChild variant="outline" className="rounded-full">
            <Link to="/services">View all services</Link>
          </Button>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-border/60 bg-surface/30">
        <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
          <SectionHeading title="Questions, answered" subtitle="The essentials before you start." />
          <Accordion type="single" collapsible className="mt-10 space-y-3">
            {FAQS.slice(0, 5).map((f, i) => (
              <AccordionItem
                key={f.q}
                value={`faq-${i}`}
                className="rounded-2xl border border-border bg-card px-5"
              >
                <AccordionTrigger className="text-left text-sm font-medium hover:no-underline">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="glow-surface relative overflow-hidden rounded-3xl px-6 py-14 text-center sm:px-12">
          <div
            className="pointer-events-none absolute inset-0 opacity-60"
            style={{ backgroundImage: "var(--gradient-glow)" }}
            aria-hidden
          />
          <div className="relative">
            <h2 className="font-display text-3xl font-semibold sm:text-4xl">Ready to grow?</h2>
            <p className="mx-auto mt-3 max-w-md text-muted-foreground">
              Create your NEXORA account and place your first order in minutes.
            </p>
            <Button asChild size="lg" className="mt-7 h-12 rounded-full px-8">
              <Link to="/auth">Create Free Account</Link>
            </Button>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <p className="font-display text-3xl font-semibold text-gradient sm:text-4xl">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground sm:text-sm">{label}</p>
    </div>
  );
}

function SectionHeading({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <h2 className="font-display text-2xl font-semibold sm:text-3xl">{title}</h2>
      <p className="mt-2 text-sm text-muted-foreground sm:text-base">{subtitle}</p>
    </div>
  );
}
