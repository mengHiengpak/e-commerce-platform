import type { NextRequest } from "next/server";

import {
  addSocialLink,
  listSocialLinks,
} from "@/lib/controller/site.controller";
import { created, handle, readJsonBody } from "@/lib/http";
import type { Doc } from "@/lib/service/catalog.service";

/** `/api/social-links` */

export async function GET() {
  return handle(async () => {
    const data = await listSocialLinks();
    return { totalItems: data.length, data };
  }, "Social links successfully fetched");
}

export async function POST(request: NextRequest) {
  return handle(async () => {
    const body = await readJsonBody<Doc>(request);
    return created(await addSocialLink(body), "Social link successfully created");
  });
}
