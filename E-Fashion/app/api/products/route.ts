import type { NextRequest } from "next/server";

import {
  addProduct,
  listProducts,
} from "@/lib/controller/catalog.controller";
import { created, handle, readJsonBody } from "@/lib/http";
import type { Doc } from "@/lib/service/catalog.service";

/**
 * `/api/products`
 *
 * The handler does three things: read query params, call the controller, wrap
 * the result. Status codes and the response envelope come from `lib/http`, so
 * there is no try/catch here.
 */

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;

  return handle(async () => {
    const page = await listProducts({
      filter: params.get("filter") ?? undefined,
      categorySlug: params.get("category") ?? undefined,
      search: params.get("q") ?? undefined,
      page: Number(params.get("page")) || 1,
      limit: Number(params.get("limit")) || 12,
    });

    return {
      totalItems: page.totalItems,
      totalPages: page.totalPages,
      currentPage: page.currentPage,
      data: page.products,
    };
  }, "Products successfully fetched");
}

export async function POST(request: NextRequest) {
  return handle(async () => {
    const body = await readJsonBody<Doc>(request);
    return created(await addProduct(body), "Product successfully created");
  });
}
