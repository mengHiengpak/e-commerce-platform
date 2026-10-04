import Image from "next/image";
import Link from "next/link";

import { Reveal, RevealText } from "@/components/motion/reveal";
import { Container } from "@/components/ui/container";

/**
 * Home page hero.
 *
 * The old version absolutely positioned the copy inside a `h-60` (240px) box
 * and it needed roughly 250px, so the text spilled out of the image on phones.
 * The height is now a `min-height` that grows with the copy, the overlay is
 * `justify-center`, and the padding is fluid, so the copy can never overflow.
 */
export function Hero() {
  return (
    <section className="pt-4 sm:pt-6 lg:pt-8">
      <Container>
        <div className="relative isolate min-h-[28rem] overflow-hidden rounded-2xl shadow-xl sm:min-h-[26rem] md:min-h-[30rem] lg:min-h-[34rem]">
          <Image
            src="/shopping_home.jpg"
            alt="Shoppers browsing the latest collection"
            fill
            priority
            sizes="(min-width: 1280px) 1280px, 100vw"
            className="-z-10 object-cover object-center"
          />

          {/* Gradient is vertical on phones so the text stays readable over the
              whole image, and horizontal from `sm` where the copy sits left. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-linear-to-b from-black/75 via-black/60 to-black/70 sm:bg-linear-to-r sm:from-black/80 sm:via-black/55 sm:to-black/20"
          />

          <div className="flex min-h-[inherit] flex-col justify-center gap-4 p-6 text-white sm:p-10 md:p-14 lg:max-w-3xl lg:p-16">
            <RevealText
              as="h1"
              className="text-3xl font-bold tracking-tight text-balance sm:text-4xl md:text-5xl lg:text-6xl"
            >
              Elevate your style with trendsetting fashion
            </RevealText>

            <Reveal delay={0.2}>
              <p className="max-w-xl text-sm leading-relaxed text-pretty text-neutral-200 sm:text-base md:text-lg">
                Discover the epitome of fashion at {`Chic Threads`}, where style
                meets substance. Explore a curated collection of the latest
                trends, ensuring you step out in confidence and flair.
              </p>
            </Reveal>

            <Reveal delay={0.35} className="flex flex-wrap items-center gap-3 pt-1">
              <Link
                href="/shop"
                className="inline-flex h-12 items-center justify-center rounded-lg bg-white px-6 text-sm font-semibold text-black transition-colors hover:bg-neutral-200 sm:h-13 sm:px-7 sm:text-base"
              >
                Shop the collection
              </Link>
              <Link
                href="/brand"
                className="inline-flex h-12 items-center justify-center rounded-lg border border-white/70 bg-white/10 px-6 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20 sm:h-13 sm:px-7 sm:text-base"
              >
                View this week&apos;s deals
              </Link>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
