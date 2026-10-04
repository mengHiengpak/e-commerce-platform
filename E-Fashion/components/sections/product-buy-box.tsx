"use client";

import { useState } from "react";
import { Heart, Minus, Plus, ShoppingBag } from "lucide-react";

import { useCart } from "@/lib/cart-store";
import { formatPrice, salePrice } from "@/lib/format";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";

/** At or below this many units the stock line becomes a warning rather than a fact. */
const LOW_STOCK = 5;

/**
 * The interactive half of the product page: quantity, add to cart, wishlist.
 *
 * A client island on purpose. Everything around it — the image, the price, the
 * description — is static and stays in the server HTML, so only this box needs
 * hydration and `next/image` never ships inside the JS bundle for the page.
 *
 * `useCart` is the external store in `lib/cart-store`, so adding here updates
 * the header badge with no prop drilling and no shared context.
 */
export function ProductBuyBox({ product }: { product: Product }) {
  const { add } = useCart();

  const stock = product.quantity;
  const unit = salePrice(product);
  const soldOut = stock <= 0;

  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [saved, setSaved] = useState(false);

  // Clamped to the stock on both ends: the stepper can never ask for more units
  // than the document says exist, or drop to zero and remove the line on add.
  const step = (delta: number) =>
    setQuantity((current) => Math.min(stock, Math.max(1, current + delta)));

  function handleAdd() {
    // `add` is +1 per call by design — the header badge counts calls — so a
    // quantity of 3 is three calls. Bounded by the stepper, so this is at most a
    // handful of iterations against an in-memory array.
    for (let taken = 0; taken < quantity; taken += 1) add(product);

    setAdded(true);
    window.setTimeout(() => setAdded(false), 1500);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-4">
        {/* Stepper. A labelled group rather than two bare buttons so the value
            between them is announced as part of the same control. */}
        <div
          role="group"
          aria-label="Quantity"
          className="inline-flex h-12 items-center rounded-full border border-neutral-200 p-1 dark:border-neutral-800"
        >
          <button
            type="button"
            onClick={() => step(-1)}
            disabled={soldOut || quantity <= 1}
            aria-label="Decrease quantity"
            className="flex size-9 items-center justify-center rounded-full transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
          >
            <Minus className="size-4" aria-hidden="true" />
          </button>

          <span
            aria-live="polite"
            className="w-10 text-center text-sm font-semibold tabular-nums"
          >
            {quantity}
          </span>

          <button
            type="button"
            onClick={() => step(1)}
            disabled={soldOut || quantity >= stock}
            aria-label="Increase quantity"
            className="flex size-9 items-center justify-center rounded-full transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
          >
            <Plus className="size-4" aria-hidden="true" />
          </button>
        </div>

        <p
          className={cn(
            "text-sm font-medium",
            soldOut && "text-destructive",
            !soldOut && stock <= LOW_STOCK && "text-amber-600 dark:text-amber-500",
            !soldOut && stock > LOW_STOCK && "text-emerald-600 dark:text-emerald-500",
          )}
        >
          {soldOut ? "Out of stock" : stock <= LOW_STOCK ? `Only ${stock} left` : "In stock"}
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={handleAdd}
          disabled={soldOut}
          className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-neutral-900 px-6 text-sm font-semibold text-white transition-colors hover:bg-black disabled:pointer-events-none disabled:opacity-50 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
        >
          <ShoppingBag className="size-4" aria-hidden="true" />
          {soldOut ? "Out of stock" : added ? "Added to cart" : "Add to cart"}
        </button>

        <button
          type="button"
          onClick={() => setSaved((current) => !current)}
          aria-pressed={saved}
          aria-label="Wishlist"
          className={cn(
            "inline-flex size-12 shrink-0 items-center justify-center rounded-full border transition-colors",
            saved
              ? "border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-900"
              : "border-neutral-200 hover:border-neutral-900 hover:text-neutral-900 dark:border-neutral-800",
          )}
        >
          <Heart className={cn("size-5", saved && "fill-current")} aria-hidden="true" />
        </button>
      </div>

      {quantity > 1 && !soldOut ? (
        <p className="text-sm text-muted-foreground">
          Subtotal ·{" "}
          <span className="font-semibold text-foreground tabular-nums">
            {formatPrice(unit * quantity)}
          </span>
        </p>
      ) : null}
    </div>
  );
}