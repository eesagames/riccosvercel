import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "@fontsource/anton/latin-400.css";
import "@fontsource/playfair-display/latin-400.css";
import "@fontsource/playfair-display/latin-400-italic.css";
import "@fontsource/playfair-display/latin-600.css";
import "@fontsource/manrope/latin-400.css";
import "@fontsource/manrope/latin-600.css";
import "@fontsource/manrope/latin-800.css";
import "@fontsource/yellowtail/latin-400.css";
import "./globals.css";
import "./cinema.css";
import { SITE } from "@/data/site";

export const viewport: Viewport = {
  themeColor: "#171515",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "Ricco's Grill & Dessert | Grills, Sizzlers, Peri Peri & Desserts",
    template: "%s | Ricco's Grill & Dessert",
  },
  description: SITE.description,
  alternates: { canonical: "/" },
  keywords: [
    "Ricco's Grill & Dessert",
    "Ricco's Grill",
    "sizzler kebab",
    "peri peri chicken",
    "loaded fries",
    "grill and dessert takeaway",
    "delivery",
  ],
  openGraph: {
    type: "website",
    url: SITE.url,
    siteName: SITE.fullName,
    title: "Ricco's Grill & Dessert — Made for the moments that matter",
    description: SITE.description,
    locale: "en_GB",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ricco's Grill & Dessert",
    description: SITE.description,
  },
  robots: { index: true, follow: true },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  name: SITE.fullName,
  url: SITE.url,
  telephone: "+44 115 937 1177",
  image: `${SITE.url}/opengraph-image.jpg`,
  description: SITE.description,
  openingHoursSpecification: [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ].map((d) => ({
    "@type": "OpeningHoursSpecification",
    dayOfWeek: d,
    opens: "14:00",
    closes: "22:00",
  })),
  hasDeliveryMethod: "http://purl.org/goodrelations/v1#DeliveryModeOwnFleet",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en-GB" suppressHydrationWarning>
      <body>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "document.documentElement.classList.add('js');if(matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('reduced');",
          }}
        />
        <a
          href="#main"
          className="fixed left-3 top-3 z-[300] -translate-y-24 bg-gold px-4 py-3 text-xs font-extrabold uppercase tracking-widest text-ink focus:translate-y-0"
        >
          Skip to content
        </a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
