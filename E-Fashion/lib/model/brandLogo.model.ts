import mongoose from "mongoose";
import type { Document, Model } from "mongoose";

const { Schema, models } = mongoose;

/**
 * A brand logo for the marquee strip.
 *
 * `width`/`height` are the file's intrinsic pixels. `next/image` needs them to
 * reserve layout space, so they are data, not presentation.
 */
export interface IBrandLogo extends Document {
  key: string;
  name: string;
  src: string;
  width: number;
  height: number;
  position: number;
}

const BrandLogoSchema = new Schema<IBrandLogo>(
  {
    key: { type: String, required: true, trim: true, unique: true },
    name: { type: String, required: true, trim: true },
    /** Path under `public/`, e.g. `"/nike-3-logo-png-transparent.png"`. */
    src: { type: String, required: true, trim: true },
    width: { type: Number, required: true, min: 1 },
    height: { type: Number, required: true, min: 1 },
    position: { type: Number, required: true, default: 0 },
  },
  { timestamps: true },
);

const BrandLogo: Model<IBrandLogo> =
  models.BrandLogo ?? mongoose.model<IBrandLogo>("BrandLogo", BrandLogoSchema);

export default BrandLogo;
