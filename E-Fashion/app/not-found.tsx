import Link from "next/link";

import { Section, SectionHeading } from "@/components/ui/container";
import { PRIMARY_NAV } from "@/lib/navigation";

/**
 * 404 page.
 *
 * The suggested links come from `lib/navigation`, the same static list the
 * header renders, so a route added to the primary nav is offered here too.
 */
export default function NotFound() {
  return (
    <Section spacing="lg">
      <div className="flex min-h-[55vh] flex-col items-center justify-center gap-6 text-center">
        <p className="text-6xl font-bold tracking-tight tabular-nums sm:text-8xl">
          404
        </p>
        <SectionHeading
          as="h1"
          title="This page has sold out"
          description="The page you are looking for does not exist, or it has moved. Here is where most people were heading."
        />
        <ul className="flex flex-wrap items-center justify-center gap-2">
          {PRIMARY_NAV.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="inline-flex h-11 items-center justify-center rounded-lg border border-neutral-200 px-5 text-sm font-medium transition-colors hover:border-neutral-900 hover:text-white"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
