"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import SplitType from "split-type";
import { gsap, isReducedMotion } from "@/lib/gsap";
import { SITE } from "@/data/site";
import { Logo } from "@/components/ui/Logo";
import { Btn } from "@/components/ui/Btn";
import { Tape } from "@/components/ui/Tape";
import { useOrder } from "@/components/order/OrderProvider";

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const media = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const { setOpen } = useOrder();

  // Real hero video: chosen by viewport, never for reduced-motion / data-saver.
  useEffect(() => {
    const v = video.current;
    if (!v || isReducedMotion()) return;
    const conn = (navigator as unknown as { connection?: { saveData?: boolean } }).connection;
    if (conn?.saveData) return;
    v.src = window.matchMedia("(max-width: 800px)").matches
      ? "/video/hero-grill-mobile.mp4"
      : "/video/hero-grill.mp4";
    const play = () => {
      v.classList.add("is-playing");
      v.play().catch(() => v.classList.remove("is-playing"));
    };
    v.addEventListener("canplay", play, { once: true });
    v.load();
    return () => v.removeEventListener("canplay", play);
  }, []);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduced = isReducedMotion();
    const splits: SplitType[] = [];
    let offPointer = () => {};
    const ctx = gsap.context(() => {
      el.querySelectorAll<HTMLElement>(".hero-line").forEach((l) => {
        const s = new SplitType(l, { types: "words,chars" });
        s.chars?.forEach((c) => c.setAttribute("aria-hidden", "true"));
        l.classList.add("is-split");
        splits.push(s);
      });
      if (reduced) return;

      gsap.set(".hero-line .char", { yPercent: 115, rotationZ: 7 });
      gsap.set(".hero-fade", { y: 28, opacity: 0 });
      gsap.set(".hero-logo", { clipPath: "inset(0 100% 0 0)" });
      gsap.set(media.current, { scale: 1.28 });

      const intro = gsap.timeline({ paused: true, defaults: { ease: "power4.out" } });
      intro
        .to(media.current, { scale: 1.04, duration: 3.2, ease: "power2.out" }, 0)
        .to(".hero-logo", { clipPath: "inset(0 0% 0 0)", duration: 1.2 }, 0.1)
        .to(".hero-line .char", { yPercent: 0, rotationZ: 0, duration: 1.1, stagger: 0.022 }, 0.3)
        .to(".hero-fade", { y: 0, opacity: 1, duration: 0.9, stagger: 0.12 }, 1.1);

      const go = () => intro.play();
      if ((window as unknown as { __riccosReady?: boolean }).__riccosReady) go();
      else window.addEventListener("riccos:ready", go, { once: true });

      // Scroll-driven exit: parallax media, drifting content.
      gsap.to(media.current, {
        yPercent: 14,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to(".hero-content", {
        yPercent: -14,
        opacity: 0.1,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top top", end: "bottom 30%", scrub: true },
      });
      gsap.to(".hero__watermark", {
        xPercent: -14,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
      });

      // Pointer depth (desktop only)
      if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
        const mx = gsap.quickTo(".hero__watermark", "x", { duration: 1.2, ease: "power3.out" });
        const my = gsap.quickTo(".hero__watermark", "y", { duration: 1.2, ease: "power3.out" });
        const move = (e: PointerEvent) => {
          mx((e.clientX / innerWidth - 0.5) * -40);
          my((e.clientY / innerHeight - 0.5) * -24);
        };
        el.addEventListener("pointermove", move);
        offPointer = () => el.removeEventListener("pointermove", move);
      }
    }, el);
    return () => {
      offPointer();
      ctx.revert();
      splits.forEach((s) => s.revert());
    };
  }, []);

  return (
    <section ref={root} id="top" className="hero" aria-label="Ricco's Grill & Dessert">
      <div ref={media} className="hero__media" aria-hidden="true">
        <Image
          src="/images/hero.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          quality={78}
          style={{ objectFit: "cover" }}
        />
        <video
          ref={video}
          data-hero
          muted
          loop
          playsInline
          preload="none"
          aria-hidden="true"
          tabIndex={-1}
        />
      </div>
      <div className="hero__shade" aria-hidden="true" />
      <div className="hero__glow" aria-hidden="true" />
      <div className="hero__watermark script" aria-hidden="true">
        Ricco&rsquo;s
      </div>

      <div className="hero-content absolute inset-x-0 bottom-0 mx-auto flex max-w-[1600px] flex-col px-5 pb-28 sm:px-8 sm:pb-32 lg:px-12">
        <div className="hero-logo mb-6 w-fit origin-left scale-[1.1] sm:mb-8 sm:scale-[1.45]">
          <Logo />
        </div>
        <p className="hero-fade eyebrow mb-4">Grill &amp; Dessert · Open seven days</p>
        <h1 aria-label="Made for the moments that matter." className="hero-title display max-w-[16ch]">
          <span className="hero-line block">MADE FOR THE</span>
          <span className="hero-line block text-gold">MOMENTS</span>
          <span className="hero-line outline-text block text-white">
            THAT MATTER<span className="text-pink" style={{ WebkitTextStroke: 0 }}>.</span>
          </span>
        </h1>
        <div className="mt-7 flex flex-col gap-7 lg:mt-9 lg:flex-row lg:items-end lg:justify-between">
          <p className="hero-fade serif max-w-md text-lg italic leading-relaxed text-white/85 sm:text-xl">
            Freshly prepared grills, loaded favourites and desserts worth coming back for.
          </p>
          <div className="hero-fade flex flex-wrap gap-3">
            <Btn href="#menu" variant="gold">
              Explore the menu
            </Btn>
            <Btn variant="ghost" onClick={() => setOpen(true)}>
              Order online
            </Btn>
          </div>
        </div>
        <div className="scroll-cue hero-fade absolute bottom-24 right-5 hidden flex-col items-center gap-3 text-[0.6rem] font-extrabold uppercase tracking-[0.3em] text-white/70 sm:right-8 md:flex lg:right-12">
          <span style={{ writingMode: "vertical-rl" }}>Scroll</span>
          <i />
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 border-t border-white/10 bg-ink/70 py-3 backdrop-blur-sm">
        <Tape
          items={[
            "Open seven days",
            `${SITE.hours.opens} – ${SITE.hours.closes}`,
            SITE.delivery,
            SITE.phoneDisplay,
          ]}
        />
      </div>
    </section>
  );
}
