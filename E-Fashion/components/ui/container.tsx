import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

import { cn } from "@/lib/utils";

type ContainerProps<T extends ElementType> = {
  as?: T;
  className?: string;
  children?: ReactNode;
};

/**
 * Horizontal rhythm for every page section.
 *
 * The padding is fluid (4 -> 6 -> 8) so sections line up with each other at
 * every breakpoint without any per-section one-off padding classes.
 */
export function Container<T extends ElementType = "div">({
  as,
  className,
  children,
  ...props
}: ContainerProps<T> & Omit<ComponentPropsWithoutRef<T>, keyof ContainerProps<T>>) {
  const Comp = (as ?? "div") as ElementType;

  return (
    <Comp
      className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", className)}
      {...props}
    >
      {children}
    </Comp>
  );
}

type SectionProps<T extends ElementType = "section"> = ContainerProps<T> & {
  id?: string;
  /** Vertical rhythm. `none` is for sections already padded by their parent. */
  spacing?: "none" | "sm" | "md" | "lg";
};

const spacingClasses: Record<NonNullable<SectionProps["spacing"]>, string> = {
  none: "",
  sm: "py-8 sm:py-10",
  md: "py-12 sm:py-16 lg:py-20",
  lg: "py-16 sm:py-20 lg:py-28",
};

/**
 * A `<section>` that is already a `<Container>`, so a page can never ship a
 * section whose width differs from its neighbours.
 */
export function Section<T extends ElementType = "section">({
  as,
  className,
  children,
  id,
  spacing = "md",
  ...props
}: SectionProps<T> & Omit<ComponentPropsWithoutRef<T>, keyof SectionProps<T>>) {
  const Comp = (as ?? "section") as ElementType;

  return (
    <Comp id={id} className={cn(spacingClasses[spacing], className)} {...props}>
      <Container className="flex flex-col">{children}</Container>
    </Comp>
  );
}

/**
 * Section heading used by every section so the type scale is identical
 * everywhere: small on phones, full size from `sm` up.
 */
export function SectionHeading({
  eyebrow,
  title,
  description,
  id,
  className,
  align = "center",
  as: Heading = "h2",
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  id?: string;
  className?: string;
  align?: "center" | "start";
  as?: "h1" | "h2" | "h3";
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        align === "center" ? "items-center text-center" : "items-start text-start",
        className,
      )}
    >
      {eyebrow ? (
        <span className="text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase">
          {eyebrow}
        </span>
      ) : null}
      <Heading
        id={id}
        className="text-2xl font-bold tracking-tight text-balance sm:text-3xl md:text-4xl"
      >
        {title}
      </Heading>
      {description ? (
        <p
          className={cn(
            "max-w-2xl text-sm leading-relaxed text-pretty text-muted-foreground sm:text-base",
            align === "center" ? "mx-auto" : undefined,
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
