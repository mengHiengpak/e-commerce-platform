import mongoose from "mongoose";
import type { Document, Model } from "mongoose";

const { Schema, models } = mongoose;

export interface ISocialLink extends Document {
  /** Icon key, e.g. `"instagram"`. Maps to the `socialIcons` record in the footer. */
  key: string;
  label: string;
  href: string;
  position: number;
}

const SocialLinkSchema = new Schema<ISocialLink>(
  {
    key: { type: String, required: true, trim: true, unique: true },
    label: { type: String, required: true, trim: true },
    href: { type: String, required: true, trim: true },
    position: { type: Number, required: true, default: 0 },
  },
  { timestamps: true },
);

const SocialLink: Model<ISocialLink> =
  models.SocialLink ?? mongoose.model<ISocialLink>("SocialLink", SocialLinkSchema);

export default SocialLink;
