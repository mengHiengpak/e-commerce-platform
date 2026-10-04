import type { Doc } from "@/lib/service/catalog.service";
import { degrade } from "@/lib/service/ready";
import {
  createFooterColumn,
  createSocialLink,
  deleteFooterColumn,
  deleteSocialLink,
  findBrandLogos,
  findEditorialImages,
  findFooterColumnById,
  findFooterColumns,
  findPromoSlides,
  findSiteChromeDocs,
  findSiteSettings,
  findSocialLinkById,
  findSocialLinks,
  updateFooterColumn,
  updateSocialLink,
  upsertSiteSettings,
} from "@/lib/service/site.service";
import {
  type BrandLogo,
  type EditorialImage,
  type FooterColumn,
  type Language,
  type PaymentMethod,
  type PromoSlide,
  type SiteChrome,
  type SiteInfo,
  type SocialLink,
} from "@/lib/types";
import { assertObjectId } from "@/lib/controller/catalog.controller";
import { NotFoundError } from "@/lib/errors";

/**
 * Site chrome business logic.
 *
 * This data used to be hardcoded arrays in `lib/data.ts`. It is now read from
 * MongoDB, so the same "map documents to UI shapes" job applies here as in the
 * catalog controller.
 *
 * Navigation is not here: it lives in `lib/navigation.ts` as a static list.
 *
 * `getSiteChrome()` is called from the root layout, i.e. on every route, so it
 * returns safe fallbacks rather than throwing — a missing settings document
 * should degrade the page, not 500 it.
 */

function str(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function num(value: unknown, fallback = 1): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function strArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

export function toSiteInfo(doc: Doc | null): SiteInfo {
  return {
    name: str("E-Fashion"),
    tagline: str(doc?.tagline, "Style meets substance"),
    description: str(doc?.description),
    phone: str(doc?.phone),
    phoneHref: str(doc?.phoneHref),
    email: str(doc?.email),
    address: strArray(doc?.address),
  };
}

function toFooterLinks(value: unknown): { label: string; href: string }[] {
  if (!Array.isArray(value)) return [];

  return value
    .filter((link): link is Doc => !!link && typeof link === "object")
    .map((link) => ({ label: str(link.label), href: str(link.href) }))
    .filter((link) => link.label && link.href);
}

function toFooterColumns(docs: Doc[]): FooterColumn[] {
  return docs.map((doc) => ({
    id: String(doc._id ?? doc.key ?? ""),
    title: str(doc.title),
    links: toFooterLinks(doc.links),
  }));
}

function toSocials(docs: Doc[]): SocialLink[] {
  return docs.map((doc) => ({
    // `key` rather than `_id`: the footer looks the icon up by key, so a
    // reseeded document must keep the same icon.
    id: str(doc.key, String(doc._id ?? "")),
    label: str(doc.label),
    href: str(doc.href),
  }));
}

export function toLanguages(docs: Doc[]): Language[] {
  return docs.map((doc) => ({
    code: str(doc.code),
    label: str(doc.label),
  }));
}

export function toBrandLogos(docs: Doc[]): BrandLogo[] {
  return docs.map((doc) => ({
    id: str(doc.key, String(doc._id ?? "")),
    name: str(doc.name),
    src: str(doc.src),
    width: num(doc.width, 100),
    height: num(doc.height, 100),
  }));
}

export function toEditorialImages(docs: Doc[]): EditorialImage[] {
  return docs.map((doc) => ({
    id: str(doc.key, String(doc._id ?? "")),
    src: str(doc.src),
    width: num(doc.width, 600),
    height: num(doc.height, 800),
    alt: str(doc.alt),
  }));
}

export function toPromoSlides(docs: Doc[]): PromoSlide[] {
  return docs.map((doc) => ({
    id: str(doc.key, String(doc._id ?? "")),
    image: str(doc.image),
    number: str(doc.number),
    subtitle: str(doc.subtitle),
    discount: str(doc.discount),
    href: str(doc.href, "/shop"),
  }));
}

function toPaymentMethods(raw: unknown): PaymentMethod[] {
  if (!Array.isArray(raw)) return [];

  return raw
    .filter(
      (method): method is { id: string; label: string } =>
        !!method &&
        typeof method === "object" &&
        typeof (method as Doc).id === "string" &&
        typeof (method as Doc).label === "string",
    )
    .map((method) => ({ id: method.id, label: method.label }));
}

/**
 * Everything the header, footer and mobile drawer need.
 *
 * Falls back to empty lists rather than throwing: this runs in the root layout,
 * so an exception here takes down every route in the app. That covers the read
 * failing and not just a document being absent — an unreachable database, a
 * missing `MONGODB_URI` or a dropped connection would otherwise replace every
 * page with Next's "This page couldn't load" screen, which is what a thrown
 * error from here produces.
 */
export async function getSiteChrome(): Promise<SiteChrome> {
  try {
    const docs = await findSiteChromeDocs();

    return {
      site: toSiteInfo(docs.site),
      languages: toLanguages(docs.languages),
      footerColumns: toFooterColumns(docs.footerColumns),
      socials: toSocials(docs.socials),
      paymentMethods: toPaymentMethods(docs.site?.payment_methods),
    };
  } catch (error) {
    // Logged rather than swallowed: the page still renders, but the reason the
    // chrome is empty belongs in the server log.
    console.error("getSiteChrome: falling back to empty chrome", error);

    return {
      site: toSiteInfo(null),
      languages: [],
      footerColumns: [],
      socials: [],
      paymentMethods: [],
    };
  }
}

export async function getSiteInfo(): Promise<SiteInfo> {
  return degrade<SiteInfo>("getSiteInfo", toSiteInfo(null), async () =>
    toSiteInfo(await findSiteSettings()),
  );
}

export async function saveSiteInfo(payload: Doc): Promise<SiteInfo> {
  return toSiteInfo(await upsertSiteSettings(payload));
}

export async function listFooterColumns(): Promise<FooterColumn[]> {
  return toFooterColumns(await findFooterColumns());
}

export async function getFooterColumn(id: string): Promise<FooterColumn> {
  assertObjectId(id, "footer column id");

  const doc = await findFooterColumnById(id);
  if (!doc) throw new NotFoundError("Footer column not found");

  return toFooterColumns([doc])[0];
}

export async function addFooterColumn(payload: Doc): Promise<FooterColumn> {
  return toFooterColumns([await createFooterColumn(payload)])[0];
}

export async function editFooterColumn(id: string, payload: Doc): Promise<FooterColumn> {
  assertObjectId(id, "footer column id");

  const updated = await updateFooterColumn(id, payload);
  if (!updated) throw new NotFoundError("Footer column not found");

  return toFooterColumns([updated])[0];
}

export async function removeFooterColumn(id: string): Promise<void> {
  assertObjectId(id, "footer column id");

  const deleted = await deleteFooterColumn(id);
  if (!deleted) throw new NotFoundError("Footer column not found");
}

export async function listSocialLinks(): Promise<SocialLink[]> {
  return toSocials(await findSocialLinks());
}

export async function getSocialLink(id: string): Promise<SocialLink> {
  assertObjectId(id, "social link id");

  const doc = await findSocialLinkById(id);
  if (!doc) throw new NotFoundError("Social link not found");

  return toSocials([doc])[0];
}

export async function addSocialLink(payload: Doc): Promise<SocialLink> {
  return toSocials([await createSocialLink(payload)])[0];
}

export async function editSocialLink(id: string, payload: Doc): Promise<SocialLink> {
  assertObjectId(id, "social link id");

  const updated = await updateSocialLink(id, payload);
  if (!updated) throw new NotFoundError("Social link not found");

  return toSocials([updated])[0];
}

export async function removeSocialLink(id: string): Promise<void> {
  assertObjectId(id, "social link id");

  const deleted = await deleteSocialLink(id);
  if (!deleted) throw new NotFoundError("Social link not found");
}

/**
 * Site media for the home, about and brand pages.
 *
 * Degrading to an empty list is safe here in a way it is not for the catalog: a
 * missing logo strip or promo slide leaves the page's layout intact, whereas a
 * missing product cannot be faked.
 */
export async function listBrandLogos(): Promise<BrandLogo[]> {
  return degrade<BrandLogo[]>("listBrandLogos", [], async () =>
    toBrandLogos(await findBrandLogos()),
  );
}

export async function listEditorialImages(): Promise<EditorialImage[]> {
  return degrade<EditorialImage[]>("listEditorialImages", [], async () =>
    toEditorialImages(await findEditorialImages()),
  );
}

export async function listPromoSlides(): Promise<PromoSlide[]> {
  return degrade<PromoSlide[]>("listPromoSlides", [], async () =>
    toPromoSlides(await findPromoSlides()),
  );
}
