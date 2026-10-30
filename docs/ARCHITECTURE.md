# Technical Architecture — Kushbhawanpur Foundation Platform

## 1. Monorepo Structure

The codebase is organized as an npm workspaces monorepo:

```
├── apps/
│   ├── web/                    # Next.js 16 (App Router, Tailwind v4, shadcn/ui, Framer Motion)
│   │   ├── app/                # Public routes + /admin routes (noindex)
│   │   ├── components/         # Heritage sections, donate stepper, admin components
│   │   ├── content/            # Static configuration & fallbacks
│   │   └── lib/                # Client/server fetchers, money formatters, UPI utilities
│   │
│   └── api/                    # NestJS 11 REST API + Prisma ORM + PostgreSQL
│       ├── src/
│       │   ├── common/         # Encryption, PDF generator, Mailer, Storage, Guards, Filters
│       │   ├── modules/        # Auth, Public, Donations, Sevas, Team, Certs, Videos, etc.
│       │   └── prisma/         # Prisma schema, seeds, migrations
│       └── uploads/            # Local disk storage for development (S3/Cloudinary ready)
│
├── packages/
│   └── shared/                 # Shared TypeScript models, Zod schemas, money & words helpers
│
├── docs/                       # Architecture, Admin Guide, Payment specs, Assumptions
└── scripts/                    # Unit tests, image analysis, migration utilities
```

---

## 2. Dynamic Content with Graceful Offline Fallback

1. **Incremental Static Regeneration (ISR)**:
   - Public pages use Next.js server components fetching `GET /public/site` and `GET /public/donate-config` with `revalidate: 60`.
   - Admin saves trigger immediate on-demand revalidation.

2. **Zero-Downtime Fallback**:
   - If the database or backend API is temporarily unreachable, `lib/api.ts` gracefully catches the network exception and serves static foundation configuration from `content/site.config.ts`.
   - Team, Certifications, and Videos sections automatically hide when no items exist, ensuring the public site never displays broken layouts or error screens.

---

## 3. Database & Concurrency Model

- **PostgreSQL 16**: Relational storage for all financial, content, and audit records.
- **Paise Integer Storage**: All monetary amounts are strictly stored as integer paise (`amountPaise`, `receivedAmountPaise`) to eliminate IEEE-754 floating point rounding errors.
- **Gapless Receipt Numbering**:
  - Allocated atomically inside an interactive database transaction:
    `{PREFIX}/{FY}/{5-digit sequence}` (e.g. `KSDHF/2026-27/00001`).
  - Utilizes row-level locking on `ReceiptCounter` per financial year to guarantee zero duplicates and zero skipped numbers during parallel verification.

---

## 4. Security & Privacy Guarantees

1. **Sensitive Data Encryption**:
   - Donor PAN numbers, personal physical addresses, and foundation bank account numbers are encrypted at rest using **AES-256-GCM** with unique initialization vectors (IV) and authentication tags.
   - Bank account numbers are masked on public endpoints (e.g. `****1234`).
2. **DPDP (Digital Personal Data Protection) Alignment**:
   - Explicit consent timestamp recorded on every donation.
   - Zero donor PII exposed on public verify-receipt pages (`/verify-receipt/<no>`).
   - One-click donor data erasure/anonymization endpoint for right-to-be-forgotten requests.
3. **Authentication & Access Control**:
   - HttpOnly, SameSite, Secure JWT cookies.
   - Role-Based Access Control (`SUPER_ADMIN`, `ACCOUNTS`, `CONTENT`).
   - Forced password reset on initial login for seeded administrator accounts.
   - Complete audit trail logging every administrative operation.
