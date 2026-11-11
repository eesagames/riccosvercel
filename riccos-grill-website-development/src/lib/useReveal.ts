"use client";

import { useEffect, type RefObject } from "react";
import { gsap, isReducedMotion } from "@/lib/gsap";

/**
 * Section choreography with one hook:
 *   .rv        → fade/slide up on enter (reversible)
 *   .clip      → clip-path wipe + inner scale settle (images)
 *   [data-par] → scrubbed parallax; value = distance in % of own height
 *   [data-count] → number count-up
 * All tweens are created inside gsap.context and fully cleaned up.
 */
export function useReveal(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el || isReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".rv").forEach((n) => {
        gsap.fromTo(
          n,
          { y: 48, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: { trigger: n, start: "top 88%", toggleActions: "play none none reverse" },
          },
        );
      });
      gsap.utils.toArray<HTMLElement>(".clip").forEach((n) => {
        gsap.fromTo(
          n,
          { clipPath: "inset(0 0 100% 0)" },
          {
            clipPath: "inset(0 0 0% 0)",
            duration: 1.3,
            ease: "expo.out",
            scrollTrigger: { trigger: n, start: "top 85%", toggleActions: "play none none reverse" },
          },
        );
        const inner = n.querySelector(".clip-in");
        if (inner)
          gsap.fromTo(
            inner,
            { scale: 1.3 },
            {
              scale: 1,
              duration: 1.8,
              ease: "expo.out",
              scrollTrigger: { trigger: n, start: "top 85%", toggleActions: "play none none reverse" },
            },
          );
      });
      gsap.utils.toArray<HTMLElement>("[data-par]").forEach((n) => {
        const d = parseFloat(n.dataset.par ?? "10");
        gsap.fromTo(
          n,
          { yPercent: -d },
          {
            yPercent: d,
            ease: "none",
            scrollTrigger: { trigger: n, start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      });
      gsap.utils.toArray<HTMLElement>("[data-count]").forEach((n) => {
        const end = parseFloat(n.dataset.count ?? "0");
        const pad = n.dataset.pad === "true";
        const o = { v: 0 };
        gsap.to(o, {
          v: end,
          duration: 1.6,
          ease: "power2.out",
          onUpdate: () => {
            const r = String(Math.round(o.v));
            n.textContent = pad ? r.padStart(2, "0") : r;
          },
          scrollTrigger: { trigger: n, start: "top 90%", toggleActions: "play none none reverse" },
        });
      });
    }, el);
    return () => ctx.revert();
  }, [ref]);
}
