import type { Product } from "@/lib/types";

/**
 * Money formatting and price derivation.
 *
 * These used to live at the bottom of `lib/cart-store.ts`, which is a client
 * island. That made them unreachable from a Server Component: importing
 * `formatPrice` from a `"use client"` module into the product page yields a
 * client *reference*, not a function, so the one number that matters most would
 * have had to wait for hydration to appear.
 *
 * Everything here is pure, so both sides can import it and the price is in the
 * server HTML.
 */

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function formatPrice(value: number): string {
  return currency.format(value);
}

/**
 * The amount actually charged for a product.
 *
 * `price` is the listed price and `discount` a percentage off it, so the two are
 * shown together — the original struck through, this as the real figure. Rounded
 * once at the end rather than per line item, so 15% off $54.00 renders as $45.90
 * and not $45.899999.
 */
export function salePrice(product: Pick<Product, "price" | "discount">): number {
  if (product.discount <= 0) return product.price;

  return Math.round(product.price * (1 - product.discount / 100) * 100) / 100;
}
