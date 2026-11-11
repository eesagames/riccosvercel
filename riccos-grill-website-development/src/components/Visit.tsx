"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { SITE } from "@/data/site";
import { SplitHeading } from "@/components/ui/SplitHeading";
import { Btn } from "@/components/ui/Btn";
import { useReveal } from "@/lib/useReveal";
import { useOrder } from "@/components/order/OrderProvider";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

function londonNow() {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/London",
    weekday: "long",
    hour: "numeric",
    hour12: false,
  }).formatToParts(new Date());
  const day = parts.find((p) => p.type === "weekday")?.value ?? "";
  const hour = Number(parts.find((p) => p.type === "hour")?.value ?? 0) % 24;
  return { day, open: hour >= 14 && hour < 22 };
}

export function Visit() {
  const root = useRef<HTMLElement>(null);
  useReveal(root);
  const { setOpen } = useOrder();
  const [now, setNow] = useState<{ day: string; open: boolean } | null>(null);

  useEffect(() => {
    setNow(londonNow());
    const t = window.setInterval(() => setNow(londonNow()), 60_000);
    return () => window.clearInterval(t);
  }, []);

  return (
    <section ref={root} id="visit" className="relative overflow-hidden bg-coal py-24 sm:py-32" aria-labelledby="visit-title">
      <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12">
        <p className="eyebrow chap-eyebrow mb-4">Visit &amp; order</p>
        <h2 id="visit-title" className="sr-only-live">Opening hours and contact</h2>
        <SplitHeading text="COME HUNGRY." as="div" className="display text-[clamp(3.4rem,11vw,11.5rem)]" />

        <div className="mt-14 grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5">
            <div className="rv flex items-center gap-3">
              <span className={`h-2.5 w-2.5 rounded-full ${now ? (now.open ? "bg-emerald-400" : "bg-pink") : "bg-white/30"}`} />
              <span className="text-xs font-extrabold uppercase tracking-[0.24em] text-white/80" aria-live="polite">
                {now ? (now.open ? "Open now · until 10 PM" : "Closed now · opens at 2 PM") : "Open seven days"}
              </span>
            </div>
            <ul className="rv mt-6 border-t border-white/15" aria-label="Opening hours">
              {DAYS.map((d) => {
                const today = now?.day === d;
                return (
                  <li
                    key={d}
                    className={`flex items-center justify-between border-b border-white/10 py-3.5 transition-colors ${today ? "text-gold" : "text-white/80"}`}
                    aria-current={today ? "date" : undefined}
                  >
                    <span className="display text-2xl sm:text-3xl">{d}</span>
                    <span className="text-sm font-bold tracking-[0.12em]">
                      {SITE.hours.opens} – {SITE.hours.closes}
                    </span>
                  </li>
                );
              })}
            </ul>
            <p className="rv mt-5 text-sm font-semibold uppercase tracking-[0.2em] text-gold">{SITE.delivery}</p>
          </div>

          <div className="lg:col-span-7">
            <div className="grid gap-4 sm:grid-cols-2">
              <a href={SITE.phoneHref} className="rv group relative block overflow-hidden bg-gold p-7 text-ink sm:p-9">
                <p className="eyebrow !text-ink">Call us</p>
                <p className="display mt-3 text-[clamp(2.4rem,4.2vw,4rem)] transition-transform duration-500 group-hover:translate-x-2">
                  {SITE.phoneDisplay}
                </p>
                <p className="mt-3 text-xs font-extrabold uppercase tracking-[0.2em]">Tap to call →</p>
              </a>
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="rv group relative block overflow-hidden bg-pink p-7 text-left text-white sm:p-9"
              >
                <p className="eyebrow !text-white">Order online</p>
                <p className="display mt-3 text-[clamp(2.4rem,4.2vw,4rem)] transition-transform duration-500 group-hover:translate-x-2">
                  Build your order
                </p>
                <p className="mt-3 text-xs font-extrabold uppercase tracking-[0.2em]">Open basket →</p>
              </button>
            </div>

            <div className="rv mt-4 grid overflow-hidden bg-ink sm:grid-cols-[1.1fr_1fr]">
              <div className="relative min-h-[16rem]">
                <Image src="/images/hero.jpg" alt="Kebabs cooking over glowing coals" fill sizes="(max-width:1024px) 100vw, 30vw" quality={70} style={{ objectFit: "cover" }} />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-ink/60" />
              </div>
              <div className="p-7 sm:p-9">
                <p className="eyebrow">Find us</p>
                <p className="display mt-3 text-3xl">Address &amp; map</p>
                <p className="serif mt-3 text-lg italic leading-relaxed text-white/75">
                  We&rsquo;re confirming our verified address before publishing a map. Until then, call the team on{" "}
                  <a href={SITE.phoneHref} className="text-gold underline underline-offset-4">{SITE.phoneDisplay}</a>{" "}
                  and we&rsquo;ll point you the right way.
                </p>
                <p className="mt-4 text-xs font-semibold tracking-wide text-white/55">
                  Web: <a href={SITE.url} className="underline underline-offset-4 hover:text-gold">www.riccosgrill.co.uk</a>
                </p>
              </div>
            </div>

            <div className="rv mt-6 flex flex-wrap gap-3">
              <Btn href={SITE.phoneHref} variant="gold">Call now</Btn>
              <Btn href="#menu" variant="ghost">Explore the menu</Btn>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
