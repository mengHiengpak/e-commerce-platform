import type { NextRequest } from "next/server";

import {
  editSocialLink,
  getSocialLink,
  removeSocialLink,
} from "@/lib/controller/site.controller";
import { handle, noContent, readJsonBody, updated } from "@/lib/http";
import type { Doc } from "@/lib/service/catalog.service";

/** `/api/social-links/[id]` */

type Context = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Context) {
  const { id } = await params;

  return handle(async () => getSocialLink(id), "Social link fetched successfully");
}

export async function PATCH(request: NextRequest, { params }: Context) {
  const { id } = await params;

  return handle(async () => {
    const body = await readJsonBody<Doc>(request);
    return updated(await editSocialLink(id, body), "Social link successfully updated");
  });
}

export async function DELETE(_request: NextRequest, { params }: Context) {
  const { id } = await params;

  return handle(async () => {
    await removeSocialLink(id);
    return noContent("Social link successfully deleted");
  });
}
