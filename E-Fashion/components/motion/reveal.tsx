"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import SplitText from "gsap/SplitText";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

gsap.registerPlugin(useGSAP, SplitText);

const EASE = "expo.out";

/** The OS-level "reduce motion" switch, read inside the layout effect. */
const reduceMotionQuery = "(prefers-reduced-motion: reduce)";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /**
   * `self` animates the wrapper. `items` animates every descendant marked with
   * `data-reveal-item`, which is how the grids stagger in.
   */
  mode?: "self" | "items";
  /** Where the element starts, as a percentage of its own height. */
  yPercent?: number;
  y?: number;
  duration?: number;
  delay?: number;
  stagger?: number;
};

/**
 * Scroll-triggered entrance animation, wrapped in a client island so the markup
 * around it can stay a Server Component.
 *
 * Mark direct children with `data-reveal-item` to stagger them:
 *
 * ```tsx
 * <Reveal mode="items">
 *   <ul>
 *     <li data-reveal-item>…</li>
 *   </ul>
 * </Reveal>
 * ```
 */
export function Reveal({
  children,
  className,
  mode = "self",
  yPercent = 12,
  y,
  duration = 0.9,
  delay = 0,
  stagger = 0.08,
}: RevealProps) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia(reduceMotionQuery).matches) return;

      const targets =
        mode === "items"
          ? (root.current?.querySelectorAll("[data-reveal-item]") ?? [])
          : [root.current].filter(Boolean);

      if (!targets.length) return;

      gsap.from(targets, {
        autoAlpha: 0,
        y: y ?? 0,
        yPercent: mode === "items" ? 0 : yPercent,
        duration,
        delay,
        ease: EASE,
        stagger,
        clearProps: "transform,opacity,visibility",
      });
    },
    { scope: root, dependencies: [mode, yPercent, y, duration, delay, stagger] },
  );

  return (
    <div ref={root} className={className}>
      {children}
    </div>
  );
}

type RevealTextProps = {
  children: ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p";
  id?: string;
  delay?: number;
  stagger?: number;
};

/**
 * Reveals copy line by line.
 *
 * Two things the previous implementation got wrong are fixed here:
 * `mask: "lines"` gives each line an overflow-hidden wrapper so the text is
 * actually clipped as it slides in, and `autoSplit: true` re-splits on resize
 * and font load, so the animation stays correct when the copy reflows at a
 * different breakpoint.
 */
export function RevealText({
  children,
  className,
  as: Tag = "h2",
  id,
  delay = 0,
  stagger = 0.08,
}: RevealTextProps) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia(reduceMotionQuery).matches) return;
      if (!root.current) return;

      const split = new SplitText(root.current, {
        type: "lines",
        mask: "lines",
        autoSplit: true,
        linesClass: "reveal-line",
        onSplit: (self) =>
          gsap.from(self.lines, {
            yPercent: 110,
            autoAlpha: 0,
            duration: 1,
            delay,
            ease: EASE,
            stagger,
          }),
      });

      return () => split.revert();
    },
    { scope: root, dependencies: [delay, stagger] },
  );

  return (
    <Tag
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={root as any}
      id={id}
      className={cn(className)}
    >
      {children}
    </Tag>
  );
}
