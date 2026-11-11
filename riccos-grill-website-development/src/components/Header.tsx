"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { gsap } from "@/lib/gsap";
import { NAV, SITE } from "@/data/site";
import { Logo } from "@/components/ui/Logo";
import { useOrder } from "@/components/order/OrderProvider";
import { useSmooth } from "@/components/SmoothScroll";

export function Header() {
  const { count, setOpen } = useOrder();
  const { scrollTo } = useSmooth();
  const [active, setActive] = useState<string>("");
  const [solid, setSolid] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const bar = useRef<HTMLElement>(null);

  // Entrance after loader
  useEffect(() => {
    const el = bar.current;
    if (!el) return;
    gsap.set(el, { yPercent: -120, opacity: 0 });
    const go = () =>
      gsap.to(el, { yPercent: 0, opacity: 1, duration: 1.1, ease: "power4.out", delay: 0.2 });
    if ((window as unknown as { __riccosReady?: boolean }).__riccosReady) go();
    else window.addEventListener("riccos:ready", go, { once: true });
    return () => window.removeEventListener("riccos:ready", go);
  }, []);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Active-section indicator
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    NAV.forEach((n) => {
      const el = document.getElementById(n.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = menuOpen ? "hidden" : "";
    if (!menuOpen) return;
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [menuOpen]);

  const go = (id: string) => {
    setMenuOpen(false);
    window.setTimeout(() => scrollTo(`#${id}`), menuOpen ? 120 : 0);
  };

  return (
    <>
      <header
        ref={bar}
        className={`fixed inset-x-0 top-0 z-[80] transition-[background,backdrop-filter] duration-500 ${
          solid || menuOpen ? "bg-ink/85 backdrop-blur-md" : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-[4.6rem] max-w-[1600px] items-center justify-between px-5 sm:px-8 lg:px-12">
          <a
            href="#top"
            aria-label="Ricco's Grill & Dessert — back to top"
            onClick={(e) => {
              e.preventDefault();
              setMenuOpen(false);
              scrollTo(0);
            }}
            className="origin-left scale-[0.78] sm:scale-90"
          >
            <Logo compact />
          </a>

          <nav aria-label="Primary" className="hidden items-center gap-9 lg:flex">
            {NAV.map((n) => (
              <a
                key={n.id}
                href={`#${n.id}`}
                className="nav-link"
                aria-current={active === n.id ? "true" : undefined}
                onClick={(e) => {
                  e.preventDefault();
                  go(n.id);
                }}
              >
                {n.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href={SITE.phoneHref}
              className="hidden text-[0.72rem] font-bold tracking-[0.18em] text-white/80 hover:text-gold md:block"
            >
              {SITE.phoneDisplay}
            </a>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="relative flex h-11 items-center gap-2 bg-gold px-4 text-[0.7rem] font-extrabold uppercase tracking-[0.16em] text-ink transition hover:bg-white active:scale-95"
              aria-label={`Open your order, ${count} items`}
            >
              Order
              <span
                className={`grid h-5 min-w-5 place-items-center rounded-full px-1 text-[0.65rem] ${
                  count ? "bg-pink text-white" : "bg-ink/15 text-ink"
                }`}
              >
                {count}
              </span>
            </button>
            <button
              type="button"
              className="relative grid h-11 w-11 place-items-center lg:hidden"
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMenuOpen((v) => !v)}
            >
              <span
                className={`absolute h-0.5 w-6 bg-white transition-transform duration-300 ${
                  menuOpen ? "rotate-45" : "-translate-y-[5px]"
                }`}
              />
              <span
                className={`absolute h-0.5 w-6 bg-white transition-transform duration-300 ${
                  menuOpen ? "-rotate-45" : "translate-y-[5px]"
                }`}
              />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-nav"
            key="mnav"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[70] flex flex-col justify-between bg-ink px-6 pb-10 pt-28 lg:hidden"
          >
            <nav aria-label="Mobile" className="flex flex-col">
              {NAV.map((n, i) => (
                <motion.a
                  key={n.id}
                  href={`#${n.id}`}
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.25 + i * 0.07, duration: 0.6 }}
                  onClick={(e) => {
                    e.preventDefault();
                    go(n.id);
                  }}
                  className="display border-b border-white/10 py-3 text-[2.9rem] text-white"
                >
                  <span className="mr-4 align-top text-xs font-bold tracking-widest text-pink">
                    0{i + 1}
                  </span>
                  {n.label}
                </motion.a>
              ))}
            </nav>
            <div className="space-y-3">
              <a href={SITE.phoneHref} className="btn btn-gold w-full">
                Call {SITE.phoneDisplay}
              </a>
              <p className="text-center text-xs tracking-widest text-white/60">
                OPEN DAILY {SITE.hours.opens.toUpperCase()} – {SITE.hours.closes.toUpperCase()}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
