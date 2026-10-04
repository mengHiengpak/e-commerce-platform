/**
 * Error types that carry an HTTP status.
 *
 * Services throw these; the API layer turns them into a status code. Without
 * them every handler has to re-derive "is this the caller's fault or ours?" from
 * a Mongoose error name, which is what the `error.name === "ValidationError"`
 * checks in the route handlers used to do.
 */

export class AppError extends Error {
  readonly status: number;

  constructor(message: string, status = 500) {
    super(message);
    this.name = "AppError";
    this.status = status;
  }
}

/** The request itself was wrong: bad id, missing body, failed validation. */
export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400);
    this.name = "ValidationError";
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Resource not found") {
    super(message, 404);
    this.name = "NotFoundError";
  }
}

/**
 * MongoDB could not be reached.
 *
 * Separate from a generic 500 because it is the one infrastructure failure a
 * render is allowed to survive: reads go through `degrade()` in
 * `lib/service/ready.ts` and fall back to empty data instead of taking the page
 * down, while the API answers 503 — which tells a client the request is worth
 * retrying, unlike a 500.
 *
 * The Mongoose error is kept as `cause` rather than folded into the message, so a
 * connection string can never reach a response body; the full reason is logged
 * server-side instead.
 */
export class DatabaseUnavailableError extends AppError {
  constructor(message = "The store is temporarily unavailable", cause?: unknown) {
    super(message, 503);
    this.name = "DatabaseUnavailableError";
    if (cause !== undefined) this.cause = cause;
  }
}

/**
 * Normalises anything thrown into `{ message, status }`.
 *
 * A Mongoose `ValidationError` or duplicate-key error is the caller's fault
 * (400); a missing `MONGODB_URI` is ours (503, so clients retry rather than give
 * up). Unknown throws become 500 with a generic message so internals never leak to
 * the client.
 */
export function toAppError(error: unknown): { message: string; status: number } {
  if (error instanceof AppError) {
    return { message: error.message, status: error.status };
  }

  if (error instanceof Error) {
    const isCallerFault =
      error.name === "ValidationError" || /duplicate key/i.test(error.message);

    if (isCallerFault) return { message: error.message, status: 400 };

    return { message: "An unexpected error occurred", status: 500 };
  }

  return { message: "An unknown error occurred", status: 500 };
}
