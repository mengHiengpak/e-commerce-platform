import type { Metadata } from "next";

import { ContactPage } from "@/components/sections/contact-page";
import { getSiteInfo } from "@/lib/controller/site.controller";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Questions about sizing, an order that has not arrived, or a wholesale enquiry? Get in touch with the Chic Threads team.",
};

export default async function Contact() {
  // Contact details are no longer a module-level constant: they come from the
  // `sitesettings` collection, so the component has to render after a read.
  const site = await getSiteInfo();

  return <ContactPage site={site} />;
}
