# Kushbhawanpur Sanatan Dharma & Heritage Foundation
## Architecture, Brand & Content Assumptions

This document records the architectural, cultural, and technical design decisions made in accordance with the project requirements.

---

### 1. Visual DNA & Color Palette
- **Palette Origin**: Derived directly from the foundation emblem (saffron Om, temple shikhara, banyan tree, earthen diya, open grantha book, sacred cow, deep maroon wordmark).
  - `--cream` (`#FFF9EF`): Primary background tone for a warm, editorial paper atmosphere.
  - `--paper` (`#FFFDF8`): Elevated card surface providing contrast without stark clinical whites.
  - `--sand` (`#F6EBD6`): Alternating section rhythm for visual hierarchy.
  - `--border` (`#EADFC8`): Hairline dividers reflecting bookbinding and traditional print craft.
  - `--ink` (`#2A1A14`) & `--muted` (`#6E5E54`): Warm espresso body text for high readability (exceeds WCAG AA contrast ≥ 4.5:1).
  - `--maroon` (`#7A1F14`) & `--maroon-deep` (`#5C140C`): Headlines, title bands, and prominent brand accents.
  - `--saffron-deep` (`#B8470A`): Primary interactive button and CTA surface, ensuring high contrast with cream text.
  - `--gold` (`#D4A02C`): Hairlines, radiant sun rays, and ornamental accents.
  - `--banyan` (`#3E7B3A`): Success badges, verified statuses, and ecological seva indicators.

---

### 2. Typography
- **Display Font**: *Cormorant Garamond* (weights 600, 700) for confident, historic, dignified titles.
- **UI & Body Font**: *Manrope* (weights 400, 500, 600, 700) for legible, modern, accessible interaction copy.
- **Devanagari Font**: *Noto Serif Devanagari* (weights 400, 600, 700) for sacred emblems, mottoes, and Hindi focus titles.

---

### 3. Truth-in-Content Policy & Zero Fake Data
- **No Fabricated Data**:
  - We never invent trustees, volunteers, tax registration numbers, or fake donation records.
  - **Dynamic Sections Auto-Hide When Empty**: If the database contains no active records for Team Members, Certifications, or Videos, those sections automatically hide on the public website.
  - By default, seed scripts initialize only the `SUPER_ADMIN` user, singleton configuration, and the 6 foundational sevas. Demo records are strictly isolated behind `SEED_DEMO=true` and clearly labeled `[DEMO]`.
- **Statutory Registration Guard**:
  - Registration lines (PAN, 80G, 12A, CSR, Darpan) are printed on official donation receipts **only when filled by the administrator**. Never default to claiming tax exemptions without valid legal orders.

---

### 4. Motion System Architecture
- **Separation of Motion Libraries**: Framer Motion handles interactive layout transitions, spring gestures, and 3D pointer parallax. GSAP handles smooth ticker marquees. No single element is animated by both frameworks simultaneously.
- **Reduced Motion Compliance**: Whenever `prefers-reduced-motion` is detected, animations gracefully collapse into static, instant transitions.

---

### 5. Story Section ("Five Symbols, One Sankalpa") Design Decisions
- **Sticky Emblem vs. Pinning**:
  - Pinned long scrolling (scroll-jacking) was intentionally avoided to prevent trap states and ensure standard, fluid accessibility across desktop touchpads, mice, and assistive devices.
  - Desktop uses CSS `position: sticky; top: 112px; align-self: start;` on the left column with Framer Motion spring interpolation for the gold hotspot ring and dynamic `transform-origin` emblem zoom.
- **Responsive Layout Strategy**:
  - Desktop (≥ 1024px): Two-column sticky emblem + scrolling chapters + 5-dot rail.
  - Mobile (< 768px): Sticky horizontal pill-nav under header + self-contained chapter cards featuring dedicated zoomed emblem detail crops (`story-*.webp`) to guarantee maximum clarity on compact viewports.

---

### 6. Dynamic Content, Backend & Payment Architecture

1. **Incremental Static Regeneration (ISR) with Graceful Offline Fallback**:
   - `output: 'export'` was removed from Next.js to enable server-side ISR (`revalidate: 60`).
   - If the API or PostgreSQL database is ever offline, `lib/api.ts` gracefully serves fallback data from `content/defaults.ts` and `content/site.config.ts`. The public page never breaks.

---

### 7. Supabase Storage & Media Asset Management
- **Cloudinary Replaced**: Replaced Cloudinary with a dedicated public Supabase Storage bucket (`kushbhawanpur-media`) on project `https://racqnmwrulqqvqjcsxfn.supabase.co`.
- **Client & Upload Transport**: Uses `@supabase/storage-js` via `StorageService` to execute direct REST stream uploads, avoiding native WebSocket incompatibilities in Node.js 20 runtimes.
- **Media Asset Registry**: Every upload is indexed in `MediaAsset` with kind (`IMAGE` or `DOCUMENT`), dimensions, MIME type, size, public CDN URL, alt text, and caption.
- **Reference Tracking**: `MediaUsage` records the exact entity and field using each asset. The Media Library indicates active usage count and prevents accidental deletion of in-use assets unless explicitly forced by the admin.

---

### 8. Structured Schema-Driven CMS Architecture
- **Draft → Publish Workflow**:
  - Each public section has a `PageSection` record with `draftContent` and `publishedContent` JSONB fields.
  - Changes made in the admin save immediately to `draftContent`.
  - "Publish to Website" promotes `draftContent` to `publishedContent` in a transaction, creates a timestamped `PageSectionVersion` snapshot (retaining up to 20 historical versions for instant rollback), and revalidates cached content.
  - "Revert to Published" discards draft changes and restores the live version.
- **Relational Tables for Repeating Data**:
  - Structured entities (`hero_slides`, `trust_items`, `value_pillars`, `focus_areas`, `story_chapters`, `impact_items`, `donor_benefits`, `gallery_items`, `involve_cards`, `faq_items`, `nav_items`, `announcements`) allow granular sorting, activation toggles, and soft-deletes.
- **Story Chapter Hotspot Picker**:
  - Interactive emblem targeting tool (`HotspotPicker`) lets administrators click directly on the foundation emblem to set percentage coordinates (`hotspotX`, `hotspotY`, `hotspotRadius`) with live radius zoom controls.

---

### 9. Delete Confirmation & Financial Immutability Boundaries
- **Universal Confirmation**: Every delete, void, or removal action across all modules triggers `ConfirmDialog` / `useConfirm()`.
- **Risk Tiers**:
  - *Standard*: Confirmation dialog explaining consequence.
  - *High-Risk*: Requires typing `DELETE` or the item name to activate the destructive button (used for primary UPI account removal, permanently deleting trash, disabling admins, and deleting in-use media assets).
- **Financial Record Immutability**:
  - Financial records (`donations`, `receipts`, donors with transactions, audit logs) can **never** be hard-deleted.
  - The API and UI strictly forbid deletion and offer `VOID` or `REJECT` with mandatory reason documentation.
- **Soft Delete & 30-Day Trash**:
  - Content models have `deletedAt: DateTime?`. Soft-deleted items move to `/admin/trash` with a 10-second undo toast, one-click restore, and permanent deletion with typed confirmation.

---

### 10. Admin UI Modernization
- **Scrollbar Affordance**: Thin, 7px rounded, brand-tinted scrollbars (`#D4A02C` track hover, `scrollbar-gutter: stable`) applied globally across admin sidebars, tables, modals, and lists.
- **Searchable Comboboxes**: Replaced native `<select>` controls with custom Radix-based searchable dropdowns supporting keyboard navigation and touch-friendly mobile drawers.
- **Unified Media Uploader**: Drag-and-drop zone with clipboard paste support, crop dialog (`react-easy-crop`), per-file upload progress bar, and "Replace with Undo" capabilities.


2. **Direct Payments Without Payment Gateways**:
   - Commercial gateway intermediaries (charging 2%+ fees) are excluded.
   - Dynamic UPI QR codes are generated on the fly per transaction using NPCI URI standards:
     `upi://pay?pa=<vpa>&pn=<payee>&am=<amount.00>&cu=INR&tn=<refId+sevaCode>`
   - `tn` (Transaction Note) carries the unique donation reference (e.g. `KSDHF-7K3Q9M`) so accounts volunteers can instantly match the entry in bank statements.
   - A `PaymentProvider` abstraction (`ManualUpiProvider`) is established so future webhook-driven gateways (e.g., Razorpay/PhonePe) can be added seamlessly without rewriting frontend flows.

3. **Database Integrity & Concurrency**:
   - All financial amounts are stored as **integer paise** (never floating-point numbers).
   - Receipt numbering `{PREFIX}/{FY}/{5-digit sequence}` (e.g., `KSDHF/2026-27/00001`) is guaranteed gapless per financial year using atomic interactive transactions on `ReceiptCounter`.
   - Receipts are permanent financial records; cancellations are stamped as `VOID` with an audit reason and never deleted.

4. **Cryptographic Privacy & DPDP Compliance**:
   - Donor PAN numbers, personal physical addresses, and foundation bank account numbers are encrypted at rest using **AES-256-GCM**.
   - Public receipt verification (`/verify-receipt/<no>`) returns authenticity, issue date, seva, and amount with **zero donor PII**.
   - One-click DPDP data erasure anonymizes donor identity while preserving audited accounting figures.
