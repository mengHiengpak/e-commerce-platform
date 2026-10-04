import mongoose from "mongoose";
import type { Document, Model } from "mongoose";

const { Schema, models } = mongoose;

/** A card in the promo carousel. */
export interface IPromoSlide extends Document {
  key: string;
  image: string;
  /** Display index, e.g. `"01"`. */
  number: string;
  subtitle: string;
  /** Pre-formatted, e.g. `"60% OFF"`. */
  discount: string;
  href: string;
  position: number;
}

const PromoSlideSchema = new Schema<IPromoSlide>(
  {
    key: { type: String, required: true, trim: true, unique: true },
    image: { type: String, required: true, trim: true },
    number: { type: String, required: true, trim: true },
    subtitle: { type: String, required: true, trim: true },
    discount: { type: String, required: true, trim: true },
    href: { type: String, required: true, trim: true },
    position: { type: Number, required: true, default: 0 },
  },
  { timestamps: true },
);

const PromoSlide: Model<IPromoSlide> =
  models.PromoSlide ?? mongoose.model<IPromoSlide>("PromoSlide", PromoSlideSchema);

export default PromoSlide;
