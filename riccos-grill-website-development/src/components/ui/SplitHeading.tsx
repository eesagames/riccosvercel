"use client";

import { useEffect, useRef, type ElementType } from "react";
import SplitType from "split-type";
import { gsap, ScrollTrigger, isReducedMotion } from "@/lib/gsap";

/**
 * Character-level heading reveal (SplitType + GSAP). Reversible on scroll,
 * accessible (full text exposed via aria-label), skipped for reduced motion.
 */
export function SplitHeading({
  text,
  as: Tag = "h2",
  className = "",
  start = "top 85%",
  from = "up",
  immediate = false,
}: {
  text: string;
  as?: ElementType;
  className?: string;
  start?: string;
  from?: "up" | "scale";
  immediate?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (isReducedMotion()) {
      el.classList.add("is-split");
      return;
    }
    const split = new SplitType(el, { types: "words,chars" });
    split.chars?.forEach((c) => c.setAttribute("aria-hidden", "true"));
    el.classList.add("is-split");
    const tween = gsap.from(split.chars, {
      yPercent: from === "up" ? 105 : 20,
      rotationZ: from === "up" ? 6 : 0,
      scale: from === "scale" ? 0.6 : 1,
      opacity: from === "scale" ? 0 : 1,
      duration: 1,
      stagger: 0.022,
      ease: "power4.out",
      paused: immediate,
      scrollTrigger: immediate
        ? undefined
        : { trigger: el, start, toggleActions: "play none none reverse" },
    });
    if (immediate) {
      const go = () => tween.play();
      if ((window as unknown as { __riccosReady?: boolean }).__riccosReady) go();
      else window.addEventListener("riccos:ready", go, { once: true });
      return () => {
        window.removeEventListener("riccos:ready", go);
        tween.kill();
        split.revert();
      };
    }
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      split.revert();
    };
  }, [text, start, from, immediate]);

  return (
    <Tag ref={ref} aria-label={text} className={`split ${className}`}>
      {text}
    </Tag>
  );
}

export { ScrollTrigger };
