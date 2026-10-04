import { NextResponse } from "next/server";

import { connectDB } from "@/lib/db";

/**
 * `GET /api/health`
 *
 * Diagnostics for the one failure mode this app cannot report on its own.
 *
 * Every read goes through `degrade()`, which turns an unreachable database into
 * empty data rather than an error page. That is the right call for a storefront
 * — but it also means a deployment missing `MONGODB_URI` looks exactly like an
 * empty catalog, with nothing on the page to say so. This route is the
 * difference between "no products" and "no database".
 *
 * It reports three distinct states, because they need three different fixes:
 * - `MONGODB_URI` unset  -> add the env var to the host
 * - connect fails       -> the URI is wrong or the IP allowlist blocks it
 * - connected, 0 docs    -> the cluster is reachable but was never seeded
 *
 * The connection string is never echoed back: only the database name is derived
 * from it, so credentials cannot leak through a public endpoint.
 */

export const dynamic = "force-dynamic";

/** Database name only, taken from the URI path so credentials stay out of it. */
function databaseName(uri: string): string {
  try {
    return new URL(uri.replace(/^mongodb\+srv:\/\//, "mongodb://")).pathname.slice(1);
  } catch {
    return "(unparseable)";
  }
}

export async function GET() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    return NextResponse.json(
      {
        status: "misconfigured",
        database: null,
        error: "MONGODB_URI is not set in this environment",
        collections: {},
      },
      { status: 503 },
    );
  }

  try {
    const connection = await connectDB();

    const names = (await connection.connection.db!.listCollections().toArray()).map(
      (collection) => collection.name,
    );

    const entries = await Promise.all(
      names.map(async (name) => [name, await connection.connection.db!.collection(name).countDocuments()] as const),
    );

    const collections = Object.fromEntries(entries.sort(([a], [b]) => a.localeCompare(b)));
    const totalDocuments = Object.values(collections).reduce((sum, n) => sum + n, 0);

    return NextResponse.json(
      {
        status: totalDocuments > 0 ? "ok" : "empty",
        database: connection.connection.name || databaseName(uri),
        error: null,
        totalDocuments,
        collections,
      },
      { status: totalDocuments > 0 ? 200 : 503 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: "unreachable",
        database: databaseName(uri),
        // The message names the cause (DNS, auth, IP allowlist) without
        // containing the credentials embedded in the URI.
        error: error instanceof Error ? error.message : "Could not reach MongoDB",
        collections: {},
      },
      { status: 503 },
    );
  }
}