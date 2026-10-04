# E-Shop — Sale Management System (Front End)

A responsive, role-based **Point of Sale and inventory management** web application built for
retail operations. It covers the full sales cycle — product catalogue, stock-in purchases,
point-of-sale checkout, receivables tracking, and analytics — with a dedicated cashier
experience alongside the back-office admin console.

All monetary values are rendered in **៛ (Cambodian Riel)**.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Architecture](#architecture)
- [Routing & Access Control](#routing--access-control)
- [Backend API Reference](#backend-api-reference)
- [UI & Design System](#ui--design-system)
- [Notable Engineering Details](#notable-engineering-details)
- [Design Decisions & Trade-offs](#design-decisions--trade-offs)
- [Future Improvements](#future-improvements)

---

## Features

### Authentication & Roles
- Email/password **sign in** and **sign up** flows.
- JWT session handling with **role-based access control** for three roles:
  `super`, `admin`, and `cashier`.
- Automatic post-login routing by role: admins land on the dashboard, cashiers are sent
  straight to the POS terminal, unknown roles are routed to an unauthorized page.
- Route guards for both directions — `Protected` blocks unauthenticated access to
  application routes, `AuthRedirect` bounces already-signed-in users away from
  `/signin` and `/signup`.
- Sign out clears both the local token and the server session.

### Dashboard & Analytics
- Eight live KPI cards: today's revenue, monthly revenue, outstanding sale invoices,
  outstanding purchase invoices, customer count, supplier count, and due-invoice counts.
- Four interactive Recharts visualisations, all fed by aggregation endpoints:
  - **Monthly revenue trend** (line chart)
  - **Customer vs. supplier growth** (area chart)
  - **Last 30 days** revenue and transaction count (area chart)
  - **Purchase due vs. sales due** over time (area chart)
- Interactive legend behaviour — hovering a series dims the others so overlapping
  curves stay readable.

### Point of Sale (POS)
- Two implementations sharing one payment modal:
  - **Full POS** (`/sale/POS`) inside the admin console.
  - **Cashier POS** (`/cashier/pos`) inside a stripped-down, sidebar-free layout
    optimised for a dedicated counter terminal.
- Product grid with live search and category breadcrumb filtering.
- Click-to-add cart with inline quantity steppers and line removal.
- **Server-side stock validation on every quantity change** — adding to cart, increasing
  quantity, and incrementing an existing line all re-check availability against the
  backend before the cart updates.
- Payment modal with customer assignment, exact-amount / quick-cash shortcuts
  (total, +5,000, +10,000, +20,000), and live change/due calculation.
- On successful payment, the receipt opens in a new tab for printing.

### Sales Management
- Searchable, paginated sales list with adjustable page size.
- Payment status badges (`paid` / `partial` / `due`).
- **Receivables collection** — record additional payments against due invoices
  through a dedicated modal.
- Printable receipt view showing customer, cashier, invoice number, line items, and totals.

### Purchases & Inventory
- Create purchases by **product-code lookup** (scanner/code friendly) with automatic
  cost-price prefill.
- Multi-line purchase orders with running line and grand totals.
- Track invoice number, purchase date, status (`received`, `ordered`, `pending`,
  `cancelled`), and free-text notes.
- Update purchase payment status and settle outstanding amounts.
- Stock levels decrement on sale and increment on purchase.

### Master Data CRUD
Full create / read / update / delete for:
- **Customers**
- **Suppliers**
- **Categories**
- **Products** — including image upload and delete, cost/sale pricing, product code,
  current stock, category assignment, and notes.
- **Users** — with role assignment.

### Reports
- **Sale Report** — filter by date range (with client-side validation that the start date
  does not follow the end date), full transaction table, and total revenue summary.
- **Stock Report** — filter products below configurable stock thresholds to drive
  reordering decisions.

### Cross-cutting
- Toast notifications on every success and failure path.
- Loading spinners, empty states, and a 404 route.
- Fully responsive: collapsible drawer sidebar on mobile, horizontally scrollable
  wide data tables, touch-friendly tap targets.

---

## Tech Stack

| Layer | Choice |
| --- | --- |
| UI Library | **React 19** |
| Build Tool | **Vite 8** (Rolldown) |
| Routing | **React Router 8** |
| Styling | **Tailwind CSS 4** + **daisyUI 5** |
| Charts | **Recharts 3** |
| HTTP Client | **Axios** |
| Dates | **dayjs** |
| Notifications | **react-hot-toast** |
| Icons | **react-icons** |
| Optimisation | **React Compiler** (`babel-plugin-react-compiler`) |
| Linting | **oxlint** |

> No component framework or state library — the app uses Tailwind utility classes with
> daisyUI primitives and a purpose-built custom hook layer for data access.

---

## Getting Started

### Prerequisites
- **Node.js 20+**
- **npm 10+**
- A running backend API exposing the endpoints listed in
  [Backend API Reference](#backend-api-reference)

### Installation

```bash
npm install
```

### Configure the environment

Create or edit a `.env` file in the project root:

```env
VITE_URL_BASE=http://localhost:3000/api
```

### Start the dev server

```bash
npm run dev
```

The app is served at **http://localhost:5173**.

### Production build

```bash
npm run build     # outputs to dist/
npm run preview   # locally serve the production build
```

---

## Environment Variables

| Variable | Required | Description |
| --- | --- | --- |
| `VITE_URL_BASE` | Yes | Base URL of the backend API. Also used to build image paths (`${VITE_URL_BASE}/uploads/<filename>`). |

> **Note:** Vite only exposes variables prefixed with `VITE_` to the client bundle.
> Never place secrets in `.env` — anything there is public in the shipped JavaScript.

---

## Available Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the Vite dev server with HMR on port 5173. |
| `npm run build` | Build the production bundle to `dist/`. |
| `npm run preview` | Serve the production build locally for verification. |
| `npm run lint` | Run oxlint with the React and Oxc plugin rule sets. |

---

## Project Structure

```
.
├── .env                        # VITE_URL_BASE
├── .oxlintrc.json              # oxlint config (react + oxc plugins)
├── index.html
├── vite.config.js              # Vite + React + Tailwind plugins
└── src/
    ├── main.jsx                # React root
    ├── App.jsx                 # Router + all route definitions
    ├── index.css               # Tailwind, daisyUI, custom theme + layout rules
    ├── config/
    │   ├── app.js              # Axios instance, token storage, request interceptor
    │   └── env.js              # Vite env accessor
    ├── hook/
    │   ├── auth/               # useSignIn, useSignUp, useSignout, useCurrent
    │   ├── useQuery.js         # Generic paginated/searchable list fetch
    │   ├── useCollection.js    # create / update / remove for a collection
    │   ├── useFindById.js      # Single-record fetch
    │   ├── useStorege.js       # Image upload / delete
    │   ├── useCheckStock.js    # Stock availability validation
    │   ├── use30DayAgo.js      # 30-day report
    │   ├── useMonthlyReport.js # Monthly revenue report
    │   ├── useGrowthReport.js  # Customer/supplier growth report
    │   ├── useGeneral.js       # Dashboard aggregate report
    │   ├── useSaleReport.js    # Date-range sale report
    │   ├── useStockReport.js   # Low-stock report
    │   ├── useSalePayment.js   # Record payment against a sale
    │   ├── useSignup.js        # Shared signup action
    │   └── test/
    │       └── useFindOneByCode.js  # Product lookup by code
    ├── pages/
    │   ├── auth/               # Signin, Signup
    │   ├── layout/             # AdminLayout, CashierLayout
    │   ├── components/
    │   │   ├── Slidebar.jsx    # Responsive collapsible navigation
    │   │   ├── Topmenu.jsx     # User menu, POS shortcut, sign out
    │   │   ├── Modal.jsx       # Reusable modal
    │   │   ├── Protected.jsx   # Auth + role guard
    │   │   ├── AuthRedirect.jsx# Guest-only guard
    │   │   └── charts/         # Four dashboard chart components
    │   ├── categories/         # Dashboard
    │   ├── custom/             # Customer CRUD
    │   ├── supplier/           # Supplier CRUD
    │   ├── category/           # Category CRUD
    │   ├── products/           # Product CRUD
    │   ├── purchase/           # Purchase list, create, payment status
    │   ├── sale/               # POS, cashier POS, list, payment, receipt
    │   ├── user/               # User CRUD
    │   ├── Report/             # Sale and stock reports
    │   ├── Loading.jsx
    │   ├── NotFound.jsx
    │   └── Unauthorization.jsx
    └── utils/
        └── formatDate.js       # Date formatting helper
```

---

## Architecture

### Layered request flow

```
Component  →  custom hook (useQuery / useCollection / report hook)
           →  shared Axios instance (src/config/app.js)
           →  request interceptor injects the JWT
           →  backend API
           →  response normalised by the hook
           →  component state → rendered
```

### Axios instance & authentication

All network traffic goes through a single configured instance in `src/config/app.js`:

- `baseURL` is read from `VITE_URL_BASE` at runtime, so the same build can be pointed at
  staging or production without code changes.
- `withCredentials: true` is enabled so the server's session cookie is sent.
- A **request interceptor** attaches the stored JWT as a `token` header on every call.

The dual token strategy is deliberate. A `SameSite=Lax` cookie is withheld from cross-site
requests, so opening the app on `127.0.0.1` — a different origin from an API served on
`localhost` — silently drops the cookie and `/auth/me` rejects with *"token is not
found!"*. Sending the JWT in a header while keeping the cookie as a fallback removes
that class of failure entirely. The trade-off is that the token lives in `localStorage`,
which is readable by any XSS payload — the app therefore avoids rendering raw HTML and
should be paired with a strict Content-Security-Policy at the edge.

### Custom hook data layer

Rather than pulling in a server-state library, the app defines a small set of focused
hooks. This keeps the bundle lean and makes the request contract explicit.

| Hook | Responsibility |
| --- | --- |
| `useQuery(collection, search, page, limit, refetch)` | Fetches a list with search, pagination, and an explicit `refetch` toggle to force a re-read after mutations. Returns `{ data, isLoading, page, totalPage }`. |
| `useCollection(collection)` | Returns `[isLoading, create, updates, remove]`. `updates` accepts a `patch`/`put` method argument. All three surface success and error toasts automatically. |
| `useFindById(collection, id)` | Fetches a single record, guarding against undefined `id`/`collection`. |
| `useStorage()` | Wraps `FormData` upload and file deletion. |
| `useCheckStock()` | Validates a product/quantity pair against available stock. |
| `useGeneral`, `use30DayAgo`, `useMonthlyReport`, `useGrowthReport`, `useSaleReport`, `useStockReport` | One hook per report endpoint, each wrapped in `useCallback` so it is a stable dependency for `useEffect`. |
| `useCurrent()` | Fetches the authenticated user from `/auth/me`. |

**Response normalisation.** `useQuery` defensively unwraps the payload, accepting a bare
array or one nested under `result`, `collection`, `data`, or `doc`. This insulates the UI
from minor backend envelope differences.

**Loading state hygiene.** Hooks that return a value (rather than performing a mutation)
default to `isLoading: true` so the first render shows a spinner instead of a flash of
"no data".

### Code splitting

Every single route in `App.jsx` is loaded through `React.lazy` and wrapped in a single
top-level `<Suspense fallback={<Loading />}>` boundary. The initial bundle therefore
contains only the router shell and the auth/layout code; the POS, charts, reports, and
each CRUD screen are fetched on demand as the user navigates.

---

## Routing & Access Control

Routes are defined in `src/App.jsx` using nested routes, so a single layout (and a
single guard) wraps an entire section.

| Path | Screen | Access |
| --- | --- | --- |
| `/signin` | Sign in | Guests only (`AuthRedirect`) |
| `/signup` | Sign up | Public |
| `/` | Dashboard | `super`, `admin`, `cashier` |
| `/customer`, `/createcustomer`, `/editcustomer/:id` | Customer management | Guarded |
| `/supplier`, `/supplier/create`, `/supplier/edit/:id` | Supplier management | Guarded |
| `/category`, `/category/create`, `/category/edit/:id` | Category management | Guarded |
| `/products`, `/products/create`, `/products/edit/:id` | Product management | Guarded |
| `/purchase`, `/purchase/create` | Purchases | Guarded |
| `/user`, `/user/create`, `/user/edit/:id` | User management | Guarded |
| `/sale/list` | Sales list | Guarded |
| `/sale/POS` | Point of Sale | Guarded |
| `/sale/payment` | Payment handler | Guarded |
| `/sale/payment/status/:id` | Payment status | Guarded |
| `/sale/report` | Sale report | Guarded |
| `/stock/report` | Stock report | Guarded |
| `/cashier/pos` | Cashier POS | `CashierLayout` |
| `/sale/list/sale/pos/:id` | Receipt | `super`, `admin`, `cashier` |
| `/unauthorization` | Access denied | Public |
| `*` | 404 | Public |

**How the guard works** (`pages/components/Protected.jsx`):

1. While `/auth/me` is in flight, render a full-screen spinner — this prevents a flash of
   the redirect before the session is known.
2. If the resolved role is in `allowedRole`, render `children` (an `<Outlet />` from the
   parent layout).
3. Otherwise `<Navigate to="/signin" />`.

`useCurrent` initialises its user as `null`, not `[]`. An empty array is truthy, so a
`[]` default would make "not signed in" indistinguishable from "signed in with no role"
for any consumer that gates on `if (data)`. On a `401` the stored token is cleared so the
next sign-in starts from a clean state.

---

## Backend API Reference

Base URL comes from `VITE_URL_BASE` (default `http://localhost:3000/api`).

### Authentication

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/auth/signin` | Sign in; returns token + user profile |
| `POST` | `/auth/signup` | Register a user |
| `POST` | `/auth/signout` | End the session |
| `GET` | `/auth/me` | Current authenticated user |

### Collections (generic CRUD)

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/{collection}?search=&page=&limit=` | Paginated, searchable list |
| `GET` | `/{collection}/{id}` | Single record |
| `POST` | `/{collection}` | Create |
| `PATCH` | `/{collection}/{id}` | Partial update |
| `PUT` | `/{collection}/{id}` | Full update (used for payment status) |
| `DELETE` | `/{collection}/{id}` | Delete |

Collections in use: `customer`, `customers`, `supplies`, `categories`, `product`,
`user`, `purchase`, `sales`.

### Sales

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/sales/checkstock?productId=&stock=` | Validate stock availability |
| `POST` | `/sales/addpayment/{saleId}` | Record a payment against a sale |

### Purchases

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/product/code/{code}` | Look up a product by code (prefills cost price) |

### Reports

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/reports/general` | Dashboard KPI aggregates |
| `GET` | `/reports/monthly` | Monthly revenue trend |
| `GET` | `/reports/growth` | Customer and supplier growth |
| `GET` | `/reports/30days` | Last 30 days revenue and sale count |
| `GET` | `/salereports/saleReport?startDate=&endDate=` | Sale report for a date range |
| `GET` | `/stockreports/stockreport?quantity=` | Products below a stock threshold |

### Files

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/upload` | Upload a product image (`FormData`, field `imageUrl`) |
| `DELETE` | `/upload/{imageUrl}` | Delete an uploaded image |
| `GET` | `{VITE_URL_BASE}/uploads/{imageUrl}` | Serve a stored image |

---

## UI & Design System

Styling is **Tailwind CSS 4** with **daisyUI 5** for component primitives, wired together
in `vite.config.js` and `src/index.css`.

```js
// vite.config.js
plugins: [tailwindcss(), react()]
```

```css
/* src/index.css */
@import "tailwindcss";
@plugin "daisyui";
```

Custom spacing tokens extend the design scale with values Tailwind does not ship by
default (`--height-90`, `--height-105`, `--height-150`, `--margin-95`, and others).

Three layout-level rules carry most of the responsive behaviour:

1. **`overflow-x: clip` on `html`** — `clip` rather than `hidden` so no scroll container
   is created, which would otherwise break `position: fixed` for the mobile sidebar drawer.
2. **`min-width: 0` on the app shell** — flex and grid children default to
   `min-width: auto` and refuse to shrink below their content, which is what pushes wide
   pages sideways on a phone. `:where()` keeps specificity at 0 so Tailwind utilities can
   still override.
3. **`.table-scroll`** — a shared class giving wide data tables their own horizontal
   scroll with momentum scrolling on touch, so ten-column tables scroll inside the table
   instead of crushing every column.

The sidebar is a static panel at `lg` and above and an overlay drawer below it. It
re-synchronises with `window.matchMedia('(min-width: 64rem)')` on every navigation, which
both starts it closed on phones and prevents "tapped a link, saw the menu" behaviour.
When closed it is marked `inert`, so its links are removed from the tab order and the
accessibility tree rather than merely being visually hidden.

---

## Notable Engineering Details

**Stock is validated on the server, not just in the UI.** The cashier POS re-checks
availability on *every* quantity increase, not only when a product first enters the cart.
Without this, a cashier could push a line past available stock and only discover the
problem at checkout.

**Payment is decoupled from the cart.** `SalePayment` is a controlled modal that receives
the cart as a prop. Both POS implementations reuse it unchanged, and it is also
responsible for post-payment navigation — opening the receipt in a new tab so the
terminal stays on the POS screen ready for the next customer.

**Report hooks are memoised with `useCallback`.** They are called from `useEffect`
dependency arrays; without a stable reference the effect would re-fire on every render
and hammer the API.

**Date validation happens before the request.** The sale report refuses to fire when the
start date is after the end date, and surfaces the error inline rather than letting the
server reject it.

**Charts handle both response shapes.** Report endpoints may return a multi-month array
or a single aggregate object; the chart components branch on the shape and fall back to
the current month rather than rendering empty.

**Defensive state initialisation.** `useCurrent` starts as `null` (not `[]`) because an
empty array is truthy; report hooks start as `isLoading: true` to avoid a "no data" flash.
`useFindById` bails out early if `id` or `collection` is missing rather than firing a
request against `undefined`.

---

## Design Decisions & Trade-offs

| Decision | Rationale | Trade-off |
| --- | --- | --- |
| **Custom hooks instead of React Query** | Smaller bundle and an explicit request contract for a fixed backend. | No automatic caching, background refetch, or request deduplication; each screen manages its own refresh. |
| **All routes lazy-loaded** | The dashboard charts and POS are the heaviest screens and are not both needed at once. | A brief spinner on first navigation to each section. |
| **Token in `localStorage` + header, cookie as fallback** | Immune to `SameSite=Lax` cross-site cookie loss, which silently 401s on `127.0.0.1`. | `localStorage` is readable by any XSS payload; needs a strict CSP to offset. |
| **`useCallback` in report hooks** | Prevents `useEffect` request loops. | Extra boilerplate per hook. |
| **No TypeScript** | Keeps the build simple for a JavaScript-first stack. | No compile-time guarantees that API payloads match component expectations. |
| **daisyUI on top of Tailwind** | Ready-made accessible primitives (buttons, modals, tables, badges) without a heavy component library. | Slight bundle overhead versus hand-rolled components. |

---

## Future Improvements

- Migrate the data layer to **TanStack Query** for caching, request deduplication, and
  automatic cache invalidation after mutations.
- Add **TypeScript** end-to-end, with typed API response contracts.
- Introduce a **global state store** (Redux Toolkit / Zustand) for the authenticated
  session, replacing the per-component `/auth/me` calls in `Protected` and `Topmenu`.
- Add **automated tests** (Vitest + React Testing Library) around the cart, payment
  calculation, and date-range validation logic.
- Replace hardcoded date bounds in the sale report with a dynamic range.
- Add **print-optimised CSS** for the receipt view.
- Support **offline resilience** with a service worker and request queueing.
- Add **refund and sale-cancellation** flows.
- Introduce **i18n** for Khmer/English interface toggling.

---

## License

This project is for educational and portfolio purposes.
