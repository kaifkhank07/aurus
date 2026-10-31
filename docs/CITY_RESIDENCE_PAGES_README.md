# Automatic Dynamic City-Wise Residence Pages

This documentation explains the architecture, flow, logic, and implementation details for the **Fully Automatic Dynamic City-Wise Residence Landing Pages** in Aurus.

---

## 1. Feature Overview

The goal of this feature is to automatically provide city-specific residence landing pages at URLs such as:
- `/residences/mumbai`
- `/residences/pune`
- `/residences/ahmedabad`
- `/residences/noida`

### Core Principles
1. **Zero Manual Page Creation & Zero Admin Registration:** No separate page component or admin approval is needed to create city pages.
2. **Single Reusable Template:** Every city landing page reuses the exact same Aurus design system, layout, cards, animations, and typography as the main `/residences` page.
3. **Database as Single Source of Truth:** Pages are powered directly by the existing MongoDB collections (`City`, `Hostel`, `Occupancy`, `Room`, `Service`, `Institute`, and `RentFrequency`). No duplicate collections or synthetic data models are introduced.
4. **Strict Automatic Availability (404 Rule):** A city page becomes accessible if and only if the city exists in City Master (`City` collection where `isActive: true`) and has at least one active, published residence (`Hostel` collection where `isActive: true` and `location.city === city._id`). If a city does not exist or has 0 published residences, Next.js immediately returns HTTP 404 (`notFound()`).

---

## 2. Architecture & Data Flow

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        Visitor requests URL                            │
│                      e.g. /residences/mumbai                           │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│             Next.js Dynamic Route: /residences/[citySlug]              │
│               (src/app/residences/[citySlug]/page.tsx)                 │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│       1. Validate & Fetch City from City Master via Mongoose           │
│       City.findOne({ slug: citySlug.toLowerCase(), isActive: true })   │
└───────────────────┬───────────────────────────────┬────────────────────┘
                    │                               │
             City Not Found                   City Found
                    │                               │
                    ▼                               ▼
┌───────────────────────────────────────┐ ┌──────────────────────────────┐
│ Check single residence fallback       │ │ 2. Verify Published          │
│ (e.g. static chapter or DB hostel)    │ │    Residences Count          │
│ - If match: render ResidenceDetail    │ │ Hostel.countDocuments({      │
│ - If no match: Next.js notFound() 404 │ │   "location.city": city._id, │
└───────────────────────────────────────┘ │   isActive: true             │
                                          │ })                           │
                                          └──────────────┬───────────────┘
                                                         │
                                  ┌──────────────────────┴─────────────────────┐
                                  │                                            │
                            Count === 0                                   Count >= 1
                                  │                                            │
                                  ▼                                            ▼
                      ┌──────────────────────┐                    ┌────────────────────────┐
                      │ Next.js notFound()   │                    │ 3. Fetch Residences    │
                      │ (HTTP 404)           │                    │    for this City       │
                      └──────────────────────┘                    └───────────┬────────────┘
                                                                              │
                                                                              ▼
                                                                  ┌────────────────────────┐
                                                                  │ 4. Generate Dynamic    │
                                                                  │    City SEO Metadata   │
                                                                  └───────────┬────────────┘
                                                                              │
                                                                              ▼
                                                                  ┌────────────────────────┐
                                                                  │ 5. Render Aurus City   │
                                                                  │    Residence Page:     │
                                                                  │    - CityHero          │
                                                                  │    - CityIntroduction  │
                                                                  │    - Filter Bar        │
                                                                  │    - Residence Cards   │
                                                                  │    - UpcomingChapters  │
                                                                  │    - LifeAtAurus       │
                                                                  └────────────────────────┘
```

---

## 3. Database Relationships

The system relies strictly on the actual relationships established in the Mongoose models:

### 1. `City` Model (`src/models/city.model.ts`)
- **Collection:** `cities`
- **Fields:**
  - `city`: Name of the city (e.g., `"Mumbai"`, `"Pune"`).
  - `state`: State (e.g., `"Maharashtra"`).
  - `country`: Country (e.g., `"India"`).
  - `slug`: Unique lowercase slug (e.g., `"mumbai"`, `"pune"`).
  - `isActive`: Boolean flag indicating if the city is active.
  - `image`: Optional `{ url, publickey }`.
  - `metadata`: Optional `{ title, description, keywords }`.

### 2. `Hostel` Model (`src/models/hostel.model.ts`)
- **Collection:** `hostels`
- **Fields:**
  - `title`: Name of the hostel/residence.
  - `slug`: Unique lowercase slug (e.g., `"chapter-i"`, `"solitaire-residence"`).
  - `subtitle`: Optional descriptive subtitle/tagline.
  - `isActive`: Boolean flag indicating if the hostel is published/active.
  - `tenantType`: Single string enum (`"girls" | "boys" | "co-ed"`).
  - `rent`: Object `{ amount: number, frequency: ObjectId (ref: "RentFrequency") }`.
  - `rating`: Object `{ star: number (0-5), userCount: number }`.
  - `location.city`: `ObjectId` referencing the `City` model.
  - `location.locality`: `ObjectId` referencing the `Locality` model.
  - `location.address`: Physical street address string.
  - `location.mapUrl`: Optional Google Maps URL.
  - `frontImage`: Main cover image object `{ url, publickey }`.
  - `galleryImages`: Additional gallery images array `[{ url, publickey }]`.
  - `brochure`: Optional PDF document `{ url, publickey }`.
  - `amenities`: Array of `ObjectId`s referencing `Amenity` model.
  - `occupancy`: Array of `ObjectId`s referencing `Occupancy` model.
  - `room`: Array of `ObjectId`s referencing `Room` model.
  - `services`: Array of `ObjectId`s referencing `Service` model.
  - `institute`: Array of `ObjectId`s referencing `Institute` model (filtered by City).
  - `metadata`: SEO metadata `{ title, description, keywords }`.

### Eligible Residence Criteria
A residence is considered eligible for display if and only if:
1. `isActive === true` (published and active).
2. `location.city === city._id` (associated with the requested city).
3. The parent city itself is active (`isActive === true`).

---

## 4. Automatic Page Availability Lifecycle

| City in Master | Active Hostels | Outcome | Description |
|---|---|---|---|
| **Mumbai** | $\ge 1$ | **200 OK** | Available immediately; lists active Mumbai residence(s). |
| **Pune** | 0 | **404 Not Found** | Exists in City Master but has 0 published residences. |
| **Ahmedabad** | 0 | **404 Not Found** | Does not exist in City Master. |
| **Invalid Slug** | 0 | **404 Not Found** | Arbitrary or malformed slug. |

### Dynamic Lifecycle
- **When a new hostel is published in Pune:** `/residences/pune` automatically transitions from 404 to 200 OK without manual page creation or redeployment.
- **When all hostels in a city are unpublished or deleted:** The city page automatically returns 404 on subsequent requests.

---

## 5. API Endpoints

All public residence endpoints delegate their query logic and business rules directly to dedicated controller functions (`hostel.controller.ts` and `residence.controller.ts`):

### 1. `GET /api/residences/cities`
Retrieves all cities from City Master that have at least one eligible (active) published residence.

- **URL:** `/api/residences/cities`
- **Method:** `GET`
- **Data Source:** `getCitiesWithResidences` (`src/lib/residences/city.ts`)
- **Auth:** Public
- **Example Response:**
  ```json
  {
    "success": true,
    "message": "Available cities retrieved successfully",
    "data": [
      {
        "_id": "6ae10cee2bcc4dc0ad035a61",
        "name": "Mumbai",
        "slug": "mumbai",
        "state": "Maharashtra",
        "country": "India",
        "count": 1
      }
    ]
  }
  ```

### 2. `GET /api/residences/cities/:citySlug`
Retrieves city details and verifies that the city has eligible residences. Returns 404 if the city does not exist or has 0 eligible residences.

- **URL:** `/api/residences/cities/mumbai`
- **Method:** `GET`
- **Data Source:** `getCityBySlug` (`src/lib/residences/city.ts`)
- **Auth:** Public
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "City retrieved successfully",
    "data": {
      "_id": "6ae10cee2bcc4dc0ad035a61",
      "name": "Mumbai",
      "slug": "mumbai",
      "state": "Maharashtra",
      "country": "India",
      "count": 1
    }
  }
  ```
- **Error Response (404 Not Found):**
  ```json
  {
    "success": false,
    "message": "City not found or has no eligible residences"
  }
  ```

### 3. `GET /api/residences`
Retrieves published active residences with multi-dimensional filtering by city slug, city ID, tenant type, occupancy option, and text search.

- **URL:** `/api/residences?citySlug=mumbai&tenantType=boys&occupancy=Single`
- **Method:** `GET`
- **Controller Action:** `listPublic` (`src/controllers/hostel.controller.ts`)
- **Query Parameters:**
  - `citySlug` (string): Filter by city slug (e.g. `mumbai`).
  - `cityId` (string): Filter by City `ObjectId`.
  - `tenantType` (string): Filter by tenant wing (`girls`, `boys`, `co-ed`).
  - `occupancy` (string): Filter by Occupancy `ObjectId` or occupancy name (e.g. `Single`, `Double Sharing`).
  - `search` (string): Case-insensitive text search across title, subtitle, and address.
  - `page` (number): Page number (default: 1).
  - `limit` (number): Number of items per page (default: 20).
- **Example Response:**
  ```json
  {
    "success": true,
    "message": "Residences retrieved successfully",
    "data": {
      "items": [
        {
          "_id": "6ae10e0f2bcc4dc0ad035a65",
          "id": "6ae10e0f2bcc4dc0ad035a65",
          "title": "Solitaire Residence",
          "slug": "solitaire-residence",
          "tenantType": "boys",
          "isActive": true,
          "rent": {
            "amount": 22000,
            "frequency": {
              "_id": "6ae10e0f2bcc4dc0ad035a90",
              "name": "Monthly"
            }
          },
          "rating": {
            "star": 4.8,
            "userCount": 42
          },
          "location": {
            "city": { "city": "Mumbai", "slug": "mumbai", "state": "Maharashtra" },
            "locality": { "name": "Andheri West", "slug": "andheri-west" },
            "address": "Opposite Infinity Mall, Link Road, Andheri West"
          },
          "amenities": [
            { "_id": "6ae10e0f2bcc4dc0ad035a11", "name": "High-speed Wi-Fi" }
          ],
          "occupancy": [
            { "_id": "6ae10e0f2bcc4dc0ad035a22", "name": "Single" }
          ],
          "room": [
            { "_id": "6ae10e0f2bcc4dc0ad035a33", "name": "AC Deluxe" }
          ],
          "services": [
            { "_id": "6ae10e0f2bcc4dc0ad035a44", "name": "Daily Housekeeping" }
          ],
          "institute": [
            { "_id": "6ae10e0f2bcc4dc0ad035a55", "name": "NMIMS" }
          ]
        }
      ],
      "total": 1,
      "page": 1,
      "limit": 20,
      "totalPages": 1
    }
  }
  ```

---

## 6. Frontend Dynamic Route & UI Components

### Route Structure
```text
src/
├── app/
│   ├── residences/
│   │   ├── page.tsx                      # Main all-cities residences page
│   │   └── [citySlug]/
│   │       └── page.tsx                  # Dual-purpose: Dynamic city landing page & single residence fallback
│   └── api/
│       └── residences/
│           ├── route.ts                  # GET /api/residences -> hostel.controller.listPublic
│           └── cities/
│               ├── route.ts              # GET /api/residences/cities -> getCitiesWithResidences
│               └── [citySlug]/
│                   └── route.ts          # GET /api/residences/cities/[citySlug] -> getCityBySlug
├── controllers/
│   └── hostel.controller.ts              # Contains listPublic (public residences endpoint logic with occupancy filter)
├── components/
│   └── residences/
│       ├── ExploreResidences.tsx         # Dynamic public residences card grid & search
│       └── city/
│           ├── CityHero.tsx              # City-specific hero banner & chapter count badge
│           ├── CityIntroduction.tsx      # Curated features (Dining, Security, Study Hubs)
│           └── CityResidenceContent.tsx  # Dynamic filter bar (search, gender wing, occupancy) + Cards Grid
└── lib/
    └── residences/
        ├── city.ts                       # Database access & data mapping utilities (getCitiesWithResidences, getCityBySlug)
        └── detail.ts                     # Residence detail loader & related hostels mapping (getHostelBySlug, getRelatedHostels)
```

### Dynamic SEO Metadata
`generateMetadata()` in `src/app/residences/[citySlug]/page.tsx` dynamically populates:
- **Title:** Custom metadata title from `City.metadata.title` or `Student Residences in ${city.name} | Aurus`.
- **Description:** `City.metadata.description` or `Explore premium student residences and accommodation options in ${city.name} with Aurus. Gourmet dining, high-speed fibre Wi-Fi, and 24/7 security.`.
- **Keywords:** Automatic city-specific tags (`residences in Mumbai`, `student hostel Mumbai`, `luxury hostel Mumbai`).
- **Canonical URL:** `/residences/${city.slug}`.
- **OpenGraph:** OpenGraph card with city title, description, and city image URL (if uploaded).

### Single Residence Fallback
The route `src/app/residences/[citySlug]/page.tsx` intelligently distinguishes between city pages and individual residence detail pages:
1. If the slug matches an active City with $\ge 1$ published residences: renders the **City Residence Landing Page** (`CityResidenceContent`).
2. If the slug matches an individual residence (e.g. `/residences/chapter-i` or a hostel slug): renders the **Residence Detail Page** (`ResidenceDetail` + `RelatedResidences`).
3. If the slug matches neither: calls Next.js `notFound()` to render the 404 page.

### Static Pre-Generation (`generateStaticParams`)
`generateStaticParams()` queries MongoDB for:
- All active cities with $\ge 1$ published residence (`getCitiesWithResidences()`).
- All active published hostels (`Hostel.find({ isActive: true }).select("slug")`).
- Deduplicates all slugs to ensure pre-rendered static HTML is created for both city pages and residence detail pages during build time.

---

## 7. Verification & Automated Test Results

The suite in `src/scripts/test-city-residences.ts` verified all 7 key test cases against live MongoDB data:

| Test Case | Scenario | Expected | Result |
|---|---|---|---|
| **Test 1** | `getCitiesWithResidences()` | Returns only cities with $\ge 1$ active hostels | **PASS** (Mumbai returned with count 1; Pune excluded) |
| **Test 2** | `getCityBySlug('mumbai')` | Resolves city details & count | **PASS** (Returns Mumbai details, count = 1) |
| **Test 3** | `getCityBySlug('pune')` | City with 0 active hostels | **PASS** (Returns `null` -> triggers Next.js 404) |
| **Test 4** | `getCityBySlug('ahmedabad')` | City not in City Master | **PASS** (Returns `null` -> triggers Next.js 404) |
| **Test 5** | `getCityBySlug('invalid-xyz')` | Arbitrary invalid slug | **PASS** (Returns `null` -> triggers Next.js 404) |
| **Test 6** | `getResidencesByCityId()` | Fetches and maps residences | **PASS** (Correct locality, rent, frontImage, and badge) |
| **Test 7** | Availability Lifecycle | Add hostel to Pune -> page available; remove hostel -> returns to 404 | **PASS** (100% automatic lifecycle verified) |

### Build Status
- `npx tsc --noEmit`: Exited with code `0` (Zero TypeScript errors).
- `npm run build`: Exited with code `0` (Next.js production build succeeded with Turbopack, Partial Prefetching, and Cache Components across all 61 routes).

---

## 8. Client-Side Options Store & Footer Integration

To ensure the public site automatically displays links to active city pages without manual footer updates, the `usePublicOptions` Zustand store was created and integrated into the global `Footer` component.

### Architecture

```text
       ┌────────────────────────┐
       │   GET /api/residences  │
       │        /cities         │
       └───────────┬────────────┘
                   │
                   ▼ (Axios client)
       ┌────────────────────────┐
       │   usePublicOptions     │
       │     Zustand Store      │
       │  (with in-flight dedup │
       │   & response caching)  │
       └───────────┬────────────┘
                   │
                   ▼ (Zustand hook)
       ┌────────────────────────┐
       │    Footer Component    │
       │  Column: OUR RESIDENCES│
       │  (Dynamic city links)  │
       └────────────────────────┘
```

### Store Features (`src/store/usePublicOptions.tsx`)
- **State Properties:**
  - `residenceCities: PublicResidenceCity[]`: List of cities with $\ge 1$ published residence.
  - `isLoading: boolean`: Loading state indicator.
  - `isFetched: boolean`: Boolean flag preventing redundant network requests once populated.
  - `error: string | null`: Error state captured using standard Axios error extraction.
- **Actions:**
  - `fetchResidenceCities(force?: boolean)`: Fetches active cities from `/api/residences/cities`. Reuses already-fetched state unless `force === true`.
  - **In-Flight Request Deduplication:** Prevents multiple simultaneous network calls when multiple components mount concurrently.
- **Footer Integration (`src/components/layout/Footer.tsx`):**
  - Consumes `residenceCities`, `isFetched`, and `fetchResidenceCities`.
  - Replaces hardcoded city links in the `OUR RESIDENCES` column with dynamic links (`/residences/${city.slug}`).
  - Preserves exact typography, font-mono uppercase styling, layout, and mobile/desktop responsive behavior.
  - Handles loading and empty states gracefully without showing technical errors or broken links.
