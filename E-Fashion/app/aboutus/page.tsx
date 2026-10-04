import type { Metadata } from "next";

import { AboutPage } from "@/components/sections/brand-showcase";
import {
  getSiteInfo,
  listBrandLogos,
  listEditorialImages,
} from "@/lib/controller/site.controller";

/**
 * `/aboutus`
 *
 * `generateMetadata` because the description interpolates the store name,
 * which now lives in MongoDB rather than a hardcoded object.
 */
export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteInfo();

  return {
    title: "About Us",
    description: `The story behind ${site.name}: a small team of stylists curating pieces that actually work together.`,
  };
}

export default async function AboutUsPage() {
  const [site, images, logos] = await Promise.all([
    getSiteInfo(),
    listEditorialImages(),
    listBrandLogos(),
  ]);

  return <AboutPage site={site} images={images} logos={logos} />;
}
