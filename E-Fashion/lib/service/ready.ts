import { connection } from "next/server";

import { connectDB, isConnected } from "@/lib/db";
import { DatabaseUnavailableError } from "@/lib/errors";

/**
 * Gate every database read goes through.
 *
 * Two things happen here, in order:
 *
 * 1. `connection()` opts the current render out of static prerendering. Without
 *    it Next runs these queries during `next build` and bakes whatever the
 *    database held that day into a static page.
 * 2. `connectDB()` opens (or reuses) the single shared Mongoose connection.
 *
 * Centralised so no service can forget step one — it is the one bug that is
 * invisible in development and silently ships stale catalog pages to production.
 */
export async function ready(): Promise<void> {
  await connection();
  await connectDB();
}

/**
 * `true` for the error `connection()` throws during `next build`.
 *
 * Prerendering does not fail — it *stops*, by throwing an error carrying the
 * `DYNAMIC_SERVER_USAGE` digest. It has to escape the read that triggered it, or
 * the build bakes whatever `degrade()` returned into a static page and serves it
 * to everyone until the next deploy.
 */
function isPrerenderSignal(error: unknown): boolean {
  if (typeof error !== "object" || error === null || !("digest" in error)) return false;

  const { digest } = error as { digest: unknown };

  return typeof digest === "string" && digest.startsWith("DYNAMIC_SERVER_USAGE");
}

/**
 * Runs a read and falls back when MongoDB is unreachable.
 *
 * Without this a database that is down — or a `MONGODB_URI` pointing at the wrong
 * port, which is the same thing from the app's side — replaces every route with
 * Next's "This page couldn't load" screen and a digest the browser cannot explain.
 * Pages render with empty data instead, and the reason goes to the server log.
 *
 * Only infrastructure failures degrade. A missing document, a malformed id or a
 * failed schema validation still throws, because those are the caller's problem
 * and swallowing them would turn a 404 into a blank page.
 *
 * The `isConnected()` half matters for the failure that arrives *after* a
 * successful connect: Mongoose then raises its own errors ("connection was
 * disconnected", buffering timeouts) rather than the one `connectDB()` wraps, and
 * those are only trustworthy as "database is down" while the connection really is.
 */
export async function degrade<T>(
  label: string,
  fallback: T,
  read: () => Promise<T>,
): Promise<T> {
  try {
    return await read();
  } catch (error) {
    // Never here: it is how the build is told to stop prerendering, and
    // swallowing it is what turns a dynamic page into a static empty one.
    if (isPrerenderSignal(error)) throw error;

    if (!(error instanceof DatabaseUnavailableError) && isConnected()) throw error;

    console.error(`${label}: MongoDB unavailable, serving fallback data`, error);

    return fallback;
  }
}
