import { isValidObjectId } from "mongoose";

import { NotFoundError, ValidationError } from "@/lib/errors";
import { degrade } from "@/lib/service/ready";
import {
  createCategory,
  createCategoryType,
  createProduct,
  deleteCategory,
  deleteCategoryType,
  deleteProduct,
  findCategories,
  findCategoryById,
  findCategoryBySlug,
  findCategoryTypeById,
  findCategoryTypes,
  findProductById,
  findProductNames,
  findProducts,
  updateCategory,
  updateCategoryType,
  updateProduct,
  type Doc,
  type ProductQueryOptions,
} from "@/lib/service/catalog.service";
import {
  ALL_FILTER,
  categoryHref,
  DEALS_FILTER,
  type CategoryTile,
  type Product,
  type ProductFilter,
} from "@/lib/types";

/**
 * Catalog business logic.
 *
 * This is the layer the UI *and* the API both call, which is the whole point of
 * extracting it: `/shop` and `GET /api/products` run identical filtering and
 * pagination instead of two implementations drifting apart.
 *
 * Two responsibilities live here and nowhere else:
 * - mapping Mongo documents to the camelCased shapes in `lib/types.ts`
 * - turning "no document" into a typed `NotFoundError` rather than `null`
 */

/* -------------------------------------------------------------------------- */
/* Validation                                                                  */
/* -------------------------------------------------------------------------- */

/**
 * Guards every id-taking entry point.
 *
 * Without this a malformed id reaches Mongoose and surfaces as a BSON cast
 * error — a 500 for what is really the caller's mistake.
 */
export function assertObjectId(id: string, label = "id"): void {
  if (!isValidObjectId(id)) {
    throw new ValidationError(`Invalid ${label}`);
  }
}

/* -------------------------------------------------------------------------- */
/* Mapping                                                                     */
/* -------------------------------------------------------------------------- */

/**
 * Resolves a populated-or-bare `category` reference to a display string.
 *
 * `populate` may or may not have run depending on the caller, so both shapes are
 * accepted and an unpopulated reference degrades to `""` rather than rendering
 * `[object Object]`.
 */
function categoryName(value: unknown): string {
  if (value && typeof value === "object" && "category_name" in value) {
    return String((value as { category_name: unknown }).category_name ?? "");
  }
  return "";
}

/**
 * The same reference, read for its `slug`.
 *
 * Separate from `categoryName` rather than one function returning both, because
 * the slug is only ever wanted where a link is being built and `populate` selects
 * the fields — the product page needs the slug to query its siblings, and the
 * grid does not, so the projection is deliberately not widened for every caller.
 */
function categorySlug(value: unknown): string {
  if (value && typeof value === "object" && "slug" in value) {
    return String((value as { slug: unknown }).slug ?? "");
  }
  return "";
}

function str(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function num(value: unknown, fallback = 0): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

/** The only place snake_case and `ObjectId` knowledge lives. */
export function toProduct(doc: Doc): Product {
  const badge = str(doc.badge);

  return {
    id: String(doc._id ?? ""),
    name: str(doc.product_name),
    subtitle: str(doc.subtitle),
    vendor: str(doc.vendor),
    price: num(doc.price),
    image: str(doc.image_url),
    // Fall back to a portrait 3:4 so a missing intrinsic size still reserves
    // roughly the right box instead of collapsing the layout.
    width: num(doc.image_width, 600),
    height: num(doc.image_height, 800),
    reviews: str(doc.reviews, "0"),
    rating: num(doc.rating),
    badge: badge || undefined,
    category: categoryName(doc.category),
    categorySlug: categorySlug(doc.category),
    keywords: str(doc.keywords),
    // Clamped to the schema's own 0-100 range: `discount` drives a strikethrough
    // price, and a corrupt document must not be able to render a negative one.
    discount: Math.min(100, Math.max(0, num(doc.discount))),
    quantity: Math.max(0, Math.floor(num(doc.quantity))),
  };
}

export function toCategoryTile(doc: Doc): CategoryTile {
  return {
    id: String(doc._id ?? ""),
    label: str(doc.category_name),
    href: categoryHref(str(doc.slug)),
    icon: str(doc.icon),
  };
}

/* -------------------------------------------------------------------------- */
/* Products                                                                    */
/* -------------------------------------------------------------------------- */

export type ProductPage = {
  products: Product[];
  totalItems: number;
  currentPage: number;
  totalPages: number;
};

/**
 * What an unreachable catalog looks like: one empty page rather than page zero.
 *
 * `totalPages: 1` is deliberate — the grid's own empty state ("No products match
 * your search") is what a visitor should see, not a "page 1 of 0" control.
 */
const EMPTY_PRODUCT_PAGE: ProductPage = {
  products: [],
  totalItems: 0,
  currentPage: 1,
  totalPages: 1,
};

export async function listProducts(options: ProductQueryOptions = {}): Promise<ProductPage> {
  // "All" is a UI sentinel, not a category — it must not reach the query layer
  // or it would be treated as a category type name and match nothing.
  const filter =
    !options.filter || options.filter === ALL_FILTER ? undefined : options.filter;

  return degrade("listProducts", EMPTY_PRODUCT_PAGE, async () => {
    const { docs, totalItems, currentPage, perPage } = await findProducts({
      ...options,
      filter,
    });

    return {
      products: docs.map(toProduct),
      // `excludeId` removes a document without filtering on it, so the count of
      // everything else is still the right number to paginate against.
      totalItems,
      currentPage,
      totalPages: Math.max(1, Math.ceil(totalItems / perPage)),
    };
  });
}

export async function getProduct(id: string): Promise<Product> {
  assertObjectId(id, "product id");

  const doc = await findProductById(id);
  if (!doc) throw new NotFoundError("Product not found");

  return toProduct(doc);
}

/**
 * Products to show under "You may also like".
 *
 * Siblings in the same category, with the product itself removed. Two attempts,
 * because a category can legitimately hold a single product — the seed has one
 * dress and one shirt in several — and an empty rail would look like a bug
 * rather than an empty category. The second pass drops the category constraint
 * and takes whatever else is in the catalog.
 */
export async function listRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  const perPage = Math.min(limit, 12);

  if (product.categorySlug) {
    const { products } = await listProducts({
      categorySlug: product.categorySlug,
      excludeId: product.id,
      limit: perPage,
    });

    if (products.length >= limit) return products;
  }

  const { products } = await listProducts({ excludeId: product.id, limit: perPage });

  return products;
}

export async function suggestProductNames(search: string, limit = 8): Promise<string[]> {
  return findProductNames(search, limit);
}

export async function addProduct(payload: Doc): Promise<Product> {
  const created = await createProduct(payload);
  return toProduct(created);
}

export async function editProduct(id: string, payload: Doc): Promise<Product> {
  assertObjectId(id, "product id");

  const updated = await updateProduct(id, payload);
  if (!updated) throw new NotFoundError("Product not found");

  return toProduct(updated);
}

export async function removeProduct(id: string): Promise<void> {
  assertObjectId(id, "product id");

  const deleted = await deleteProduct(id);
  if (!deleted) throw new NotFoundError("Product not found");
}

/* -------------------------------------------------------------------------- */
/* Categories                                                                  */
/* -------------------------------------------------------------------------- */

/** "Shop by category" tiles for the home page, linked at their own shop page. */
export async function listCategoryTiles(): Promise<CategoryTile[]> {
  return degrade<CategoryTile[]>("listCategoryTiles", [], async () =>
    (await findCategories()).map(toCategoryTile),
  );
}

/**
 * The shop filter bar.
 *
 * Category names come from the `categorytypes` collection, so adding a type in
 * the database adds a tab. `"All"` and `"Discount Deals"` are UI sentinels
 * rather than categories and are appended here — which is also why they are the
 * whole of the fallback: without a database there are no types to offer, but the
 * two sentinels still navigate correctly.
 */
export async function listProductFilters(): Promise<string[]> {
  return degrade<string[]>("listProductFilters", [ALL_FILTER, DEALS_FILTER], async () => {
    const types = await findCategoryTypes();
    const names = types.map((type) => str(type.category_name)).filter(Boolean);

    return [ALL_FILTER, ...names, DEALS_FILTER];
  });
}

export async function getCategory(id: string): Promise<Doc> {
  assertObjectId(id, "category id");

  const doc = await findCategoryById(id);
  if (!doc) throw new NotFoundError("Category not found");

  return doc;
}

export async function getCategoryBySlug(slug: string): Promise<Doc | null> {
  return findCategoryBySlug(slug);
}

export async function addCategory(payload: Doc): Promise<Doc> {
  return createCategory(payload);
}

export async function editCategory(id: string, payload: Doc): Promise<Doc> {
  assertObjectId(id, "category id");

  const updated = await updateCategory(id, payload);
  if (!updated) throw new NotFoundError("Category not found");

  return updated;
}

export async function removeCategory(id: string): Promise<void> {
  assertObjectId(id, "category id");

  const deleted = await deleteCategory(id);
  if (!deleted) throw new NotFoundError("Category not found");
}

/* -------------------------------------------------------------------------- */
/* Category types                                                              */
/* -------------------------------------------------------------------------- */

export async function listCategoryTypeNames(): Promise<ProductFilter[]> {
  return listProductFilters();
}

export async function getCategoryType(id: string): Promise<Doc> {
  assertObjectId(id, "category type id");

  const doc = await findCategoryTypeById(id);
  if (!doc) throw new NotFoundError("Category type not found");

  return doc;
}

export async function addCategoryType(payload: Doc): Promise<Doc> {
  return createCategoryType(payload);
}

export async function editCategoryType(id: string, payload: Doc): Promise<Doc> {
  assertObjectId(id, "category type id");

  const updated = await updateCategoryType(id, payload);
  if (!updated) throw new NotFoundError("Category type not found");

  return updated;
}

export async function removeCategoryType(id: string): Promise<void> {
  assertObjectId(id, "category type id");

  const deleted = await deleteCategoryType(id);
  if (!deleted) throw new NotFoundError("Category type not found");
}

export { DEALS_FILTER };
