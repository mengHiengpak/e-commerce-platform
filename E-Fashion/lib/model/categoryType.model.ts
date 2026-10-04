import mongoose from "mongoose";
import type { Document, Model } from "mongoose";

// Mongoose is CommonJS, so Node's ESM loader cannot see its named exports.
// Destructuring off the default import works under both Node and the bundler.
const { Schema, models } = mongoose;

export interface ICategoryType extends Document {
  category_name: string;
  category_description: string;
}

const CategoryTypeSchema = new Schema<ICategoryType>(
  {
    category_name: { type: String, required: true, trim: true, unique: true },
    category_description: { type: String, default: "" },
  },
  { timestamps: true },
);

const CategoryType: Model<ICategoryType> =
  models.CategoryType ??
  mongoose.model<ICategoryType>("CategoryType", CategoryTypeSchema);

export default CategoryType;