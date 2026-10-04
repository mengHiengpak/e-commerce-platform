import Image from "next/image";
import Link from "next/link";

import { Reveal } from "@/components/motion/reveal";
import { Container, Section, SectionHeading } from "@/components/ui/container";
import type { BrandLogo, EditorialImage, SiteInfo } from "@/lib/types";
import { BrandMarquee } from "./brand-marquee";

/**
 * Editorial / "About us" band.
 *
 * The gallery declared `width={1000} height={1000}` on seven mixed-ratio
 * sources and then forced them into `w-40 h-50` with no `object-fit`, so every
 * photo was squashed. Each image now carries its real intrinsic size and is
 * cropped with `aspect-*` + `object-cover` inside a grid that actually has gaps.
 *
 * Images and the store name arrive as props, read from MongoDB by the page.
 */
export function BrandShowcase({
  site,
  images,
}: {
  site: SiteInfo;
  images: EditorialImage[];
}) {
  return (
    <Section id="about" spacing="lg">
      <SectionHeading
        eyebrow="About us"
        title="Style that speaks for itself"
        description={`We are ${site.name}. A small team of stylists and makers who believe getting dressed should be the easiest part of your day — so we curate pieces that actually work together, in sizes that actually exist, at prices that do not need explaining.`}
      />

      {images.length ? (
        <Reveal mode="items" delay={0.1} className="w-full">
          <ul className="mt-8 grid grid-cols-2 gap-3 sm:mt-10 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-7">
            {images.map((image) => (
              <li
                key={image.id}
                data-reveal-item
                className="overflow-hidden rounded-xl bg-neutral-100"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={image.width}
                  height={image.height}
                  sizes="(min-width: 1024px) 14vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, 50vw"
                  className="aspect-3/4 w-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </li>
            ))}
          </ul>
        </Reveal>
      ) : null}

      <div className="mt-12 flex flex-col items-center gap-4 sm:mt-16">
        <Reveal className="flex flex-col items-center gap-3">
          <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
            New drops land every Thursday. Follow along on Telegram for first
            access before anything goes on sale.
          </p>
          <Link
            href="/contact"
            className="inline-flex h-11 items-center justify-center rounded-lg border border-neutral-900 px-6 text-sm font-semibold transition-colors hover:border-neutral-900 hover:bg-neutral-900 hover:text-white"
          >
            Get in touch
          </Link>
        </Reveal>
      </div>
    </Section>
  );
}

export function BrandMarqueeBand({ logos }: { logos: BrandLogo[] }) {
  if (!logos.length) return null;

  return (
    <section aria-label="Brands we stock" className="border-y border-neutral-200 py-8">
      <Container>
        <BrandMarquee logos={logos} />
      </Container>
    </section>
  );
}

/** Page-level wrapper for `/aboutus`. */
export function AboutPage({
  site,
  images,
  logos,
}: {
  site: SiteInfo;
  images: EditorialImage[];
  logos: BrandLogo[];
}) {
  return (
    <>
      <Container className="pt-10 sm:pt-14">
        <SectionHeading
          as="h1"
          align="start"
          eyebrow="About"
          title="Who we are"
          description={`${site.name} is an independent fashion store built around one idea: a smaller, better-chosen collection beats a bigger one you have to dig through.`}
        />
      </Container>
      <BrandShowcase site={site} images={images} />
      <BrandMarqueeBand logos={logos} />
    </>
  );
}
