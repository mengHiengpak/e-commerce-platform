"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

const pad = (value: number) => String(value).padStart(2, "0");

/**
 * Deal window: the coming Sunday at midnight, local time.
 *
 * Derived from the clock rather than seeded with a literal. The old version
 * started at a hardcoded 4d 12h 34m 30s and counted down once per mount, so
 * every reload handed the visitor a fresh four days and it never reached zero.
 * `getTarget()` is passed in as a prop so a real campaign deadline can replace
 * it without touching the ticking logic.
 */
function getSundayMidnight(now = new Date()): Date {
  const target = new Date(now);
  const daysUntilSunday = (7 - now.getDay()) % 7;
  target.setDate(now.getDate() + daysUntilSunday);
  target.setHours(0, 0, 0, 0);
  // Already past midnight on Sunday: aim at next week.
  if (target <= now) target.setDate(target.getDate() + 7);
  return target;
}

function timeLeft(target: Date) {
  const ms = Math.max(0, target.getTime() - Date.now());

  return {
    days: Math.floor(ms / 86_400_000),
    hours: Math.floor(ms / 3_600_000) % 24,
    minutes: Math.floor(ms / 60_000) % 60,
    seconds: Math.floor(ms / 1_000) % 60,
  };
}

/**
 * Countdown to the end of the week.
 *
 * Laid out as a `grid-cols-4` grid instead of a flex row of four fixed
 * `w-16` boxes. The old version needed 292px of boxes plus 36px of gaps plus
 * 32px of padding — 360px in total, so it overflowed every phone narrower
 * than that. The grid now shares whatever width it is given.
 */
export function CountDown({ getTarget = getSundayMidnight }: { getTarget?: () => Date }) {
  const [remaining, setRemaining] = useState(() => timeLeft(getTarget()));

  useEffect(() => {
    const target = getTarget();

    const timer = window.setInterval(() => {
      const next = timeLeft(target);
      setRemaining(next);
      // Stop ticking once it has expired rather than spinning forever at zero.
      if (next.days === 0 && next.hours === 0 && next.minutes === 0 && next.seconds === 0) {
        window.clearInterval(timer);
      }
    }, 1000);

    return () => window.clearInterval(timer);
  }, [getTarget]);

  const units = [
    { label: "Days", value: pad(remaining.days) },
    { label: "Hours", value: pad(remaining.hours) },
    { label: "Minutes", value: pad(remaining.minutes) },
    { label: "Seconds", value: pad(remaining.seconds) },
  ];

  const total = `${remaining.days}d ${remaining.hours}h ${remaining.minutes}m ${remaining.seconds}s`;

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold text-neutral-800 sm:text-xl">
        Hurry, before it&apos;s too late
      </h3>

      <dl
        className="mt-4 grid max-w-sm grid-cols-4 gap-2 sm:gap-3"
        role="timer"
        aria-label="Time remaining in the sale"
        aria-live="off"
      >
        {units.map((unit) => (
          <div key={unit.label} className="flex flex-col items-center gap-1.5">
            <dd
              className={cn(
                "flex aspect-square w-full max-w-20 items-center justify-center rounded-2xl",
                "border border-neutral-100 bg-background shadow-sm",
              )}
            >
              <span className="font-mono text-xl font-medium tracking-wider text-neutral-800 tabular-nums sm:text-3xl">
                {unit.value}
              </span>
            </dd>
            <dt className="text-[11px] font-normal text-neutral-500 sm:text-sm">
              {unit.label}
            </dt>
          </div>
        ))}
      </dl>

      <p className="sr-only">{total}</p>
    </div>
  );
}
