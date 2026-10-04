import type { NextRequest } from "next/server";

import {
  editFooterColumn,
  getFooterColumn,
  removeFooterColumn,
} from "@/lib/controller/site.controller";
import { handle, noContent, readJsonBody, updated } from "@/lib/http";
import type { Doc } from "@/lib/service/catalog.service";

/** `/api/footer-columns/[id]` */

type Context = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Context) {
  const { id } = await params;

  return handle(
    async () => getFooterColumn(id),
    "Footer column fetched successfully",
  );
}

export async function PATCH(request: NextRequest, { params }: Context) {
  const { id } = await params;

  return handle(async () => {
    const body = await readJsonBody<Doc>(request);
    return updated(
      await editFooterColumn(id, body),
      "Footer column successfully updated",
    );
  });
}

export async function DELETE(_request: NextRequest, { params }: Context) {
  const { id } = await params;

  return handle(async () => {
    await removeFooterColumn(id);
    return noContent("Footer column successfully deleted");
  });
}
