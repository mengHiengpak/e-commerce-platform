import mongoose from "mongoose";
import type { Document, Model } from "mongoose";

const { Schema, models } = mongoose;

/** An editorial photo for the "About us" gallery. */
export interface IEditorialImage extends Document {
  key: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  position: number;
}

const EditorialImageSchema = new Schema<IEditorialImage>(
  {
    key: { type: String, required: true, trim: true, unique: true },
    src: { type: String, required: true, trim: true },
    /** Required, not optional: an unserved image is a WCAG failure. */
    alt: { type: String, required: true, trim: true },
    width: { type: Number, required: true, min: 1 },
    height: { type: Number, required: true, min: 1 },
    position: { type: Number, required: true, default: 0 },
  },
  { timestamps: true },
);

const EditorialImage: Model<IEditorialImage> =
  models.EditorialImage ??
  mongoose.model<IEditorialImage>("EditorialImage", EditorialImageSchema);

export default EditorialImage;
