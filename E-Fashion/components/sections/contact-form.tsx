"use client";

import { useId, useState } from "react";

/**
 * Contact form.
 *
 * A client island rather than a page-level `"use client"`, so the rest of the
 * contact page (and the site) stays server-rendered. Submitting validates and
 * reports back; point `onSubmit` at your form endpoint or server action when
 * you have one.
 */
export function ContactForm() {
  const nameId = useId();
  const emailId = useId();
  const messageId = useId();
  const [status, setStatus] = useState<"idle" | "success">("idle");

  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const name = String(data.get("name") ?? "").trim();
        const email = String(data.get("email") ?? "").trim();
        const message = String(data.get("message") ?? "").trim();

        if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !message) {
          setStatus("idle");
          return;
        }

        setStatus("success");
        event.currentTarget.reset();
      }}
      className="flex flex-col gap-4"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor={nameId} className="text-sm font-medium">
            Name
          </label>
          <input
            id={nameId}
            name="name"
            type="text"
            autoComplete="name"
            required
            className="h-11 rounded-lg border border-input bg-background px-3 text-sm outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor={emailId} className="text-sm font-medium">
            Email
          </label>
          <input
            id={emailId}
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            className="h-11 rounded-lg border border-input bg-background px-3 text-sm outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor={messageId} className="text-sm font-medium">
          Message
        </label>
        <textarea
          id={messageId}
          name="message"
          rows={5}
          required
          className="rounded-lg border border-input bg-background p-3 text-sm outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          className="inline-flex h-12 items-center justify-center rounded-lg bg-neutral-900 px-7 text-sm font-semibold text-white transition-colors hover:bg-black"
        >
          Send message
        </button>
        <p role="status" aria-live="polite" className="text-sm">
          {status === "success" ? (
            <span className="text-emerald-600">
              Thanks — we&apos;ll get back to you within one business day.
            </span>
          ) : null}
        </p>
      </div>
    </form>
  );
}
