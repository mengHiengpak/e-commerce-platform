"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, X } from "lucide-react";

import type { Language, SiteInfo } from "@/lib/types";
import { ACCOUNT_NAV, PRIMARY_NAV, isNavLinkActive } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { LanguageMenu } from "./language-menu";

/**
 * The whole site navigation for phones and small tablets (`< md`).
 *
 * From `md` up the header renders inline links instead, so this component is
 * the only navigation rendered on mobile and the two never both appear.
 *
 * The panel stays mounted and is toggled with `data-[closed]`, which lets a
 * plain CSS transition animate both opening and closing. While closed it is
 * `inert`, so its links cannot be reached by keyboard or screen reader.
 *
 * The links themselves are imported from `lib/navigation`. They are a static
 * module, so this client component needs no database access and no props for
 * them.
 */
export function MobileNav({
  site,
  languages,
}: {
  site: SiteInfo;
  languages: Language[];
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;

    const { body } = document;
    const previousOverflow = body.style.overflow;
    body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
        return;
      }

      if (event.key !== "Tab" || !panelRef.current) return;

      // Minimal focus trap: cycle within the panel while it is open.
      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, close]);

  // Return focus to the hamburger once the drawer has finished sliding out.
  useEffect(() => {
    if (!open) triggerRef.current?.focus();
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        aria-label="Open menu"
        className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg border border-border transition-colors hover:bg-muted"
      >
        <Menu className="size-5" aria-hidden="true" />
      </button>

      <div
        data-closed={open ? undefined : ""}
        className="fixed inset-0 z-50 transition-opacity duration-300 ease-out data-[closed]:pointer-events-none data-[closed]:opacity-0"
      >
        <button
          type="button"
          tabIndex={-1}
          onClick={close}
          aria-label="Close menu"
          className="absolute inset-0 h-full w-full cursor-default bg-black/50 backdrop-blur-sm"
        />

        <div
          id="mobile-nav-panel"
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          inert={!open}
          data-closed={open ? undefined : ""}
          className="absolute inset-y-0 start-0 flex w-[min(20rem,88vw)] flex-col overflow-y-auto overscroll-contain border-e border-border bg-background shadow-2xl transition-transform duration-300 ease-out data-[closed]:-translate-x-full"
        >
          <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-4">
            <Link
              href="/"
              onClick={close}
              className="text-lg font-bold tracking-tight transition-colors hover:text-red-600"
            >
              {site.name}
            </Link>
            <button
              ref={closeRef}
              type="button"
              onClick={close}
              aria-label="Close menu"
              className="inline-flex size-10 items-center justify-center rounded-lg border border-border transition-colors hover:bg-muted"
            >
              <X className="size-5" aria-hidden="true" />
            </button>
          </div>

          <form action="/shop" role="search" className="border-b border-border p-4">
            <label htmlFor="mobile-search" className="sr-only">
              Search products
            </label>
            <div className="relative">
              <Search
                className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <input
                id="mobile-search"
                name="q"
                type="search"
                placeholder="Search products…"
                className="h-11 w-full rounded-lg border border-input bg-background ps-9 pe-3 text-sm outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
          </form>

          <nav aria-label="Main" className="flex flex-col p-2">
            {PRIMARY_NAV.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={close}
                aria-current={isNavLinkActive(pathname, link.href) ? "page" : undefined}
                className={cn(
                  "rounded-lg px-3 py-3 text-base font-medium transition-colors hover:bg-muted",
                  isNavLinkActive(pathname, link.href) && "bg-muted",
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="mt-auto flex flex-col gap-4 border-t border-border p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Call us</span>
                <a
                  href={`tel:${site.phoneHref}`}
                  className="text-sm font-medium tabular-nums"
                >
                  {site.phone}
                </a>
              </div>
              <LanguageMenu languages={languages} />
            </div>

            <div className="grid grid-cols-2 gap-2">
              {ACCOUNT_NAV.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={close}
                  className="inline-flex h-11 items-center justify-center rounded-lg border border-border px-4 text-sm font-medium transition-colors hover:bg-muted"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
