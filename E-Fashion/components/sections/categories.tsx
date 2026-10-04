import Image from "next/image";
import Link from "next/link";

import { Reveal } from "@/components/motion/reveal";
import { Section, SectionHeading } from "@/components/ui/container";
import type { CategoryTile } from "@/lib/types";

/**
 * "Trending Category" grid.
 *
 * Tiles come from the `categories` collection via `getCategoryTiles()`, so adding
 * a row in MongoDB adds a tile here.
 *
 * Fixed at 3 columns, which forced 90px-wide cells at 320px and clipped the
 * labels. Now 2 columns on the narrowest phones, 3 from `sm`, 6 from `md`.
 */
export function Categories({ items }: { items: CategoryTile[] }) {
  if (!items.length) return null;

  return (
    <Section id="categories" spacing="lg">
      <SectionHeading
        eyebrow="Shop by category"
        title="Trending Category"
        description="The pieces everyone is browsing right now, from everyday essentials to statement accessories."
      />

      <Reveal mode="items" delay={0.1} className="w-full">
        <ul className="mt-8 grid grid-cols-2 gap-3 sm:mt-10 sm:grid-cols-3 sm:gap-4 md:grid-cols-6 md:gap-3 lg:gap-4">
          {items.map((category) => (
            <li
              key={category.id}
              data-reveal-item
              className="flex flex-col items-center gap-2"
            >
              <Link
                href={category.href}
                className="group flex w-full flex-1 flex-col items-center justify-center gap-3 rounded-2xl border border-neutral-200 bg-background px-2 py-7 transition-all duration-300 hover:border-neutral-900 hover:bg-neutral-900 hover:text-white sm:gap-4 sm:px-3 sm:py-9 md:py-11"
              >
                <Image
                  src={category.icon}
                  alt={category.label}
                  width={40}
                  height={44}
                  className="h-9 w-8 transition-[transform,filter] duration-300 group-hover:scale-110 group-hover:invert sm:h-11 sm:w-10"
                />
                <span className="text-center text-xs leading-tight font-medium text-balance sm:text-sm">
                  {category.label}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Reveal>
    </Section>
  );
}