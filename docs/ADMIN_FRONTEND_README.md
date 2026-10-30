# Aurus Admin Panel — Frontend UI & Layout Documentation

Comprehensive reference documentation covering the frontend architecture, layouts, page routing, design tokens, color palette system, Zustand state stores, modules, CRUD flows, media handling, and UI component primitives of the **Aurus Admin Panel**.

---

## 1. UI Architecture & Tech Stack

- **Framework:** Next.js 16 (App Router with Turbopack) & React 19
- **State Management:** **Zustand v5** modular stores:
  - `useAuthStore.ts`: Authentication, session verification, and persistent admin identity.
  - `useThemeStore.ts`: Dynamic luxury color palettes, cookie persistence, and runtime CSS variables.
  - `useMasterStore.ts`: Cities, Localities, Institutes, Occupancies, and Amenities.
  - `useHostelAndEnquiryStore.ts`: Hostels, Booked Visits, and Inquiries / Callback Requests.
  - `useContentStore.ts`: Blogs, Stories (Testimonials), and FAQs (single & bulk operations).
- **Language:** TypeScript (TSX) with strict type safety.
- **HTTP Client:** **Axios v1.20** (`src/lib/admin-api.ts`):
  - Pre-configured with `baseURL: "/api/admin"` and `withCredentials: true` (HTTP-only cookies).
  - Built-in request interceptor that automatically strips `Content-Type` for `FormData` payloads, enabling browser-managed multipart boundaries.
  - Unified error extraction converting API responses into typed `ApiResponse<T>` envelopes.
- **Styling Strategy:** 100% pure **Tailwind CSS v4** utility classes (zero third-party UI framework dependencies).
  - Configured via `@source "../**/*.{js,ts,jsx,tsx}";` in `src/app/globals.css`.
  - Dynamic palette variables: `--admin-primary`, `--admin-secondary`, `--admin-glow`.
- **Layout Guard & Integration:**
  - `ClientLayoutWrapper.tsx` dynamically excludes public website navigation/footer for `/admin/*` routes.
  - `(panel)/layout.tsx` enforces authentication guards before rendering the administrative shell.
- **Media Architecture:** Unified `{ url: string, publickey: string }` media contract with client-side preview object URL lifecycle management (`URL.createObjectURL` / `URL.revokeObjectURL`) and fallback resolution via `src/lib/media.ts`.

---

## 2. Directory Structure & File Map

```text
src/
├── app/
│   └── admin/
│       ├── page.tsx                           # Root route: session check & redirect
│       ├── login/
│       │   └── page.tsx                       # Login route rendering AdminLogin
│       └── (panel)/
│           ├── layout.tsx                     # Protected shell guard with useAuthStore
│           ├── dashboard/
│           │   └── page.tsx                   # Administrative metrics & operations dashboard
│           ├── city/
│           │   └── page.tsx                   # City master + nested Locality & Institute management
│           ├── occupancy/
│           │   └── page.tsx                   # Occupancy master management
│           ├── amenity/
│           │   └── page.tsx                   # Amenity master management
│           ├── hostel/
│           │   └── page.tsx                   # Hostel residence management (CRUD & media)
│           ├── booked-visit/
│           │   └── page.tsx                   # Scheduled residence visit management
│           ├── enquiry/
│           │   └── page.tsx                   # User inquiries & callback requests
│           ├── blog/
│           │   └── page.tsx                   # Journal blog posts & articles
│           ├── story/
│           │   └── page.tsx                   # Resident stories, ratings & featured cards
│           └── faq/
│               └── page.tsx                   # Frequently asked questions & bulk manager
│
├── components/
│   └── admin/
│       ├── amenity/                           # Amenity module components
│       │   ├── AmenityHeader.tsx              # Eyebrow, title, stats & action bar
│       │   ├── AmenityManage.tsx              # Table, search, filter, pagination & actions
│       │   ├── CreateAmenity.tsx              # Modal for creating a new amenity with icon
│       │   ├── EditAmenity.tsx                # Modal for updating amenity & icon
│       │   ├── DeleteAmenity.tsx              # Confirmation modal with dependency warning
│       │   └── AmenityDetails.tsx            # Read-only slideover/modal with asset preview
│       ├── blog/                              # Blog module components
│       │   ├── BlogHeader.tsx                 # Header with count & write post button
│       │   ├── BlogManage.tsx                 # Table, search, tag filters & pagination
│       │   ├── CreateBlog.tsx                 # Write article modal (tags, banner upload, SEO)
│       │   ├── EditBlog.tsx                   # Edit article modal with image replacement
│       │   ├── DeleteBlog.tsx                 # Safe deletion modal
│       │   └── BlogDetails.tsx                # Article viewer modal
│       ├── booked-visit/                      # Booked Visits module components
│       │   ├── BookedVisitHeader.tsx          # Metric counters & date filter bar
│       │   ├── BookedVisitManage.tsx          # Table, location filter, search & date range
│       │   ├── BookedVisitDetails.tsx         # Detailed visit view (resident, date, time)
│       │   └── DeleteBookedVisit.tsx          # Delete appointment record
│       ├── city/                              # City module components
│       │   ├── CityHeader.tsx                 # Statistics and Add City trigger
│       │   ├── CityManage.tsx                 # Table with embedded Locality/Institute launchers
│       │   ├── CreateCity.tsx                 # Create city modal (cover image, SEO metadata)
│       │   ├── EditCity.tsx                   # Update city modal with image replacement
│       │   ├── DeleteCity.tsx                 # Deletion modal with dependency alerts
│       │   ├── CityDetails.tsx                # City overview modal
│       │   ├── LocalityForCity.tsx            # Scoped locality management modal for chosen city
│       │   └── InstituteForCity.tsx           # Scoped institute management modal for chosen city
│       ├── dashboard/                         # Dashboard widgets
│       │   ├── DashboardCharts.tsx            # Activity area chart & occupancy breakdown
│       │   ├── DashboardHeader.tsx            # Date eyebrow, greeting & refresh action
│       │   ├── DashboardKpiGrid.tsx           # 4-card KPI metric grid with sparklines
│       │   ├── DashboardWelcomeBand.tsx       # Dark aurora hero banner with live statistics
│       │   └── RecentAdminsList.tsx           # Real-time list of administrative staff
│       ├── enquiry/                           # Enquiry & Callback module components
│       │   ├── EnquiryHeader.tsx              # Count breakdown for inquiries vs requests
│       │   ├── EnquiryManage.tsx              # Table with type tabs (all, query, request)
│       │   ├── EnquiryDetails.tsx             # Contact viewer & message inspector
│       │   └── DeleteEnquiry.tsx              # Delete enquiry modal
│       ├── faq/                               # FAQ module components
│       │   ├── FaqHeader.tsx                  # FAQ count & batch create trigger
│       │   ├── FaqManage.tsx                  # Table with inline status toggle, filter bar & reset
│       │   ├── CreateFaq.tsx                  # Single FAQ & Category Batch creation modal
│       │   ├── EditFaq.tsx                    # Edit single FAQ modal
│       │   ├── BulkEditFaq.tsx                # Category-wide multi-FAQ editor modal
│       │   ├── DeleteFaq.tsx                  # Deletion confirmation modal
│       │   └── FaqDetails.tsx                 # Read-only FAQ preview modal
│       ├── hostel/                            # Hostel residence module components
│       │   ├── HostelHeader.tsx               # Total count & Add Hostel button
│       │   ├── HostelManage.tsx               # Table, multi-filter bar, search & actions
│       │   ├── CreateHostel.tsx               # Multi-field form (city/locality, amenities, media)
│       │   ├── EditHostel.tsx                 # Update hostel, media replacements & brochure
│       │   ├── DeleteHostel.tsx               # Deletion modal with S3 asset cleanup warning
│       │   └── HostelDetails.tsx              # Comprehensive hostel dossier & gallery viewer
│       ├── layout/                            # Admin layout infrastructure
│       │   ├── AdminCommandPalette.tsx        # Streamlined navigation palette (⌘K)
│       │   ├── AdminMobileNav.tsx             # Responsive drawer for mobile viewports
│       │   ├── AdminPaletteSelector.tsx       # Luxury theme palette switcher dropdown
│       │   ├── AdminShell.tsx                 # Master layout frame (sidebar, topbar, body)
│       │   ├── AdminSidebar.tsx               # Collapsible navigation rail with active pills
│       │   └── AdminTopbar.tsx                # Sticky topbar with search, palette, & profile
│       ├── login/                             # Authentication views
│       │   └── AdminLogin.tsx                 # Split-screen luxury login interface
│       ├── occupancy/                         # Occupancy module components
│       │   ├── OccupancyHeader.tsx            # Header & Add Occupancy trigger
│       │   ├── OccupancyManage.tsx            # Table, search, filter & pagination
│       │   ├── CreateOccupancy.tsx            # Add occupancy modal (name, optional icon)
│       │   ├── EditOccupancy.tsx              # Edit occupancy modal
│       │   ├── DeleteOccupancy.tsx            # Delete confirmation modal
│       │   └── OccupancyDetails.tsx           # Occupancy preview
│       ├── story/                             # Resident Story module components
│       │   ├── StoryHeader.tsx                # Header & Add Resident Story trigger
│       │   ├── StoryManage.tsx                # Table, rating badges, featured indicator
│       │   ├── CreateStory.tsx                # Form with conditional featured background upload
│       │   ├── EditStory.tsx                  # Edit review, rating & conditional featured image
│       │   ├── DeleteStory.tsx                # Delete testimonial modal
│       │   └── StoryDetails.tsx               # Story viewer with featured background banner
│       └── ui/                                # Reusable UI primitives & design tokens
│           ├── AdminIcons.tsx                 # SVG icon catalog matching administrative tools
│           └── AdminUI.tsx                    # Design primitives: Btn, Card, Chip, FormField, TextInput
│
├── store/
│   ├── useAuthStore.ts                        # Zustand authentication & session store
│   ├── useThemeStore.ts                       # Zustand color palette & custom property store
│   ├── useMasterStore.ts                      # Zustand store for Cities, Localities, Amenities, Occupancies
│   ├── useHostelAndEnquiryStore.ts            # Zustand store for Hostels, Visits & Inquiries
│   └── useContentStore.ts                     # Zustand store for Blogs, Stories & FAQs
│
└── lib/
    ├── admin-api.ts                           # Axios client with FormData interceptor & auth helpers
    ├── admin-nav.ts                           # Navigation items array for sidebar and command palette
    └── media.ts                               # Isomorphic S3/CloudFront media URL resolver
```

---

## 3. State Management Architecture

State is decoupled into five dedicated, single-responsibility Zustand stores located in `src/store/`:

### 3.1 Authentication Store (`src/store/useAuthStore.ts`)
- **State:** `admin` (`SafeAdmin | null`), `isAuthenticated`, `isLoading`, `isInitialized`, `error`.
- **Key Methods:**
  - `login(email, password)`: Dispatches credentials to `POST /api/admin/auth/login`, caches admin in `localStorage`, and updates reactive state.
  - `logout()`: Dispatches to `POST /api/admin/auth/logout`, clears cookies, purges `localStorage`, and redirects to `/admin/login`.
  - `checkAuth()`: Queries `GET /api/admin/auth/me`. Restores cached session immediately for seamless hydration, then reconciles against the server.
  - `setAdmin(admin)` / `clearError()`: Updates admin details reactively.

### 3.2 Theme Store (`src/store/useThemeStore.ts`)
- **Supported Luxury Palettes:**
  1. `ember` *(Default)*: Ember Orange (`#f97316`)
  2. `gold`: Aurus Gold (`#d97706`)
  3. `emerald`: Emerald Jade (`#10b981`)
  4. `sapphire`: Sapphire Blue (`#2563eb`)
  5. `amethyst`: Royal Amethyst (`#8b5cf6`)
  6. `rose`: Crimson Rose (`#f43f5e`)
- **Features:**
  - Persists preference in the `aurus_admin_palette` cookie (1-year validity, `SameSite=Lax`).
  - Dynamically sets CSS custom properties (`--admin-primary`, `--admin-secondary`, `--admin-glow`) on `document.documentElement`.
  - Provides Tailwind helper classes: `primaryClass`, `bgLightClass`, `borderClass`, `textClass`.

### 3.3 Master Store (`src/store/useMasterStore.ts`)
- **Managed Entities:** Cities, Localities, Institutes, Occupancies, Amenities.
- **Operations Supported:**
  - `fetchCities(params)`, `getCityById(id)`, `createCity(data)`, `updateCity(id, data)`, `deleteCity(id)`
  - `fetchLocalities(params)`, `getLocalityById(id)`, `createLocality(data)`, `updateLocality(id, data)`, `deleteLocality(id)`
  - `fetchInstitutes(params)`, `getInstituteById(id)`, `createInstitute(data)`, `updateInstitute(id, data)`, `deleteInstitute(id)`
  - `fetchOccupancies(params)`, `getOccupancyById(id)`, `createOccupancy(data)`, `updateOccupancy(id, data)`, `deleteOccupancy(id)`
  - `fetchAmenities(params)`, `getAmenityById(id)`, `createAmenity(data)`, `updateAmenity(id, data)`, `deleteAmenity(id)`
- **Multipart Support:** Automatically accepts `FormData` (with image files) or JSON objects for create/update.

### 3.4 Residence & Inquiries Store (`src/store/useHostelAndEnquiryStore.ts`)
- **Managed Entities:** Hostels, Booked Visits, Enquiries.
- **Operations Supported:**
  - `fetchHostels(params)`, `getHostelById(id)`, `createHostel(formData)`, `updateHostel(id, formData)`, `deleteHostel(id)`
  - `fetchBookedVisits(params)`, `getBookedVisitById(id)`, `createBookedVisit(data)`, `updateBookedVisit(id, data)`, `deleteBookedVisit(id)`
  - `fetchEnquiries(params)`, `getEnquiryById(id)`, `createEnquiry(data)`, `updateEnquiry(id, data)`, `deleteEnquiry(id)`

### 3.5 Content Store (`src/store/useContentStore.ts`)
- **Managed Entities:** Blogs, Stories (Testimonials), FAQs.
- **Operations Supported:**
  - `fetchBlogs(params)`, `getBlogById(id)`, `createBlog(formData)`, `updateBlog(id, formData)`, `deleteBlog(id)`
  - `fetchStories(params)`, `getStoryById(id)`, `createStory(formData)`, `updateStory(id, formData)`, `deleteStory(id)`
  - `fetchFaqs(params)`: Supports pagination, category filter, active filter, search, and `grouped=true`.
  - `getFaqById(id)`: Fetches single FAQ.
  - `createFaq(data)`: Handles both single FAQ and Category Batch creation (`{ category, faqs: [...] }`).
  - `updateFaq(id, data)`: Updates single FAQ and synchronizes store state.
  - `bulkUpdateFaqs(items)`: Atomically updates multiple FAQs.
  - `deleteFaq(id)`: Deletes individual FAQ.
  - `bulkDeleteFaqs(ids)`: Batch deletes an array of FAQ IDs.

---

## 4. Layout & Navigation Infrastructure

### 4.1 Master Shell (`AdminShell.tsx`)
- Coordinates the collapsible sidebar, sticky topbar, responsive mobile drawer, and keyboard command palette listener (`⌘K` / `Ctrl+K`).
- Injects theme variables directly into the root wrapper to ensure seamless CSS property inheritance.

### 4.2 Sidebar Navigation (`AdminSidebar.tsx`)
- Displays branding, grouped navigation sections, and active state indicator bars.
- Supports collapsible viewports: expanded (250px) and mini rail (76px).
- Navigation sections defined in `src/lib/admin-nav.ts`:
  - **Home:** Dashboard (`/admin/dashboard`)
  - **Master Management:** City (`/admin/city`), Occupancies (`/admin/occupancy`), Amenities (`/admin/amenity`)
  - **Residence Management:** Hostels (`/admin/hostel`), Booked Visits (`/admin/booked-visit`), Enquiries (`/admin/enquiry`)
  - **Content Management:** Blogs (`/admin/blog`), Stories (`/admin/story`), FAQs (`/admin/faq`)

### 4.3 Command Palette (`AdminCommandPalette.tsx`)
- Spotlight-style keyboard search modal triggered by `⌘K` or `Ctrl+K`.
- **Streamlined Navigation:** Displays exclusively verified navigation destinations from `adminNav`.
- **Clean Interface:** Eliminates clutter by omitting section title labels and duplicate action buttons.
- Supports instant arrow-key navigation (`ArrowUp`, `ArrowDown`), keyboard jump (`Enter`), query reset, and `ESC` dismiss.

### 4.4 Topbar & Palette Selector (`AdminTopbar.tsx` & `AdminPaletteSelector.tsx`)
- Sticky header featuring quick search launcher, live theme palette switcher dropdown with hex previews, and administrative profile menu with logout.

---

## 5. Module-by-Module Walkthrough

### 5.1 Dashboard (`src/app/admin/(panel)/dashboard/page.tsx`)
- **Overview:** Operations control center displaying real-time platform statistics.
- **Components:**
  - `DashboardHeader.tsx`: Date eyebrow, personalized welcome, and data refresh button.
  - `DashboardWelcomeBand.tsx`: Aurora gradient hero card with quick statistics tiles.
  - `DashboardKpiGrid.tsx`: 4 responsive KPI cards (Hostels, Visits, Enquiries, Stories) with inline sparkline charts and trend badges.
  - `DashboardCharts.tsx`: 6-month enquiry/visit trend area chart and residence occupancy distribution breakdown.
  - `RecentAdminsList.tsx`: List of registered administrative team members.

### 5.2 City Management (`src/app/admin/(panel)/city/page.tsx`)
- **Table & Filters:** Lists cities with country, state, city name, slug, cover image thumbnail, sort order, and active status.
- **Embedded Sub-Managers:**
  - `LocalityForCity.tsx`: Opens a scoped modal to add, view, and delete localities specifically belonging to the selected city.
  - `InstituteForCity.tsx`: Opens a scoped modal to add, view, and delete educational institutes for the selected city.
- **Create & Edit (`CreateCity.tsx`, `EditCity.tsx`):**
  - Inputs for country, state, city name, sort order, active status checkbox.
  - Cover image upload with live preview and removal action.
  - SEO Metadata sub-form: meta title, meta description, meta keywords.

### 5.3 Occupancies Management (`src/app/admin/(panel)/occupancy/page.tsx`)
- **Features:** Manages room sharing types (e.g., Single, Double, Triple sharing).
- **Components:** `OccupancyManage`, `CreateOccupancy`, `EditOccupancy`, `DeleteOccupancy`, `OccupancyDetails`.
- **Form Controls:** Occupancy name, optional icon/photo upload with preview, active status toggle.

### 5.4 Amenities Management (`src/app/admin/(panel)/amenity/page.tsx`)
- **Features:** Manages hostel facilities (e.g., High-speed Wi-Fi, Biometric Access, Laundry, Gym).
- **Components:** `AmenityManage`, `CreateAmenity`, `EditAmenity`, `DeleteAmenity`, `AmenityDetails`.
- **Form Controls:** Amenity name, icon upload, active status toggle.
- **Protection:** Warns if an amenity is referenced by hostels before allowing deletion.

### 5.5 Hostel Management (`src/app/admin/(panel)/hostel/page.tsx`)
- **Features:** Flagship module for residence properties and student accommodation.
- **Table Features:** Filter by City, Locality (dynamically loaded), Tenant Type, Rent Range, Active status, and Search. Inline quick status toggle with feedback toast.
- **Create & Edit (`CreateHostel.tsx`, `EditHostel.tsx`):**
  - **General Details:** Title, Subtitle, Description.
  - **Pricing & Tenancy:** Rent, Rent Frequency (`monthly`, `yearly`), Tenant Type checkboxes (`boys`, `girls`, `co-ed`).
  - **Location Cascade:** City select triggers dynamic loading of available Localities for that city. Address, Map URL, and Latitude/Longitude coordinates.
  - **Amenities:** Interactive checkbox grid selecting from available amenities.
  - **Media Suite:**
    - `frontImage`: Main exterior/banner image (required).
    - `firstImage` & `secondImage`: Key interior/room images (optional).
    - `galleryImages`: Multi-file picker with preview thumbnails and deletion.
    - `brochure`: PDF document upload (max 25MB) with download/preview link.
  - **SEO Metadata:** Meta title, meta description, keywords.

### 5.6 Booked Visits (`src/app/admin/(panel)/booked-visit/page.tsx`)
- **Features:** Manages schedule requests from website visitors wishing to tour a residence.
- **Table & Search:** Search by resident name or phone number; filter by residence location; sort by scheduled date or submission date.
- **Details (`BookedVisitDetails.tsx`):** Displays resident name, international phone number, selected location, "I am" category (e.g., Student, Parent, Working Professional), preferred date, and preferred time slot.
- **Actions:** View full details, delete appointment.

### 5.7 Inquiries & Callbacks (`src/app/admin/(panel)/enquiry/page.tsx`)
- **Features:** Manages general queries and callback requests submitted via public forms.
- **Filter Tabs:** Tab buttons to filter between All Enquiries, Queries (`type: "query"`), and Callback Requests (`type: "request"`).
- **Details (`EnquiryDetails.tsx`):** Displays sender name, phone number, enquiry type badge, message body, location, and user category.
- **Actions:** View full inquiry text, delete record.

### 5.8 Blogs (`src/app/admin/(panel)/blog/page.tsx`)
- **Features:** Editorial journal and lifestyle articles.
- **Create & Edit (`CreateBlog.tsx`, `EditBlog.tsx`):**
  - Title, Subtitle, Slug (auto-derived on backend), Article Body (`description`).
  - Tag management: dynamic chip input (type tag + Enter/comma).
  - Cover image banner uploader (16:9 aspect ratio, max 10MB).
  - SEO Metadata sub-form.

### 5.9 Resident Stories / Testimonials (`src/app/admin/(panel)/story/page.tsx`)
- **Features:** Resident reviews, community testimonials, and star ratings.
- **Resident Initial Avatar:** Uses clean gradient initials for resident profiles instead of distorting background card images.
- **Featured Image Logic (`CreateStory.tsx`, `EditStory.tsx`):**
  - **Hidden by default:** When creating or when `isFeatured` is unchecked, the image uploader is hidden.
  - **Visible when featured:** Toggling **Featured Review** (`isFeatured: true`) reveals the **Featured Background / Side Card Image** upload box.
  - High-resolution banner uploader designed specifically for carousel background or side card display.
- **Rating Selector:** Interactive 5-star rating selector (`1.0` to `5.0`).
- **Story Details (`StoryDetails.tsx`):** Displays resident name, profession, rating stars, location, testimonial quote, and full-width background banner preview with a "View Full" asset link.

### 5.10 FAQs (`src/app/admin/(panel)/faq/page.tsx`)
- **Features:** Comprehensive knowledge base management.
- **Categories Supported:**
  - `general`: General
  - `booking`: Booking & Reservations
  - `payment`: Payment & Pricing
  - `safety`: Safety & Security
  - `living`: Living at Aurus
  - `move`: Move-in & Move-out
- **Table Features:**
  - Filter bar: Search by question/answer, filter by category dropdown, filter by active status, sort options, and a one-click **Reset** button.
  - Interactive status chips with instant toggle action.
  - Expandable row or modal for quick question & answer inspection.
- **Creation Options (`CreateFaq.tsx`):**
  1. *Single FAQ Mode:* Add one question, answer, category, sort order, and active status.
  2. *Category Batch Mode:* Select a category and dynamically add multiple Q&A pairs to submit simultaneously in a single API call (`POST /api/admin/faqs`).
- **Bulk Edit Mode (`BulkEditFaq.tsx`):**
  - Modal allowing administrators to select a category and edit all questions, answers, sort orders, and active statuses for that category at once (`PATCH /api/admin/faqs/bulk`).

---

## 6. Media Handling & Axios Configuration

### 6.1 Media Contract
All media objects in the application follow the standardized structure:
```typescript
interface IFileOption {
  url: string;        // Complete, stable HTTPS URL for direct rendering
  publickey: string;  // S3 object key (e.g., "images/cities/1740000000-abcd.webp")
}
```

### 6.2 URL Resolution Helper (`src/lib/media.ts`)
The `getMediaUrl(keyOrUrl)` utility safely normalizes media references:
- Returns `null` if the input is falsy or blank.
- Preserves existing absolute URLs (`http://` or `https://`).
- Prefixes S3 keys with `AWS_CLOUDFRONT_DOMAIN` if configured.
- Constructs standard regional S3 bucket URLs (`https://<bucket>.s3.<region>.amazonaws.com/<key>`) using environment variables or fallback values.

### 6.3 Axios FormData Interceptor (`src/lib/admin-api.ts`)
To prevent conflicts between the Axios default `Content-Type: application/json` header and native browser multipart boundary generation:
```typescript
adminApiClient.interceptors.request.use((config) => {
  if (typeof FormData !== "undefined" && config.data instanceof FormData) {
    if (config.headers) {
      delete config.headers["Content-Type"];
      delete config.headers["content-type"];
    }
  }
  return config;
});
```
This enables all administrative forms to seamlessly dispatch `FormData` (with binary images/PDFs) or standard JSON payloads without manual header overrides.

---

## 7. UI Component Primitives & Design Tokens

Located in `src/components/admin/ui/`:

### 7.1 `AdminUI.tsx`
- **`Btn`:** Button supporting variants (`brand`, `ghost`, `dark`, `danger`, `outline`), sizes (`sm`, `md`, `lg`), and loading spin states.
- **`Chip`:** Status pill supporting tone variants (`mint`, `rose`, `amber`, `sea`, `slate`, `ember`) with optional pulsing status dot.
- **`Card` & `CardHead`:** Rounded bento containers with optional hover elevation, header titles, and action slots.
- **`FormField`:** Standardized label, required asterisk, helper hint, and validation error message wrapper.
- **`TextInput`:** Consistent styled input field with focus ring and error states.
- **`Avatar`:** Name initials or image circle with gradient fallback.
- **`Sparkline`:** Inline SVG path component rendering KPI trend curves.

### 7.2 `AdminIcons.tsx`
Resolution-independent, scalable SVG icon set containing standard administrative glyphs:
- `grid`, `building`, `flow`, `users`, `card`, `mega`, `chat`, `calendar`, `bed`, `cog`, `search`, `bell`, `head`, `phone`, `mail`, `pin`, `pen`, `info`, `x`, `plus`, `check`, `refresh`, `filter`, `home`, `star`, `fileText`, `trash`, `eye`, `clock`, etc.

---

## 8. Environment Variables & Setup

### Environment Configuration (`.env.local` or `.env`):
```ini
# Base Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# AWS S3 Public Fallbacks (Used by isomorphic media helpers)
NEXT_PUBLIC_AWS_S3_BUCKET_NAME=your-aurus-s3-bucket
NEXT_PUBLIC_AWS_REGION=ap-south-1

# Optional CloudFront CDN Domain
# NEXT_PUBLIC_AWS_CLOUDFRONT_DOMAIN=cdn.aurus.com
```

### Local Development Setup:
```bash
# 1. Install dependencies
npm install

# 2. Seed initial administrator account (if not already seeded)
npm run seed:admin

# 3. Start local development server (with Turbopack)
npm run dev

# 4. Access Admin Panel
# Open http://localhost:3000/admin in your browser
```

### Build & Verification Commands:
```bash
# Run TypeScript compilation check
npx tsc --noEmit

# Run ESLint validation
npm run lint

# Production build
npm run build

# Start production server
npm start
```
