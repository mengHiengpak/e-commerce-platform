import { Types, isValidObjectId } from "mongoose";

import Category from "@/lib/model/category.model";
import CategoryType from "@/lib/model/categoryType.model";
import Product from "@/lib/model/product.model";
import { ready } from "@/lib/service/ready";

/**
 * Data access for the catalog.
 *
 * Deliberately dumb: it builds Mongo filters, runs queries and returns lean
 * documents. Mapping documents to the shapes in `lib/types.ts` is the
 * controller's job, and HTTP concerns (status codes, envelopes) are the route
 * handlers' job. Nothing here imports Next.js.
 *
 * Every function opens with `ready()`. That is not boilerplate to be trimmed —
 * it is what stops `next build` from prerendering these queries into static HTML.
 */

/** A lean Mongoose document, untyped. Controllers narrow it field by field. */
export type Doc = Record<string, unknown>;

const MAX_LIMIT = 60;

export type ProductQueryOptions = {
  /** Category type name (`"Men Fashion"`) or one of the sentinel filters. */
  filter?: string;
  /** Category slug, from `?category=<slug>`. Applied on top of `filter`. */
  categorySlug?: string;
  /** Free-text search across name, subtitle, vendor and keywords. */
  search?: string;
  page?: number;
  limit?: number;
  /** Drops one product from the result — the product page listing its siblings. */
  excludeId?: string;
};

export type ProductQueryResult = {
  docs: Doc[];
  totalItems: number;
  currentPage: number;
  perPage: number;
};

/**
 * Escapes a user string for safe use inside a RegExp.
 *
 * Without this, searching for `(` throws "Unterminated group", and a pattern
 * like `.*` would match every document.
 */
export function escapeRegExp(input: string): string {
  return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/* -------------------------------------------------------------------------- */
/* Products                                                                    */
/* -------------------------------------------------------------------------- */

export async function findProducts(
  options: ProductQueryOptions = {},
): Promise<ProductQueryResult> {
  await ready();

  const { page = 1, limit = 12, filter, categorySlug, search, excludeId } = options;

  const currentPage = Math.max(1, Math.floor(page));
  const perPage = Math.min(Math.max(1, Math.floor(limit)), MAX_LIMIT);

  // A loose record rather than a Mongoose schema filter, because the keys are
  // built from user input and traverse populated references
  // (`category.categorytype.category_name`), which the strict per-document type
  // cannot express. Mongoose 9 rejects a `mongodb.Filter<Doc>` outright; the
  // narrowing cast below is the seam.
  const query: Record<string, unknown> = {};

  // A malformed id has to be dropped rather than cast: this goes into `_id`,
  // where an invalid ObjectId would turn the whole query into a cast error and
  // 500 the product page. The caller already has a product, so its id is valid,
  // but `excludeId` is a filter option and this is where it is used as one.
  if (excludeId && isValidObjectId(excludeId)) {
    query._id = { $ne: new Types.ObjectId(excludeId) };
  }

  if (filter) {
    if (filter === "Discount Deals") {
      query.discount = { $gt: 0 };
    } else {
      // A category type groups categories, so the match has to traverse the
      // reference rather than hit `category` directly.
      query["category.categorytype.category_name"] = filter;
    }
  }

  if (categorySlug) {
    query["category.slug"] = categorySlug;
  }

  const trimmed = search?.trim();
  if (trimmed) {
    const pattern = new RegExp(escapeRegExp(trimmed), "i");
    query.$or = [
      { product_name: pattern },
      { subtitle: pattern },
      { vendor: pattern },
      { keywords: pattern },
    ];
  }

  const [docs, totalItems] = await Promise.all([
    // Mongoose 9's strict filter type cannot express the dynamically-keyed,
    // reference-traversing query built above, and it no longer exports the
    // `FilterQuery` helper that used to bridge this. `query` only ever contains
    // operators and dotted paths this file wrote, so the cast is the seam.
    Product.find(query as never)
      .populate("category", "category_name slug")
      .sort({ createdAt: -1 })
      .skip((currentPage - 1) * perPage)
      .limit(perPage)
      .lean(),
    Product.countDocuments(query as never),
  ]);

  return { docs: docs as unknown as Doc[], totalItems, currentPage, perPage };
}

export async function findProductById(id: string): Promise<Doc | null> {
  await ready();

  const doc = await Product.findById(id)
    .populate("category", "category_name slug")
    .lean();

  return (doc as unknown as Doc) ?? null;
}

/** Distinct product names matching `search`, for typeahead. */
export async function findProductNames(search: string, limit = 8): Promise<string[]> {
  await ready();

  const trimmed = search.trim();
  if (!trimmed) return [];

  const pattern = new RegExp(escapeRegExp(trimmed), "i");
  const names = await Product.distinct("product_name", { product_name: pattern });

  return names.slice(0, limit);
}

export async function createProduct(payload: Doc): Promise<Doc> {
  await ready();
  const created = await Product.create(payload);
  return created.toObject() as unknown as Doc;
}

export async function updateProduct(id: string, payload: Doc): Promise<Doc | null> {
  await ready();

  const updated = await Product.findByIdAndUpdate(id, payload, {
    returnDocument: "after",
    runValidators: true,
  }).lean();

  return (updated as unknown as Doc) ?? null;
}

export async function deleteProduct(id: string): Promise<Doc | null> {
  await ready();
  const deleted = await Product.findByIdAndDelete(id).lean();
  return (deleted as unknown as Doc) ?? null;
}

/* -------------------------------------------------------------------------- */
/* Categories                                                                  */
/* -------------------------------------------------------------------------- */

export async function findCategories(): Promise<Doc[]> {
  await ready();
  const docs = await Category.find().sort({ createdAt: 1 }).lean();
  return docs as unknown as Doc[];
}

export async function findCategoryById(id: string): Promise<Doc | null> {
  await ready();
  const doc = await Category.findById(id)
    .populate("categorytype", "category_name")
    .lean();

  return (doc as unknown as Doc) ?? null;
}

export async function findCategoryBySlug(slug: string): Promise<Doc | null> {
  await ready();
  const doc = await Category.findOne({ slug: slug.toLowerCase() })
    .populate("categorytype", "category_name")
    .lean();

  return (doc as unknown as Doc) ?? null;
}

export async function createCategory(payload: Doc): Promise<Doc> {
  await ready();
  const created = await Category.create(payload);
  return created.toObject() as unknown as Doc;
}

export async function updateCategory(id: string, payload: Doc): Promise<Doc | null> {
  await ready();

  const updated = await Category.findByIdAndUpdate(id, payload, {
    returnDocument: "after",
    runValidators: true,
  }).lean();

  return (updated as unknown as Doc) ?? null;
}

export async function deleteCategory(id: string): Promise<Doc | null> {
  await ready();
  const deleted = await Category.findByIdAndDelete(id).lean();
  return (deleted as unknown as Doc) ?? null;
}

/* -------------------------------------------------------------------------- */
/* Category types                                                              */
/* -------------------------------------------------------------------------- */

export async function findCategoryTypes(): Promise<Doc[]> {
  await ready();
  const docs = await CategoryType.find().sort({ category_name: 1 }).lean();
  return docs as unknown as Doc[];
}

export async function findCategoryTypeById(id: string): Promise<Doc | null> {
  await ready();
  const doc = await CategoryType.findById(id).lean();
  return (doc as unknown as Doc) ?? null;
}

export async function createCategoryType(payload: Doc): Promise<Doc> {
  await ready();
  const created = await CategoryType.create(payload);
  return created.toObject() as unknown as Doc;
}

export async function updateCategoryType(id: string, payload: Doc): Promise<Doc | null> {
  await ready();

  const updated = await CategoryType.findByIdAndUpdate(id, payload, {
    returnDocument: "after",
    runValidators: true,
  }).lean();

  return (updated as unknown as Doc) ?? null;
}

export async function deleteCategoryType(id: string): Promise<Doc | null> {
  await ready();
  const deleted = await CategoryType.findByIdAndDelete(id).lean();
  return (deleted as unknown as Doc) ?? null;
}
