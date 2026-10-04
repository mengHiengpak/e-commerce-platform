import mongoose from "mongoose";
import type { Document, Model } from "mongoose";

// Mongoose is CommonJS, so Node's ESM loader cannot see its named exports.
// Destructuring off the default import works under both Node and the bundler.
const { Schema, models } = mongoose;

export interface ICategory extends Document {
  category_name: string;
  slug: string;
  description: string;
  icon: string;
  categorytype: mongoose.Types.ObjectId;
}

const CategorySchema = new Schema<ICategory>(
  {
    categorytype: {
      type: Schema.Types.ObjectId,
      ref: "CategoryType",
      required: true,
      index: true,
    },
    category_name: { type: String, required: true, trim: true },
    /** URL segment used by `/shop?category=<slug>`. Unique so links stay unambiguous. */
    slug: { type: String, required: true, trim: true, lowercase: true, unique: true },
    description: { type: String, default: "" },
    /** Path to the tile icon in `public/`, e.g. `"/dress.svg"`. */
    icon: { type: String, required: true },
  },
  { timestamps: true },
);

const Category: Model<ICategory> =
  models.Category ?? mongoose.model<ICategory>("Category", CategorySchema);

export default Category;