/**
 * Shapes the UI renders.
 *
 * These are deliberately decoupled from the Mongoose schemas in `lib/model`.
 * Documents come back snake_cased and with `ObjectId` ids and unpopulated
 * references; `lib/controller` maps them into these camelCased shapes once, so no
 * component ever has to know how Mongo stores a record.
 */

export type Product = {
  id: string;
  name: string;
  /** One-line summary. The product page shows it as the description. */
  subtitle: string;
  vendor: string;
  price: number;
  image: string;
  /** Intrinsic size, so `next/image` is not asked to guess an aspect ratio. */
  width: number;
  height: number;
  reviews: string;
  rating: number;
  badge?: string;
  category: string;
  /** Slug of `category`, so a card can link to its filtered shop page. */
  categorySlug: string;
  keywords: string;
  /** Percentage off `price`, 0-100. The detail page shows the struck-through original. */
  discount: number;
  /** Units in stock. The detail page disables the buy button at 0. */
  quantity: number;
};

/** A "shop by category" tile on the home page. */
export type CategoryTile = {
  id: string;
  label: string;
  href: string;
  icon: string;
};

/**
 * A shop filter value.
 *
 * Not a literal union any more: the category names come from the
 * `categorytypes` collection, so this is whatever the URL carried. The two
 * non-category sentinels are `ALL_FILTER` and `DEALS_FILTER`.
 */
export type ProductFilter = string;

export const ALL_FILTER = "All";
export const DEALS_FILTER = "Discount Deals";

export const CATEGORY_PARAM = "category";
export const FILTER_PARAM = "filter";
export const QUERY_PARAM = "q";

/**
 * Where a single product lives.
 *
 * A function rather than a template string so the id is encoded once, here: an id
 * pasted into a URL bar arrives as an arbitrary string, and every caller that
 * interpolated it into `href={"/productdetail/" + id}` would have to remember
 * that. Also gives the links a single definition to compare against.
 */
export function productHref(id: string): string {
  return `/productdetail/${encodeURIComponent(id)}`;
}

/** The shop page filtered to one category, as reached from a tile or a breadcrumb. */
export function categoryHref(slug: string): string {
  return `/shop?${CATEGORY_PARAM}=${encodeURIComponent(slug)}`;
}

/* -------------------------------------------------------------------------- */
/* Site chrome. These used to be hardcoded arrays in `lib/data.ts` and are now   */
/* read from MongoDB, but the shapes the components consume are unchanged.       */
/* -------------------------------------------------------------------------- */

/**
 * A navigation entry.
 *
 * Declared in `lib/navigation.ts`, which is the single source of truth for the
 * header and the 404 suggestions. No `id`: these used to come from MongoDB and
 * needed a stable key, but the list is now a constant, so `href` is both the
 * identity and the React key.
 */
export type NavLink = {
  label: string;
  href: string;
};

export type SiteInfo = {
  name: string;
  tagline: string;
  description: string;
  phone: string;
  phoneHref: string;
  email: string;
  address: string[];
};

export type FooterColumn = {
  id: string;
  title: string;
  links: { label: string; href: string }[];
};

export type SocialLink = {
  id: string;
  label: string;
  href: string;
};

export type PaymentMethod = {
  id: string;
  label: string;
};

export type Language = {
  code: string;
  label: string;
};

export type BrandLogo = {
  id: string;
  name: string;
  src: string;
  width: number;
  height: number;
};

export type EditorialImage = {
  id: string;
  src: string;
  width: number;
  height: number;
  alt: string;
};

export type PromoSlide = {
  id: string;
  image: string;
  number: string;
  subtitle: string;
  discount: string;
  href: string;
};

/**
 * Everything the header, footer and mobile drawer need, fetched in one go.
 *
 * Bundled into a single object because these are read together on every page,
 * from the root layout — the separate queries per request would be wasteful.
 *
 * Navigation is absent on purpose: it is a static module in `lib/navigation.ts`,
 * not a database read.
 */
export type SiteChrome = {
  site: SiteInfo;
  languages: Language[];
  footerColumns: FooterColumn[];
  socials: SocialLink[];
  paymentMethods: PaymentMethod[];
};
