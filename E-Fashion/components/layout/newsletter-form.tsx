"use client";

import { useId, useState } from "react";
import { ArrowRight } from "lucide-react";

/**
 * Newsletter signup.
 *
 * The old footer input had no `name`, no `id` and no label, and its submit
 * button did a bare `preventDefault()` with no feedback. It is now a labelled,
 * validated form that reports its result to the user.
 *
 * There is no backend yet, so this is a client-side success state — wire the
 * `onSubmit` body to your email provider when one exists.
 */
export function NewsletterForm() {
  const inputId = useId();
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const email = String(data.get("email") ?? "").trim();
        setStatus(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? "success" : "error");
      }}
      className="flex flex-col gap-2"
    >
      <label htmlFor={inputId} className="sr-only">
        Email address
      </label>
      <div className="relative">
        <input
          id={inputId}
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          placeholder="Email address"
          aria-invalid={status === "error" || undefined}
          className="h-11 w-full rounded-lg border border-white/15 bg-white/10 ps-3 pe-11 text-sm text-white placeholder:text-gray-500 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-white/60 aria-invalid:border-red-400"
        />
        <button
          type="submit"
          aria-label="Subscribe"
          className="absolute end-1.5 top-1/2 inline-flex size-8 -translate-y-1/2 items-center justify-center rounded-md text-gray-300 transition-colors hover:bg-white/10 hover:text-white"
        >
          <ArrowRight className="size-4" aria-hidden="true" />
        </button>
      </div>

      <p
        role="status"
        aria-live="polite"
        className="min-h-4 text-xs"
      >
        {status === "success" ? (
          <span className="text-emerald-400">Thanks! Check your inbox to confirm.</span>
        ) : status === "error" ? (
          <span className="text-red-400">Please enter a valid email address.</span>
        ) : null}
      </p>
    </form>
  );
}
