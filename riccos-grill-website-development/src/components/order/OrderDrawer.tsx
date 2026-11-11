"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useOrder } from "./OrderProvider";
import { getOrderChannel } from "@/lib/ordering";
import { SITE } from "@/data/site";
import { formatPrice } from "@/data/menu";

type Summary = { text: string; error?: undefined } | { error: string; text?: undefined };

export function OrderDrawer() {
  const { open, setOpen, lines, count, subtotal, unpriced, setQty, remove, clear, resolve } = useOrder();
  const [summary, setSummary] = useState<Summary | null>(null);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const channel = getOrderChannel();

  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    document.documentElement.style.overflow = "hidden";
    closeRef.current?.focus();
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "Tab" && panelRef.current) {
        const f = panelRef.current.querySelectorAll<HTMLElement>("button:not([disabled]), a[href]");
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
      prev?.focus?.();
    };
  }, [open, setOpen]);

  // Any basket change invalidates a previously prepared summary.
  useEffect(() => {
    setSummary(null);
    setCopied(false);
  }, [lines]);

  const prepare = async () => {
    setBusy(true);
    try {
      const res = await fetch("/api/order/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lines }),
      });
      const data = await res.json();
      setSummary(res.ok ? { text: String(data.text) } : { error: String(data.error ?? "Something went wrong") });
    } catch {
      setSummary({ error: "Could not prepare the summary. Please try again." });
    } finally {
      setBusy(false);
    }
  };

  const copy = async () => {
    if (!summary?.text) return;
    try {
      await navigator.clipboard.writeText(summary.text);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          data-lenis-prevent
          className="fixed inset-0 z-[130] flex justify-end bg-black/70 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setOpen(false)}
        >
          <motion.aside
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Your order"
            onClick={(e) => e.stopPropagation()}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex h-full w-full max-w-md flex-col bg-ink shadow-2xl ring-1 ring-white/10"
          >
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
              <div>
                <p className="eyebrow">Your order</p>
                <h2 className="display mt-1 text-4xl">{count ? `${count} item${count > 1 ? "s" : ""}` : "Empty"}</h2>
              </div>
              <button ref={closeRef} type="button" onClick={() => setOpen(false)} aria-label="Close order" className="grid h-11 w-11 place-items-center text-2xl hover:bg-pink">
                ×
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6">
              {lines.length === 0 ? (
                <div className="py-16 text-center">
                  <p className="display text-3xl text-white/80">Nothing here yet</p>
                  <p className="serif mt-3 text-lg italic text-white/60">Add a sizzler, some wings or loaded fries from the menu.</p>
                  <button
                    type="button"
                    className="btn btn-gold mt-8"
                    onClick={() => {
                      setOpen(false);
                      window.setTimeout(() => document.getElementById("menu")?.scrollIntoView(), 300);
                    }}
                  >
                    Browse the menu
                  </button>
                </div>
              ) : (
                <ul>
                  {lines.map((l) => {
                    const p = resolve(l.id);
                    if (!p) return null;
                    return (
                      <li key={l.id} className="grid grid-cols-[4rem_1fr_auto] items-center gap-4 border-b border-white/10 py-4">
                        <div className="relative aspect-square overflow-hidden bg-coal">
                          <Image src={p.image} alt={p.imageAlt} fill sizes="64px" quality={60} style={{ objectFit: "cover" }} />
                        </div>
                        <div className="min-w-0">
                          <p className="display truncate text-xl leading-none">{p.name}</p>
                          <p className="mt-1 text-xs font-semibold text-white/55">{formatPrice(p.price)}</p>
                          <div className="mt-2 flex items-center gap-3">
                            <div className="flex items-center border border-white/20">
                              <button type="button" className="h-8 w-8 hover:bg-white/10" aria-label={`Decrease ${p.name}`} onClick={() => setQty(l.id, l.qty - 1)}>−</button>
                              <span className="w-8 text-center text-sm font-bold tabular-nums">{l.qty}</span>
                              <button type="button" className="h-8 w-8 hover:bg-white/10" aria-label={`Increase ${p.name}`} onClick={() => setQty(l.id, l.qty + 1)}>+</button>
                            </div>
                            <button type="button" onClick={() => remove(l.id)} className="text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-white/50 underline-offset-4 hover:text-pink hover:underline">
                              Remove
                            </button>
                          </div>
                        </div>
                        <p className="display text-xl text-gold">{p.price === null ? "TBC" : `£${(p.price * l.qty).toFixed(2)}`}</p>
                      </li>
                    );
                  })}
                </ul>
              )}

              {summary && (
                <div className="my-5 border border-gold/40 bg-coal p-4">
                  {summary.error ? (
                    <p role="alert" className="text-sm text-pink">{summary.error}</p>
                  ) : (
                    <>
                      <pre className="whitespace-pre-wrap font-sans text-[0.8rem] leading-relaxed text-white/85">{summary.text}</pre>
                      <button type="button" onClick={copy} className="mt-3 text-xs font-extrabold uppercase tracking-[0.18em] text-gold underline-offset-4 hover:underline">
                        {copied ? "Copied to clipboard" : "Copy order list"}
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            {lines.length > 0 && (
              <div className="border-t border-white/10 bg-coal px-6 py-5">
                <dl className="space-y-1.5 text-sm">
                  <div className="flex justify-between"><dt className="text-white/65">Subtotal (priced items)</dt><dd className="font-bold tabular-nums">£{subtotal.toFixed(2)}</dd></div>
                  {unpriced > 0 && (
                    <div className="flex justify-between text-white/55"><dt>{unpriced} item{unpriced > 1 ? "s" : ""} awaiting price</dt><dd>TBC</dd></div>
                  )}
                  <div className="flex justify-between text-white/55"><dt>Delivery &amp; charges</dt><dd>Confirmed when you order</dd></div>
                  <div className="flex items-baseline justify-between border-t border-white/10 pt-2">
                    <dt className="eyebrow">{unpriced > 0 ? "Total so far" : "Total"}</dt>
                    <dd className="display text-3xl text-gold">£{subtotal.toFixed(2)}</dd>
                  </div>
                </dl>
                <p className="mt-3 text-[0.7rem] leading-relaxed text-white/50">
                  This list has not been sent anywhere. No payment is taken on this website. Place your order using the button below.
                </p>
                <div className="mt-4 grid gap-2.5">
                  <a
                    href={channel.href}
                    {...(channel.kind === "provider" ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="btn btn-gold w-full"
                  >
                    {channel.label}
                  </a>
                  <button type="button" onClick={prepare} disabled={busy} className="btn btn-ghost w-full disabled:opacity-60">
                    {busy ? "Preparing…" : "Review order list"}
                  </button>
                  <button type="button" onClick={clear} className="py-2 text-center text-[0.68rem] font-extrabold uppercase tracking-[0.2em] text-white/55 hover:text-pink">
                    Clear order
                  </button>
                </div>
              </div>
            )}
            {lines.length === 0 && (
              <div className="border-t border-white/10 px-6 py-5 text-center">
                <a href={SITE.phoneHref} className="btn btn-ghost w-full">Or call {SITE.phoneDisplay}</a>
              </div>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
