import type { NextRequest } from "next/server";

import {
  addFooterColumn,
  listFooterColumns,
} from "@/lib/controller/site.controller";
import { created, handle, readJsonBody } from "@/lib/http";
import type { Doc } from "@/lib/service/catalog.service";

/** `/api/footer-columns` */

export async function GET() {
  return handle(async () => {
    const data = await listFooterColumns();
    return { totalItems: data.length, data };
  }, "Footer columns successfully fetched");
}

export async function POST(request: NextRequest) {
  return handle(async () => {
    const body = await readJsonBody<Doc>(request);
    return created(await addFooterColumn(body), "Footer column successfully created");
  });
}
