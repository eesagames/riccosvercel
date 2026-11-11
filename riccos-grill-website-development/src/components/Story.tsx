"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import SplitType from "split-type";
import { gsap, ScrollTrigger, isReducedMotion } from "@/lib/gsap";
import { ITEM_BY_ID } from "@/data/menu";
import { Btn } from "@/components/ui/Btn";
import { Tape } from "@/components/ui/Tape";
import { useOrder } from "@/components/order/OrderProvider";
import { useSmooth } from "@/components/SmoothScroll";

const Embers = dynamic(() => import("./Embers"), { ssr: false });

const CHAPTERS = [
  "The Grill",
  "The Signatures",
  "The Crunch",
  "The Favourites",
  "Something Sweet",
  "The Complete Experience",
];
const N = CHAPTERS.length;
const SIGS = [
  "chicken-sizzler",
  "beef-sizzler",
  "riccos-special-sizzler",
  "lamb-chops",
  "peri-peri-chicken",
].map((id) => ITEM_BY_ID[id]);

const SLATS = [
  { label: "Burgers", img: "/images/fav-c.jpg", pos: "50% 14%", alt: "A burger on a wooden board" },
  { label: "Wraps", img: "/images/fav-c.jpg", pos: "30% 88%", alt: "A toasted wrap on a wooden board" },
  { label: "Pizzas", img: "/images/fav-d.jpg", pos: "88% 28%", alt: "A freshly baked pizza" },
  { label: "Pasta", img: "/images/fav-d.jpg", pos: "14% 22%", alt: "Creamy pasta with garlic bread" },
  { label: "Meal deals", img: "/images/fav-b.jpg", pos: "50% 50%", alt: "A tray of shared dishes" },
];
const MOSAIC = [
  { src: "/images/grill-b.jpg", alt: "Meat skewers over charcoal" },
  { src: "/images/sizzler-a.jpg", alt: "A sizzling plate of grilled meat and peppers" },
  { src: "/images/crunch-c.jpg", alt: "Crispy chicken tenders" },
  { src: "/images/fries-b.jpg", alt: "Cheesy loaded fries" },
  { src: "/images/fav-a.jpg", alt: "A table of pizza, wraps and burgers" },
  { src: "/images/sweet-a.jpg", alt: "A layered dessert in warm light" },
];

function Ph({
  cls,
  src,
  alt,
  show,
  sizes,
  pos = "50% 50%",
}: {
  cls: string;
  src: string;
  alt: string;
  show: boolean;
  sizes: string;
  pos?: string;
}) {
  return (
    <div className={`ph ${cls}`}>
      <div className="ph-in">
        {show && (
          <Image
            src={src}
            alt={alt}
            fill
            sizes={sizes}
            quality={72}
            style={{ objectFit: "cover", objectPosition: pos }}
          />
        )}
      </div>
    </div>
  );
}

// Ring easing: each signature holds still, then glides to the next.
const smooth = (x: number) => x * x * (3 - 2 * x);
const ringEase = (p: number) => {
  if (p >= 1) return 1;
  const x = p * (SIGS.length - 1);
  const k = Math.floor(x);
  const f = Math.min(1, Math.max(0, (x - k - 0.25) / 0.5));
  return (k + smooth(f)) / (SIGS.length - 1);
};

export function Story() {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const trigger = useRef<ScrollTrigger | null>(null);
  const [active, setActive] = useState(0);
  const [reach, setReach] = useState(2);
  const [live, setLive] = useState(false);
  const [desktop, setDesktop] = useState(false);
  const { setOpen } = useOrder();
  const { scrollTo } = useSmooth();

  useEffect(() => {
    const el = root.current;
    const st = stage.current;
    if (!el || !st) return;
    if (isReducedMotion()) {
      setReach(N + 1);
      return;
    }
    setDesktop(
      window.matchMedia("(min-width: 1024px) and (hover: hover) and (pointer: fine)").matches,
    );
    const mobile = window.matchMedia("(max-width: 900px)").matches;
    const perChapter = mobile ? 0.95 : 1.25;
    const splits: SplitType[] = [];
    const cleanups: (() => void)[] = [];

    // ---- Video: lazy source + coalesced seeking (technique from BR-BURGER) ----
    const vid = st.querySelector<HTMLVideoElement>("video");
    let target = 0;
    const seek = () => {
      if (!vid || vid.seeking || vid.readyState < 1 || !Number.isFinite(vid.duration)) return;
      const d = target * Math.max(0, vid.duration - 0.05);
      if (Math.abs(vid.currentTime - d) > 0.02) vid.currentTime = d;
    };
    if (vid) {
      const ready = () => {
        vid.classList.add("is-ready");
        seek();
      };
      vid.addEventListener("loadeddata", ready);
      vid.addEventListener("seeked", seek);
      const conn = (navigator as unknown as { connection?: { saveData?: boolean } }).connection;
      const io = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting) && !vid.getAttribute("src") && !conn?.saveData) {
            vid.src = mobile ? "/video/grill-scrub-mobile.mp4" : "/video/grill-scrub.mp4";
            vid.load();
            io.disconnect();
          }
        },
        { rootMargin: "150% 0px" },
      );
      io.observe(el);
      cleanups.push(() => {
        io.disconnect();
        vid.removeEventListener("loadeddata", ready);
        vid.removeEventListener("seeked", seek);
      });
    }

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(st);
      const chaps = q(".chap") as HTMLElement[];
      const plates = q(".plate");
      gsap.set(chaps.slice(1), { autoAlpha: 0 });
      gsap.set(plates.slice(1), { opacity: 0 });

      const chars: Record<number, Element[]> = {};
      chaps.forEach((c, i) => {
        const h = c.querySelector<HTMLElement>("[data-split]");
        if (!h) return;
        const s = new SplitType(h, { types: "words,chars" });
        s.chars?.forEach((ch) => ch.setAttribute("aria-hidden", "true"));
        h.classList.add("is-split");
        splits.push(s);
        chars[i] = s.chars ?? [];
      });

      // ---- Ring (chapter 2) helpers ----
      const ring = st.querySelector<HTMLElement>(".ring");
      const cards = Array.from(st.querySelectorAll<HTMLElement>(".ring-card"));
      const nameEl = st.querySelector<HTMLElement>(".sig-name");
      const dots = Array.from(st.querySelectorAll<HTMLElement>(".sig-dots button"));
      const rotObj = { rot: 0 };
      let lastSig = -1;
      const applyRing = () => {
        if (!ring) return;
        ring.style.setProperty("--rot", `${rotObj.rot}deg`);
        cards.forEach((c, i) => {
          const a = ((i * 72 + rotObj.rot) * Math.PI) / 180;
          c.style.opacity = String(0.28 + 0.72 * Math.max(0, Math.cos(a)));
        });
        const idx = Math.min(SIGS.length - 1, Math.max(0, Math.round(-rotObj.rot / 72)));
        if (idx !== lastSig) {
          lastSig = idx;
          if (nameEl) nameEl.textContent = SIGS[idx].name;
          dots.forEach((d, k) => d.setAttribute("aria-current", String(k === idx)));
        }
      };
      applyRing();

      let lastChapter = -1;
      const bar = st.querySelector<HTMLElement>(".story-progress i");
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: () => `+=${innerHeight * perChapter * N}`,
          pin: st,
          scrub: 0.7,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onToggle: (self) => setLive(self.isActive),
          onUpdate: (self) => {
            const time = self.progress * N;
            if (bar) bar.style.transform = `scaleX(${self.progress})`;
            target = Math.min(1, Math.max(0, time / 1));
            seek();
            const idx = Math.min(N - 1, Math.floor(time));
            if (idx !== lastChapter) {
              lastChapter = idx;
              st.dataset.chapter = String(idx);
              setActive(idx);
              setReach((r) => Math.max(r, idx + 2));
            }
          },
        },
      });
      trigger.current = tl.scrollTrigger ?? null;
      tl.add(() => {}, N);

      // Chapter transitions: dissolve plates, fade foregrounds — fully reversible.
      for (let i = 0; i < N - 1; i++) {
        tl.to(chaps[i], { autoAlpha: 0, duration: 0.1, ease: "power1.in" }, i + 0.9);
        tl.to(plates[i + 1], { opacity: 1, duration: 0.14 }, i + 0.88);
        tl.to(chaps[i + 1], { autoAlpha: 1, duration: 0.1, ease: "power1.out" }, i + 1.03);
      }

      // 01 — THE GRILL
      tl.from(chars[0], { yPercent: 115, rotationZ: 6, stagger: 0.008, duration: 0.2, ease: "power3.out" }, 0.02);
      tl.from(".c0-list li", { x: -30, opacity: 0, stagger: 0.04, duration: 0.14, ease: "power2.out" }, 0.14);
      tl.fromTo(".c0-a", { yPercent: 35, clipPath: "inset(100% 0 0 0)" }, { yPercent: -10, clipPath: "inset(0% 0 0 0)", duration: 0.85 }, 0.02);
      tl.fromTo(".c0-b", { yPercent: 55, clipPath: "inset(100% 0 0 0)" }, { yPercent: -20, clipPath: "inset(0% 0 0 0)", duration: 0.85 }, 0.1);
      tl.fromTo(".c0-c", { yPercent: 80, clipPath: "inset(100% 0 0 0)" }, { yPercent: -30, clipPath: "inset(0% 0 0 0)", duration: 0.85 }, 0.18);
      tl.fromTo(".c0-a .ph-in, .c0-b .ph-in, .c0-c .ph-in", { scale: 1.35 }, { scale: 1, duration: 0.9 }, 0.02);

      // 02 — THE SIGNATURES
      tl.from(chars[1], { yPercent: 115, rotationZ: 6, stagger: 0.01, duration: 0.18, ease: "power3.out" }, 1.06);
      tl.from(".c1-copy > *:not(h2)", { y: 30, opacity: 0, stagger: 0.05, duration: 0.14, ease: "power2.out" }, 1.1);
      tl.fromTo(".c1-bg", { xPercent: 6 }, { xPercent: -10, duration: 0.9 }, 1.0);
      tl.fromTo(".ring-wrap", { opacity: 0, y: 90, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.14, ease: "power3.out" }, 1.06);
      tl.to(rotObj, { rot: -288, duration: 0.78, ease: ringEase, onUpdate: applyRing }, 1.1);

      // 03 — THE CRUNCH
      tl.from(chars[2], { yPercent: 40, opacity: 0, scale: 0.7, stagger: 0.012, duration: 0.18, ease: "back.out(1.6)" }, 2.05);
      tl.fromTo(".c2-big", { xPercent: -9 }, { xPercent: 9, duration: 0.9 }, 2.0);
      tl.fromTo(".c2-a", { clipPath: "inset(100% 0 0 0)", yPercent: 12 }, { clipPath: "inset(0% 0 0 0)", yPercent: -4, duration: 0.3, ease: "power3.out" }, 2.06);
      tl.fromTo(".c2-b", { xPercent: -140, rotation: -10 }, { xPercent: 0, rotation: -4, duration: 0.26, ease: "power3.out" }, 2.1);
      tl.fromTo(".c2-c", { xPercent: 140, rotation: 10 }, { xPercent: 0, rotation: 4, duration: 0.26, ease: "power3.out" }, 2.14);
      tl.fromTo(".c2-d", { yPercent: 160 }, { yPercent: 0, duration: 0.26, ease: "power3.out" }, 2.18);
      tl.from(".c2-copy > *", { y: 24, opacity: 0, stagger: 0.05, duration: 0.14, ease: "power2.out" }, 2.2);
      tl.to(".c2-b", { yPercent: -16, rotation: -7, duration: 0.5 }, 2.38);
      tl.to(".c2-c", { yPercent: -22, rotation: 7, duration: 0.5 }, 2.38);
      tl.to(".c2-a", { yPercent: -10, duration: 0.5 }, 2.38);
      tl.fromTo(".c2-a .ph-in", { scale: 1.25 }, { scale: 1.02, duration: 0.8 }, 2.06);

      // 04 — THE FAVOURITES
      const slats = q(".slat");
      tl.fromTo(slats, { yPercent: 105 }, { yPercent: 0, stagger: 0.05, duration: 0.22, ease: "power3.out" }, 3.03);
      tl.fromTo(".slat-img", { yPercent: -5, scale: 1.12 }, { yPercent: 5, scale: 1, duration: 0.85 }, 3.03);
      tl.from(chars[3], { yPercent: 115, rotationZ: 6, stagger: 0.01, duration: 0.18, ease: "power3.out" }, 3.2);
      tl.from(".c3-head p", { y: 20, opacity: 0, duration: 0.12 }, 3.3);
      slats.forEach((s, k) => {
        tl.to(s, { flexGrow: 2.8, duration: 0.07, ease: "power2.out" }, 3.38 + k * 0.1);
        tl.to(s, { flexGrow: 1, duration: 0.07, ease: "power2.in" }, 3.38 + k * 0.1 + 0.08);
      });

      // 05 — SOMETHING SWEET
      tl.fromTo(".c4-a", { clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0% 0 0 0)", duration: 0.3, ease: "power3.out" }, 4.05);
      tl.fromTo(".c4-a .ph-in", { scale: 1.4 }, { scale: 1.04, duration: 0.85 }, 4.05);
      tl.fromTo(".c4-ring", { scale: 0.86, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: "power2.out" }, 4.1);
      tl.fromTo(".c4-b", { yPercent: 70, opacity: 0 }, { yPercent: -25, opacity: 1, duration: 0.8 }, 4.14);
      tl.from(chars[4], { yPercent: 80, rotationZ: -8, opacity: 0, stagger: 0.015, duration: 0.2, ease: "power3.out" }, 4.1);
      tl.from(".c4-copy > *:not(h2)", { y: 26, opacity: 0, stagger: 0.06, duration: 0.14, ease: "power2.out" }, 4.2);

      // 06 — THE COMPLETE EXPERIENCE
      const xs = [-720, 360, -240, 660, -520, 440];
      const ys = [-420, 520, 640, -520, 360, -340];
      const rs = [-24, 18, -12, 22, -16, 10];
      q(".mosaic .ph").forEach((t, k) => {
        tl.fromTo(t, { x: xs[k], y: ys[k], rotation: rs[k], scale: 1.5, opacity: 0 }, { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1, duration: 0.34, ease: "power3.out" }, 5.04 + k * 0.025);
      });
      tl.from(chars[5], { yPercent: 115, rotationZ: 5, stagger: 0.008, duration: 0.18, ease: "power3.out" }, 5.28);
      tl.from(".c5-cta > *", { y: 40, opacity: 0, stagger: 0.07, duration: 0.14, ease: "power3.out" }, 5.5);
    }, el);

    return () => {
      ctx.revert();
      splits.forEach((s) => s.revert());
      cleanups.forEach((f) => f());
      trigger.current = null;
    };
  }, []);

  const jump = (chapter: number, fraction = 0.3) => {
    const t = trigger.current;
    if (!t) {
      const nodes = stage.current?.querySelectorAll(".chap");
      (nodes?.[chapter] as HTMLElement | undefined)?.scrollIntoView();
      return;
    }
    scrollTo(t.start + (t.end - t.start) * ((chapter + fraction) / N));
  };
  const jumpSignature = (i: number) => {
    const t = trigger.current;
    if (!t) return;
    const p = i >= SIGS.length - 1 ? 1 : (i + 0.12) / (SIGS.length - 1);
    scrollTo(t.start + (t.end - t.start) * ((1.1 + 0.78 * p) / N));
  };

  const s = (i: number) => i < reach;

  return (
    <section ref={root} id="story" className="story" aria-label="The Ricco's story in six chapters">
      <div ref={stage} className="story-stage" data-chapter="0">
        {/* Plates (shared background layer, crossfaded by the timeline) */}
        <div className="plate plate-0" data-plate="0" aria-hidden="true">
          <Image
            src="/images/grill-c.jpg"
            alt=""
            fill
            sizes="100vw"
            quality={70}
            style={{ objectFit: "cover" }}
          />
          <video muted playsInline preload="none" tabIndex={-1} aria-hidden="true" />
        </div>
        <div className="plate plate-1" data-plate="1" aria-hidden="true" />
        <div className="plate plate-2" data-plate="2" aria-hidden="true" />
        <div className="plate plate-3" data-plate="3" aria-hidden="true" />
        <div className="plate plate-4" data-plate="4" aria-hidden="true" />
        <div className="plate plate-5" data-plate="5" aria-hidden="true" />

        {desktop && (
          <div
            className="pointer-events-none absolute inset-0 z-[4] transition-opacity duration-700"
            style={{ opacity: active === 0 ? 1 : 0 }}
            aria-hidden="true"
          >
            <Embers active={live && active === 0} />
          </div>
        )}

        {/* 01 — THE GRILL */}
        <div className="chap" data-chap="0">
          <Ph cls="c0-a" src="/images/grill-a.jpg" alt="Kebabs and skewers sizzling over charcoal" show={s(0)} sizes="(max-width:900px) 45vw, 22vw" />
          <Ph cls="c0-b" src="/images/grill-b.jpg" alt="Marinated meat skewers on the grill" show={s(0)} sizes="(max-width:900px) 35vw, 17vw" />
          <Ph cls="c0-c" src="/images/lamb-b.jpg" alt="Close-up of grilled meat with char marks" show={s(0)} sizes="15vw" />
          <div className="c0-head">
            <p className="eyebrow chap-eyebrow mb-4">Chapter 01</p>
            <h2 data-split aria-label="Where the grill comes alive." className="split display">
              WHERE THE GRILL COMES ALIVE.
            </h2>
            <ul className="c0-list mt-6 hidden gap-1.5 text-sm font-semibold uppercase tracking-[0.2em] text-white/85 md:grid">
              <li>Flame-grilled chicken</li>
              <li>Grilled kebabs</li>
              <li>Freshly prepared meat</li>
            </ul>
          </div>
        </div>

        {/* 02 — THE SIGNATURES */}
        <div className="chap" data-chap="1">
          <div className="c1-bg display" aria-hidden="true">SIGNATURE</div>
          <div className="c1-grid">
            <div className="c1-copy relative z-10 max-w-md">
              <p className="eyebrow chap-eyebrow mb-4">Chapter 02</p>
              <h2 data-split aria-label="The Signatures" className="split display text-[clamp(3rem,7.2vw,7.6rem)]">
                THE SIGNATURES
              </h2>
              <p className="serif mt-5 text-lg italic leading-relaxed text-white/80 max-md:hidden">
                Sizzling plates, lamb chops and peri peri chicken — the dishes that put Ricco&rsquo;s on the table.
              </p>
              <p className="mt-6 text-[0.65rem] font-extrabold uppercase tracking-[0.3em] text-gold max-md:mt-3">Now showing</p>
              <p className="sig-name display mt-1 text-3xl sm:text-4xl" aria-live="polite">{SIGS[0].name}</p>
              <div className="sig-dots mt-5 flex gap-2" role="group" aria-label="Choose a signature dish">
                {SIGS.map((d, i) => (
                  <button key={d.id} type="button" aria-label={`Show ${d.name}`} aria-current={i === 0} onClick={() => jumpSignature(i)} />
                ))}
              </div>
              <div className="mt-6 max-md:hidden">
                <Btn href="#menu" variant="ghost">See the menu</Btn>
              </div>
            </div>
            <div className="ring-wrap">
              <div className="ring">
                {SIGS.map((d, i) => (
                  <div key={d.id} className="ring-card" style={{ "--i": i } as React.CSSProperties}>
                    {s(1) && (
                      <Image src={d.image} alt={d.imageAlt} fill sizes="(max-width:900px) 56vw, 24vw" quality={70} style={{ objectFit: "cover" }} />
                    )}
                    <span>{d.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 03 — THE CRUNCH */}
        <div className="chap c2" data-chap="2">
          <h2 data-split aria-label="The Crunch" className="split c2-big display">CRUNCH</h2>
          <div className="c2-copy">
            <p className="eyebrow chap-eyebrow mb-3 !text-ink">Chapter 03</p>
            <p className="display text-[clamp(2rem,3.6vw,3.4rem)]">Crispy chicken. Wings. Tenders. Loaded fries.</p>
            <p className="serif mt-3 text-base italic text-ink/80 max-md:hidden">Close-up, golden and made to be shared.</p>
          </div>
          <Ph cls="c2-a" src="/images/crunch-c.jpg" alt="Golden crispy chicken tenders with a creamy dip" show={s(2)} sizes="(max-width:900px) 62vw, 30vw" />
          <Ph cls="c2-b" src="/images/crunch-d.jpg" alt="Crispy chicken wings with onion rings" show={s(2)} sizes="(max-width:900px) 46vw, 24vw" />
          <Ph cls="c2-c" src="/images/fries-b.jpg" alt="Fries loaded with melted cheese and sauce" show={s(2)} sizes="(max-width:900px) 38vw, 20vw" />
          <Ph cls="c2-d" src="/images/crunch-a.jpg" alt="Crispy fried chicken pieces" show={s(2)} sizes="15vw" />
        </div>

        {/* 04 — THE FAVOURITES */}
        <div className="chap" data-chap="3">
          <div className="slats">
            {SLATS.map((sl) => (
              <div key={sl.label} className="slat">
                <div className="slat-img">
                  {s(3) && (
                    <Image src={sl.img} alt={sl.alt} fill sizes="(max-width:900px) 100vw, 20vw" quality={70} style={{ objectFit: "cover", objectPosition: sl.pos }} />
                  )}
                </div>
                <span className="slat-label">
                  {sl.label}
                </span>
              </div>
            ))}
          </div>
          <div className="c3-head">
            <p className="eyebrow chap-eyebrow mb-3">Chapter 04</p>
            <h2 data-split aria-label="The Favourites" className="split display">THE FAVOURITES</h2>
            <p className="serif mt-3 max-w-md text-lg italic text-white/85">Burgers, wraps, pizzas, pasta and meal deals.</p>
          </div>
        </div>

        {/* 05 — SOMETHING SWEET */}
        <div className="chap" data-chap="4">
          <div className="c4-ring" aria-hidden="true" />
          <Ph cls="c4-a" src="/images/sweet-a.jpg" alt="A layered dessert lit by warm light" show={s(4)} sizes="(max-width:900px) 52vw, 28vw" />
          <Ph cls="c4-b" src="/images/sweet-d.jpg" alt="A warm mug of hot chocolate with biscotti" show={s(4)} sizes="(max-width:900px) 28vw, 16vw" />
          <div className="c4-copy">
            <p className="eyebrow chap-eyebrow mb-3">Chapter 05</p>
            <h2 data-split aria-label="Something sweet." className="split c4-script script">Something sweet.</h2>
            <p className="serif mt-5 max-w-sm text-lg italic leading-relaxed text-white/85">
              Warm light, rich textures and a proper finish. Dessert is half of our name for a reason.
            </p>
          </div>
        </div>

        {/* 06 — THE COMPLETE EXPERIENCE */}
        <div className="chap" data-chap="5">
          <div className="c5-head">
            <p className="eyebrow mb-3">Chapter 06</p>
            <h2 data-split aria-label="The complete experience" className="split display">THE COMPLETE EXPERIENCE</h2>
            <p className="serif mx-auto mt-3 max-w-lg text-lg italic text-white/80 max-md:hidden">
              Grills. Crunch. Favourites. Sweet endings. Order the lot.
            </p>
          </div>
          <div className="mosaic">
            {MOSAIC.map((m) => (
              <Ph key={m.src} cls="" src={m.src} alt={m.alt} show={s(5)} sizes="(max-width:900px) 50vw, 25vw" />
            ))}
          </div>
          <div className="c5-cta">
            <Btn variant="gold" onClick={() => setOpen(true)}>Order online</Btn>
            <Btn href="#menu" variant="ghost">View the full menu</Btn>
          </div>
        </div>

        {/* HUD */}
        <div className="hud" aria-hidden="true">
          <span className="display text-3xl tabular-nums">0{active + 1}</span>
          <span className="text-xs font-bold tracking-[0.2em] opacity-60">/ 0{N}</span>
          <span className="ml-2 hidden text-[0.68rem] font-extrabold uppercase tracking-[0.28em] sm:inline">{CHAPTERS[active]}</span>
        </div>
        <div className="hud-dots" role="group" aria-label="Story chapters">
          {CHAPTERS.map((c, i) => (
            <button key={c} type="button" aria-label={`Go to chapter ${i + 1}: ${c}`} aria-current={i === active} onClick={() => jump(i)}>
              <i />
            </button>
          ))}
        </div>
        <div className="story-progress" aria-hidden="true"><i /></div>
      </div>
    </section>
  );
}

export function StoryTape() {
  return (
    <div className="border-y border-ink/20 bg-gold py-3 text-ink">
      <Tape items={["Grill", "Sizzlers", "Peri Peri", "Wings & Tenders", "Loaded Fries", "Desserts"]} className="text-[0.78rem] text-ink" diamond="bg-ink" />
    </div>
  );
}
