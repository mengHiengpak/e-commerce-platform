import { ProductList } from "@/components/sections/product-list";
import {
  listProductFilters,
  listProducts,
} from "@/lib/controller/catalog.controller";
import { ALL_FILTER, FILTER_PARAM, QUERY_PARAM, type ProductFilter } from "@/lib/types";

/**
 * Shop page.
 *
 * `searchParams` is a Promise in Next.js 16 — reading it synchronously no longer
 * works and used to silently yield `undefined`, which is why every filter below
 * fell back to "All". Awaiting it here means the filter, category and search
 * terms actually reach MongoDB on the server.
 *
 * Filtering and pagination live in the controller, which the `/api/products`
 * handler calls too, so the page and the API cannot drift apart.
 */
export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;

  // A repeated query key arrives as an array; the first value is the one clicked.
  const first = (value: string | string[] | undefined) =>
    Array.isArray(value) ? value[0] : value;

  const activeFilter = (first(params[FILTER_PARAM]) as ProductFilter) || ALL_FILTER;
  const categorySlug = first(params["category"]);
  const query = first(params[QUERY_PARAM]);

  const [filters, { products }] = await Promise.all([
    listProductFilters(),
    listProducts({ filter: activeFilter, categorySlug, search: query }),
  ]);

  return (
    <ProductList
      items={products}
      filters={filters}
      activeFilter={activeFilter}
      categorySlug={categorySlug}
      query={query}
    />
  );
}
