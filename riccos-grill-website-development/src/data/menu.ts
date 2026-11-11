/**
 * MENU DATA
 * ---------------------------------------------------------------------------
 * The category list below is confirmed by the client brief (15 categories).
 * The supplied menu image was NOT available when this site was built, so:
 *   - individual dishes are limited to names the brief itself mentions,
 *   - every `price` is `null` (rendered as "Price to be confirmed"),
 *   - descriptions are intentionally absent rather than invented,
 *   - the eight Value Boxes and eight Meal Deals are not listed.
 *
 * To complete the menu: add items below with a real `price` (GBP, number).
 * Every part of the site (menu, search, product modal, basket, validation API)
 * is driven from this file.
 */

export type CategoryId =
  | "sizzler-kebab"
  | "peri-peri-chicken"
  | "rice-dishes"
  | "tub-of-sauces"
  | "wraps"
  | "kids-meals"
  | "breads"
  | "pasta-dishes"
  | "jacket-potatoes"
  | "loaded-fries"
  | "tenders"
  | "sfc-wings"
  | "side-orders"
  | "value-box"
  | "meal-deals";

export type MenuCategory = {
  id: CategoryId;
  name: string;
  /** Short editorial tagline — brand copy, not a menu claim. */
  tagline: string;
  image: string;
  imageAlt: string;
};

export type MenuItem = {
  id: string;
  category: CategoryId;
  name: string;
  /** Only add when copied from the official menu. */
  description?: string;
  /** GBP. `null` = awaiting confirmation from the official menu. */
  price: number | null;
  image: string;
  imageAlt: string;
  featured?: boolean;
  /** Named in the brief but its menu category needs confirming. */
  categoryUnconfirmed?: boolean;
};

export const CATEGORIES: MenuCategory[] = [
  { id: "sizzler-kebab", name: "Sizzler Kebab", tagline: "Served hot, loud and unforgettable.", image: "/images/sizzler-a.jpg", imageAlt: "Sizzling grilled meat and peppers on a cast-iron plate" },
  { id: "peri-peri-chicken", name: "Peri Peri Chicken", tagline: "Flame-grilled with a kick.", image: "/images/peri-b.jpg", imageAlt: "Grilled chicken quarter with rice and vegetables" },
  { id: "rice-dishes", name: "Rice Dishes", tagline: "The comforting centre of the plate.", image: "/images/peri-a.jpg", imageAlt: "Grilled chicken fillets beside a mound of white rice" },
  { id: "tub-of-sauces", name: "Tub of Sauces", tagline: "For dipping, drizzling and double-dipping.", image: "/images/crunch-c.jpg", imageAlt: "Crispy chicken with a tub of creamy dipping sauce" },
  { id: "wraps", name: "Wraps", tagline: "Toasted, rolled and ready to go.", image: "/images/fav-c.jpg", imageAlt: "Toasted wrap beside a burger on a wooden board" },
  { id: "kids-meals", name: "Kids Meals", tagline: "Smaller plates for smaller appetites.", image: "/images/fav-b.jpg", imageAlt: "Assorted plates and sides on a wooden tray" },
  { id: "breads", name: "Breads", tagline: "Warm, fresh and made for sharing.", image: "/images/fav-d.jpg", imageAlt: "Garlic bread beside pasta and pizza" },
  { id: "pasta-dishes", name: "Pasta Dishes", tagline: "Creamy, hearty, generous.", image: "/images/fav-d.jpg", imageAlt: "Creamy pasta served beside pizza" },
  { id: "jacket-potatoes", name: "Jacket Potatoes", tagline: "Crisp skin, fluffy middle.", image: "/images/fries-c.jpg", imageAlt: "Bowl of golden loaded potatoes" },
  { id: "loaded-fries", name: "Loaded Fries", tagline: "Piled high. Properly loaded.", image: "/images/fries-b.jpg", imageAlt: "Fries topped with melted cheese and sauce" },
  { id: "tenders", name: "Tenders", tagline: "Golden, crunchy, dunk-ready.", image: "/images/crunch-c.jpg", imageAlt: "Golden crispy chicken tenders" },
  { id: "sfc-wings", name: "SFC & Wings", tagline: "Crispy to the very last bite.", image: "/images/crunch-d.jpg", imageAlt: "Crispy fried chicken wings with onion rings" },
  { id: "side-orders", name: "Side Orders", tagline: "Everything the main event needs.", image: "/images/crunch-e.jpg", imageAlt: "Chicken wings with a side of chips" },
  { id: "value-box", name: "Ricco's Value Box", tagline: "Eight boxes. One great idea.", image: "/images/fav-a.jpg", imageAlt: "A table spread of mixed dishes seen from above" },
  { id: "meal-deals", name: "Meal Deals", tagline: "Eight deals built around the good stuff.", image: "/images/fav-b.jpg", imageAlt: "A generous spread of sharing dishes" },
];

/** Dish names below come directly from the project brief. Prices pending. */
export const ITEMS: MenuItem[] = [
  { id: "chicken-sizzler", category: "sizzler-kebab", name: "Chicken Sizzler", price: null, image: "/images/sizzler-a.jpg", imageAlt: "Sizzling plate of grilled meat, peppers and onions", featured: true },
  { id: "beef-sizzler", category: "sizzler-kebab", name: "Beef Sizzler", price: null, image: "/images/sizzler-c.jpg", imageAlt: "Sizzler served steaming at the table", featured: true },
  { id: "riccos-special-sizzler", category: "sizzler-kebab", name: "Ricco's Special Sizzler", price: null, image: "/images/sizzler-b.jpg", imageAlt: "Sizzler plates on wooden boards in a warm kitchen", featured: true },
  { id: "lamb-chops", category: "sizzler-kebab", name: "Lamb Chops", price: null, image: "/images/lamb-a.jpg", imageAlt: "Grilled lamb chops with tomato and chilli on a dark plate", featured: true, categoryUnconfirmed: true },
  { id: "peri-peri-chicken", category: "peri-peri-chicken", name: "Peri Peri Chicken", price: null, image: "/images/peri-b.jpg", imageAlt: "Grilled chicken with rice and an orange slice", featured: true },
  { id: "chicken-tenders", category: "tenders", name: "Chicken Tenders", price: null, image: "/images/crunch-c.jpg", imageAlt: "Crispy golden chicken tenders with dip" },
  { id: "wings", category: "sfc-wings", name: "Wings", price: null, image: "/images/crunch-b.jpg", imageAlt: "Golden fried chicken wings on a wooden board" },
  { id: "crispy-chicken", category: "sfc-wings", name: "Crispy Chicken", price: null, image: "/images/crunch-a.jpg", imageAlt: "Crispy fried chicken pieces piled on paper" },
  { id: "loaded-fries", category: "loaded-fries", name: "Loaded Fries", price: null, image: "/images/fries-a.jpg", imageAlt: "Fries covered in melted cheese and crispy topping", featured: true },
];

/**
 * Offers: the client confirmed there are 8 Value Boxes and 8 Meal Deals.
 * Their contents and prices must be copied from the official menu.
 */
export type Offer = {
  id: string;
  kind: "value-box" | "meal-deal";
  name: string;
  includes: string[];
  price: number;
  image: string;
  imageAlt: string;
};
export const OFFERS: Offer[] = [];
export const OFFER_COUNTS = { valueBoxes: 8, mealDeals: 8 } as const;

export const ITEM_BY_ID: Record<string, MenuItem> = Object.fromEntries(
  ITEMS.map((i) => [i.id, i]),
);
export const CATEGORY_BY_ID: Record<string, MenuCategory> = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c]),
);

export const formatPrice = (p: number | null) =>
  p === null ? "Price to be confirmed" : `£${p.toFixed(2)}`;
