import Link from "next/link";
import { Search } from "lucide-react";

import { Container } from "@/components/ui/container";
import { ACCOUNT_NAV, PRIMARY_NAV } from "@/lib/navigation";
import type { Language, SiteInfo } from "@/lib/types";
import { HeaderActions, PhoneBlock } from "./header-actions";
import { LanguageMenu } from "./language-menu";
import { MobileNav } from "./mobile-nav";

/**
 * Site header, rendered once in the root layout.
 *
 * Two navigation presentations, and only one of them is ever visible:
 * - `< md`  : hamburger + slide-in drawer (`MobileNav`)
 * - `>= md` : inline links, with the secondary row collapsing away as width grows
 *
 * Server Component. The links are imported from `lib/navigation` rather than
 * passed as props, since they are a static module rather than a database read.
 */
export function SiteHeader({
  site,
  languages,
}: {
  site: SiteInfo;
  languages: Language[];
}) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <Container>
        <div className="flex h-16 items-center gap-3 md:h-20 md:gap-6">
          <MobileNav site={site} languages={languages} />

          <Link
            href="/"
            className="text-lg font-bold tracking-tight whitespace-nowrap transition-colors hover:text-red-600 md:text-xl"
          >
            E-Fahion
          </Link>

          <nav
            aria-label="Main"
            className="hidden items-center gap-1 md:flex md:gap-2 lg:gap-4"
          >
            {PRIMARY_NAV.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-md px-2.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground lg:text-base"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <form
            action="/shop"
            role="search"
            className="ms-auto hidden min-w-0 flex-1 sm:block sm:max-w-xs md:max-w-sm"
          >
            <label htmlFor="site-search" className="sr-only">
              Search products
            </label>
            <div className="relative">
              <Search
                className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <input
                id="site-search"
                name="q"
                type="search"
                placeholder="Search products…"
                className="h-10 w-full rounded-lg border border-input bg-background ps-9 pe-3 text-sm outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
          </form>

          <div className="ms-auto flex items-center gap-2 sm:ms-0 md:ms-auto md:gap-3">
            <div className="lg:me-2">
              <PhoneBlock site={site} />
            </div>

            <div className="hidden lg:block">
              <LanguageMenu languages={languages} />
            </div>

            <HeaderActions />
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-border py-2 text-xs md:hidden">
          <Link
            href="/shop"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Free delivery over $300
          </Link>
          <Link
              href={ACCOUNT_NAV[0].href}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              {ACCOUNT_NAV[0].label}
            </Link>
        </div>
      </Container>
    </header>
  );
}
