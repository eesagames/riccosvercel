"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { CATEGORY_BY_ID, formatPrice, type MenuItem } from "@/data/menu";
import { SITE } from "@/data/site";
import { useOrder } from "@/components/order/OrderProvider";

export function ProductModal({
  item,
  onClose,
}: {
  item: MenuItem | null;
  onClose: () => void;
}) {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const { add, setOpen } = useOrder();
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!item) return;
    setQty(1);
    setAdded(false);
    const prevFocus = document.activeElement as HTMLElement | null;
    document.documentElement.style.overflow = "hidden";
    closeRef.current?.focus();
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && panelRef.current) {
        const f = panelRef.current.querySelectorAll<HTMLElement>("button, a[href], input");
        if (!f.length) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", key);
    return () => {
      window.removeEventListener("keydown", key);
      document.documentElement.style.overflow = "";
      prevFocus?.focus?.();
    };
  }, [item, onClose]);

  const total = item?.price != null ? item.price * qty : null;

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          data-lenis-prevent
          className="fixed inset-0 z-[120] grid place-items-end bg-black/75 backdrop-blur-sm sm:place-items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={item.name}
            onClick={(e) => e.stopPropagation()}
            initial={{ y: 80, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 60, opacity: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="relative grid max-h-[92svh] w-full max-w-5xl overflow-y-auto bg-coal sm:grid-cols-2"
          >
            <div className="relative h-60 sm:h-auto sm:min-h-[34rem]">
              <Image src={item.image} alt={item.imageAlt} fill sizes="(max-width:640px) 100vw, 50vw" quality={78} style={{ objectFit: "cover" }} />
              <div className="absolute inset-0 bg-gradient-to-t from-coal/70 to-transparent sm:bg-gradient-to-r sm:from-transparent sm:to-coal/40" />
            </div>
            <div className="flex flex-col p-6 sm:p-10">
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="absolute right-3 top-3 z-10 grid h-11 w-11 place-items-center bg-ink/70 text-xl text-white hover:bg-pink"
              >
                ×
              </button>
              <p className="eyebrow !text-pink">{CATEGORY_BY_ID[item.category].name}</p>
              <h3 className="display mt-3 text-[clamp(2.6rem,5vw,4.6rem)]">{item.name}</h3>
              <p className="display mt-3 text-3xl text-gold">{formatPrice(item.price)}</p>
              <div className="serif mt-5 space-y-3 text-lg italic leading-relaxed text-white/80">
                {item.description ? (
                  <p>{item.description}</p>
                ) : (
                  <p>
                    Ingredients, sizes and options will be listed here once confirmed from the official menu.
                    For anything specific, call the team on{" "}
                    <a href={SITE.phoneHref} className="text-gold underline">{SITE.phoneDisplay}</a>.
                  </p>
                )}
                {item.categoryUnconfirmed && (
                  <p className="!text-sm text-white/50">Category placement to be confirmed.</p>
                )}
              </div>

              <div className="mt-auto pt-8">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center border border-white/20" role="group" aria-label="Quantity">
                    <button type="button" className="h-12 w-12 text-xl hover:bg-white/10" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity">−</button>
                    <span className="grid h-12 w-12 place-items-center font-bold tabular-nums" aria-live="polite">{qty}</span>
                    <button type="button" className="h-12 w-12 text-xl hover:bg-white/10" onClick={() => setQty((q) => Math.min(50, q + 1))} aria-label="Increase quantity">+</button>
                  </div>
                  {total !== null && <span className="display text-2xl">£{total.toFixed(2)}</span>}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    add(item.id, qty);
                    setAdded(true);
                  }}
                  className="btn btn-gold mt-4 w-full"
                >
                  {added ? "Added to order" : "Add to order"}
                </button>
                {added && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      setOpen(true);
                    }}
                    className="mt-3 w-full text-center text-xs font-extrabold uppercase tracking-[0.2em] text-gold underline-offset-4 hover:underline"
                  >
                    View your order
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
