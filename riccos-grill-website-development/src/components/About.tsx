"use client";

import { useRef } from "react";
import Image from "next/image";
import { SplitHeading } from "@/components/ui/SplitHeading";
import { useReveal } from "@/lib/useReveal";
import { CATEGORIES } from "@/data/menu";

export function About() {
  const root = useRef<HTMLElement>(null);
  useReveal(root);

  return (
    <section ref={root} id="about" className="relative overflow-hidden bg-ink py-24 sm:py-36" aria-labelledby="about-title">
      <div className="script pointer-events-none absolute -left-8 top-10 text-[clamp(10rem,30vw,32rem)] leading-none text-white/[0.03]" aria-hidden="true">
        Ricco&rsquo;s
      </div>
      <div className="mx-auto grid max-w-[1600px] gap-14 px-5 sm:px-8 lg:grid-cols-12 lg:gap-8 lg:px-12">
        <div className="relative min-h-[26rem] sm:min-h-[40rem] lg:col-span-5">
          <div className="clip absolute left-0 top-0 h-[78%] w-[72%] bg-coal" data-par="4">
            <div className="clip-in absolute inset-0">
              <Image src="/images/grill-a.jpg" alt="Skewers cooking over hot charcoal with rising smoke" fill sizes="(max-width:1024px) 70vw, 28vw" quality={75} style={{ objectFit: "cover" }} />
            </div>
          </div>
          <div className="clip absolute bottom-0 right-0 h-[52%] w-[56%] border-[6px] border-ink bg-coal sm:border-[10px]" data-par="8">
            <div className="clip-in absolute inset-0">
              <Image src="/images/sweet-b.jpg" alt="A chocolate dessert in a box on a patterned table" fill sizes="(max-width:1024px) 55vw, 24vw" quality={75} style={{ objectFit: "cover" }} />
            </div>
          </div>
          <div className="rv absolute right-[4%] top-[6%] grid h-24 w-24 -rotate-12 place-items-center rounded-full bg-pink text-center text-[0.58rem] font-extrabold uppercase leading-tight tracking-[0.18em] sm:h-32 sm:w-32 sm:text-[0.66rem]">
            Grill
            <br />
            &amp;
            <br />
            Dessert
          </div>
        </div>

        <div className="lg:col-span-7 lg:pl-16 lg:pt-10">
          <p className="eyebrow chap-eyebrow mb-4">About Ricco&rsquo;s</p>
          <h2 id="about-title" className="sr-only-live">About Ricco&rsquo;s Grill &amp; Dessert</h2>
          <SplitHeading text="FIRE FIRST. SWEET LAST." as="div" className="display text-[clamp(3rem,8vw,8.6rem)]" />
          <div className="serif mt-8 max-w-2xl space-y-5 text-xl leading-relaxed text-white/80 sm:text-2xl">
            <p className="rv">
              Ricco&rsquo;s is a grill and dessert house built around food that makes the moment better — whether that moment is a quick weeknight order or a table full of friends.
            </p>
            <p className="rv text-white/65">
              The menu runs from sizzlers and peri peri chicken to crispy wings, tenders, loaded fries, wraps, pasta and jacket potatoes — then closes with something sweet.
            </p>
            <p className="rv text-white/65">
              Every plate is freshly prepared, every order matters, and the team is open seven days a week to serve you.
            </p>
          </div>

          <dl className="mt-14 grid max-w-2xl grid-cols-2 gap-y-8 border-t border-white/15 pt-8 sm:grid-cols-4">
            {[
              { n: 7, l: "Days a week", pad: false },
              { n: CATEGORIES.length, l: "Menu categories", pad: false },
              { n: 8, l: "Value Boxes", pad: true },
              { n: 8, l: "Meal Deals", pad: true },
            ].map((s) => (
              <div key={s.l} className="rv">
                <dd className="display text-5xl text-gold sm:text-6xl" data-count={s.n} data-pad={s.pad}>
                  {s.pad ? String(s.n).padStart(2, "0") : s.n}
                </dd>
                <dt className="mt-1 text-[0.62rem] font-extrabold uppercase tracking-[0.22em] text-white/60">{s.l}</dt>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
