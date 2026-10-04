"use client";

import Link from "next/link";
import { useId, useState } from "react";

import { Container, Section, SectionHeading } from "@/components/ui/container";

/**
 * Sign in / register card.
 *
 * `/signin` and `/register` were linked from the header but neither route
 * existed, so both links 404'd. There is no auth backend yet, so submitting
 * reports back locally; swap the `onSubmit` body for your auth call.
 */
function AuthForm({ mode }: { mode: "signin" | "register" }) {
  const isRegister = mode === "register";
  const nameId = useId();
  const emailId = useId();
  const passwordId = useId();
  const [submitted, setSubmitted] = useState(false);

  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(true);
      }}
      className="flex w-full flex-col gap-4 rounded-2xl border border-neutral-200 bg-background p-6 shadow-sm sm:p-8"
    >
      {isRegister ? (
        <div className="flex flex-col gap-1.5">
          <label htmlFor={nameId} className="text-sm font-medium">
            Full name
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
      ) : null}

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

      <div className="flex flex-col gap-1.5">
        <label htmlFor={passwordId} className="text-sm font-medium">
          Password
        </label>
        <input
          id={passwordId}
          name="password"
          type="password"
          autoComplete={isRegister ? "new-password" : "current-password"}
          required
          minLength={8}
          className="h-11 rounded-lg border border-input bg-background px-3 text-sm outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-ring"
        />
        {!isRegister ? (
          <Link
            href="/contact"
            className="mt-1 text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground"
          >
            Forgot your password?
          </Link>
        ) : null}
      </div>

      <button
        type="submit"
        className="inline-flex h-12 w-full items-center justify-center rounded-lg bg-neutral-900 px-7 text-sm font-semibold text-white transition-colors hover:bg-black"
      >
        {isRegister ? "Create account" : "Sign in"}
      </button>

      <p role="status" aria-live="polite" className="min-h-5 text-sm">
        {submitted ? (
          <span className="text-emerald-600">
            {isRegister
              ? "Account created — welcome aboard."
              : "Signed in. Redirecting is not wired up yet."}
          </span>
        ) : null}
      </p>

      <p className="text-sm text-muted-foreground">
        {isRegister ? (
          <>
            Already have an account?{" "}
            <Link href="/signin" className="font-medium underline underline-offset-4">
              Sign in
            </Link>
          </>
        ) : (
          <>
            New here?{" "}
            <Link
              href="/register"
              className="font-medium underline underline-offset-4"
            >
              Create an account
            </Link>
          </>
        )}
      </p>
    </form>
  );
}

function AuthPage({ mode }: { mode: "signin" | "register" }) {
  const isRegister = mode === "register";

  return (
    <>
      <Container className="pt-10 sm:pt-14">
        <SectionHeading
          as="h1"
          align="center"
          eyebrow={isRegister ? "Register" : "Welcome back"}
          title={isRegister ? "Create your account" : "Sign in to your account"}
          description={
            isRegister
              ? "Save your favourites, track orders and check out faster."
              : "Sign in to see your orders, saved items and addresses."
          }
        />
      </Container>

      <Section spacing="md">
        <div className="mx-auto w-full max-w-md">
          <AuthForm mode={mode} />
        </div>
      </Section>
    </>
  );
}

export function SignInPage() {
  return <AuthPage mode="signin" />;
}

export function RegisterPage() {
  return <AuthPage mode="register" />;
}
