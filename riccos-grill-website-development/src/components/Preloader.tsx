"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, isReducedMotion } from "@/lib/gsap";
import { Logo } from "@/components/ui/Logo";

const HERO_SRC = "/images/hero.jpg";

/**
 * Branded loader. Progress is MEASURED: web fonts, the hero photograph and
 * the hero video's first-frame readiness each count as one task. A minimum
 * display time keeps the logo reveal readable; a hard cap (3.8s) means slow
 * networks are never held hostage.
 */
export function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLElement>(null);
  const pct = useRef<HTMLSpanElement>(null);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduced = isReducedMotion();
    const html = document.documentElement;
    html.style.overflow = "hidden";
    const w = window as unknown as { __riccosReady?: boolean };
    w.__riccosReady = false;

    const state = { value: 0 };
    let finished = false;
    const total = 3;
    let done = 0;
    const started = performance.now();

    const render = () => {
      const v = Math.round(state.value * 100);
      if (pct.current) pct.current.textContent = String(v).padStart(2, "0");
      if (bar.current) bar.current.style.transform = `scaleX(${state.value})`;
    };

    const logo = el.querySelector(".pre-logo");
    const swash = el.querySelectorAll(".pre-swash");
    const lines = el.querySelectorAll(".pre-line");
    const intro = gsap.timeline();
    if (!reduced) {
      intro
        .fromTo(logo, { clipPath: "inset(0 100% 0 0)", y: 18 }, { clipPath: "inset(0 0% 0 0)", y: 0, duration: 1.1, ease: "power3.out" })
        .from(swash, { scaleX: 0, transformOrigin: "left", duration: 0.7, ease: "power3.out" }, "-=0.35")
        .from(lines, { y: 14, opacity: 0, stagger: 0.12, duration: 0.6, ease: "power2.out" }, "-=0.4");
    }

    const leave = () => {
      if (finished) return;
      finished = true;
      gsap.to(state, {
        value: 1,
        duration: 0.35,
        ease: "power1.out",
        onUpdate: render,
        onComplete: () => {
          const out = gsap.timeline({
            onComplete: () => {
              html.style.overflow = "";
              ScrollTrigger.refresh();
              w.__riccosReady = true;
              window.dispatchEvent(new Event("riccos:ready"));
              setGone(true);
            },
          });
          if (reduced) {
            out.to(el, { opacity: 0, duration: 0.3 });
          } else {
            out
              .to(el.querySelector(".pre-content"), { y: -30, opacity: 0, duration: 0.5, ease: "power2.in" })
              .to(el.querySelector(".preloader__curtain"), { yPercent: -100, duration: 0.9, ease: "expo.inOut" }, "-=0.1")
              .to(el, { clipPath: "inset(0 0 100% 0)", duration: 0.9, ease: "expo.inOut" }, "<0.05");
          }
        },
      });
    };

    const tick = () => {
      done += 1;
      gsap.to(state, { value: done / total, duration: 0.6, ease: "power2.out", onUpdate: render });
      if (done >= total) {
        const wait = Math.max(0, (reduced ? 300 : 2000) - (performance.now() - started));
        window.setTimeout(leave, wait);
      }
    };

    // Task 1: fonts
    Promise.race([
      Promise.all([
        document.fonts.load("1em Anton"),
        document.fonts.load("1em Yellowtail"),
        document.fonts.load("1em Manrope"),
      ]),
      new Promise((r) => setTimeout(r, 2500)),
    ]).then(tick, tick);
    // Task 2: hero photograph
    const img = new Image();
    img.onload = img.onerror = tick;
    img.src = HERO_SRC;
    // Task 3: hero video
    const vid = document.querySelector<HTMLVideoElement>("video[data-hero]");
    if (vid && !reduced && vid.readyState < 3) {
      const ok = () => tick();
      vid.addEventListener("canplay", ok, { once: true });
      vid.addEventListener("error", ok, { once: true });
      window.setTimeout(ok, 2800);
    } else tick();

    const cap = window.setTimeout(leave, 3800);
    return () => {
      window.clearTimeout(cap);
      intro.kill();
      gsap.killTweensOf(state);
      html.style.overflow = "";
    };
  }, []);

  if (gone) return null;
  return (
    <div ref={root} className="preloader" role="status" aria-label="Loading Ricco's">
      <div className="preloader__curtain" aria-hidden="true" />
      <div className="pre-content relative z-10 flex flex-col items-center px-6 text-center">
        <div className="pre-logo">
          <Logo className="scale-[1.9] sm:scale-[2.4]" />
        </div>
        <svg className="pre-swash mt-14 w-40" viewBox="0 0 160 4" aria-hidden="true">
          <rect width="160" height="2" y="1" fill="#F8C342" />
        </svg>
        <p className="pre-line mt-5 text-[0.68rem] font-extrabold uppercase tracking-[0.34em] text-white/70">
          Made for the moments that matter
        </p>
        <p className="pre-line mt-3 font-display text-3xl tabular-nums text-gold">
          <span ref={pct}>00</span>
          <span className="text-pink">%</span>
        </p>
      </div>
      <div className="preloader__bar" aria-hidden="true">
        <i ref={bar as React.RefObject<HTMLElement>} />
      </div>
    </div>
  );
}
