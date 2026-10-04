import mongoose from "mongoose";
import type { Document, Model } from "mongoose";

// Mongoose is CommonJS, so Node's ESM loader cannot see its named exports.
// Destructuring off the default import works under both Node and the bundler.
const { Schema, models } = mongoose;

export interface IProduct extends Document {
  product_name: string;
  subtitle: string;
  vendor: string;
  price: number;
  quantity: number;
  image_url: string;
  image_width: number;
  image_height: number;
  discount: number;
  rating: number;
  reviews: string;
  badge: string;
  keywords: string;
  category: mongoose.Types.ObjectId;
}

const ProductSchema = new Schema<IProduct>(
  {
    product_name: { type: String, required: true, trim: true },
    subtitle: { type: String, required: true, trim: true },
    vendor: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 0, default: 0 },
    image_url: { type: String, required: true },
    // Intrinsic size, so `next/image` is never asked to guess an aspect ratio.
    image_width: { type: Number, required: true, min: 1 },
    image_height: { type: Number, required: true, min: 1 },
    /** Percentage off, 0-100. Anything above 0 counts as a deal. */
    discount: { type: Number, min: 0, max: 100, default: 0 },
    rating: { type: Number, min: 0, max: 5, default: 0 },
    /** Pre-formatted review count, e.g. `"2.2k"`. */
    reviews: { type: String, default: "0" },
    /** Short merchandising label, e.g. `"Sale"`, `"New"`. Empty string = none. */
    badge: { type: String, default: "" },
    keywords: { type: String, default: "" },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true,
    },
  },
  { timestamps: true },
);

// Free-text search across the fields the storefront advertises.
ProductSchema.index({ product_name: "text", subtitle: "text", vendor: "text", keywords: "text" });

// `models.X` keeps the compiled model across dev hot reloads; without the
// guard the second evaluation throws OverwriteModelError.
const Product: Model<IProduct> = models.Product ?? mongoose.model<IProduct>("Product", ProductSchema);

export default Product;