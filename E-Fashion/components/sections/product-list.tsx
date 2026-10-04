"use client";

import Image from "next/image";
import { Star } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Reveal } from "@/components/motion/reveal";
import { Section, SectionHeading } from "@/components/ui/container";
import { formatPrice, useCart } from "@/lib/cart-store";
import {
  ALL_FILTER,
  FILTER_PARAM,
  productHref,
  type Product,
  type ProductFilter,
} from "@/lib/types";
import { cn } from "@/lib/utils";

/** Star row. Shared with the product page, so the two cannot drift apart. */
export function Rating({ rating }: { rating: number }) {
  return (
    <span
      className="flex items-center gap-0.5 text-amber-500"
      role="img"
      aria-label={`Rated ${rating} out of 5`}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            "size-3.5 sm:size-4",
            star <= rating
              ? "fill-amber-500 stroke-amber-500"
              : "fill-transparent stroke-amber-300",
          )}
          aria-hidden="true"
        />
      ))}
    </span>
  );
}

/** One tile in the grid. Also rendered by the product page's "you may also like" rail. */
export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  return (
    <article className="group relative flex h-full flex-col rounded-2xl border border-neutral-100 bg-background p-3 shadow-sm transition-shadow hover:shadow-md sm:p-4">
      <div className="relative mb-4 aspect-3/4 overflow-hidden rounded-xl bg-neutral-100">
        {/* The picture is a second link to the same place as the title, so it is
            hidden from assistive tech to avoid announcing the product twice. */}
        <Link
          href={productHref(product.id)}
          tabIndex={-1}
          aria-hidden="true"
          className="block h-full w-full"
        >
          <Image
            src={product.image}
            alt=""
            width={product.width}
            height={product.height}
            sizes="(min-width: 768px) 30vw, (min-width: 640px) 45vw, 45vw"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>
        {product.badge ? (
          <span className="absolute start-3 top-3 rounded-md bg-emerald-600 px-2 py-1 text-[10px] font-semibold tracking-wider text-white sm:text-xs">
            {product.badge.toUpperCase()}
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-bold text-neutral-800 text-balance sm:text-lg">
            <Link href={productHref(product.id)} className="hover:underline">
              {product.name}
            </Link>
          </h3>
          <Rating rating={product.rating} />
        </div>

        <p className="mt-0.5 text-xs text-neutral-400 sm:text-sm">{product.vendor}</p>
        <p className="mt-2 text-xs font-medium text-neutral-500">
          ({product.reviews}) Customer Reviews
        </p>

        <div className="mt-auto flex flex-col gap-3 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-xl font-bold text-neutral-800 sm:text-2xl">
            {formatPrice(product.price)}
          </span>
          <button
            type="button"
            onClick={() => {
              add(product);
              setAdded(true);
              window.setTimeout(() => setAdded(false), 1500);
            }}
            className="inline-flex h-10 items-center justify-center rounded-lg bg-neutral-900 px-4 text-sm font-medium text-white transition-colors hover:bg-black"
          >
            {added ? "Added to cart" : "Add to cart"}
          </button>
        </div>
      </div>
    </article>
  );
}

/**
 * "New Arrivals" product grid.
 *
 * Products and filters arrive as props from the server, which has already read
 * them out of MongoDB — there is no catalog array in the bundle and no client
 * fetch. 2 / 3 / 4 columns across phone, tablet and desktop.
 */
export function ProductList({
  items,
  filters,
  activeFilter,
  categorySlug,
  query,
  showFilters = true,
}: {
  items: Product[];
  filters: string[];
  activeFilter: ProductFilter;
  /** Set when the grid was reached through a category tile. */
  categorySlug?: string;
  query?: string;
  showFilters?: boolean;
}) {
  // Switching category type must not silently keep the old ?category= param.
  const filterHref = (filter: string) => {
    const params = new URLSearchParams();
    if (filter !== ALL_FILTER) params.set(FILTER_PARAM, filter);
    if (categorySlug && filter === ALL_FILTER) params.set("category", categorySlug);
    const search = params.toString();
    return search ? `/shop?${search}` : "/shop";
  };

  return (
    <Section id="new-arrivals" spacing="lg">
      <SectionHeading
        eyebrow={query ? `Results for “${query}”` : "Just landed"}
        title="New Arrivals"
        description="Fresh pieces added to the collection this week, priced to move."
      />

      {showFilters ? (
        <Reveal delay={0.1} className="w-full">
          <ul className="mt-8 flex flex-wrap items-center justify-center gap-2 sm:mt-10 sm:gap-3">
            {filters.map((filter) => {
              const isActive = filter === activeFilter;
              return (
                <li key={filter}>
                  <Link
                    href={filterHref(filter)}
                    aria-current={isActive ? "true" : undefined}
                    className={cn(
                      "inline-flex h-10 items-center justify-center rounded-full px-4 text-xs font-semibold transition-colors sm:h-11 sm:px-6 sm:text-sm",
                      isActive
                        ? "bg-neutral-900 text-white"
                        : "bg-neutral-100 text-neutral-500 hover:bg-neutral-900 hover:text-white",
                    )}
                  >
                    {filter}
                  </Link>
                </li>
              );
            })}
          </ul>
        </Reveal>
      ) : null}

      {items.length ? (
        <Reveal mode="items" delay={0.15} className="w-full">
          <ul className="mt-8 grid grid-cols-2 gap-3 sm:mt-10 sm:gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
            {items.map((product) => (
              <li key={product.id} data-reveal-item className="h-full">
                <ProductCard product={product} />
              </li>
            ))}
          </ul>
        </Reveal>
      ) : (
        <div className="mt-10 flex flex-col items-center gap-3 rounded-2xl border border-dashed border-neutral-200 p-10 text-center">
          <p className="text-sm font-semibold text-neutral-700">
            No products match your search.
          </p>
          <Link
            href="/shop"
            className="text-sm font-medium text-neutral-500 underline underline-offset-4 hover:text-neutral-900"
          >
            Clear filters and browse everything
          </Link>
        </div>
      )}
    </Section>
  );
}