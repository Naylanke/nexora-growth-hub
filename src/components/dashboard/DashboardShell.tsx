import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import type { ReactNode } from "react";
import {
  LayoutDashboard,
  PlusCircle,
  ListOrdered,
  Wallet,
  LogOut,
  Layers,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/site/Logo";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/new-order", label: "New Order", icon: PlusCircle },
  { to: "/orders", label: "Orders", icon: ListOrdered },
  { to: "/wallet", label: "Wallet", icon: Wallet },
  { to: "/services", label: "Services", icon: Layers },
] as const;

export function DashboardShell({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 hidden w-60 flex-col border-r border-border/60 bg-sidebar px-3 py-5 lg:flex">
        <Link to="/" className="px-2 pb-6">
          <Logo />
        </Link>
        <nav className="flex flex-1 flex-col gap-1">
          {nav.map((item) => {
            const active = pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
                  active
                    ? "bg-sidebar-accent text-sidebar-primary"
                    : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground",
                )}
              >
                <item.icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <button
          onClick={signOut}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-destructive"
        >
          <LogOut className="size-4" />
          Sign out
        </button>
      </aside>

      <div className="lg:pl-60">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border/60 bg-background/80 px-4 backdrop-blur-xl sm:px-6">
          <div className="lg:hidden">
            <Logo compact />
          </div>
          <div className="hidden lg:block">
            <h1 className="font-display text-lg font-semibold">{title}</h1>
            {description && <p className="text-xs text-muted-foreground">{description}</p>}
          </div>
          <button
            onClick={signOut}
            className="rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground lg:hidden"
          >
            Sign out
          </button>
        </header>

        <main className="px-4 pb-28 pt-6 sm:px-6 lg:pb-12">
          <div className="mb-5 lg:hidden">
            <h1 className="font-display text-xl font-semibold">{title}</h1>
            {description && (
              <p className="mt-1 text-sm text-muted-foreground">{description}</p>
            )}
          </div>
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border/60 bg-background/95 backdrop-blur-xl lg:hidden">
        <div className="grid grid-cols-5">
          {nav.map((item) => {
            const active = pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex flex-col items-center gap-1 py-2.5 text-[11px] transition-colors",
                  active ? "text-primary" : "text-muted-foreground",
                )}
              >
                <item.icon className="size-5" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
