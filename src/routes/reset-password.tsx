import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/site/Logo";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Set a new password — NEXORA" },
      { name: "description", content: "Choose a new password for your NEXORA account." },
      { property: "og:title", content: "Set a new password — NEXORA" },
      { property: "og:description", content: "Choose a new password for your NEXORA account." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ResetPassword,
});

function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Password updated");
    navigate({ to: "/dashboard", replace: true });
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>
        <form onSubmit={submit} className="glow-surface space-y-4 rounded-3xl p-8">
          <h1 className="font-display text-2xl font-semibold">Set a new password</h1>
          <div className="space-y-2">
            <Label htmlFor="pw">New password</Label>
            <Input
              id="pw"
              type="password"
              value={password}
              maxLength={72}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11 rounded-xl"
              required
            />
          </div>
          <Button disabled={loading} className="h-11 w-full rounded-xl">
            {loading && <Loader2 className="mr-2 size-4 animate-spin" />}
            Update password
          </Button>
        </form>
      </div>
    </main>
  );
}
