/**
 * One-time catalog migration: moves everything that used to live in
 * `lib/data.ts` into MongoDB — the products, categories and category types, and
 * now the site chrome (settings, footer, socials, media, promo slides).
 *
 *     npm run seed
 *
 * Idempotent. Every write is an upsert keyed on a natural identifier —
 * `category_name` for types, `slug` for categories, `product_name` + `vendor`
 * for products, `key`/`code` for the chrome collections — so re-running updates
 * rows in place instead of duplicating them or wiping the collection.
 *
 * Navigation is not seeded: it is a static list in `lib/navigation.ts`.
 *
 * Run with Node directly (no tsx/ts-node): Node 22.18+ strips the types itself,
 * and the models are imported with explicit `.ts` specifiers for that reason.
 */

import mongoose from "mongoose";

import BrandLogo from "../lib/model/brandLogo.model.ts";
import Category from "../lib/model/category.model.ts";
import CategoryType from "../lib/model/categoryType.model.ts";
import EditorialImage from "../lib/model/editorialImage.model.ts";
import FooterColumn from "../lib/model/footerColumn.model.ts";
import Language from "../lib/model/language.model.ts";
import Product from "../lib/model/product.model.ts";
import PromoSlide from "../lib/model/promoSlide.model.ts";
import SiteSetting from "../lib/model/siteSetting.model.ts";
import SocialLink from "../lib/model/socialLink.model.ts";
import { categories, categoryTypes, products } from "./seed-catalog-data.ts";
import {
  brandLogos,
  editorialImages,
  footerColumns,
  languages,
  promoSlides,
  siteSettings,
  socials,
} from "./seed-site-data.ts";

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error("MONGODB_URI is not set. Copy .env.example to .env.local first.");
  process.exit(1);
}

/**
 * Turns an array of documents into a list of idempotent upsert operations.
 *
 * `keyFields` are the fields that identify a document naturally, so re-running
 * updates rather than inserts. They are also the upsert filter, which is why the
 * key has to be genuinely stable — hence slugs and codes rather than titles.
 *
 * Typed loosely rather than per-model: the rows come from plain seed-data
 * objects, and a generic version cannot satisfy Mongoose's strict per-document
 * `UpdateFilter`. The seed author controls both sides, and `syncIndexes()`
 * validates the schema afterwards.
 */
function upserts(
  rows: Record<string, unknown>[],
  keyFields: string[],
) {
  return rows.map((row) => {
    const filter: Record<string, unknown> = {};
    for (const field of keyFields) filter[field] = row[field];

    return {
      updateOne: {
        filter,
        update: { $set: row },
        upsert: true,
      },
    };
  });
}

async function seedSiteChrome() {
  // The settings document is a singleton: one row, matched on `singleton`.
  await SiteSetting.updateOne(
    { singleton: "site" },
    { $set: { ...siteSettings, singleton: "site" } },
    { upsert: true },
  );
  console.log("Site settings: upserted");

  await FooterColumn.bulkWrite(
    upserts(
      footerColumns.map((column, index) => ({ ...column, position: index })),
      ["key"],
    ),
  );
  console.log(`Footer columns: ${footerColumns.length} upserted`);

  await SocialLink.bulkWrite(
    upserts(
      socials.map((social, index) => ({ ...social, position: index })),
      ["key"],
    ),
  );
  console.log(`Social links: ${socials.length} upserted`);

  await Language.bulkWrite(
    upserts(
      languages.map((language, index) => ({ ...language, position: index })),
      ["code"],
    ),
  );
  console.log(`Languages: ${languages.length} upserted`);

  await BrandLogo.bulkWrite(
    upserts(
      brandLogos.map((logo, index) => ({ ...logo, position: index })),
      ["key"],
    ),
  );
  console.log(`Brand logos: ${brandLogos.length} upserted`);

  await EditorialImage.bulkWrite(
    upserts(
      editorialImages.map((image, index) => ({ ...image, position: index })),
      ["key"],
    ),
  );
  console.log(`Editorial images: ${editorialImages.length} upserted`);

  await PromoSlide.bulkWrite(
    upserts(
      promoSlides.map((slide, index) => ({ ...slide, position: index })),
      ["key"],
    ),
  );
  console.log(`Promo slides: ${promoSlides.length} upserted`);
}

async function seedCatalog() {
  await CategoryType.bulkWrite(upserts(categoryTypes, ["category_name"]));
  console.log(`Category types: ${categoryTypes.length} upserted`);

  const typeIds = new Map<string, mongoose.Types.ObjectId>();
  for (const type of await CategoryType.find().lean()) {
    typeIds.set(type.category_name, type._id);
  }

  await Category.bulkWrite(
    upserts(
      categories.map((category) => {
        const categorytype = typeIds.get(category.type);
        if (!categorytype) {
          throw new Error(`Unknown category type "${category.type}"`);
        }

        // `type` and `categorySlug` are seed-only join keys, not schema fields.
        // Spreading first and deleting after keeps the payload explicit instead
        // of relying on rest-destructuring, which trips no-unused-vars.
        const doc: Record<string, unknown> = { ...category, categorytype };
        delete doc.type;

        return doc;
      }),
      ["slug"],
    ),
  );
  console.log(`Categories: ${categories.length} upserted`);

  const categoryIds = new Map<string, mongoose.Types.ObjectId>();
  for (const category of await Category.find().lean()) {
    categoryIds.set(category.slug, category._id);
  }

  await Product.bulkWrite(
    upserts(
      products.map((product) => {
        const category = categoryIds.get(product.categorySlug);
        if (!category) {
          throw new Error(`Unknown category "${product.categorySlug}"`);
        }

        // See above: `categorySlug` is a join key, not a stored field.
        const doc: Record<string, unknown> = { ...product, category };
        delete doc.categorySlug;

        return doc;
      }),
      ["product_name", "vendor"],
    ),
  );
  console.log(`Products: ${products.length} upserted`);
}

async function main() {
  await mongoose.connect(uri as string, { bufferCommands: false });
  console.log(`Connected to ${mongoose.connection.name}`);

  // Chrome first: it is the fastest to verify, so a broken seed fails here
  // before the catalog work starts.
  await seedSiteChrome();
  await seedCatalog();

  // Indexes declared on the schemas (product text search, unique slugs) are
  // otherwise only built on first app request.
  await Promise.all([
    SiteSetting.syncIndexes(),
    FooterColumn.syncIndexes(),
    SocialLink.syncIndexes(),
    Language.syncIndexes(),
    BrandLogo.syncIndexes(),
    EditorialImage.syncIndexes(),
    PromoSlide.syncIndexes(),
    CategoryType.syncIndexes(),
    Category.syncIndexes(),
    Product.syncIndexes(),
  ]);
  console.log("Indexes synced");

  await mongoose.disconnect();
  console.log("Done.");
}

main().catch(async (error: unknown) => {
  console.error(error);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
