/**
 * Seed data for the site chrome collections.
 *
 * Moved verbatim out of the old `lib/data.ts`, which was deleted in favour of
 * reading all of this from MongoDB. Values are unchanged — same names, same
 * image paths, same intrinsic dimensions — so the rendered site is identical,
 * it is just editable at runtime now.
 *
 * `position` is the explicit sort order. It is written here rather than derived
 * from array order so that reordering in the database does not renumber
 * anything else.
 *
 * Navigation is absent on purpose: it lives in `lib/navigation.ts` as a static
 * list, so there is no `navlinks` collection to seed.
 */

export const siteSettings = {
  singleton: "site",
  name: "Chic Threads",
  tagline: "Style meets substance",
  description:
    "Chic Threads is a curated fashion store for trendsetting clothing, accessories and everyday essentials. Free delivery on orders over $300.",
  phone: "+1 234 567 890",
  phoneHref: "+12345678900",
  email: "shop@example.com",
  address: ["4562 Park Lane Streetview", "Sydney, Australia 75601"],
  payment_methods: [
    { id: "visa", label: "VISA" },
    { id: "diners", label: "Diners Club" },
    { id: "amex", label: "American Express" },
    { id: "discover", label: "Discover" },
    { id: "mastercard", label: "Mastercard" },
  ],
};

export const languages = [
  { code: "en", label: "English" },
  { code: "km", label: "Khmer" },
];

export const socials = [
  { key: "facebook", label: "Facebook", href: "https://facebook.com" },
  { key: "twitter", label: "Twitter", href: "https://twitter.com" },
  { key: "youtube", label: "YouTube", href: "https://youtube.com" },
  { key: "instagram", label: "Instagram", href: "https://instagram.com" },
  { key: "linkedin", label: "LinkedIn", href: "https://linkedin.com" },
];

export const footerColumns = [
  {
    key: "supports",
    title: "Supports",
    links: [
      { label: "Contact Us", href: "/contact" },
      { label: "About Page", href: "/aboutus" },
      { label: "Size Guide", href: "/shop" },
      { label: "Shipping & Returns", href: "/shop" },
      { label: "FAQ's Page", href: "/contact" },
      { label: "Privacy", href: "/contact" },
    ],
  },
  {
    key: "shop",
    title: "Shop",
    links: [
      { label: "Men's Shopping", href: "/shop" },
      { label: "Women's Shopping", href: "/shop" },
      { label: "Kids's Shopping", href: "/shop" },
      { label: "Accessories", href: "/shop" },
      { label: "Discounts", href: "/shop" },
    ],
  },
  {
    key: "company",
    title: "Company",
    links: [
      { label: "About", href: "/aboutus" },
      { label: "Brand Deals", href: "/brand" },
      { label: "Blog", href: "/aboutus" },
      { label: "Affiliate", href: "/register" },
    ],
  },
];

export const brandLogos = [
  {
    key: "nike",
    name: "Nike",
    src: "/nike-3-logo-png-transparent.png",
    width: 2400,
    height: 2400,
  },
  { key: "puma", name: "Puma", src: "/Puma-logo.png", width: 5000, height: 2491 },
  {
    key: "dolce",
    name: "Dolce & Gabbana",
    src: "/Dolce-Gabbana-Logo.png",
    width: 3840,
    height: 2160,
  },
  {
    key: "zara",
    name: "Zara",
    src: "/479-4798484_zara-clothes-brand-logo-png-transparent-png.png",
    width: 500,
    height: 280,
  },
  { key: "r-1", name: "R", src: "/R (1).png", width: 511, height: 309 },
  { key: "r", name: "R", src: "/R.png", width: 1134, height: 750 },
];

export const editorialImages = [
  {
    key: "look-1",
    src: "/39A4138_46a232e7-4b67-4aea-b3e1-f8b3a9d18b00.webp",
    width: 1174,
    height: 2087,
    alt: "Editorial look from our latest collection",
  },
  {
    key: "look-2",
    src: "/OIP.webp",
    width: 600,
    height: 800,
    alt: "Everyday shirt styled for the season",
  },
  {
    key: "look-3",
    src: "/OIP (1).webp",
    width: 474,
    height: 712,
    alt: "Midi skirt from the new arrivals",
  },
  {
    key: "look-4",
    src: "/OIP (2).webp",
    width: 474,
    height: 711,
    alt: "Tailored trousers in a neutral tone",
  },
  {
    key: "look-5",
    src: "/OIP (3).webp",
    width: 474,
    height: 711,
    alt: "Merino knit cardigan detail",
  },
  {
    key: "look-6",
    src: "/OIP (4).webp",
    width: 474,
    height: 592,
    alt: "Relaxed denim jacket styling",
  },
  {
    key: "look-7",
    src: "/b8403bcab2c1f33e6afb5c24240acac2.jpg",
    width: 1340,
    height: 1785,
    alt: "Street style photographed for the campaign",
  },
];

export const promoSlides = [
  {
    key: "summer-60",
    image: "/il_1080xN.6805271679_9hk8.webp",
    number: "01",
    subtitle: "Summer Sale",
    discount: "60% OFF",
    href: "/shop",
  },
  {
    key: "mid-season-50",
    image: "/b8403bcab2c1f33e6afb5c24240acac2.jpg",
    number: "02",
    subtitle: "Mid Season",
    discount: "50% OFF",
    href: "/shop",
  },
  {
    key: "winter-40",
    image: "/39A4138_46a232e7-4b67-4aea-b3e1-f8b3a9d18b00.webp",
    number: "03",
    subtitle: "Winter Sale",
    discount: "40% OFF",
    href: "/shop",
  },
  {
    key: "spring-30",
    image: "/OIP (5).webp",
    number: "04",
    subtitle: "Spring Sale",
    discount: "30% OFF",
    href: "/shop",
  },
];
