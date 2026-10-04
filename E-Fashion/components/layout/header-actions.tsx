"use client";

import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";

import { formatPrice, useCart } from "@/lib/cart-store";
import type { SiteInfo } from "@/lib/types";

/**
 * Wishlist and cart controls.
 *
 * These were `<div>`s with icons in them, so they were not focusable, not
 * announced, and did nothing when tapped. They are now links/buttons with
 * accessible names, and the count/total come from the cart instead of being
 * hardcoded to `90.00$`.
 */
export function HeaderActions() {
  const { itemCount, total } = useCart();

  return (
    <div className="flex items-center gap-1 sm:gap-2">
      <Link
        href="/shop?filter=Accessories"
        aria-label="View wishlist"
        className="inline-flex size-10 items-center justify-center rounded-lg transition-colors hover:bg-muted"
      >
        <Heart className="size-5" aria-hidden="true" />
      </Link>

      <Link
        href="/shop"
        aria-label={`Cart, ${itemCount} ${itemCount === 1 ? "item" : "items"}`}
        className="relative inline-flex size-10 items-center justify-center rounded-lg transition-colors hover:bg-muted"
      >
        <ShoppingBag className="size-5" aria-hidden="true" />
        {itemCount > 0 ? (
          <span className="absolute end-0.5 top-0.5 flex size-4 items-center justify-center rounded-full bg-black text-[10px] font-semibold text-white tabular-nums dark:bg-white dark:text-black">
            {itemCount > 9 ? "9+" : itemCount}
          </span>
        ) : null}
      </Link>

      <div className="hidden flex-col text-end text-xs leading-tight lg:flex">
        <span className="text-muted-foreground">Total</span>
        <span className="font-semibold tabular-nums">{formatPrice(total)}</span>
      </div>
    </div>
  );
}

/** Phone block, shown from `lg` up where there is room for it. */
export function PhoneBlock({ site }: { site: SiteInfo }) {
  return (
    <a
      href={`tel:${site.phoneHref}`}
      className="hidden items-center gap-2 text-sm transition-colors hover:text-red-600 lg:flex"
    >
      <span className="flex size-9 items-center justify-center rounded-full bg-muted">
        <svg viewBox="0 0 24 24" fill="currentColor" className="size-4" aria-hidden="true">
          <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.85 21 3 13.15 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1.02l-2.2 2.2Z" />
        </svg>
      </span>
      <span className="flex flex-col">
        <span className="text-muted-foreground">Call us now</span>
        <span className="font-medium tabular-nums">{site.phone}</span>
      </span>
    </a>
  );
}
