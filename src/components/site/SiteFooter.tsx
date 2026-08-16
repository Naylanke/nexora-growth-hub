import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";

const groups = [
  {
    title: "Platform",
    links: [
      { label: "Home", to: "/" },
      { label: "Services", to: "/services" },
      { label: "Pricing", to: "/pricing" },
      { label: "API", to: "/api-docs" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", to: "/about" },
      { label: "FAQ", to: "/faq" },
      { label: "Contact", to: "/contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms", to: "/terms" },
      { label: "Privacy", to: "/privacy" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Login", to: "/auth" },
      { label: "Register", to: "/auth" },
    ],
  },
] as const;

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-surface/40">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-5">
          <div className="md:col-span-1">
            <Logo />
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              Automated social media growth infrastructure for creators, agencies and resellers.
            </p>
          </div>
          {groups.map((g) => (
            <div key={g.title}>
              <h3 className="text-sm font-semibold text-foreground">{g.title}</h3>
              <ul className="mt-3 space-y-2">
                {g.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      to={l.to}
                      className="text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col gap-2 border-t border-border/60 pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} NEXORA. All rights reserved.</p>
          <p>Built for speed, reliability and transparent pricing.</p>
        </div>
      </div>
    </footer>
  );
}
