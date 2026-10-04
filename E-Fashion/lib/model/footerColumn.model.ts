import mongoose from "mongoose";
import type { Document, Model } from "mongoose";

const { Schema, models } = mongoose;

export interface IFooterLink {
  label: string;
  href: string;
}

/**
 * A footer column and its links.
 *
 * The links are embedded rather than referenced: a column is only ever read
 * together with its links, never queried across columns, so a join would buy
 * nothing and cost a round trip.
 */
export interface IFooterColumn extends Document {
  key: string;
  title: string;
  position: number;
  links: IFooterLink[];
}

const FooterLinkSchema = new Schema<IFooterLink>(
  {
    label: { type: String, required: true, trim: true },
    href: { type: String, required: true, trim: true },
  },
  { _id: false },
);

const FooterColumnSchema = new Schema<IFooterColumn>(
  {
    /** Stable upsert key, e.g. `"supports"`. */
    key: { type: String, required: true, trim: true, unique: true },
    title: { type: String, required: true, trim: true },
    position: { type: Number, required: true, default: 0 },
    links: { type: [FooterLinkSchema], required: true, default: [] },
  },
  { timestamps: true },
);

const FooterColumn: Model<IFooterColumn> =
  models.FooterColumn ??
  mongoose.model<IFooterColumn>("FooterColumn", FooterColumnSchema);

export default FooterColumn;
