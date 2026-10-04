import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProductDetail } from "@/components/sections/product-detail";
import { Section, SectionHeading } from "@/components/ui/container";
import { getProduct, listRelatedProducts } from "@/lib/controller/catalog.controller";
import { AppError, DatabaseUnavailableError } from "@/lib/errors";
import type { Product } from "@/lib/types";

/**
 * A single product.
 *
 * `params` is a Promise in Next.js 16 — reading it synchronously no longer works
 * and used to silently yield `undefined`, which `getProduct` would then reject as
 * a malformed id. Awaiting it is what actually reaches MongoDB.
 *
 * A Server Component: the product and its siblings are read here and passed down,
 * so the first HTML response already has the real price, image and copy in it.
 */
export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const loaded = await loadProduct(id);

  return loaded.status === "unavailable" ? (
    <StoreUnavailable />
  ) : (
    <ProductDetail product={loaded.product} related={loaded.related} />
  );
}

/** A catalog page degrades to an empty grid; this one cannot invent a product. */
type LoadedProduct =
  | { status: "unavailable" }
  | { status: "ready"; product: Product; related: Product[] };

/**
 * Reads the product and its siblings, turning the two ways this can fail into
 * something the page knows how to render.
 *
 * Only the reads sit inside the `try`: building JSX there would make a render
 * error indistinguishable from a read error, and render errors need an error
 * boundary rather than a `catch`.
 */
async function loadProduct(id: string): Promise<LoadedProduct> {
  try {
    const product = await getProduct(id);
    // Only after the product exists, since the rail is scoped by its category.
    const related = await listRelatedProducts(product);

    return { status: "ready", product, related };
  } catch (error) {
    // A database that cannot be reached is not a missing product, so it must not
    // become a 404: telling a visitor the product does not exist when it does is
    // the one answer they cannot act on.
    if (error instanceof DatabaseUnavailableError) return { status: "unavailable" };

    // `getProduct` raises a `ValidationError` for an id Mongo would reject and a
    // `NotFoundError` for one that simply is not there; both are the caller's
    // problem, so both render 404. Anything else is ours and is left to bubble up.
    if (error instanceof AppError) notFound();

    throw error;
  }
}

/**
 * The one thing a product page can honestly show without the database.
 *
 * A catalog page degrades to an empty grid; this one cannot invent a product, so
 * it says what happened instead of pretending the product is gone.
 */
function StoreUnavailable() {
  return (
    <Section spacing="lg">
      <SectionHeading
        eyebrow="Temporarily unavailable"
        title="We could not load this product"
        description="The store cannot reach its database right now. Please refresh in a moment."
      />
    </Section>
  );
}

/**
 * Title and description from the product itself.
 *
 * Failures return a bare title instead of propagating: a missing document should
 * render the 404 page, not turn a `<head>` lookup into a 500.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  try {
    const product = await getProduct(id);

    return {
      title: product.name,
      description: product.subtitle || `${product.name} by ${product.vendor}`,
      openGraph: {
        title: product.name,
        description: product.subtitle,
        images: [{ url: product.image }],
      },
    };
  } catch {
    return { title: "Product" };
  }
}
