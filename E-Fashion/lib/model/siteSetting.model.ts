import mongoose from "mongoose";
import type { Document, Model } from "mongoose";

const { Schema, models } = mongoose;

export interface IPaymentMethod {
  id: string;
  label: string;
}

export interface ISiteSetting extends Document {
  /** Always the literal below — this collection holds exactly one document. */
  singleton: string;
  name: string;
  tagline: string;
  description: string;
  phone: string;
  phoneHref: string;
  email: string;
  address: string[];
  /**
   * Embedded rather than its own collection: a fixed, ordered list of five that
   * is only ever read whole and never queried by value.
   */
  payment_methods: IPaymentMethod[];
}

const PaymentMethodSchema = new Schema<IPaymentMethod>(
  {
    id: { type: String, required: true, trim: true },
    label: { type: String, required: true, trim: true },
  },
  { _id: false },
);

const SiteSettingSchema = new Schema<ISiteSetting>(
  {
    // Unique, so a second insert fails rather than silently creating a rival
    // settings document that `findSiteSettings()` would then read at random.
    singleton: { type: String, required: true, unique: true, default: "site" },
    name: { type: String, required: true, trim: true },
    tagline: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    phone: { type: String, required: true, trim: true },
    /** Digits only, used to build `tel:` links. */
    phoneHref: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    address: { type: [String], required: true },
    payment_methods: { type: [PaymentMethodSchema], required: true, default: [] },
  },
  { timestamps: true },
);

const SiteSetting: Model<ISiteSetting> =
  models.SiteSetting ?? mongoose.model<ISiteSetting>("SiteSetting", SiteSettingSchema);

export default SiteSetting;
