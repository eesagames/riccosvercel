/**
 * Ricco's wordmark.
 * The supplied logo files were not available in the build environment, so this
 * is a typographic recreation (script wordmark + pink swash + small caps
 * descriptor). To use the official artwork, drop the files in /public/brand
 * and swap the contents of this component for <Image> tags:
 *   - "light" variant → logo for dark backgrounds
 *   - "dark" variant  → logo for gold / light backgrounds
 */
export function Logo({
  variant = "light",
  className = "",
  compact = false,
}: {
  variant?: "light" | "dark";
  className?: string;
  compact?: boolean;
}) {
  const main = variant === "light" ? "text-gold" : "text-ink";
  const sub = variant === "light" ? "text-white/85" : "text-ink/80";
  return (
    <span
      className={`relative inline-flex flex-col items-center leading-none ${className}`}
      aria-label="Ricco's Grill and Dessert"
    >
      <span
        className={`script ${main} text-[2.6rem] leading-[0.9] tracking-wide`}
        aria-hidden="true"
      >
        Ricco&rsquo;s
      </span>
      <svg
        viewBox="0 0 120 10"
        className="-mt-0.5 h-[0.45rem] w-[88%]"
        aria-hidden="true"
        fill="none"
      >
        <path
          d="M2 6 C 25 1, 60 9, 118 3"
          stroke="#ED168A"
          strokeWidth="2.6"
          strokeLinecap="round"
        />
      </svg>
      {!compact && (
        <span
          className={`${sub} mt-1 text-[0.5rem] font-extrabold uppercase tracking-[0.36em]`}
          aria-hidden="true"
        >
          Grill &amp; Dessert
        </span>
      )}
    </span>
  );
}
