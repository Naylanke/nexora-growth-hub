import type { ReactNode } from "react";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}

export function PageHero({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <section className="relative overflow-hidden border-b border-border/60">
      <div
        className="pointer-events-none absolute inset-0"
        style={{ backgroundImage: "var(--gradient-glow)" }}
        aria-hidden
      />
      <div className="relative mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 sm:py-20">
        <h1 className="animate-fade-up font-display text-3xl font-semibold sm:text-4xl">{title}</h1>
        <p className="mx-auto mt-4 max-w-2xl text-balance text-muted-foreground">{subtitle}</p>
      </div>
    </section>
  );
}
