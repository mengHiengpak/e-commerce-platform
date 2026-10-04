import Image from "next/image";
import Link from "next/link";
import { ChevronRight, RotateCcw, ShieldCheck, Truck } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { ProductBuyBox } from "@/components/sections/product-buy-box";
import { ProductCard, Rating } from "@/components/sections/product-list";
import { Section, SectionHeading } from "@/components/ui/container";
import { formatPrice, salePrice } from "@/lib/format";
import { categoryHref, type Product } from "@/lib/types";

/**
 * Product detail page body.
 *
 * A Server Component. The product and its siblings are read from MongoDB by
 * `app/productdetail/[id]/page.tsx` and arrive as props, so the image, the price
 * and the copy are all in the first HTML response — the only JavaScript this page
 * ships is the `ProductBuyBox` island, because the quantity stepper and the cart
 * are the only parts that change.
 *
 * Prices come from `lib/format`, not `lib/cart-store`: the latter is a
 * `"use client"` module, so importing `formatPrice` from it into a Server
 * Component would hand back a client reference instead of a function.
 */

/** Position in the trail above the fold, where a long name would wrap to three lines. */
function Breadcrumb({ product }: { product: Product }) {
    const hasCategory = Boolean(product.categorySlug && product.category);

    return (
        <nav aria-label="Breadcrumb" className="w-full">
            <ol className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground sm:text-sm">
                <li>
                    <Link href="/" className="transition-colors hover:text-foreground">
                        Home
                    </Link>
                </li>

                {hasCategory ? (
                    <>
                        <li aria-hidden="true">
                            <ChevronRight className="size-3.5" />
                        </li>
                        <li>
                            <Link
                                href={categoryHref(product.categorySlug)}
                                className="transition-colors hover:text-foreground"
                            >
                                {product.category}
                            </Link>
                        </li>
                    </>
                ) : null}

                <li aria-hidden="true">
                    <ChevronRight className="size-3.5" />
                </li>
                <li aria-current="page" className="font-medium text-foreground">
                    {product.name}
                </li>
            </ol>
        </nav>
    );
}

/**
 * The product image.
 *
 * One image per document, so there is no thumbnail rail to build — the badges sit
 * over a single `aspect-3/4` frame that matches the grid cards, which keeps the
 * page from reflowing when a product is opened from the shop.
 */
function Gallery({ product }: { product: Product }) {
    return (
        <div className="relative w-full">
            <div className="group relative aspect-3/4 overflow-hidden rounded-2xl bg-muted">
                <Image
                    src={product.image}
                    alt={product.name}
                    width={product.width}
                    height={product.height}
                    // Above the fold and the largest element on the page, so it is the LCP
                    // candidate and must not be lazy.
                    priority
                    sizes="(min-width: 1024px) 46vw, 100vw"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
            </div>

            {/* `pointer-events-none` because these are labels sitting on top of the
          image, not controls — the hover zoom belongs to the picture alone. */}
            <div className="pointer-events-none absolute inset-x-3 top-3 flex items-start justify-between gap-2 sm:inset-x-4 sm:top-4">
                {product.discount > 0 ? (
                    <span className="rounded-md bg-neutral-900 px-2.5 py-1 text-[11px] font-semibold tracking-wider text-white uppercase dark:bg-white dark:text-neutral-900">
                        -{product.discount}%
                    </span>
                ) : null}

                {product.badge ? (
                    <span className="rounded-md bg-emerald-600 px-2.5 py-1 text-[11px] font-semibold tracking-wider text-white uppercase">
                        {product.badge}
                    </span>
                ) : null}
            </div>
        </div>
    );
}

/** Name, rating and price. Kept apart from the gallery so the panel reads top-down. */
function Summary({ product }: { product: Product }) {
    const price = salePrice(product);
    const onSale = product.discount > 0 && product.price > 0;
    const savedPercent = onSale ? Math.round((1 - price / product.price) * 100) : 0;

    return (
        <div className="flex flex-col gap-4">
            {product.vendor ? (
                <p className="text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase">
                    {product.vendor}
                </p>
            ) : null}

            <h1 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl">
                {product.name}
            </h1>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <Rating rating={product.rating} />
                <span className="text-sm text-muted-foreground">
                    {product.reviews} customer {product.reviews === "1" ? "review" : "reviews"}
                </span>
            </div>

            <div className="flex flex-wrap items-baseline gap-3">
                <span className="text-3xl font-bold tabular-nums sm:text-4xl">
                    {formatPrice(price)}
                </span>

                {onSale ? (
                    <>
                        <span className="text-base text-muted-foreground line-through tabular-nums">
                            {formatPrice(product.price)}
                        </span>
                        {savedPercent > 0 ? (
                            <span className="rounded-full bg-emerald-600/10 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                                Save {savedPercent}%
                            </span>
                        ) : null}
                    </>
                ) : null}
            </div>

            {product.subtitle ? (
                <p className="max-w-prose text-sm leading-relaxed text-pretty text-muted-foreground sm:text-base">
                    {product.subtitle}
                </p>
            ) : null}
        </div>
    );
}

const PROMISES = [
    { Icon: Truck, label: "Free shipping over $50" },
    { Icon: RotateCcw, label: "30-day returns" },
    { Icon: ShieldCheck, label: "Secure checkout" },
];

/**
 * The facts row, minus anything blank.
 *
 * A document is not obliged to carry a vendor or a category, so each entry is
 * built conditionally and the row drops out entirely when it would be empty —
 * an empty `<dt>` reads as a rendering bug rather than missing data.
 */
function detailFields(product: Product) {
    return [
        { label: "Brand", value: product.vendor },
        { label: "Category", value: product.category },
        { label: "Rating", value: `${product.rating} out of 5` },
        { label: "Reference", value: product.id },
    ];
}

/**
 * Reassurance row and the collapsed detail panels.
 *
 * `<details>`/`<summary>` rather than an accordion component: it is disclosure
 * semantics the platform already implements, it works before hydration, and each
 * panel keeps its own open/closed state instead of the section closing whatever
 * the shopper last opened.
 */
function Assurance({ product }: { product: Product }) {
    return (
        <div className="flex flex-col gap-6">
            <ul className="flex flex-wrap gap-x-6 gap-y-3">
                {PROMISES.map(({ Icon, label }) => (
                    <li key={label} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Icon className="size-4" aria-hidden="true" />
                        {label}
                    </li>
                ))}
            </ul>

            <div className="divide-y divide-border border-y border-border">
                {/* The description already sits above the fold, so this panel carries the
            fields that are facts rather than prose instead of repeating it. */}
                <details className="group py-4" open>
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold [&::-webkit-details-marker]:hidden">
                        Details
                        <ChevronRight
                            className="size-4 transition-transform group-open:rotate-90"
                            aria-hidden="true"
                        />
                    </summary>
                    <dl className="mt-3 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
                        {detailFields(product).map(({ label, value }) =>
                            value ? (
                                <div key={label} className="flex items-baseline justify-between gap-4">
                                    <dt className="text-muted-foreground">{label}</dt>
                                    <dd className="text-end font-medium">{value}</dd>
                                </div>
                            ) : null,
                        )}
                    </dl>
                </details>

                <details className="group py-4">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold [&::-webkit-details-marker]:hidden">
                        Shipping &amp; returns
                        <ChevronRight
                            className="size-4 transition-transform group-open:rotate-90"
                            aria-hidden="true"
                        />
                    </summary>
                    <p className="pt-3 text-sm leading-relaxed text-muted-foreground">
                        Orders placed before 2pm ship the same working day. Delivery is free over $50,
                        otherwise a flat $6. Returns are free within 30 days, unworn and with the tags
                        still attached.
                    </p>
                </details>

                <details className="group py-4">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold [&::-webkit-details-marker]:hidden">
                        Availability
                        <ChevronRight
                            className="size-4 transition-transform group-open:rotate-90"
                            aria-hidden="true"
                        />
                    </summary>
                    <p className="pt-3 text-sm leading-relaxed text-muted-foreground">
                        {product.quantity > 0
                            ? `${product.quantity} in stock, ready to leave our warehouse.`
                            : "This piece is sold out. The shop page shows what is currently available."}
                    </p>
                </details>
            </div>
        </div>
    );
}

/**
 * The whole page below the header.
 *
 * Single column on a phone (image, then the buy box, then the details) and two
 * from `lg` up, where the panel is sticky so the quantity stepper stays reachable
 * while a long description is being read.
 */
export function ProductDetail({
    product,
    related,
}: {
    product: Product;
    related: Product[];
}) {
    return (
        <>
            <Section spacing="md">
                <Breadcrumb product={product} />

                <Reveal mode="items" className="mt-6 w-full sm:mt-8">
                    <div className="grid gap-8 lg:grid-cols-2 lg:gap-14">
                        <div data-reveal-item className="w-full">
                            <Gallery product={product} />
                        </div>

                        <div
                            data-reveal-item
                            className="flex flex-col gap-8 lg:sticky lg:top-24 lg:self-start"
                        >
                            <Summary product={product} />
                            <ProductBuyBox product={product} />
                            <Assurance product={product} />
                        </div>
                    </div>
                </Reveal>
            </Section>

            {related.length ? (
                <Section spacing="lg">
                    <SectionHeading
                        eyebrow="More to try"
                        title="You may also like"
                        description="Pieces from the same part of the collection, picked by the shop."
                    />

                    <Reveal mode="items" delay={0.1} className="mt-8 w-full sm:mt-10">
                        <ul className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4 md:gap-6">
                            {related.map((item) => (
                                <li key={item.id} data-reveal-item className="h-full">
                                    <ProductCard product={item} />
                                </li>
                            ))}
                        </ul>
                    </Reveal>
                </Section>
            ) : null}
        </>
    );
}