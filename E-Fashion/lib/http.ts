import { NextResponse } from "next/server";

import { toAppError, ValidationError } from "@/lib/errors";

/**
 * One response envelope for the whole API, so every client can branch the same
 * way: `{ success, message, result }`.
 */

export function ok<T>(result: T, message = "Request successful", status = 200) {
  return NextResponse.json({ success: true, message, result }, { status });
}

export function created<T>(result: T, message = "Resource created") {
  return ok(result, message, 201);
}

/** 200 for a mutation of an existing resource — PATCH/PUT are not creations. */
export function updated<T>(result: T, message = "Resource updated") {
  return ok(result, message, 200);
}

export function noContent(message = "Resource deleted") {
  return NextResponse.json({ success: true, message, result: null });
}

/**
 * Runs a handler body and turns any throw into a JSON error response.
 *
 * Wrapping each export in this is what keeps the API route files down to a
 * couple of lines: the try/catch and the status-code guessing live here once.
 */
export async function handle<T>(
  run: () => Promise<T>,
  message = "Request successful",
): Promise<NextResponse> {
  try {
    const result = await run();
    // A handler that already built a response (e.g. 404) passes it straight
    // through rather than being re-wrapped.
    if (result instanceof NextResponse) return result;

    return ok(result, message);
  } catch (error) {
    const { message: text, status } = toAppError(error);
    return NextResponse.json({ success: false, message: text }, { status });
  }
}

/** Reads a JSON body, rejecting an empty or malformed one with a 400. */
export async function readJsonBody<T>(request: Request): Promise<T> {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    throw new ValidationError("Request body must be valid JSON");
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    throw new ValidationError("Please provide valid request body parameters");
  }

  if (Object.keys(body as object).length === 0) {
    throw new ValidationError("Please provide valid request body parameters");
  }

  return body as T;
}
