import type { NextRequest } from "next/server";

import { getSiteChrome, saveSiteInfo } from "@/lib/controller/site.controller";
import { handle, readJsonBody, updated } from "@/lib/http";
import type { Doc } from "@/lib/service/catalog.service";

/**
 * `/api/site`
 *
 * GET returns the whole chrome bundle in one payload — the same object the root
 * layout uses — so a client can hydrate the header and footer from a single
 * request instead of seven.
 */

export async function GET() {
  return handle(async () => getSiteChrome(), "Site settings successfully fetched");
}

export async function PATCH(request: NextRequest) {
  return handle(async () => {
    const body = await readJsonBody<Doc>(request);
    return updated(await saveSiteInfo(body), "Site settings successfully updated");
  });
}
