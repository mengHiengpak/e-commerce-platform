import { Clock, Mail, MapPin, Phone } from "lucide-react";

import { Container, Section, SectionHeading } from "@/components/ui/container";
import type { SiteInfo } from "@/lib/types";
import { ContactForm } from "./contact-form";

/**
 * `/contact`
 *
 * This route used to render nothing but the site footer, which meant visiting
 * `/contact` showed a footer and no contact information at all.
 *
 * The contact details are built inside the component rather than at module
 * scope: they come from props read out of MongoDB, and a module-level array
 * would be evaluated once at import time with no access to them.
 */
export function ContactPage({ site }: { site: SiteInfo }) {
  const details = [
    {
      id: "address",
      icon: MapPin,
      label: "Visit us",
      lines: site.address,
      href: undefined,
    },
    {
      id: "phone",
      icon: Phone,
      label: "Call us",
      lines: site.phone ? [site.phone] : [],
      href: site.phoneHref ? `tel:${site.phoneHref}` : undefined,
    },
    {
      id: "email",
      icon: Mail,
      label: "Email us",
      lines: site.email ? [site.email] : [],
      href: site.email ? `mailto:${site.email}` : undefined,
    },
    {
      id: "hours",
      icon: Clock,
      label: "Opening hours",
      lines: ["Mon – Fri, 9am – 6pm", "Saturday, 10am – 4pm"],
      href: undefined,
    },
  ];

  return (
    <>
      <Container className="pt-10 sm:pt-14">
        <SectionHeading
          as="h1"
          align="start"
          eyebrow="Contact"
          title="Talk to us"
          description="Questions about sizing, an order that has not arrived, or a wholesale enquiry — pick whichever is easiest and we will pick it up from there."
        />
      </Container>

      <Section spacing="md">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:gap-16">
          <div className="flex flex-col gap-6">
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              {details.map((detail) => {
                const Icon = detail.icon;
                return (
                  <li
                    key={detail.id}
                    className="flex gap-4 rounded-2xl border border-neutral-200 p-5"
                  >
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-neutral-100">
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-neutral-900">
                        {detail.label}
                      </p>
                      {detail.lines.map((line) => (
                        <p key={line} className="text-sm break-words text-neutral-500">
                          {detail.href ? (
                            <a
                              href={detail.href}
                              className="transition-colors hover:text-neutral-900"
                            >
                              {line}
                            </a>
                          ) : (
                            line
                          )}
                        </p>
                      ))}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="min-w-0 rounded-2xl border border-neutral-200 p-6 sm:p-8">
            <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
              Send us a message
            </h2>
            <p className="mt-2 mb-6 text-sm text-muted-foreground">
              Fill in the form and we will reply to your email address.
            </p>
            <ContactForm />
          </div>
        </div>
      </Section>
    </>
  );
}
