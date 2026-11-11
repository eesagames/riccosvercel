import { NextResponse } from "next/server";
import { ITEM_BY_ID, OFFERS } from "@/data/menu";
import { SITE } from "@/data/site";

/**
 * Server-side basket validation.
 *
 * This endpoint does NOT place an order, take payment or store anything.
 * It validates untrusted client input against the menu data, recomputes
 * totals on the server and returns a plain-text summary the customer can
 * read out over the phone or paste into the restaurant's official ordering
 * channel. Connect a real ordering provider in `src/lib/ordering.ts`.
 */
export const dynamic = "force-dynamic";

const offerById = Object.fromEntries(OFFERS.map((o) => [o.id, o]));

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const raw = (body as { lines?: unknown })?.lines;
  if (!Array.isArray(raw) || raw.length === 0 || raw.length > 40) {
    return NextResponse.json({ error: "Basket is empty or too large" }, { status: 400 });
  }

  const lines: {
    id: string;
    name: string;
    qty: number;
    unitPrice: number | null;
    lineTotal: number | null;
  }[] = [];
  for (const entry of raw) {
    const id = (entry as { id?: unknown })?.id;
    const qty = (entry as { qty?: unknown })?.qty;
    if (typeof id !== "string" || id.length > 80)
      return NextResponse.json({ error: "Invalid item" }, { status: 400 });
    if (typeof qty !== "number" || !Number.isInteger(qty) || qty < 1 || qty > 50)
      return NextResponse.json({ error: "Invalid quantity" }, { status: 400 });
    const product = ITEM_BY_ID[id] ?? offerById[id];
    if (!product)
      return NextResponse.json({ error: `Unknown item: ${id.slice(0, 40)}` }, { status: 400 });
    lines.push({
      id,
      name: product.name,
      qty,
      unitPrice: product.price,
      lineTotal: product.price === null ? null : Math.round(product.price * qty * 100) / 100,
    });
  }

  const subtotal =
    Math.round(lines.reduce((s, l) => s + (l.lineTotal ?? 0), 0) * 100) / 100;
  const unpricedCount = lines.filter((l) => l.lineTotal === null).length;

  const text = [
    `${SITE.fullName} — order list`,
    ...lines.map(
      (l) =>
        `${l.qty} × ${l.name}${l.lineTotal === null ? " (price to be confirmed)" : ` — £${l.lineTotal.toFixed(2)}`}`,
    ),
    `Subtotal of priced items: £${subtotal.toFixed(2)}`,
    unpricedCount ? `${unpricedCount} item(s) awaiting price confirmation.` : "",
    "Not yet submitted. Call " + SITE.phoneDisplay + " to place this order.",
  ]
    .filter(Boolean)
    .join("\n");

  return NextResponse.json({ submitted: false, lines, subtotal, unpricedCount, text });
}
