import { handle } from "@/lib/http";
import { listBrandLogos, listEditorialImages, listPromoSlides } from "@/lib/controller/site.controller";

/**
 * `/api/media`
 *
 * Read-only. These three collections are decorative site content curated by an
 * admin, not user-managed resources, so they get one bundle endpoint rather than
 * six CRUD routes. Writes go through Mongo directly or a CMS.
 */
export async function GET() {
  return handle(async () => {
    const [brandLogos, editorialImages, promoSlides] = await Promise.all([
      listBrandLogos(),
      listEditorialImages(),
      listPromoSlides(),
    ]);

    return {
      brandLogos,
      editorialImages,
      promoSlides,
      totalItems: brandLogos.length + editorialImages.length + promoSlides.length,
    };
  }, "Media successfully fetched");
}
