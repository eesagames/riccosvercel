/** Infinite ticker. Content is duplicated for a seamless loop; the copy is aria-hidden. */
export function Tape({
  items,
  className = "text-[0.7rem] text-white/80",
  reverse = false,
  diamond = "bg-pink",
}: {
  items: string[];
  className?: string;
  reverse?: boolean;
  diamond?: string;
}) {
  const row = (hidden: boolean) => (
    <div className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {Array.from({ length: 3 }).flatMap((_, k) =>
        items.map((t, i) => (
          <span
            key={`${k}-${i}`}
            className="flex items-center font-extrabold uppercase tracking-[0.28em]"
          >
            <span className="px-7">{t}</span>
            <span className={`h-1.5 w-1.5 rotate-45 ${diamond}`} />
          </span>
        )),
      )}
    </div>
  );
  return (
    <div className={`tape ${reverse ? "tape--rev" : ""} ${className}`}>
      <div className="tape__track">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
