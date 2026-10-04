import type { NextRequest } from "next/server";

import {
  editCategoryType,
  getCategoryType,
  removeCategoryType,
} from "@/lib/controller/catalog.controller";
import { handle, noContent, readJsonBody, updated } from "@/lib/http";
import type { Doc } from "@/lib/service/catalog.service";

/** `/api/category-types/[id]` */

type Context = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Context) {
  const { id } = await params;

  return handle(
    async () => getCategoryType(id),
    "Category type fetched successfully",
  );
}

export async function PATCH(request: NextRequest, { params }: Context) {
  const { id } = await params;

  return handle(async () => {
    const body = await readJsonBody<Doc>(request);
    return updated(
      await editCategoryType(id, body),
      "Category type successfully updated",
    );
  });
}

export async function DELETE(_request: NextRequest, { params }: Context) {
  const { id } = await params;

  return handle(async () => {
    await removeCategoryType(id);
    return noContent("Category type successfully deleted");
  });
}
