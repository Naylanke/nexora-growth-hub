import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/site/Logo";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in or create your NEXORA account" },
      {
        name: "description",
        content:
          "Access your NEXORA dashboard to add funds, place orders and track social media growth campaigns.",
      },
      { property: "og:title", content: "Sign in to NEXORA" },
      {
        property: "og:description",
        content: "Access your NEXORA dashboard to manage orders and wallet balance.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

const emailSchema = z.string().trim().email("Enter a valid email").max(255);
const passwordSchema = z.string().min(8, "Password must be at least 8 characters").max(72);

type Mode = "login" | "register" | "forgot";

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/dashboard", replace: true });
    });
  }, [navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSent(null);
    const parsedEmail = emailSchema.safeParse(email);
    if (!parsedEmail.success) {
      toast.error(parsedEmail.error.issues[0]!.message);
      return;
    }

    setLoading(true);
    try {
      if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(parsedEmail.data, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        setSent("Password reset link sent. Check your inbox.");
        return;
      }

      const parsedPassword = passwordSchema.safeParse(password);
      if (!parsedPassword.success) throw new Error(parsedPassword.error.issues[0]!.message);

      if (mode === "register") {
        const { data, error } = await supabase.auth.signUp({
          email: parsedEmail.data,
          password: parsedPassword.data,
          options: {
            emailRedirectTo: window.location.origin,
            data: { full_name: fullName.trim().slice(0, 100) },
          },
        });
        if (error) throw error;
        if (!data.session) {
          setSent("Almost there — confirm your email address to activate your account.");
          return;
        }
        toast.success("Welcome to NEXORA");
        navigate({ to: "/dashboard", replace: true });
        return;
      }

      const { error } = await supabase.auth.signInWithPassword({
        email: parsedEmail.data,
        password: parsedPassword.data,
      });
      if (error) throw error;
      toast.success("Signed in");
      navigate({ to: "/dashboard", replace: true });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center px-4 py-14">
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{ backgroundImage: "var(--gradient-glow)" }}
        aria-hidden
      />
      <div className="relative w-full max-w-md">
        <Link to="/" className="mb-8 flex justify-center">
          <Logo />
        </Link>

        <div className="glow-surface rounded-3xl p-6 sm:p-8">
          <h1 className="font-display text-2xl font-semibold">
            {mode === "login" && "Welcome back"}
            {mode === "register" && "Create your account"}
            {mode === "forgot" && "Reset your password"}
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            {mode === "login" && "Sign in to manage your orders and wallet."}
            {mode === "register" && "Start growing in under a minute. No card required."}
            {mode === "forgot" && "We'll email you a secure reset link."}
          </p>

          {sent && (
            <div className="mt-5 rounded-xl border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-foreground">
              {sent}
            </div>
          )}

          <form onSubmit={submit} className="mt-6 space-y-4">
            {mode === "register" && (
              <div className="space-y-2">
                <Label htmlFor="name">Full name</Label>
                <Input
                  id="name"
                  value={fullName}
                  maxLength={100}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Alex Mwangi"
                  className="h-11 rounded-xl"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                maxLength={255}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="h-11 rounded-xl"
              />
            </div>

            {mode !== "forgot" && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  {mode === "login" && (
                    <button
                      type="button"
                      onClick={() => setMode("forgot")}
                      className="text-xs text-primary hover:underline"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  maxLength={72}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-11 rounded-xl"
                />
              </div>
            )}

            <Button type="submit" disabled={loading} className="h-11 w-full rounded-xl">
              {loading && <Loader2 className="mr-2 size-4 animate-spin" />}
              {mode === "login" && "Sign in"}
              {mode === "register" && "Create free account"}
              {mode === "forgot" && "Send reset link"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            {mode === "login" ? (
              <>
                New to NEXORA?{" "}
                <button
                  onClick={() => setMode("register")}
                  className="font-medium text-primary hover:underline"
                >
                  Create an account
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  onClick={() => setMode("login")}
                  className="font-medium text-primary hover:underline"
                >
                  Sign in
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
