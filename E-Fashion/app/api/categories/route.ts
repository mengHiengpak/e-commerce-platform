import type { NextRequest } from "next/server";

import { addCategory, listCategoryTiles } from "@/lib/controller/catalog.controller";
import { created, handle, readJsonBody } from "@/lib/http";
import type { Doc } from "@/lib/service/catalog.service";

/** `/api/categories` — the shop-by-category tiles. */

export async function GET() {
  return handle(async () => {
    const data = await listCategoryTiles();
    return { totalItems: data.length, data };
  }, "Categories successfully fetched");
}

export async function POST(request: NextRequest) {
  return handle(async () => {
    const body = await readJsonBody<Doc>(request);
    return created(await addCategory(body), "Category successfully created");
  });
}
