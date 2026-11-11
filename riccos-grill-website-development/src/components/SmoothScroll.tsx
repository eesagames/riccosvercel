"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
} from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, isReducedMotion } from "@/lib/gsap";

type Smooth = {
  scrollTo: (target: string | number, opts?: { immediate?: boolean }) => void;
};
const Ctx = createContext<Smooth>({ scrollTo: () => {} });
export const useSmooth = () => useContext(Ctx);

/**
 * One scroll clock (adapted from BR-BURGER): Lenis drives the GSAP ticker and
 * ScrollTrigger, so every pinned chapter and scrubbed timeline shares a single
 * source of truth. Smoothing is disabled for reduced-motion visitors.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const reduced = isReducedMotion();
    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: !reduced,
      anchors: false,
    });
    lenisRef.current = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  const value = useMemo<Smooth>(
    () => ({
      scrollTo: (target, opts) => {
        const lenis = lenisRef.current;
        const el =
          typeof target === "string"
            ? document.querySelector<HTMLElement>(target)
            : null;
        if (typeof target === "string" && !el) return;
        if (lenis) {
          lenis.scrollTo(typeof target === "string" ? el! : target, {
            duration: opts?.immediate ? 0 : 1.6,
            immediate: opts?.immediate,
            easing: (x) => 1 - Math.pow(1 - x, 4),
          });
        } else if (el) el.scrollIntoView({ behavior: "auto" });
        else if (typeof target === "number") window.scrollTo(0, target);
      },
    }),
    [],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
