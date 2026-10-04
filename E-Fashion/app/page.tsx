import { BrandMarqueeBand, BrandShowcase } from "@/components/sections/brand-showcase";
import { Categories } from "@/components/sections/categories";
import { Deals } from "@/components/sections/deals";
import { Hero } from "@/components/sections/hero";
import { ProductList } from "@/components/sections/product-list";
import {
  listCategoryTiles,
  listProductFilters,
  listProducts,
} from "@/lib/controller/catalog.controller";
import {
  getSiteInfo,
  listBrandLogos,
  listEditorialImages,
  listPromoSlides,
} from "@/lib/controller/site.controller";
import { ALL_FILTER } from "@/lib/types";

/**
 * Home page.
 *
 * A Server Component: the catalog, category tiles and site media are read
 * straight from MongoDB here, so the first paint already has real products in it
 * and the browser never issues a follow-up fetch.
 *
 * All six reads are in one `Promise.all` because none depends on another — the
 * page waits for all of them regardless, so running them in series would add six
 * round trips for nothing.
 */
export default async function Home() {
  const [site, tiles, filters, { products }, logos, images, slides] = await Promise.all([
    getSiteInfo(),
    listCategoryTiles(),
    listProductFilters(),
    listProducts({ filter: ALL_FILTER, limit: 8 }),
    listBrandLogos(),
    listEditorialImages(),
    listPromoSlides(),
  ]);

  return (
    <>
      <Hero />
      <Categories items={tiles} />
      <ProductList items={products} filters={filters} activeFilter={ALL_FILTER} />
      <Deals slides={slides} />
      <BrandMarqueeBand logos={logos} />
      <BrandShowcase site={site} images={images} />
    </>
  );
}
