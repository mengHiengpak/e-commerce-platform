import Image from "next/image";
import type { CSSProperties } from "react";

import type { BrandLogo } from "@/lib/types";

/**
 * Infinite brand logo strip.
 *
 * The previous implementation was a `motion.div` sized at `w-[17%]` holding 21
 * flex children: the logos were crushed into a sixth of the available width,
 * the `-100%` translate moved it by 17% of the container so it never looked
 * like it was scrolling, `h-[12%]` resolved against an auto-height parent, and
 * `object-cover` was applied to a `<div>`.
 *
 * This is now a pure CSS animation, which also removes the `motion` runtime
 * from the critical path. A `w-max` track holds two identical sets and
 * translates by exactly -50%, so the loop is seamless. The track itself has no
 * `gap` — the spacing lives inside each set's padding, otherwise the inter-set
 * gap would make -50% overshoot and the seam would visibly jump.
 *
 * It pauses on hover/focus and is switched off by `prefers-reduced-motion`.
 * The duplicate set is hidden from assistive tech.
 *
 * Logos arrive as props from the server; an empty list renders nothing rather
 * than an empty scrolling band.
 */
export function BrandMarquee({ logos }: { logos: BrandLogo[] }) {
  if (!logos.length) return null;

  return (
    <div
      className="marquee"
      style={{ "--marquee-duration": "34s" } as CSSProperties}
    >
      <div className="marquee__track">
        {[0, 1].map((copy) => (
          <ul
            key={copy}
            aria-hidden={copy === 1 ? "true" : undefined}
            className="flex shrink-0 items-center gap-8 px-4 sm:gap-12 sm:px-6"
          >
            {logos.map((brand) => (
              <li key={`${copy}-${brand.id}`} className="shrink-0">
                <Image
                  src={brand.src}
                  alt={brand.name}
                  title={brand.name}
                  width={brand.width}
                  height={brand.height}
                  className="h-8 w-auto max-w-24 opacity-70 transition-opacity hover:opacity-100 sm:h-10 sm:max-w-32"
                />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
