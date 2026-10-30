import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Inter, JetBrains_Mono } from "next/font/google";
import { site } from "@/lib/site";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { PageGround } from "@/components/motion/PageGround";
import { Cursor } from "@/components/motion/Cursor";
import { ScrollProgress } from "@/components/motion/ScrollProgress";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import "./globals.css";

const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Full-stack & interface design`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  keywords: [
    "Saatvik Raghuvanshi",
    "portfolio",
    "full-stack developer",
    "frontend engineer",
    "geospatial",
    "React",
    "Next.js",
    "Manipal University Jaipur",
  ],
  authors: [{ name: site.name, url: site.github }],
  creator: site.name,
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: site.url,
    siteName: site.name,
    title: `${site.name} — Full-stack & interface design`,
    description: site.description,
    images: [{ url: "/og.png", width: 1200, height: 630, alt: site.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — Full-stack & interface design`,
    description: site.description,
    images: ["/og.png"],
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#101114",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${serif.variable} ${inter.variable} ${mono.variable}`}
      // the pre-paint script sets data-intro on this element before hydration
      suppressHydrationWarning
    >
      <body>
        {/* Runs before the first paint: a repeat visit in this session, or a
            reduced-motion preference, hides the opening panel immediately so
            it never flashes over the page it is about to reveal. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(sessionStorage.getItem('sr-intro')==='1'||window.matchMedia('(prefers-reduced-motion: reduce)').matches){document.documentElement.dataset.intro='seen'}}catch(e){}`,
          }}
        />
        {/* without scripting the opening panel can never close, so it is not
            shown at all */}
        <noscript>
          <style>{`.loader{display:none}`}</style>
        </noscript>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <PageGround />
        <ScrollProgress />
        <div className="grain" aria-hidden="true" />
        <div className="columns" aria-hidden="true">
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i} />
          ))}
        </div>
        <Cursor />
        <SmoothScroll />
        <Nav />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
