"use client";

import { useRef } from "react";
import Image from "next/image";
import { OFFERS, OFFER_COUNTS, formatPrice } from "@/data/menu";
import { SITE } from "@/data/site";
import { SplitHeading } from "@/components/ui/SplitHeading";
import { Btn } from "@/components/ui/Btn";
import { Tape } from "@/components/ui/Tape";
import { useReveal } from "@/lib/useReveal";
import { useOrder } from "@/components/order/OrderProvider";
import { useSmooth } from "@/components/SmoothScroll";

export function Offers() {
  const root = useRef<HTMLElement>(null);
  useReveal(root);
  const { scrollTo } = useSmooth();
  const { add } = useOrder();

  const openCategory = (id: string) => {
    window.dispatchEvent(new CustomEvent("riccos:category", { detail: id }));
    scrollTo("#menu");
  };

  return (
    <section ref={root} id="offers" className="relative overflow-hidden bg-gold text-ink" aria-labelledby="offers-title">
      <div className="bg-ink py-3">
        <Tape items={["Ricco's Value Box", "Meal Deals", "Eight of each"]} className="text-[0.72rem] text-gold" diamond="bg-pink" reverse />
      </div>

      <div className="mx-auto max-w-[1600px] px-5 pb-24 pt-20 sm:px-8 sm:pt-28 lg:px-12">
        <p className="eyebrow chap-eyebrow !text-ink mb-4">Offers</p>
        <h2 id="offers-title" className="sr-only-live">Value boxes and meal deals</h2>
        <SplitHeading text="MORE ON THE TABLE." as="div" className="display text-[clamp(3.2rem,10.5vw,11rem)]" />

        {/* Value boxes — image-led, left */}
        <div className="mt-16 grid items-center gap-8 lg:mt-24 lg:grid-cols-12 lg:gap-12">
          <div className="relative lg:col-span-7">
            <div className="clip relative aspect-[4/3] bg-ink shadow-[0_40px_80px_-30px_rgba(23,21,21,.6)]">
              <div className="clip-in absolute inset-0">
                <Image src="/images/fav-a.jpg" alt="A table spread of grilled dishes, pizza and wraps seen from above" fill sizes="(max-width:1024px) 100vw, 56vw" quality={75} style={{ objectFit: "cover" }} />
              </div>
            </div>
            <span
              data-count={OFFER_COUNTS.valueBoxes}
              data-pad="true"
              className="display outline-text pointer-events-none absolute -bottom-10 -right-2 text-[clamp(8rem,22vw,22rem)] leading-none text-ink/0 sm:-right-8 lg:-right-16"
              style={{ WebkitTextStroke: "2px #171515" }}
              aria-hidden="true"
            >
              {String(OFFER_COUNTS.valueBoxes).padStart(2, "0")}
            </span>
          </div>
          <div className="rv lg:col-span-5">
            <p className="script text-5xl text-pink sm:text-6xl">Ricco&rsquo;s</p>
            <h3 className="display -mt-1 text-[clamp(3rem,6.4vw,6.4rem)]">Value Box</h3>
            <p className="serif mt-5 max-w-md text-xl italic leading-relaxed text-ink/80">
              {OFFER_COUNTS.valueBoxes} Value Boxes, each with its own line-up. Browse them in the menu, or call the team for today&rsquo;s details.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Btn variant="dark" onClick={() => openCategory("value-box")}>See the value boxes</Btn>
            </div>
          </div>
        </div>

        {/* Meal deals — type-led, right */}
        <div className="mt-24 grid items-center gap-8 lg:mt-36 lg:grid-cols-12 lg:gap-12">
          <div className="rv order-2 lg:order-1 lg:col-span-5">
            <h3 className="display text-[clamp(3rem,6.4vw,6.4rem)]">Meal <span className="text-pink">Deals</span></h3>
            <p className="serif mt-5 max-w-md text-xl italic leading-relaxed text-ink/80">
              {OFFER_COUNTS.mealDeals} Meal Deals built around the favourites. Pick one, add it to your order, and we&rsquo;ll confirm every detail when you order.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Btn variant="dark" onClick={() => openCategory("meal-deals")}>See the meal deals</Btn>
              <Btn href={SITE.phoneHref} variant="ghost" className="!text-ink !shadow-[inset_0_0_0_1.5px_#171515]">
                Call {SITE.phoneDisplay}
              </Btn>
            </div>
          </div>
          <div className="relative order-1 lg:order-2 lg:col-span-7">
            <div className="clip relative ml-auto aspect-[5/4] w-[88%] bg-ink shadow-[0_40px_80px_-30px_rgba(23,21,21,.6)]">
              <div className="clip-in absolute inset-0">
                <Image src="/images/fav-b.jpg" alt="A wooden tray of shared dishes, sides and dips" fill sizes="(max-width:1024px) 90vw, 50vw" quality={75} style={{ objectFit: "cover" }} />
              </div>
            </div>
            <div className="clip absolute -bottom-8 left-0 aspect-[3/4] w-[34%] bg-ink shadow-[0_30px_60px_-20px_rgba(23,21,21,.7)]" data-par="6">
              <div className="clip-in absolute inset-0">
                <Image src="/images/crunch-e.jpg" alt="Chicken wings with chips on a wooden board" fill sizes="20vw" quality={70} style={{ objectFit: "cover" }} />
              </div>
            </div>
            <span
              data-count={OFFER_COUNTS.mealDeals}
              data-pad="true"
              className="display pointer-events-none absolute -top-12 left-2 text-[clamp(7rem,18vw,18rem)] leading-none text-transparent lg:-left-6"
              style={{ WebkitTextStroke: "2px #171515" }}
              aria-hidden="true"
            >
              {String(OFFER_COUNTS.mealDeals).padStart(2, "0")}
            </span>
          </div>
        </div>

        {/* Data-driven offer grid: renders as soon as OFFERS is populated in src/data/menu.ts */}
        {OFFERS.length > 0 && (
          <ul className="mt-24 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {OFFERS.map((o, i) => {
              const feature = i % 5 === 0;
              return (
                <li key={o.id} className={`offer-card bg-ink text-white ${feature ? "lg:col-span-2 lg:row-span-2" : ""}`}>
                  <div className={`relative ${feature ? "aspect-[4/3]" : "aspect-square"}`}>
                    <Image src={o.image} alt={o.imageAlt} fill sizes="(max-width:1024px) 100vw, 30vw" quality={70} style={{ objectFit: "cover" }} />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent" />
                  </div>
                  <div className="p-5">
                    <p className="eyebrow !text-pink">{o.kind === "value-box" ? "Value Box" : "Meal Deal"}</p>
                    <p className="display mt-1 text-3xl">{o.name}</p>
                    <p className="mt-2 text-sm text-white/70">{o.includes.join(" · ")}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="display text-3xl text-gold">{formatPrice(o.price)}</span>
                      <button type="button" className="bg-gold px-4 py-3 text-[0.68rem] font-extrabold uppercase tracking-[0.16em] text-ink hover:bg-white" onClick={() => add(o.id, 1)}>
                        Add
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
