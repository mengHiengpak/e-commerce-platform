import type { NextRequest } from "next/server";

import { addCategoryType } from "@/lib/controller/catalog.controller";
import { created, handle, readJsonBody } from "@/lib/http";
import { findCategoryTypes, type Doc } from "@/lib/service/catalog.service";

/**
 * `/api/category-types`
 *
 * GET returns the raw stored types. The shop filter bar (`All` / type names /
 * `Discount Deals`) is a UI concern and lives in `listProductFilters`; exposing
 * that here too would mean clients had to know which entries are real.
 *
 * Route files may only export HTTP verbs — Next rejects anything else, so the
 * filter-bar helper is re-exported from the controller, not from here.
 */

export async function GET() {
  return handle(async () => {
    const data = await findCategoryTypes();
    return { totalItems: data.length, data };
  }, "Category types successfully fetched");
}

export async function POST(request: NextRequest) {
  return handle(async () => {
    const body = await readJsonBody<Doc>(request);
    return created(await addCategoryType(body), "Category type successfully created");
  });
}
