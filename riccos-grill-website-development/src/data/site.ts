/**
 * Single source of truth for verified Ricco's business information.
 * Only details supplied by the client live here. Do NOT add an address,
 * delivery fee, minimum order or delivery zone until they are confirmed.
 */
export const SITE = {
  name: "Ricco's",
  fullName: "Ricco's Grill & Dessert",
  url: "https://www.riccosgrill.co.uk",
  phoneDisplay: "0115 9371177",
  phoneHref: "tel:+441159371177",
  hours: { days: "Monday – Sunday", opens: "2:00 PM", closes: "10:00 PM" },
  delivery: "Delivery available",
  /**
   * Official online-ordering URL. Set NEXT_PUBLIC_ORDER_URL when the restaurant
   * confirms its provider. Until then, ordering falls back to the phone line.
   */
  orderUrl: process.env.NEXT_PUBLIC_ORDER_URL ?? "",
  description:
    "Ricco's Grill & Dessert — freshly prepared grills, sizzlers, peri peri chicken, loaded favourites and desserts. Open seven days, 2 PM – 10 PM. Delivery available. Call 0115 9371177.",
} as const;

export const NAV = [
  { id: "story", label: "The Story" },
  { id: "menu", label: "Menu" },
  { id: "offers", label: "Deals" },
  { id: "about", label: "About" },
  { id: "visit", label: "Visit" },
] as const;
