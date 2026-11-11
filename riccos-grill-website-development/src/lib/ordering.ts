/**
 * ORDERING INTEGRATION LAYER
 * ---------------------------------------------------------------------------
 * No official online-ordering provider could be verified for Ricco's, and no
 * payment API exists. Rather than fake one, ordering resolves to the first
 * channel that is genuinely configured:
 *
 *   1. NEXT_PUBLIC_ORDER_URL  → official provider (link-out, opens new tab)
 *   2. Telephone               → 0115 9371177 (always available)
 *
 * To connect a provider later:
 *   - set NEXT_PUBLIC_ORDER_URL in the environment, or
 *   - implement `OrderProvider.submit` below and call it from OrderDrawer.
 * Never collect card details on this site. Payment must happen on the
 * provider's own PCI-compliant checkout.
 */
import { SITE } from "@/data/site";

export type OrderChannel =
  | { kind: "provider"; href: string; label: string }
  | { kind: "phone"; href: string; label: string };

export function getOrderChannel(): OrderChannel {
  if (SITE.orderUrl && /^https:\/\//.test(SITE.orderUrl))
    return { kind: "provider", href: SITE.orderUrl, label: "Order online" };
  return { kind: "phone", href: SITE.phoneHref, label: `Order by phone · ${SITE.phoneDisplay}` };
}

export interface OrderProvider {
  /** Implement when a provider API is available. Must never fake success. */
  submit(lines: { id: string; qty: number }[]): Promise<{ ok: boolean; reference?: string }>;
}
