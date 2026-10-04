import Link from "next/link";

import { Container, Section, SectionHeading } from "@/components/ui/container";
import type { PromoSlide } from "@/lib/types";
import { CountDown } from "./countdown";
import { PromoCards } from "./promo-cards";

/**
 * "Deal of the Week" band, also used as the `/brand` page.
 *
 * The old layout was `flex ... lg:flex-row` with no `min-w-0` and no wrapping.
 * At 1024px the two columns needed roughly 1042px of intrinsic width in 968px
 * of space, so the whole page scrolled sideways from 1024px to about 1200px.
 *
 * This uses a grid with `minmax(0, …)` tracks, which lets both columns shrink
 * instead of overflowing, and only splits into two columns from `lg` up.
 *
 * The promo slides arrive as props so both the server render and the client
 * carousel see the same list from one database read.
 */
export function Deals({ slides }: { slides: PromoSlide[] }) {
  return (
    <Section id="deals" spacing="lg" className="bg-neutral-50">
      <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-12">
        <div className="flex min-w-0 flex-col items-center gap-6 text-center lg:items-start lg:text-start">
          <SectionHeading
            align="start"
            eyebrow="Limited time"
            title="Deal Of The Week"
            description="Discover the epitome of fashion at Chic Threads, where style meets substance. Explore a curated collection of the latest trends, ensuring you step out in confidence and flair."
          />

          <Link
            href="/shop"
            className="inline-flex h-12 w-full items-center justify-center rounded-lg bg-neutral-900 px-7 text-sm font-semibold text-white transition-colors hover:bg-black sm:w-auto sm:text-base"
          >
            Shop the deal
          </Link>

          <div className="w-full max-w-md">
            <CountDown />
          </div>
        </div>

        <div className="min-w-0">
          <PromoCards slides={slides} />
        </div>
      </div>
    </Section>
  );
}

/** Page-level wrapper so `/brand` and the home page share one section. */
export function DealsPage({ slides }: { slides: PromoSlide[] }) {
  return (
    <>
      <Container className="pt-10 sm:pt-14">
        <SectionHeading
          as="h1"
          align="start"
          eyebrow="Brand"
          title="Brand Deals"
          description="Everything in this section is a limited-time offer from our partner brands."
        />
      </Container>
      <Deals slides={slides} />
    </>
  );
}
