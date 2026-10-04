import Link from "next/link";
import type { IconType } from "react-icons";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaLink,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";

import { Container } from "@/components/ui/container";
import type {
  FooterColumn,
  PaymentMethod,
  SiteInfo,
  SocialLink,
} from "@/lib/types";
import { NewsletterForm } from "./newsletter-form";

// lucide-react no longer ships brand marks, so the social icons come from
// react-icons as before.
const socialIcons = {
  facebook: FaFacebook,
  twitter: FaTwitter,
  youtube: FaYoutube,
  instagram: FaInstagram,
  linkedin: FaLinkedin,
} satisfies Record<string, IconType>;

/**
 * `SocialLink.id` holds the icon key read from the database, which is a plain
 * string rather than a key of `socialIcons`, so the lookup is widened and an
 * unrecognised key falls back to a generic glyph instead of breaking the row.
 */
function socialIcon(key: string): IconType {
  const icons: Record<string, IconType> = socialIcons;

  return icons[key] ?? FaLink;
}

/**
 * Site footer.
 *
 * This used to be `app/contact/page.tsx`, which meant it only rendered on `/`
 * and `/contact` and left the other four routes with no footer at all. It now
 * lives in the root layout.
 *
 * Server Component: only the newsletter form is a client island. Contact
 * details, columns, socials and payment methods arrive as props, read from
 * MongoDB by the layout.
 */
export function SiteFooter({
  site,
  footerColumns,
  socials,
  paymentMethods,
}: {
  site: SiteInfo;
  footerColumns: FooterColumn[];
  socials: SocialLink[];
  paymentMethods: PaymentMethod[];
}) {
  return (
    <footer className="mt-auto bg-neutral-900 text-neutral-400">
      <Container className="py-12 sm:py-14 lg:py-16">
        <div className="grid grid-cols-1 gap-10 border-b border-white/10 pb-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <p className="text-xl font-bold tracking-wide text-white sm:text-2xl">
              E-Fashion
            </p>
            <address className="mt-4 space-y-1 text-sm not-italic">
              {site.address.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </address>
            <div className="mt-4 space-y-1 text-sm">
              <p>
                <a
                  href={`tel:${site.phoneHref}`}
                  className="transition-colors hover:text-white"
                >
                  {site.phone}
                </a>
              </p>
              <p>
                <a
                  href={`mailto:${site.email}`}
                  className="transition-colors hover:text-white"
                >
                  {site.email}
                </a>
              </p>
            </div>

            <ul className="mt-5 flex items-center gap-2">
              {socials.map((social) => {
                const Icon = socialIcon(social.id);
                return (
                  <li key={social.id}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      aria-label={social.label}
                      className="inline-flex size-9 items-center justify-center rounded-full border border-white/10 transition-colors hover:border-white/30 hover:text-white"
                    >
                      <Icon className="size-4" aria-hidden="true" />
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          {footerColumns.map((column) => (
            <nav
              key={column.id}
              aria-label={column.title}
              className="lg:col-span-2"
            >
              <h2 className="mb-4 text-xs font-semibold tracking-wider text-white uppercase">
                {column.title}
              </h2>
              <ul className="space-y-2.5 text-sm">
                {column.links.map((link) => (
                  <li key={`${column.id}-${link.label}`}>
                    <Link
                      href={link.href}
                      className="transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div className="lg:col-span-2">
            <h2 className="mb-4 text-xs font-semibold tracking-wider text-white uppercase">
              Subscribe
            </h2>
            <p className="text-sm leading-relaxed">
              Get updates, hot deals and discounts straight in your inbox.
            </p>
            <div className="mt-4">
              <NewsletterForm />
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-6 pt-8 sm:flex-row sm:justify-between">
          <ul className="flex flex-wrap items-center justify-center gap-2">
            {paymentMethods.map((method) => (
              <li
                key={method.id}
                className="rounded border border-white/15 px-2 py-1 text-[10px] font-semibold tracking-tight text-neutral-300"
              >
                {method.label}
              </li>
            ))}
          </ul>

          <p className="text-center text-xs text-neutral-500 sm:text-end">
            &copy; {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
}
