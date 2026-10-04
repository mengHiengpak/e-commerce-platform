"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { useIsTabletOrLarger } from "@/hooks/use-media-query";
import type { PromoSlide } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * Promo carousel.
 *
 * The old version hardcoded `w-60` / `h-100` cards, showed a fixed two slides on
 * every screen, wrapped around at both ends, and marked all four images
 * `priority` even though at most two were ever visible.
 *
 * Now: one slide per view on phones, two from `sm` up; disabled buttons at the
 * ends instead of wrapping; lazy images except the first visible one.
 *
 * The slides arrive as props — this is a client component and cannot read
 * MongoDB. `useIsTabletOrLarger()` reads `false` on the server, so `perView`
 * starts at 1 and corrects on hydration; `index` is clamped during render rather
 * than in an effect to absorb that correction without an extra pass.
 */
export function PromoCards({ slides }: { slides: PromoSlide[] }) {
  const isWide = useIsTabletOrLarger();
  const perView = isWide ? 2 : 1;
  const totalSlides = Math.ceil(slides.length / perView);

  const [requested, setRequested] = useState(0);

  // Crossing the `sm` breakpoint changes how many slides there are, so the
  // stored position is clamped during render instead of being corrected in an
  // effect. Growing the viewport keeps the position; shrinking it clamps.
  // `Math.max(0, …)` matters: with no slides `totalSlides` is 0, and without the
  // floor `index` would be -1 and `slice(-2, 0)` would return nothing anyway.
  const index = Math.max(0, Math.min(requested, totalSlides - 1));

  const atStart = index === 0;
  const atEnd = index >= totalSlides - 1;

  const visible = slides.slice(index * perView, index * perView + perView);

  if (!slides.length) return null;

  return (
    <div className="w-full">
      <div
        className={cn("grid gap-4", isWide ? "grid-cols-2" : "grid-cols-1")}
      >
        {visible.map((slide, position) => (
          <Link
            key={slide.id}
            href={slide.href}
            className="group relative block aspect-4/5 w-full overflow-hidden rounded-2xl shadow-lg sm:aspect-3/4"
          >
            <Image
              src={slide.image}
              alt={slide.subtitle}
              fill
              sizes="(min-width: 640px) 40vw, 90vw"
              priority={index === 0 && position === 0}
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />

            <div className="absolute inset-x-0 bottom-0 rounded-t-2xl bg-background/95 p-5 backdrop-blur-sm">
              <div className="mb-1 flex items-center gap-2 text-xs font-medium text-neutral-500">
                <span>{slide.number}</span>
                <span aria-hidden="true" className="h-px w-4 bg-neutral-300" />
                <span>{slide.subtitle}</span>
              </div>
              <p className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">
                {slide.discount}
              </p>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => setRequested(Math.max(0, index - 1))}
          disabled={atStart}
          aria-label="Previous slide"
          className="inline-flex size-10 items-center justify-center rounded-full bg-background text-neutral-700 shadow-md transition-all hover:bg-neutral-100 active:scale-95 disabled:pointer-events-none disabled:opacity-40"
        >
          <ChevronLeft className="size-5" aria-hidden="true" />
        </button>

        <ul className="flex items-center gap-2">
          {Array.from({ length: totalSlides }, (_, dot) => (
            <li key={dot}>
              <button
                type="button"
                onClick={() => setRequested(dot)}
                aria-label={`Go to slide ${dot + 1} of ${totalSlides}`}
                aria-current={dot === index ? "true" : undefined}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  dot === index
                    ? "w-8 bg-neutral-900"
                    : "w-6 bg-neutral-300 hover:bg-neutral-400",
                )}
              />
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={() => setRequested(Math.min(totalSlides - 1, index + 1))}
          disabled={atEnd}
          aria-label="Next slide"
          className="inline-flex size-10 items-center justify-center rounded-full bg-background text-neutral-700 shadow-md transition-all hover:bg-neutral-100 active:scale-95 disabled:pointer-events-none disabled:opacity-40"
        >
          <ChevronRight className="size-5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
