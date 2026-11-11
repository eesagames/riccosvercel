import { NAV, SITE } from "@/data/site";
import { Logo } from "@/components/ui/Logo";

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-ink pb-8 pt-20">
      <div className="script pointer-events-none absolute inset-x-0 -bottom-10 select-none text-center text-[clamp(8rem,34vw,34rem)] leading-none text-gold/[0.06]" aria-hidden="true">
        Ricco&rsquo;s
      </div>
      <div className="relative mx-auto grid max-w-[1600px] gap-12 px-5 sm:px-8 md:grid-cols-[1.2fr_1fr_1fr_1fr] lg:px-12">
        <div>
          <Logo className="origin-left scale-125" />
          <p className="serif mt-8 max-w-xs text-lg italic text-white/70">Made for the moments that matter.</p>
        </div>
        <nav aria-label="Footer">
          <p className="eyebrow mb-4">Explore</p>
          <ul className="space-y-2.5 text-sm font-semibold text-white/75">
            {NAV.map((n) => (
              <li key={n.id}>
                <a href={`#${n.id}`} className="hover:text-gold">{n.label}</a>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <p className="eyebrow mb-4">Opening</p>
          <p className="text-sm font-semibold text-white/75">{SITE.hours.days}</p>
          <p className="text-sm font-semibold text-white/75">{SITE.hours.opens} – {SITE.hours.closes}</p>
          <p className="mt-2 text-sm font-semibold text-gold">{SITE.delivery}</p>
        </div>
        <div>
          <p className="eyebrow mb-4">Contact</p>
          <a href={SITE.phoneHref} className="display text-3xl hover:text-gold">{SITE.phoneDisplay}</a>
          <p className="mt-2 text-sm text-white/65">{SITE.url.replace("https://", "")}</p>
        </div>
      </div>
      <div className="relative mx-auto mt-16 flex max-w-[1600px] flex-col gap-2 border-t border-white/10 px-5 pt-6 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-white/45 sm:flex-row sm:justify-between sm:px-8 lg:px-12">
        <span>© {new Date().getFullYear()} {SITE.fullName}</span>
        <span>Freshly prepared · Open seven days</span>
      </div>
    </footer>
  );
}
