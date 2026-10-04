import mongoose from "mongoose";
import type { Document, Model } from "mongoose";

const { Schema, models } = mongoose;

export interface ILanguage extends Document {
  /** ISO code, e.g. `"en"`. */
  code: string;
  label: string;
  position: number;
}

const LanguageSchema = new Schema<ILanguage>(
  {
    code: { type: String, required: true, trim: true, lowercase: true, unique: true },
    label: { type: String, required: true, trim: true },
    position: { type: Number, required: true, default: 0 },
  },
  { timestamps: true },
);

const Language: Model<ILanguage> =
  models.Language ?? mongoose.model<ILanguage>("Language", LanguageSchema);

export default Language;
