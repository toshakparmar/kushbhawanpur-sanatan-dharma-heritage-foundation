# Kushbhawanpur Sanatan Dharma & Heritage Foundation
### Dynamic Non-Profit Platform · Video CMS · Gateway-Free Donation Records & Receipts · Admin Portal

[![Next.js 16](https://img.shields.io/badge/Next.js-16.4.3-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![NestJS 11](https://img.shields.io/badge/NestJS-11.0-E0234E?style=for-the-badge&logo=nestjs)](https://nestjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)
[![Prisma ORM](https://img.shields.io/badge/Prisma-6.4-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.0-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)

> **धर्मो रक्षति रक्षितः** · *Dharmo Rakshati Rakshitah*  
> *“Dharma protects those who protect Dharma.”*

Production site: [https://kushbhawanpur-sanatan-dharma-herita.vercel.app/](https://kushbhawanpur-sanatan-dharma-herita.vercel.app/)

---

## 🏛️ Project Overview

A complete dynamic platform for the **Kushbhawanpur Sanatan Dharma & Heritage Foundation** (Sultanpur, Uttar Pradesh), transforming the static landing page into a full-featured, admin-managed non-profit system:

1. **About Section Upgrade**: Foundation narrative, **Founder & Co-Founder cards** (with arched logo mask and 3D tilt), **Volunteer cards**, and official **Certifications & Registrations** with lightbox viewers and PDF downloads.
2. **Video CMS Carousel**: Admin adds YouTube/Vimeo/FB/Drive/MP4 video links; rendered as a polished carousel with 16:9 featured lite player.
3. **Gateway-Free Direct Donations**:
   - Zero gateway commission fees (saving 2%+ on every rupee).
   - Dynamic UPI QR generated on the fly per transaction (`upi://pay`) pre-filling the donor's exact chosen amount and unique reference ID.
   - Bank transfer (NEFT/RTGS/IMPS) instructions with one-click copy buttons.
   - Proof submission (12-digit UTR and screenshot upload).
   - One-click admin verification against bank records.
   - Automated gapless receipt allocation (`{PREFIX}/{FY}/{5-digit sequence}`) with bilingual Devanagari PDF receipts emailed directly to donors.
4. **Comprehensive Admin Panel (`/admin`)**:
   - Collapsible sidebar, light theme matching heritage tokens, role-based access (`SUPER_ADMIN`, `ACCOUNTS`, `CONTENT`).
   - Dashboard with verified totals (all-time, this FY, this month), prominent pending alerts, and seva breakdowns.
   - Pending verification queue with bank-statement reference lookups.
   - Bank statement CSV reconciliation tool.
   - Donors registry with lifetime giving metrics and DPDP erasure.
   - Complete CRUD for Organisation profile, UPI accounts, Bank accounts, Sevas, Team, Certifications, Videos, and Milestones.
   - Admin user management and audit logging.

---

## 🧱 Monorepo Architecture

```
├── apps/
│   ├── web/                    # Next.js 16 (App Router, Tailwind v4, shadcn/ui, Framer Motion)
│   │   ├── app/                # Public routes + /admin routes (noindex)
│   │   ├── components/         # Heritage sections, donate stepper, admin components
│   │   └── lib/                # ISR server fetchers, money formatters, UPI utilities
│   │
│   └── api/                    # NestJS 11 REST API + Prisma ORM + PostgreSQL
│       ├── src/
│       │   ├── common/         # Encryption (AES-256-GCM), PDF generator, Mailer, Storage, Guards
│       │   ├── modules/        # Auth, Public, Donations, Sevas, Team, Certs, Videos, etc.
│       │   └── prisma/         # Prisma schema, seeds, migrations
│       └── uploads/            # File storage for receipts, proofs, and certificates
│
├── packages/
│   └── shared/                 # Shared TypeScript models, Zod schemas, money & words helpers
│
└── docs/                       # Architecture, Admin Guide, Payment specs, Assumptions
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 20.0
- Docker & Docker Compose (optional, for local PostgreSQL)

### 1. Installation
Clone the repository and install root dependencies:
```bash
git clone https://github.com/toshakparmar/kushbhawanpur-sanatan-dharma-heritage-foundation.git
cd kushbhawanpur-sanatan-dharma-heritage-foundation
npm install
```

### 2. Environment Setup
Copy the example environment configuration:
```bash
cp .env.example .env
```
Key variables configured in `.env`:
- `DATABASE_URL`: PostgreSQL connection string (default: `postgresql://postgres:postgres@localhost:5432/kushbhawanpur_db?schema=public`)
- `JWT_SECRET`: Secret key for admin session cookies
- `ENCRYPTION_KEY`: 32-character secret for AES-256-GCM encryption of PAN and bank details
- `ADMIN_EMAIL`: Initial super administrator email (default: `admin@kushbhawanpur.org`)
- `ADMIN_INITIAL_PASSWORD`: Initial default password (forced to change on first login)

### 3. Database Initialization & Seeding
Start PostgreSQL container (or use Neon/Supabase):
```bash
docker-compose up -d
```
Generate Prisma client and seed the foundational database:
```bash
npm run prisma:generate --workspace=@kushbhawanpur/api
npm run prisma:migrate --workspace=@kushbhawanpur/api
npm run db:seed
```

### 4. Running the Applications
Start the web application and API dev servers:
```bash
# Start Next.js frontend (http://localhost:3000)
npm run dev:web

# In a separate terminal, start NestJS backend (http://localhost:4000)
npm run dev:api
```

---

## 🔐 First Login & Admin Credentials

1. Open `http://localhost:3000/admin`
2. Default login credentials:
   - **Email**: `admin@kushbhawanpur.org`
   - **Password**: `Admin@12345`
3. Upon first login, the panel will prompt you to set your own secure private password before granting access.

---

## 🧪 Unit Tests

Run the comprehensive unit test suite:
```bash
node scripts/run-unit-tests.js
```
Validates:
- Integer paise to rupee conversions and Indian numbering grouping
- Indian currency words converter (`amountInWords`)
- Safe video URL parser (YouTube, Vimeo, Google Drive, direct MP4, XSS protection)
- AES-256-GCM encryption round-trip
- Dynamic UPI URI builder
- Indian Financial Year calculations

---

## 📖 Documentation Index

- [Architecture Reference](docs/ARCHITECTURE.md): Technical deep-dive on ISR, database concurrency, and security.
- [Trustee & Accounts Guide](docs/ADMIN_GUIDE.md): Operational manual for managing content, approving donations, and issuing receipts.
- [Direct Payments Without Gateway](docs/PAYMENTS_WITHOUT_GATEWAY.md): Complete rationale, UPI QR technical specification, and fraud safeguards.
- [REST API Reference](docs/API.md): Documentation of all public and administrative REST endpoints.
- [Assumptions & Boundaries](docs/ASSUMPTIONS.md): Architectural decisions and zero-fake-data policy.

---

## ⚖️ License & Integrity Notice

All cultural narratives, sacred shlokas, and architectural descriptions are dedicated to the preservation of Sanatan cultural heritage in Kushbhawanpur. Built with devotion and precision.
