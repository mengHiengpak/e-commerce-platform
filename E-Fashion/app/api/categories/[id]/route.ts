import type { NextRequest } from "next/server";

import {
  editCategory,
  getCategory,
  removeCategory,
} from "@/lib/controller/catalog.controller";
import { handle, noContent, readJsonBody, updated } from "@/lib/http";
import type { Doc } from "@/lib/service/catalog.service";

/** `/api/categories/[id]` */

type Context = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Context) {
  const { id } = await params;

  return handle(async () => getCategory(id), "Category fetched successfully");
}

export async function PATCH(request: NextRequest, { params }: Context) {
  const { id } = await params;

  return handle(async () => {
    const body = await readJsonBody<Doc>(request);
    return updated(await editCategory(id, body), "Category successfully updated");
  });
}

export async function DELETE(_request: NextRequest, { params }: Context) {
  const { id } = await params;

  return handle(async () => {
    await removeCategory(id);
    return noContent("Category successfully deleted");
  });
}
