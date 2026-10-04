import type { NextRequest } from "next/server";

import {
  editProduct,
  getProduct,
  removeProduct,
} from "@/lib/controller/catalog.controller";
import { handle, noContent, readJsonBody, updated } from "@/lib/http";
import type { Doc } from "@/lib/service/catalog.service";

/**
 * `/api/products/[id]`
 *
 * `params` is a Promise in Next.js 16. The id is validated inside the
 * controller (`assertObjectId`), so a malformed id becomes a 400 rather than a
 * BSON cast error surfacing as a 500.
 */

type Context = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Context) {
  const { id } = await params;

  return handle(async () => getProduct(id), "Product fetched successfully");
}

export async function PATCH(request: NextRequest, { params }: Context) {
  const { id } = await params;

  return handle(async () => {
    const body = await readJsonBody<Doc>(request);
    return updated(await editProduct(id, body), "Product successfully updated");
  });
}

export async function DELETE(_request: NextRequest, { params }: Context) {
  const { id } = await params;

  return handle(async () => {
    await removeProduct(id);
    return noContent("Product successfully deleted");
  });
}
