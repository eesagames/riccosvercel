"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import {
  CATEGORIES,
  CATEGORY_BY_ID,
  ITEMS,
  formatPrice,
  type CategoryId,
  type MenuItem,
} from "@/data/menu";
import { SITE } from "@/data/site";
import { SplitHeading } from "@/components/ui/SplitHeading";
import { Btn } from "@/components/ui/Btn";
import { useOrder } from "@/components/order/OrderProvider";
import { ProductModal } from "./ProductModal";

type Tab = "featured" | CategoryId;

const FEATURED = ITEMS.filter((i) => i.featured);

export function MenuExplorer() {
  const [tab, setTab] = useState<Tab>("featured");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<MenuItem | null>(null);
  const [justAdded, setJustAdded] = useState<string | null>(null);
  const { add } = useOrder();
  const tabsRef = useRef<HTMLDivElement>(null);

  // Other sections (deals, story) can deep-link into a category.
  useEffect(() => {
    const h = (e: Event) => {
      const id = (e as CustomEvent<string>).detail as Tab;
      if (id === "featured" || CATEGORY_BY_ID[id]) {
        setQuery("");
        setTab(id);
      }
    };
    window.addEventListener("riccos:category", h);
    return () => window.removeEventListener("riccos:category", h);
  }, []);

  // Keep the active tab in view on mobile.
  useEffect(() => {
    const el = tabsRef.current?.querySelector<HTMLElement>('[aria-selected="true"]');
    el?.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
  }, [tab]);

  const q = query.trim().toLowerCase();
  const results = useMemo(() => {
    if (!q) return [];
    return ITEMS.filter((i) =>
      [i.name, i.description ?? "", CATEGORY_BY_ID[i.category].name]
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [q]);
  const matchedCats = useMemo(
    () => (q ? CATEGORIES.filter((c) => c.name.toLowerCase().includes(q)) : []),
    [q],
  );

  const category = tab === "featured" ? null : CATEGORY_BY_ID[tab];
  const list = tab === "featured" ? FEATURED : ITEMS.filter((i) => i.category === tab);
  const panelImg = category?.image ?? "/images/hero.jpg";
  const panelAlt = category?.imageAlt ?? "Flame-grilled kebabs over glowing charcoal";

  const quickAdd = (item: MenuItem) => {
    add(item.id, 1);
    setJustAdded(item.id);
    window.setTimeout(() => setJustAdded((c) => (c === item.id ? null : c)), 1400);
  };

  const row = (item: MenuItem, i: number) => (
    <motion.li
      key={item.id}
      layout="position"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ delay: i * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="dish group grid grid-cols-[4.5rem_1fr_auto] items-center gap-4 border-b border-white/10 py-4 sm:grid-cols-[6.5rem_1fr_auto] sm:gap-6"
    >
      <button
        type="button"
        onClick={() => setSelected(item)}
        className="relative block aspect-square overflow-hidden bg-coal"
        aria-label={`View ${item.name}`}
      >
        <Image src={item.image} alt={item.imageAlt} fill sizes="104px" quality={65} style={{ objectFit: "cover" }} />
      </button>
      <button type="button" onClick={() => setSelected(item)} className="min-w-0 text-left">
        <span className="eyebrow !text-pink block text-[0.6rem]">
          {CATEGORY_BY_ID[item.category].name}
        </span>
        <span className="display mt-1 block text-[1.6rem] leading-none sm:text-[2.2rem]">
          {item.name}
        </span>
        <span className="mt-1 block text-xs font-semibold tracking-wide text-white/55">
          {item.price === null ? "Price to be confirmed" : formatPrice(item.price)}
        </span>
      </button>
      <button
        type="button"
        onClick={() => quickAdd(item)}
        className={`h-11 min-w-[5.4rem] px-4 text-[0.68rem] font-extrabold uppercase tracking-[0.16em] transition active:scale-95 ${
          justAdded === item.id ? "bg-pink text-white" : "bg-gold text-ink hover:bg-white"
        }`}
        aria-label={`Add ${item.name} to order`}
      >
        {justAdded === item.id ? "Added" : "Add"}
      </button>
    </motion.li>
  );

  return (
    <section id="menu" className="relative bg-ink pt-24 sm:pt-32" aria-labelledby="menu-title">
      <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12">
        <p className="eyebrow chap-eyebrow mb-4">The full menu</p>
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <SplitHeading text="PICK YOUR FIRE." as="h2" className="display text-[clamp(3.2rem,10vw,10rem)]" />
          <p className="serif max-w-md text-lg italic leading-relaxed text-white/75">
            Fifteen categories, from sizzlers and peri peri to value boxes and meal deals. Tap any dish to see it up close and add it to your order.
          </p>
        </div>
        <span id="menu-title" className="sr-only-live">Ricco&rsquo;s menu</span>
      </div>

      {/* Sticky category bar */}
      <div className="sticky top-[4.6rem] z-40 mt-10 border-y border-white/10 bg-ink/92 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-0 px-0 lg:flex-row lg:items-center lg:px-12">
          <LayoutGroup id="cats">
            <div
              ref={tabsRef}
              role="tablist"
              aria-label="Menu categories"
              className="no-scrollbar flex flex-1 overflow-x-auto px-3 sm:px-8 lg:px-0"
            >
              {[{ id: "featured" as Tab, name: "Featured" }, ...CATEGORIES].map((c) => (
                <button
                  key={c.id}
                  role="tab"
                  type="button"
                  aria-selected={!q && tab === c.id}
                  className="cat-tab"
                  onClick={() => {
                    setQuery("");
                    setTab(c.id as Tab);
                  }}
                >
                  {!q && tab === c.id && (
                    <motion.span layoutId="pill" className="pill" transition={{ type: "spring", stiffness: 500, damping: 40 }} />
                  )}
                  {c.name}
                </button>
              ))}
            </div>
          </LayoutGroup>
          <label className="relative mx-3 mb-3 mt-1 block lg:mx-0 lg:mb-0 lg:mt-0 lg:w-72">
            <span className="sr-only-live">Search the menu</span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value.slice(0, 60))}
              placeholder="Search the menu"
              className="h-11 w-full border-0 bg-white/8 px-4 text-sm font-semibold text-white outline-none ring-1 ring-white/15 placeholder:text-white/40 focus:ring-gold"
              style={{ background: "rgba(255,255,255,.06)" }}
            />
          </label>
        </div>
      </div>

      <div className="mx-auto grid max-w-[1600px] gap-8 px-5 py-10 sm:px-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16 lg:px-12 lg:py-16">
        {/* Visual panel */}
        <div className="lg:sticky lg:top-44 lg:self-start">
          <AnimatePresence mode="wait">
            <motion.div
              key={q ? "search" : tab}
              initial={{ clipPath: "inset(0 0 100% 0)" }}
              animate={{ clipPath: "inset(0 0 0% 0)" }}
              exit={{ clipPath: "inset(100% 0 0 0)" }}
              transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
              className="relative h-56 overflow-hidden bg-coal sm:h-80 lg:h-[68vh] lg:max-h-[720px]"
            >
              <Image
                src={q ? "/images/grill-b.jpg" : panelImg}
                alt={q ? "Skewers on the grill" : panelAlt}
                fill
                sizes="(max-width:1024px) 100vw, 45vw"
                quality={75}
                style={{ objectFit: "cover" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8">
                <p className="eyebrow !text-gold">{q ? "Search" : category ? "Category" : "Chef’s picks"}</p>
                <h3 className="display mt-2 text-[clamp(2.4rem,5.6vw,5.6rem)]">
                  {q ? `“${query.trim()}”` : category ? category.name : "Featured"}
                </h3>
                {!q && (
                  <p className="serif mt-2 text-lg italic text-white/80">
                    {category ? category.tagline : "Sizzlers, peri peri and loaded favourites."}
                  </p>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Items */}
        <div className="min-h-[24rem]" aria-live="polite">
          {q ? (
            <>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-white/55">
                {results.length + matchedCats.length} result{results.length + matchedCats.length === 1 ? "" : "s"}
              </p>
              {matchedCats.length > 0 && (
                <div className="mb-4 flex flex-wrap gap-2">
                  {matchedCats.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => {
                        setQuery("");
                        setTab(c.id);
                      }}
                      className="border border-gold/50 px-3 py-2 text-[0.68rem] font-extrabold uppercase tracking-[0.16em] text-gold hover:bg-gold hover:text-ink"
                    >
                      Open {c.name}
                    </button>
                  ))}
                </div>
              )}
              <ul>{results.map(row)}</ul>
              {results.length === 0 && matchedCats.length === 0 && (
                <p className="serif py-10 text-xl italic text-white/70">
                  Nothing matches &ldquo;{query.trim()}&rdquo;. Try another word, or call us on{" "}
                  <a href={SITE.phoneHref} className="text-gold underline">{SITE.phoneDisplay}</a>.
                </p>
              )}
            </>
          ) : (
            <AnimatePresence mode="popLayout">
              <motion.div key={tab} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }}>
                {list.length > 0 && <ul>{list.map(row)}</ul>}
                {category && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 + list.length * 0.05 }}
                    className={`${list.length ? "mt-8" : ""} border border-dashed border-gold/40 p-6 sm:p-8`}
                  >
                    <p className="eyebrow">{list.length ? "More in this category" : "Menu being confirmed"}</p>
                    <p className="serif mt-3 text-xl italic leading-relaxed text-white/85">
                      {list.length
                        ? `The full ${category.name} list and prices are being verified against the printed menu.`
                        : `Dishes and prices for ${category.name} are being verified against the printed menu — we don’t publish anything we haven’t confirmed.`}
                    </p>
                    <div className="mt-5 flex flex-wrap gap-3">
                      <Btn href={SITE.phoneHref} variant="gold">Call {SITE.phoneDisplay}</Btn>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>

      <ProductModal item={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
