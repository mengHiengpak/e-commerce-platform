import type { NavLink } from "@/lib/types";

/**
 * Site navigation.
 *
 * This used to be a `navlinks` collection read from MongoDB on every request,
 * behind a model, a service layer, a controller, CRUD endpoints and a seed
 * block. That was a lot of machinery for five primary links and two account
 * links that never changed between deploys, and it cost two extra queries on
 * every page render because the root layout reads the chrome.
 *
 * The links are now a plain module-level constant instead:
 * - Importing a const is free. `getSiteChrome()` no longer waits on nav.
 * - There is no key to keep stable, so `NavLink` lost its `id` field; `href` is
 *   already what the components use for React keys.
 * - Editing the menu is a code change, which is the point — the header and the
 *   404 suggestions are guaranteed to render the same list.
 */

/** Main navigation, rendered inline from `md` up and in the mobile drawer below it. */
export const PRIMARY_NAV = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/aboutus" },
  { label: "Shop", href: "/shop" },
  { label: "Brand", href: "/brand" },
  { label: "Contact", href: "/contact" },
] satisfies NavLink[];

/**
 * Account links, rendered as buttons in the mobile drawer and — for the first
 * entry only — in the slim strip under the header on small screens.
 */
export const ACCOUNT_NAV = [
  { label: "Login", href: "/signin" },
  { label: "Register", href: "/register" },
] satisfies NavLink[];

/**
 * True when `href` is the current route.
 *
 * `/` has to be compared exactly or every path would count as "home", and the
 * remaining links match as prefixes so `/shop?filter=Deals` still highlights
 * "Shop". Needs `usePathname()`, so it lives here rather than in a server
 * component.
 */
export function isNavLinkActive(pathname: string, href: string): boolean {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}