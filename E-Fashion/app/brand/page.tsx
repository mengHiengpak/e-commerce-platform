import type { Metadata } from "next";

import { DealsPage } from "@/components/sections/deals";
import { listPromoSlides } from "@/lib/controller/site.controller";

export const metadata: Metadata = {
  title: "Brand Deals",
  description:
    "Limited-time offers from the brands we stock, refreshed every week.",
};

export default async function BrandPage() {
  const slides = await listPromoSlides();

  return <DealsPage slides={slides} />;
}
