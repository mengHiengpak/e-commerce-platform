/**
 * Seed data for the catalog collections.
 *
 * Extracted from the original `scripts/seed.ts` so that script is only about
 * *how* to write, not *what* to write.
 */

export const categoryTypes = [
  {
    category_name: "Women Fashion",
    category_description: "Dresses, skirts and knitwear.",
  },
  {
    category_name: "Men Fashion",
    category_description: "Shirts, trousers and outerwear.",
  },
  {
    category_name: "Accessories",
    category_description: "Shoes, bags and finishing touches.",
  },
  {
    category_name: "Kids Fashion",
    category_description: "Durable, playful pieces for little ones.",
  },
];

export const categories = [
  { slug: "dresses", category_name: "Dresses", icon: "/dress.svg", type: "Women Fashion" },
  { slug: "skirts", category_name: "Skirts", icon: "/dress.svg", type: "Women Fashion" },
  { slug: "knitwear", category_name: "Knitwear", icon: "/shirt.svg", type: "Women Fashion" },
  { slug: "shirts", category_name: "Shirts", icon: "/shirt.svg", type: "Men Fashion" },
  { slug: "trousers", category_name: "Trousers", icon: "/jeans.svg", type: "Men Fashion" },
  { slug: "jackets", category_name: "Jackets", icon: "/jeans.svg", type: "Men Fashion" },
  { slug: "jeans", category_name: "Jeans", icon: "/jeans.svg", type: "Men Fashion" },
  { slug: "shoes", category_name: "Shoes", icon: "/running-shoe.svg", type: "Accessories" },
  { slug: "bags", category_name: "Bags", icon: "/cartoon-handbag.svg", type: "Accessories" },
  { slug: "kids-wear", category_name: "Kids Wear", icon: "/shirt.svg", type: "Kids Fashion" },
];

/**
 * `image_width`/`image_height` are the intrinsic sizes of the files in `public/`.
 * The old hardcoded data carried a `badge` of "Sale" but no percentage, so a
 * discount is supplied here — the "Discount Deals" tab matches on `discount > 0`.
 */
export const products = [
  {
    product_name: "Radiant Gown",
    subtitle: "Satin evening gown with a fluid drape",
    vendor: "Al Madina Shop",
    price: 23.5,
    quantity: 12,
    image_url: "/39A4138_46a232e7-4b67-4aea-b3e1-f8b3a9d18b00.webp",
    image_width: 1174,
    image_height: 2087,
    discount: 20,
    rating: 5,
    reviews: "2.2k",
    badge: "Sale",
    keywords: "gown dress evening formal satin",
    categorySlug: "dresses",
  },
  {
    product_name: "Linen Everyday Shirt",
    subtitle: "Relaxed linen shirt for everyday wear",
    vendor: "Northline Studio",
    price: 39.0,
    quantity: 30,
    image_url: "/OIP.webp",
    image_width: 600,
    image_height: 800,
    discount: 0,
    rating: 4,
    reviews: "1.1k",
    badge: "",
    keywords: "shirt linen men casual",
    categorySlug: "shirts",
  },
  {
    product_name: "Pleated Midi Skirt",
    subtitle: "Knife-pleated midi skirt",
    vendor: "Maison Rue",
    price: 54.0,
    quantity: 18,
    image_url: "/OIP (1).webp",
    image_width: 474,
    image_height: 712,
    discount: 15,
    rating: 5,
    reviews: "860",
    badge: "Sale",
    keywords: "skirt pleated midi women",
    categorySlug: "skirts",
  },
  {
    product_name: "Tailored Trousers",
    subtitle: "Sharp tailored trousers in a neutral tone",
    vendor: "Northline Studio",
    price: 68.0,
    quantity: 22,
    image_url: "/OIP (2).webp",
    image_width: 474,
    image_height: 711,
    discount: 0,
    rating: 4,
    reviews: "540",
    badge: "",
    keywords: "trousers tailored men office",
    categorySlug: "trousers",
  },
  {
    product_name: "Merino Knit Cardigan",
    subtitle: "Fine-gauge merino cardigan",
    vendor: "Maison Rue",
    price: 72.5,
    quantity: 15,
    image_url: "/OIP (3).webp",
    image_width: 474,
    image_height: 711,
    discount: 0,
    rating: 5,
    reviews: "1.4k",
    badge: "",
    keywords: "cardigan knit merino wool women",
    categorySlug: "knitwear",
  },
  {
    product_name: "Relaxed Denim Jacket",
    subtitle: "Unstructured denim jacket with a relaxed fit",
    vendor: "Al Madina Shop",
    price: 89.0,
    quantity: 9,
    image_url: "/OIP (4).webp",
    image_width: 474,
    image_height: 592,
    discount: 25,
    rating: 4,
    reviews: "980",
    badge: "Sale",
    keywords: "denim jacket men relaxed",
    categorySlug: "jackets",
  },
];
