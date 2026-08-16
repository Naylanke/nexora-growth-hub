/**
 * Modular SMM provider adapter.
 *
 * The integration layer is intentionally isolated so a different provider can be
 * dropped in later without touching application code. Endpoints and parameter
 * names are NOT invented: the adapter is disabled until SMM_API_URL and
 * SMM_API_KEY are configured, and `defaultMapping` follows the request shape the
 * project owner supplies from their provider documentation.
 *
 * Required secrets (server-side only, never exposed to the browser):
 *   SMM_API_URL  — provider endpoint, e.g. https://provider.example/api/v2
 *   SMM_API_KEY  — provider API key
 */

export type ProviderService = {
  service: string;
  name: string;
  category: string;
  rate: string;
  min: string;
  max: string;
  type?: string;
  refill?: boolean;
  cancel?: boolean;
  description?: string;
};

export type ProviderOrderStatus = {
  charge?: string;
  start_count?: string;
  status?: string;
  remains?: string;
  currency?: string;
  error?: string;
};

export function isProviderConfigured(): boolean {
  return Boolean(process.env["SMM_API_URL"] && process.env["SMM_API_KEY"]);
}

async function call<T>(payload: Record<string, string | number>): Promise<T> {
  const url = process.env["SMM_API_URL"];
  const key = process.env["SMM_API_KEY"];
  if (!url || !key) {
    throw new Error(
      "SMM provider is not configured. Add SMM_API_URL and SMM_API_KEY to enable live provider calls.",
    );
  }

  const body = new URLSearchParams({ key, ...Object.fromEntries(
    Object.entries(payload).map(([k, v]) => [k, String(v)]),
  ) });

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  if (!res.ok) throw new Error(`Provider responded with ${res.status}`);
  return (await res.json()) as T;
}

export const provider = {
  /** action=services */
  listServices: () => call<ProviderService[]>({ action: "services" }),

  /** action=add */
  createOrder: (input: { service: string; link: string; quantity: number }) =>
    call<{ order?: number; error?: string }>({ action: "add", ...input }),

  /** action=status */
  orderStatus: (order: string) => call<ProviderOrderStatus>({ action: "status", order }),

  /** action=status with comma separated ids */
  multiStatus: (orders: string[]) =>
    call<Record<string, ProviderOrderStatus>>({ action: "status", orders: orders.join(",") }),

  /** action=balance */
  balance: () => call<{ balance: string; currency: string }>({ action: "balance" }),

  /** action=refill */
  refill: (order: string) => call<{ refill?: string; error?: string }>({ action: "refill", order }),

  /** action=cancel */
  cancel: (orders: string[]) =>
    call<Array<{ order: number; cancel: string | { error: string } }>>({
      action: "cancel",
      orders: orders.join(","),
    }),
};

/** Normalises the provider's status string onto our internal order status. */
export function mapProviderStatus(status: string | undefined) {
  switch ((status ?? "").toLowerCase()) {
    case "completed":
      return "completed" as const;
    case "in progress":
    case "processing":
      return "in_progress" as const;
    case "pending":
      return "pending" as const;
    case "partial":
      return "partial" as const;
    case "canceled":
    case "cancelled":
      return "cancelled" as const;
    default:
      return "processing" as const;
  }
}
