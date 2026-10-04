import BrandLogo from "@/lib/model/brandLogo.model";
import EditorialImage from "@/lib/model/editorialImage.model";
import FooterColumn from "@/lib/model/footerColumn.model";
import Language from "@/lib/model/language.model";
import PromoSlide from "@/lib/model/promoSlide.model";
import SiteSetting from "@/lib/model/siteSetting.model";
import SocialLink from "@/lib/model/socialLink.model";
import type { Doc } from "@/lib/service/catalog.service";
import { ready } from "@/lib/service/ready";

/**
 * Data access for the site chrome that lives in MongoDB.
 *
 * All of it is read together by the root layout on every request, so
 * `findSiteChromeDocs()` fires the reads concurrently rather than in series.
 */

export async function findSiteSettings(): Promise<Doc | null> {
  await ready();
  const doc = await SiteSetting.findOne({ singleton: "site" }).lean();
  return (doc as unknown as Doc) ?? null;
}

export async function upsertSiteSettings(payload: Doc): Promise<Doc> {
  await ready();
  const updated = await SiteSetting.findOneAndUpdate(
    { singleton: "site" },
    { $set: { ...payload, singleton: "site" } },
    { returnDocument: "after", runValidators: true, upsert: true },
  ).lean();

  return updated as unknown as Doc;
}

export async function findFooterColumns(): Promise<Doc[]> {
  await ready();
  const docs = await FooterColumn.find().sort({ position: 1 }).lean();
  return docs as unknown as Doc[];
}

export async function findFooterColumnByKey(key: string): Promise<Doc | null> {
  await ready();
  const doc = await FooterColumn.findOne({ key }).lean();
  return (doc as unknown as Doc) ?? null;
}

export async function findFooterColumnById(id: string): Promise<Doc | null> {
  await ready();
  const doc = await FooterColumn.findById(id).lean();
  return (doc as unknown as Doc) ?? null;
}

export async function createFooterColumn(payload: Doc): Promise<Doc> {
  await ready();
  const created = await FooterColumn.create(payload);
  return created.toObject() as unknown as Doc;
}

export async function updateFooterColumn(id: string, payload: Doc): Promise<Doc | null> {
  await ready();
  const updated = await FooterColumn.findByIdAndUpdate(id, payload, {
    returnDocument: "after",
    runValidators: true,
  }).lean();
  return (updated as unknown as Doc) ?? null;
}

export async function deleteFooterColumn(id: string): Promise<Doc | null> {
  await ready();
  const deleted = await FooterColumn.findByIdAndDelete(id).lean();
  return (deleted as unknown as Doc) ?? null;
}

export async function findSocialLinks(): Promise<Doc[]> {
  await ready();
  const docs = await SocialLink.find().sort({ position: 1 }).lean();
  return docs as unknown as Doc[];
}

export async function findSocialLinkById(id: string): Promise<Doc | null> {
  await ready();
  const doc = await SocialLink.findById(id).lean();
  return (doc as unknown as Doc) ?? null;
}

export async function createSocialLink(payload: Doc): Promise<Doc> {
  await ready();
  const created = await SocialLink.create(payload);
  return created.toObject() as unknown as Doc;
}

export async function updateSocialLink(id: string, payload: Doc): Promise<Doc | null> {
  await ready();
  const updated = await SocialLink.findByIdAndUpdate(id, payload, {
    returnDocument: "after",
    runValidators: true,
  }).lean();
  return (updated as unknown as Doc) ?? null;
}

export async function deleteSocialLink(id: string): Promise<Doc | null> {
  await ready();
  const deleted = await SocialLink.findByIdAndDelete(id).lean();
  return (deleted as unknown as Doc) ?? null;
}

export async function findLanguages(): Promise<Doc[]> {
  await ready();
  const docs = await Language.find().sort({ position: 1 }).lean();
  return docs as unknown as Doc[];
}

export async function findBrandLogos(): Promise<Doc[]> {
  await ready();
  const docs = await BrandLogo.find().sort({ position: 1 }).lean();
  return docs as unknown as Doc[];
}

export async function findEditorialImages(): Promise<Doc[]> {
  await ready();
  const docs = await EditorialImage.find().sort({ position: 1 }).lean();
  return docs as unknown as Doc[];
}

export async function findPromoSlides(): Promise<Doc[]> {
  await ready();
  const docs = await PromoSlide.find().sort({ position: 1 }).lean();
  return docs as unknown as Doc[];
}

/**
 * The chrome reads in one round of promises.
 *
 * `Promise.all` rather than sequential awaits: these are independent, and the
 * layout waits on all of them anyway, so serialising them would add a network
 * round trip per collection to every page render for nothing.
 */
export async function findSiteChromeDocs(): Promise<{
  site: Doc | null;
  languages: Doc[];
  footerColumns: Doc[];
  socials: Doc[];
  paymentMethods: { id: string; label: string }[];
}> {
  await ready();

  const [site, languages, footerColumns, socials] = await Promise.all([
    findSiteSettings(),
    findLanguages(),
    findFooterColumns(),
    findSocialLinks(),
  ]);

  // Payment methods ride along on the settings document. They are a fixed,
  // never-queried-by-value list of five, so a join to another collection
  // would cost more than it saves.
  const paymentMethods = readPaymentMethods(site);

  return { site, languages, footerColumns, socials, paymentMethods };
}

/** Pulls `payment_methods` off the settings doc defensively. */
function readPaymentMethods(site: Doc | null): { id: string; label: string }[] {
  const raw = site?.payment_methods;

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

