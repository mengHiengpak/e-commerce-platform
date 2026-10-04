import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { getSiteChrome } from "@/lib/controller/site.controller";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

/**
 * Site metadata.
 *
 * `generateMetadata` rather than a static `metadata` export because the store
 * name and description now live in MongoDB. Reading them here costs one query
 * that `getSiteChrome()` would make anyway on the same request.
 */
export async function generateMetadata(): Promise<Metadata> {
  const { site } = await getSiteChrome();

  return {
    title: {
      default: `${site.name} — ${site.tagline}`,
      template: `%s | ${site.name}`,
    },
    description: site.description,
    keywords: ["fashion", "clothing", "ecommerce", "accessories", "deals"],
    openGraph: {
      type: "website",
      siteName: site.name,
      title: `${site.name} — ${site.tagline}`,
      description: site.description,
    },
    twitter: {
      card: "summary_large_image",
      title: `${site.name} — ${site.tagline}`,
      description: site.description,
    },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // Not capping `maximumScale` keeps browser pinch-zoom working, which is an
  // accessibility requirement.
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#171717" },
  ],
};

/**
 * Root layout.
 *
 * Async because the header and footer chrome used to be hardcoded in
 * `lib/data.ts` and now comes from MongoDB. `getSiteChrome()` fires its reads
 * concurrently and returns safe fallbacks, so a missing settings document
 * degrades the page instead of erroring every route.
 *
 * The chrome is fetched here once and passed down as props: the header, footer
 * and mobile drawer are separate components but share one database read, and a
 * Server Component passing props is what keeps Mongo out of the client bundle.
 * Navigation is not among them — it is imported from `lib/navigation`.
 */
export default async function RootLayout({ children }: LayoutProps<"/">) {
  const chrome = await getSiteChrome();

  return (
    // `data-scroll-behavior` tells Next to keep its instant scroll-to-top on
    // route changes, even though `globals.css` opts into smooth scrolling.
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-neutral-900 focus:px-4 focus:py-2 focus:text-sm focus:text-white"
        >
          Skip to content
        </a>
        <SiteHeader site={chrome.site} languages={chrome.languages} />
        {/* `flex-1` pushes the footer to the bottom of the viewport on short
            pages, which was missing before. */}
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter
          site={chrome.site}
          footerColumns={chrome.footerColumns}
          socials={chrome.socials}
          paymentMethods={chrome.paymentMethods}
        />
      </body>
    </html>
  );
}
