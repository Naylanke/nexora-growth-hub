import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { Mail, MessageSquare } from "lucide-react";
import { PageShell, PageHero } from "@/components/site/PageShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact NEXORA support" },
      {
        name: "description",
        content: "Reach the NEXORA team about orders, payments, refunds or reseller API access.",
      },
      { property: "og:title", content: "Contact NEXORA" },
      { property: "og:description", content: "Talk to our support team about any order or payment." },
    ],
  }),
  component: ContactPage,
});

const schema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  message: z.string().trim().min(10, "Tell us a little more").max(1000),
});

function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]!.message);
      return;
    }
    toast.success("Thanks — signed-in users get faster replies through the support desk.");
    setForm({ name: "", email: "", message: "" });
  }

  return (
    <PageShell>
      <PageHero
        title="Contact us"
        subtitle="Questions about an order, a payment or reseller access? Send us a message."
      />
      <section className="mx-auto grid max-w-4xl gap-6 px-4 py-14 sm:px-6 md:grid-cols-5">
        <form onSubmit={submit} className="space-y-4 rounded-2xl border border-border bg-card p-6 md:col-span-3">
          <div className="space-y-1.5">
            <Label>Name</Label>
            <Input
              value={form.name}
              maxLength={100}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="h-11 rounded-xl"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Email</Label>
            <Input
              type="email"
              value={form.email}
              maxLength={255}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="h-11 rounded-xl"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Message</Label>
            <Textarea
              value={form.message}
              maxLength={1000}
              rows={5}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="rounded-xl"
            />
          </div>
          <Button className="h-11 w-full rounded-xl">Send message</Button>
        </form>

        <div className="space-y-4 md:col-span-2">
          <div className="rounded-2xl border border-border bg-card p-6">
            <Mail className="size-5 text-primary" />
            <h2 className="mt-3 text-sm font-semibold">Email</h2>
            <p className="mt-1 text-sm text-muted-foreground">support@nexora.app</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6">
            <MessageSquare className="size-5 text-primary" />
            <h2 className="mt-3 text-sm font-semibold">Support desk</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Signed-in customers can open a ticket from the dashboard for order-specific help.
            </p>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
