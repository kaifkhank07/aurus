# Aurus Admin Panel — Backend Logic & APIs Documentation

Comprehensive reference documentation covering the backend architecture, authentication flows, database schemas, validation rules, business logic controllers, slug generation, S3 media management, and master CRUD APIs of the **Aurus Admin Panel**.

---

## 1. Backend Architecture & Tech Stack

- **Framework:** Next.js 16 (App Router API Route Handlers) & Node.js
- **Language:** TypeScript
- **Database & ODM:** MongoDB with **Mongoose v9**
  - Cached connection singleton (`src/lib/mongodb.ts`) ensuring connection reuse across serverless and long-running route invocations.
- **Validation Engine:** **Zod v4**
  - Strict runtime type checking (`.strict()`) to prevent client-injected or unexpected fields.
  - Custom refinements (`superRefine`) for conditional requirements and dependency rules.
- **Authentication & Security:**
  - Stateless JSON Web Tokens (**JWT**) signed with `HS256` via `jsonwebtoken`.
  - Passwords hashed using `bcryptjs` (salt factor 10).
  - Tokens strictly stored and transmitted in `HttpOnly`, `SameSite=lax` secure cookies (`admin_access_token`).
- **Media & File Storage:**
  - AWS SDK v3 (`@aws-sdk/client-s3`, `@aws-sdk/s3-request-presigner`).
  - Unified media contract: `{ url: string, publickey: string }`.
  - In-controller multipart `FormData` processing (uploads handled directly inside entity endpoints without separate upload routes).
  - Binary magic-byte inspection (detects true MIME types, preventing extension spoofing).
  - Cross-collection safe deletion (guarantees shared assets are not deleted from S3 if referenced elsewhere).
  - Isomorphic URL resolution via `src/lib/media.ts` supporting direct S3 URLs and CloudFront CDNs.
- **Response Formatting:** Standardized response envelopes (`apiSuccess`, `apiError`) with structured field-by-field error details.
- **Logging:** Structured backend logger (`src/lib/logger.ts`) with automatic credential redaction, log injection protection, and JSON production formatting.

---

## 2. Directory Structure & File Map

```text
src/
├── app/
│   └── api/
│       ├── admin/
│       │   ├── route.ts                       # GET: Paginated admin accounts, POST: Create admin
│       │   ├── [id]/route.ts                  # GET, PATCH, DELETE administrator by ID
│       │   ├── auth/
│       │   │   ├── login/route.ts             # POST: Authenticate & issue HTTP-only cookie
│       │   │   ├── logout/route.ts            # POST: Invalidate session & clear cookie
│       │   │   └── me/route.ts                # GET: Verify session & return admin profile
│       │   ├── cities/
│       │   │   ├── route.ts                   # GET: List cities, POST: Create city
│       │   │   └── [id]/route.ts              # GET, PATCH, DELETE city
│       │   ├── localities/
│       │   │   ├── route.ts                   # GET: List localities, POST: Create locality
│       │   │   └── [id]/route.ts              # GET, PATCH, DELETE locality
│       │   ├── institutes/
│       │   │   ├── route.ts                   # GET: List institutes, POST: Create institute
│       │   │   └── [id]/route.ts              # GET, PATCH, DELETE institute
│       │   ├── occupancies/
│       │   │   ├── route.ts                   # GET: List occupancies, POST: Create occupancy
│       │   │   └── [id]/route.ts              # GET, PATCH, DELETE occupancy
│       │   ├── amenities/
│       │   │   ├── route.ts                   # GET: List amenities, POST: Create amenity
│       │   │   └── [id]/route.ts              # GET, PATCH, DELETE amenity
│       │   ├── hostels/
│       │   │   ├── route.ts                   # GET: List hostels, POST: Create hostel
│       │   │   └── [id]/route.ts              # GET, PATCH, DELETE hostel
│       │   ├── blogs/
│       │   │   ├── route.ts                   # GET: List blogs, POST: Create blog
│       │   │   └── [id]/route.ts              # GET, PATCH, DELETE blog
│       │   ├── stories/
│       │   │   ├── route.ts                   # GET: List stories, POST: Create story
│       │   │   └── [id]/route.ts              # GET, PATCH, DELETE story
│       │   ├── faqs/
│       │   │   ├── route.ts                   # GET: List FAQs, POST: Single/Batch create FAQs
│       │   │   ├── bulk/route.ts              # PATCH: Bulk update FAQs, DELETE: Bulk delete FAQs
│       │   │   └── [id]/route.ts              # GET, PATCH, DELETE FAQ
│       │   ├── booked-visits/
│       │   │   ├── route.ts                   # GET: List visits, POST: Create booked visit
│       │   │   └── [id]/route.ts              # GET, PATCH, DELETE booked visit
│       │   └── enquiries/
│       │       ├── route.ts                   # GET: List enquiries, POST: Create enquiry
│       │       └── [id]/route.ts              # GET, PATCH, DELETE enquiry
│       ├── booked-visits/
│       │   └── route.ts                       # POST: Public residence visit booking
│       ├── enquiries/
│       │   └── route.ts                       # POST: Public enquiry/callback submission
│       └── faqs/
│           └── route.ts                       # GET: Public active FAQs listing
│
├── controllers/
│   ├── admin.controller.ts                    # Administrator authentication and CRUD logic
│   ├── city.controller.ts                     # City master logic (S3 upload & cascade protection)
│   ├── locality.controller.ts                 # Locality business logic & city validation
│   ├── institute.controller.ts                # Institute business logic & city validation
│   ├── occupancy.controller.ts                # Occupancy master logic & S3 icon upload
│   ├── amenity.controller.ts                  # Amenity master logic & cascade protection
│   ├── hostel.controller.ts                   # Hostel master logic (multi-image & brochure S3 upload)
│   ├── blog.controller.ts                     # Blog master logic, tag normalization & cover upload
│   ├── story.controller.ts                    # Story logic, rating & conditional featured image upload
│   ├── faq.controller.ts                      # FAQ CRUD, single/batch create, bulk update/delete & public list
│   ├── booked-visit.controller.ts             # Booked visit CRUD & public appointment handling
│   └── enquiry.controller.ts                  # Enquiry CRUD, type-conditional fields & public submission
│
├── middleware/
│   └── admin-auth.ts                          # JWT cookie verification helper (authenticateAdmin)
│
├── models/
│   ├── admin.model.ts                         # Administrator Mongoose schema & indexes
│   ├── city.model.ts                          # City Mongoose schema, compound unique index & metadata
│   ├── locality.model.ts                      # Locality Mongoose schema & city relationship index
│   ├── institute.model.ts                     # Institute Mongoose schema & city relationship index
│   ├── occupancy.model.ts                     # Occupancy Mongoose schema & unique index
│   ├── amenity.model.ts                       # Amenity Mongoose schema & unique index
│   ├── hostel.model.ts                        # Hostel Mongoose schema, media array & location subdocument
│   ├── blog.model.ts                          # Blog Mongoose schema & tag indexes
│   ├── story.model.ts                         # Story Mongoose schema & featured indexes
│   ├── faq.model.ts                           # FAQ Mongoose schema, category enum & sort indexes
│   ├── booked-visit.model.ts                  # Booked visit Mongoose schema & date/time indexes
│   └── enquiry.model.ts                       # Enquiry Mongoose schema & type compound indexes
│
├── validations/
│   ├── admin.validation.ts                    # Zod schemas for admin login, creation, update & queries
│   ├── city.validation.ts                     # Zod schemas for city CRUD and query filtering
│   ├── locality.validation.ts                 # Zod schemas for locality CRUD and query filtering
│   ├── institute.validation.ts                # Zod schemas for institute CRUD and query filtering
│   ├── occupancy.validation.ts                # Zod schemas for occupancy CRUD and query filtering
│   ├── amenity.validation.ts                  # Zod schemas for amenity CRUD and query filtering
│   ├── hostel.validation.ts                   # Zod schemas for hostel CRUD and query filtering
│   ├── blog.validation.ts                     # Zod schemas for blog CRUD and query filtering
│   ├── story.validation.ts                    # Zod schemas for story CRUD & conditional featured image
│   ├── faq.validation.ts                      # Zod schemas for single/batch create, bulk update & queries
│   ├── booked-visit.validation.ts             # Zod schemas for visit booking & phone/date/time validation
│   └── enquiry.validation.ts                  # Zod schemas for enquiry CRUD & type-conditional fields
│
├── types/
│   ├── general.types.ts                       # Shared interfaces: IFileOption, ISeoMetadata, PaginationMeta
│   ├── admin.types.ts                         # Admin interfaces (SafeAdmin, JwtAdminPayload, AdminStatus)
│   ├── city.types.ts                          # City interfaces (SafeCity, CreateCityInput, UpdateCityInput)
│   ├── locality.types.ts                      # Locality interfaces (SafeLocality, CreateLocalityInput)
│   ├── institute.types.ts                     # Institute interfaces (SafeInstitute, CreateInstituteInput)
│   ├── occupancy.types.ts                     # Occupancy interfaces (SafeOccupancy, CreateOccupancyInput)
│   ├── amenity.types.ts                       # Amenity interfaces (SafeAmenity, CreateAmenityInput)
│   ├── hostel.types.ts                        # Hostel interfaces (SafeHostel, CreateHostelInput)
│   ├── blog.types.ts                          # Blog interfaces (SafeBlog, CreateBlogInput)
│   ├── story.types.ts                         # Story interfaces (SafeStory, CreateStoryInput)
│   ├── faq.types.ts                           # FAQ interfaces (SafeFaq, FaqCategory, GroupedFaqCategory)
│   ├── booked-visit.types.ts                  # Booked visit interfaces (SafeBookedVisit, etc.)
│   └── enquiry.types.ts                       # Enquiry interfaces (SafeEnquiry, EnquiryType, etc.)
│
└── lib/
    ├── cookies.ts                             # Utilities to set & clear HTTP-only auth cookies
    ├── jwt.ts                                 # JWT signing and verification helpers
    ├── mongodb.ts                             # Cached MongoDB Mongoose connection client
    ├── slug.ts                                # Reusable backend slug generator & collision resolver
    ├── media.ts                               # Centralized S3 & CloudFront URL builder (getMediaUrl)
    ├── api-response.ts                        # Standardized JSON response helpers & AppError class
    ├── logger.ts                              # Structured, secure backend logger
    └── s3.ts                                  # AWS S3 service (magic bytes, presigning, upload & safe delete)
```

---

## 3. Admin Authentication & Session Management

Authentication is managed **strictly on the backend**. The frontend never decodes or generates JWTs.

### Authentication Flow:
1. Client submits credentials to `POST /api/admin/auth/login`.
2. Controller verifies the administrator's email and compares the hashed password via `bcrypt.compare`.
3. If valid, signs a JWT containing `{ id, email, role: "admin" }` using `JWT_SECRET`.
4. Attaches the token in a secure HTTP-only cookie (`admin_access_token`) with attributes:
   - `HttpOnly: true` (inaccessible to JavaScript `document.cookie`).
   - `SameSite: "lax"`.
   - `Secure: process.env.NODE_ENV === "production"`.
   - `Path: "/"`.
   - `Max-Age: ADMIN_COOKIE_MAX_AGE` (default: 900 seconds / 15 minutes).
5. Downstream protected routes execute `authenticateAdmin(request)` (`src/middleware/admin-auth.ts`). If the cookie is absent, expired, or tampered with, the request is immediately rejected with HTTP `401 Unauthorized`.
6. `POST /api/admin/auth/logout` clears the cookie (`Max-Age=0`).
7. `GET /api/admin/auth/me` validates the token and returns the authenticated `SafeAdmin` document.

---

## 4. Backend-Managed Slug Generation (`src/lib/slug.ts`)

Slugs for master entities (City, Locality, Institute, Hostel, Blog) are calculated strictly on the backend:
- **Base Generation:** String converted to lowercase, special characters stripped, spaces and underscores converted to single hyphens, leading/trailing hyphens trimmed.
- **Collision Resolution:** Automatically queries the corresponding MongoDB collection. If `myslug` exists, appends `-2`, `-3`, etc., until an unused slug is found.
- **Update Handling:** When an entity is updated via `PATCH`:
  - If the name/title has not changed, the current slug is preserved.
  - If the name/title has changed, a new slug is generated. The current document's ID is excluded from collision checks.
- Validation schemas are marked `.strict()` to reject client attempts to manually submit a slug.

---

## 5. Master Modules & Data Schemas

### Shared Interfaces (`src/types/general.types.ts`):
```typescript
export interface IFileOption {
  url: string;        // Absolute, stable URL for the asset
  publickey: string;  // S3 object key (e.g., "images/cities/1740000000-abcd.webp")
}

export interface ISeoMetadata {
  title?: string;
  description?: string;
  keywords?: string[];
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}
```

---

### 5.1 City Master (`/api/admin/cities`)
- **Schema (`src/models/city.model.ts`):**
  - `country`: String, required, trimmed.
  - `state`: String, required, trimmed.
  - `city`: String, required, trimmed.
  - `slug`: String, required, unique index.
  - `image`: Subdocument matching `IFileOption` (`{ url, publickey }`), required.
  - `sortOrder`: Number, default `0`.
  - `isActive`: Boolean, default `true`.
  - `metadata`: Subdocument matching `ISeoMetadata`.
- **Indexes:** Compound unique index on `{ country: 1, state: 1, city: 1 }` with case-insensitive collation `{ locale: "en", strength: 2 }`.
- **Deletion Protection:** Blocked (HTTP 409 Conflict) if any Localities, Institutes, or Hostels reference this City.

### 5.2 Locality Master (`/api/admin/localities`)
- **Schema (`src/models/locality.model.ts`):**
  - `name`: String, required, trimmed.
  - `slug`: String, required, unique index.
  - `city`: `ObjectId` referencing `City`, required.
  - `isActive`: Boolean, default `true`.
- **Indexes:** Compound unique index on `{ city: 1, name: 1 }` with case-insensitive collation.
- **Deletion Protection:** Blocked (HTTP 409 Conflict) if referenced by any Hostels.
- **City Reassignment Protection:** Modifying a locality's `city` is blocked (HTTP 409) if existing hostels reference it.

### 5.3 Institute Master (`/api/admin/institutes`)
- **Schema (`src/models/institute.model.ts`):**
  - `name`: String, required, trimmed.
  - `slug`: String, required, unique index.
  - `city`: `ObjectId` referencing `City`, required.
  - `isActive`: Boolean, default `true`.
- **Indexes:** Compound unique index on `{ city: 1, name: 1 }` with case-insensitive collation.

### 5.4 Occupancy Master (`/api/admin/occupancies`)
- **Schema (`src/models/occupancy.model.ts`):**
  - `name`: String, required, trimmed (e.g., "Single Sharing", "Double Sharing").
  - `image`: Subdocument matching `IFileOption` (`{ url, publickey }`), optional.
  - `isActive`: Boolean, default `true`.
- **Indexes:** Unique index on `{ name: 1 }` with case-insensitive collation.

### 5.5 Amenity Master (`/api/admin/amenities`)
- **Schema (`src/models/amenity.model.ts`):**
  - `name`: String, required, trimmed (e.g., "High-Speed Wi-Fi", "Laundry").
  - `image`: Subdocument matching `IFileOption` (`{ url, publickey }`), optional.
  - `isActive`: Boolean, default `true`.
- **Indexes:** Unique index on `{ name: 1 }` with case-insensitive collation.
- **Deletion Protection:** Blocked (HTTP 409 Conflict) if referenced by any Hostels.

### 5.6 Hostel Master (`/api/admin/hostels`)
- **Schema (`src/models/hostel.model.ts`):**
  - `title`: String, required.
  - `slug`: String, required, unique index.
  - `subtitle`: String, optional.
  - `tenantType`: Array of Strings, required (`"boys"`, `"girls"`, `"co-ed"`).
  - `isActive`: Boolean, default `true`.
  - `frontImage`: `IFileOption` (`{ url, publickey }`), required.
  - `firstImage` & `secondImage`: `IFileOption`, optional.
  - `galleryImages`: Array of `IFileOption`, optional.
  - `brochure`: `IFileOption` (PDF), optional.
  - `rent`: Number, required, minimum `0`.
  - `rentFrequency`: Enum (`"monthly"`, `"yearly"`), required.
  - `amenities`: Array of `ObjectId` referencing `Amenity`.
  - `description`: String, required.
  - `location`: Subdocument:
    - `city`: `ObjectId` ref `City`, required.
    - `locality`: `ObjectId` ref `Locality`, required.
    - `address`: String, required.
    - `mapUrl`: String, optional URL.
    - `longitude` & `latitude`: Numbers, optional.
  - `metadata`: `ISeoMetadata`.
- **Relationship Validation:**
  - Validates that referenced `City` exists.
  - Validates that referenced `Locality` exists.
  - Enforces `locality.city === city`.
  - Validates all IDs in `amenities` exist.

### 5.7 Blog Master (`/api/admin/blogs`)
- **Schema (`src/models/blog.model.ts`):**
  - `title`: String, required.
  - `slug`: String, required, unique index.
  - `subtitle`: String, optional.
  - `image`: `IFileOption` (`{ url, publickey }`), required banner.
  - `tags`: Array of Strings (normalized: trimmed, lowercased, deduplicated).
  - `description`: String, required.
  - `metadata`: `ISeoMetadata`.

### 5.8 Stories Master (`/api/admin/stories`)
- **Schema (`src/models/story.model.ts`):**
  - `name`: String, required.
  - `profession`: String, required.
  - `rating`: Number between 1 and 5, required.
  - `location`: String, required.
  - `description`: String, required.
  - `isActive`: Boolean, default `true`.
  - `isFeatured`: Boolean, default `false`.
  - `image`: `IFileOption` (`{ url, publickey }`), optional when `isFeatured: false`, strictly required when `isFeatured: true`.
- **Conditional Featured Image Rule:**
  - `image` serves as the **Featured Background / Side Card Image**.
  - On create/update: If `isFeatured: true`, an image with valid `url` and `publickey` is strictly enforced via Zod refinement. If `isFeatured: false`, the image is optional.

### 5.9 FAQ Master (`/api/admin/faqs`)
- **Schema (`src/models/faq.model.ts`):**
  - `question`: String, required, trimmed (max 500 chars).
  - `answer`: String, required, trimmed (max 5000 chars).
  - `category`: String enum, required:
    - `"general"`: General
    - `"booking"`: Booking & Reservations
    - `"payment"`: Payment & Pricing
    - `"safety"`: Safety & Security
    - `"living"`: Living at Aurus
    - `"move"`: Move-in & Move-out
  - `sortOrder`: Number, default `0`.
  - `isActive`: Boolean, default `true`.
- **Indexes:** `{ category: 1, sortOrder: 1 }`, `{ isActive: 1, category: 1 }`, `{ createdAt: -1 }`.
- **Batch & Bulk Support:**
  - `POST /api/admin/faqs`: Supports single FAQ object or `{ category, faqs: [...] }` to add multiple FAQs for a category simultaneously.
  - `PATCH /api/admin/faqs/bulk`: Accepts `{ items: [{ id, question, answer, category, sortOrder, isActive }] }` to update multiple records atomically.
  - `DELETE /api/admin/faqs/bulk`: Accepts `{ ids: string[] }` to delete an array of FAQs in one request.

### 5.10 Booked Visits Master (`/api/admin/booked-visits`)
- **Schema (`src/models/booked-visit.model.ts`):**
  - `name`: String, required.
  - `number`: String, required (phone string preserving formatting).
  - `location`: String, required.
  - `iam`: String, required (e.g., Student, Parent, Working Professional).
  - `preferredDate`: Date, required.
  - `preferredTime`: String, required (12h or 24h format).
- **Public Entry:** Unauthenticated website users submit visits via `POST /api/booked-visits`.

### 5.11 Enquiries Master (`/api/admin/enquiries`)
- **Schema (`src/models/enquiry.model.ts`):**
  - `type`: Enum (`"query"`, `"request"`), required.
  - `name`: String, required.
  - `number`: String, required.
  - `location`: String, conditional (required if `type === "query"`).
  - `iam`: String, conditional (required if `type === "query"`).
  - `message`: String, conditional (required if `type === "query"`).
- **Public Entry:** Unauthenticated website users submit enquiries via `POST /api/enquiries`.

---

## 6. API Endpoints Reference Table

All administrative endpoints require authentication via `admin_access_token` cookie unless marked **Public**.

| Path | Method | Auth | Description | Request Body / Parameters |
| :--- | :--- | :--- | :--- | :--- |
| `/api/admin/auth/login` | `POST` | Public | Authenticates admin & sets cookie | `{ email, password }` |
| `/api/admin/auth/logout` | `POST` | Public | Clears session cookie | None |
| `/api/admin/auth/me` | `GET` | Admin | Returns authenticated admin profile | None |
| `/api/admin` | `GET` | Admin | Lists paginated administrators | Query: `page`, `limit`, `search`, `status` |
| `/api/admin` | `POST` | Admin | Creates new administrator account | `{ name, email, password, status }` |
| `/api/admin/[id]` | `GET` | Admin | Retrieves administrator by ID | None |
| `/api/admin/[id]` | `PATCH` | Admin | Updates administrator profile | `{ name?, email?, password?, status? }` |
| `/api/admin/[id]` | `DELETE` | Admin | Deletes administrator (no self-delete) | None |
| `/api/admin/cities` | `GET` | Admin | Lists cities with pagination & search | Query: `page`, `limit`, `search`, `isActive` |
| `/api/admin/cities` | `POST` | Admin | Creates city (FormData or JSON) | `FormData` or `{ country, state, city, image, sortOrder, metadata }` |
| `/api/admin/cities/[id]` | `GET` | Admin | Retrieves city by ID | None |
| `/api/admin/cities/[id]` | `PATCH` | Admin | Updates city details/image | `FormData` or `{ country?, state?, city?, image?, sortOrder?, metadata? }` |
| `/api/admin/cities/[id]` | `DELETE` | Admin | Deletes city (checks dependencies) | None |
| `/api/admin/localities` | `GET` | Admin | Lists localities | Query: `city`, `search`, `isActive`, `page`, `limit` |
| `/api/admin/localities` | `POST` | Admin | Creates locality | `{ name, city, isActive }` |
| `/api/admin/localities/[id]` | `PATCH` | Admin | Updates locality | `{ name?, city?, isActive? }` |
| `/api/admin/localities/[id]` | `DELETE` | Admin | Deletes locality (checks hostel refs) | None |
| `/api/admin/institutes` | `GET` | Admin | Lists institutes | Query: `city`, `search`, `isActive`, `page`, `limit` |
| `/api/admin/institutes` | `POST` | Admin | Creates institute | `{ name, city, isActive }` |
| `/api/admin/institutes/[id]` | `PATCH` | Admin | Updates institute | `{ name?, city?, isActive? }` |
| `/api/admin/institutes/[id]` | `DELETE` | Admin | Deletes institute | None |
| `/api/admin/occupancies` | `GET` | Admin | Lists room occupancies | Query: `search`, `isActive`, `page`, `limit` |
| `/api/admin/occupancies` | `POST` | Admin | Creates occupancy | `FormData` or `{ name, image?, isActive? }` |
| `/api/admin/occupancies/[id]` | `PATCH` | Admin | Updates occupancy | `FormData` or `{ name?, image?, isActive? }` |
| `/api/admin/occupancies/[id]` | `DELETE` | Admin | Deletes occupancy | None |
| `/api/admin/amenities` | `GET` | Admin | Lists amenities | Query: `search`, `isActive`, `page`, `limit` |
| `/api/admin/amenities` | `POST` | Admin | Creates amenity | `FormData` or `{ name, image?, isActive? }` |
| `/api/admin/amenities/[id]` | `PATCH` | Admin | Updates amenity | `FormData` or `{ name?, image?, isActive? }` |
| `/api/admin/amenities/[id]` | `DELETE` | Admin | Deletes amenity (checks hostel refs) | None |
| `/api/admin/hostels` | `GET` | Admin | Lists hostels with full population | Query: `city`, `locality`, `tenantType`, `minRent`, `maxRent`, `search`, `isActive` |
| `/api/admin/hostels` | `POST` | Admin | Creates hostel residence | `FormData` (frontImage, firstImage, secondImage, galleryImages, brochure, etc.) |
| `/api/admin/hostels/[id]` | `GET` | Admin | Retrieves complete hostel dossier | None |
| `/api/admin/hostels/[id]` | `PATCH` | Admin | Updates hostel fields/media | `FormData` or JSON payload |
| `/api/admin/hostels/[id]` | `DELETE` | Admin | Deletes hostel & safe cleans S3 | None |
| `/api/admin/blogs` | `GET` | Admin | Lists journal blog posts | Query: `search`, `tag`, `page`, `limit` |
| `/api/admin/blogs` | `POST` | Admin | Publishes blog post | `FormData` or `{ title, subtitle, image, tags, description, metadata }` |
| `/api/admin/blogs/[id]` | `PATCH` | Admin | Updates blog post | `FormData` or JSON payload |
| `/api/admin/blogs/[id]` | `DELETE` | Admin | Deletes blog post & cleans S3 banner | None |
| `/api/admin/stories` | `GET` | Admin | Lists resident stories/reviews | Query: `search`, `isActive`, `isFeatured`, `page`, `limit` |
| `/api/admin/stories` | `POST` | Admin | Creates resident story | `FormData` or `{ name, profession, rating, location, description, isFeatured, image }` |
| `/api/admin/stories/[id]` | `PATCH` | Admin | Updates resident story | `FormData` or JSON payload |
| `/api/admin/stories/[id]` | `DELETE` | Admin | Deletes story & cleans S3 asset | None |
| `/api/admin/faqs` | `GET` | Admin | Lists FAQs with query & filters | Query: `category`, `search`, `isActive`, `grouped`, `sortBy`, `sortOrder`, `page`, `limit` |
| `/api/admin/faqs` | `POST` | Admin | Single or Category Batch create | Single: `{ question, answer, category, sortOrder, isActive }`<br>Batch: `{ category, faqs: [...] }` |
| `/api/admin/faqs/[id]` | `GET` | Admin | Retrieves FAQ by ID | None |
| `/api/admin/faqs/[id]` | `PATCH` | Admin | Updates individual FAQ | `{ question?, answer?, category?, sortOrder?, isActive? }` |
| `/api/admin/faqs/[id]` | `DELETE` | Admin | Deletes individual FAQ | None |
| `/api/admin/faqs/bulk` | `PATCH` | Admin | Bulk updates multiple FAQs | `{ items: [{ id, question, answer, category, sortOrder, isActive }] }` |
| `/api/admin/faqs/bulk` | `DELETE` | Admin | Bulk deletes array of FAQs | `{ ids: string[] }` |
| `/api/admin/booked-visits` | `GET` | Admin | Lists scheduled visits | Query: `location`, `search`, `preferredDate`, `page`, `limit` |
| `/api/admin/booked-visits` | `POST` | Admin | Manually creates booked visit | `{ name, number, location, iam, preferredDate, preferredTime }` |
| `/api/admin/booked-visits/[id]` | `GET` | Admin | Retrieves visit details | None |
| `/api/admin/booked-visits/[id]` | `PATCH` | Admin | Updates appointment | `{ name?, number?, location?, iam?, preferredDate?, preferredTime? }` |
| `/api/admin/booked-visits/[id]` | `DELETE` | Admin | Deletes visit record | None |
| `/api/admin/enquiries` | `GET` | Admin | Lists inquiries and callbacks | Query: `type`, `search`, `page`, `limit` |
| `/api/admin/enquiries` | `POST` | Admin | Manually creates inquiry | `{ type, name, number, location?, iam?, message? }` |
| `/api/admin/enquiries/[id]` | `GET` | Admin | Retrieves inquiry details | None |
| `/api/admin/enquiries/[id]` | `PATCH` | Admin | Updates inquiry | `{ type?, name?, number?, location?, iam?, message? }` |
| `/api/admin/enquiries/[id]` | `DELETE` | Admin | Deletes inquiry record | None |
| `/api/booked-visits` | `POST` | **Public** | Schedules residence visit | `{ name, number, location, iam, preferredDate, preferredTime }` |
| `/api/enquiries` | `POST` | **Public** | Submits inquiry or callback | `{ type, name, number, location?, iam?, message? }` |
| `/api/faqs` | `GET` | **Public** | Lists active public FAQs | Query: `category`, `grouped` |

---

## 7. Relationship Integrity & Protected Deletions

Orphaned records and dangling foreign keys are strictly blocked at the controller layer:

```text
City <───────────── Locality <─────────── Hostel
  │                                         │
  ├─────────────────────────────────────────┤ (location.city)
  │                                         │
  ├───────────── Institute                  │
  │                                         │
Amenity <───────────────────────────────────┘ (amenities array)
```

- **City Deletion:** Blocked (`HTTP 409 Conflict`) if any Localities, Institutes, or Hostels reference this City.
- **Locality Deletion:** Blocked (`HTTP 409 Conflict`) if referenced by Hostels.
- **Locality City Reassignment:** Blocked (`HTTP 409 Conflict`) if referenced by Hostels.
- **Amenity Deletion:** Blocked (`HTTP 409 Conflict`) if referenced by Hostels.
- **Hostel Creation / Update:** Rejected (`HTTP 400 Bad Request`) if `locality.city !== city`.

---

## 8. AWS S3 Storage Service & CloudFront Resolution

Built with AWS SDK v3 (`@aws-sdk/client-s3`), the storage service provides robust asset management across all six media-holding modules (`City`, `Amenity`, `Occupancy`, `Hostel`, `Blog`, `Story`).

### 8.1 Core Features:
- **Binary Magic-Byte Inspection:** Inspects buffer header bytes to ensure files are genuine images (`JPEG`, `PNG`, `WebP`, `GIF`, `SVG`) or documents (`PDF`). Files with spoofed extensions are rejected with `HTTP 422 Unprocessable Entity`.
- **Strict Size Limits:**
  - Images: 10 MB maximum (`MAX_IMAGE_SIZE_BYTES`).
  - Documents (PDF): 25 MB maximum (`MAX_PDF_SIZE_BYTES`).
- **Collision-Proof Keys:** Key format: `{type}s/{folder}/{timestamp}-{random16hex}.{ext}` (e.g., `images/cities/1740000000-abcd1234ef567890.webp`).
- **Safe Deletion Across Collections:** `safeDeleteS3File` checks across all models before executing `DeleteObjectCommand`. If another record references the same S3 key, deletion is safely skipped to protect shared assets.
- **Upload-First Replacement:** When an asset is replaced on `PATCH`, the database update is committed first before cleaning up the legacy S3 object.

### 8.2 In-Controller Multipart Handling:
Controllers handle multipart uploads directly:
```typescript
// Example: Hostel Controller creates or updates directly from FormData
const formData = await request.formData();
const frontImageFile = formData.get("frontImage");
if (frontImageFile instanceof File) {
  frontImage = await uploadS3File(frontImageFile, "hostels");
}
```

### 8.3 CloudFront URL Resolution (`src/lib/media.ts`):
The `getMediaUrl(keyOrUrl)` utility formats URLs automatically:
1. If already an absolute URL, preserves it (with auto-correction for legacy placeholder bucket references).
2. If `AWS_CLOUDFRONT_DOMAIN` is populated (e.g., `cdn.aurus.com`), resolves to `https://cdn.aurus.com/${key}`.
3. Otherwise, generates standard regional bucket URLs: `https://${bucket}.s3.${region}.amazonaws.com/${key}`.

---

## 9. Response Envelopes & Error Handling

Standardized response envelopes generated via `src/lib/api-response.ts`:

### Success Response (`apiSuccess`):
```json
{
  "success": true,
  "message": "Hostel created successfully.",
  "data": { ... }
}
```

### Error Response (`apiError`):
```json
{
  "success": false,
  "message": "Validation failed.",
  "errors": [
    { "field": "location.city", "message": "A valid city is required." }
  ]
}
```

- **Mongoose Duplicate Key Errors (`11000`):** Caught in controllers and converted to clean `HTTP 409 Conflict` responses.
- **Invalid MongoDB ObjectIds:** Caught via `objectIdSchema` and returned as `HTTP 400 Bad Request`.
- **Zod Validation Errors:** Formatted into `{ field, message }` error arrays with `HTTP 422 Unprocessable Entity`.

---

## 10. Logging System (`src/lib/logger.ts`)

- **Log Levels:** `debug`, `info`, `warn`, `error` (controlled by `LOG_LEVEL` or `AURUS_LOG_LEVEL`).
- **Production Format:** Single-line JSON (`timestamp`, `level`, `module`, `operation`, `message`, `data`, `error`).
- **Security & Redaction:** Sensitive keys (`password`, `token`, `cookie`, `secret`, `jwt`, `authorization`) are automatically redacted to `"[REDACTED]"`.
- **Injection Protection:** Replaces carriage returns and newlines in messages to prevent log forgery.

---

## 11. Environment Configuration & Scripts

### Environment Variables (`.env` or `.env.local`):
```ini
# MongoDB Connection
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net
MONGODB_DEV_DB=development

# JWT & Authentication
JWT_SECRET=your_super_secret_jwt_key_at_least_32_chars
JWT_EXPIRES_IN=15m
ADMIN_COOKIE_NAME=admin_access_token
ADMIN_COOKIE_MAX_AGE=900

# Backend Logging
LOG_LEVEL=info

# Default Initial Administrator Seed Credentials
DEFAULT_ADMIN_NAME=System Administrator
DEFAULT_ADMIN_EMAIL=admin@example.com
DEFAULT_ADMIN_PASSWORD=AdminPassword123!

# AWS S3 Storage Service
AWS_REGION=ap-south-1
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
AWS_S3_BUCKET_NAME=your-aurus-s3-bucket

# Optional File Size Limits (Bytes)
MAX_IMAGE_SIZE_BYTES=10485760
MAX_PDF_SIZE_BYTES=26214400

# Optional CloudFront CDN Domain (Uncomment when CloudFront distribution is live)
# AWS_CLOUDFRONT_DOMAIN=d123456789.cloudfront.net
```

### Database Seeding Command:
Seeds the initial administrator using `DEFAULT_ADMIN_NAME`, `DEFAULT_ADMIN_EMAIL`, and `DEFAULT_ADMIN_PASSWORD`:
```bash
npm run seed:admin
```
*(Executes `scripts/seed-admin.ts` using `tsx`)*.

### Development & Build Commands:
```bash
# Typecheck
npx tsc --noEmit

# Lint
npm run lint

# Build production bundle
npm run build
```
