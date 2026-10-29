# Kushbhawanpur Sanatan Dharma & Heritage Foundation
### Official Seva & Heritage Conservation Landing Page · Production Donation Portal

[![Next.js 16](https://img.shields.io/badge/Next.js-16.4.3-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.3.0-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.0-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Static Export](https://img.shields.io/badge/Output-Static_Export-green?style=for-the-badge)](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)

> **धर्मो रक्षति रक्षितः** · *Dharmo Rakshati Rakshitah*  
> *“Dharma protects those who protect Dharma.”*

A production-ready, single-page, fully static, light-theme-only official donation and seva website for the **Kushbhawanpur Sanatan Dharma & Heritage Foundation**. Crafted with an editorial bookbinding visual aesthetic (warm paper tones, hairline borders, dignified Cormorant Garamond serif headlines, and golden accents) honoring sacred Hindu civilizational heritage.

---

## 🏛️ About the Foundation

The **Kushbhawanpur Sanatan Dharma & Heritage Foundation** is an independent charitable trust registered in the historic cultural geography of Kushbhawanpur (Sultanpur), Uttar Pradesh. The foundation is dedicated to:
- **Temple & Monument Conservation**: Restoring centuries-old stone shrines, mandapas, and historic teerthas.
- **Vedic Education & Manuscripts**: Supporting traditional gurukuls, Vedic scholars, and digitizing rare Sanskrit texts.
- **Gau Seva & Animal Care**: Providing shelter, veterinary care, and fresh fodder for indigenous desi cows and calves.
- **Annadanam & Community Seva**: Serving pure, wholesome satvik meals to pilgrims, sadhus, and underserved families.
- **Sacred Groves (Tapovana)**: Planting and nurturing native banyan, peepal, and neem groves around holy precincts.

---

## ✨ Key Features & Components

### 1. Header & Navigation
- **Dual Brand Presentation**: Official sacred emblem and horizontal lockup with crisp typography.
- **Sticky Glassmorphism Header**: Backdrop blur on scroll, active section indicator via Framer Motion `layoutId`, and quick donation trigger.
- **Accessible Mobile Drawer**: Sheet menu with smooth transitions, touch-friendly anchors, and emergency contact links.
- **Top Sanskrit Utility Bar**: Displays registered precinct address, official email, and sacred motto.

### 2. Dignified Hero Section
- **Sacred 3D Composition**: Layered depth with Ken Burns animated sunrise temple arch photography, rotating golden sun-ray burst, floating golden ॐ medallion, pennant dhwaja, and an animated diya emblem.
- **Editorial Headline**: Cormorant Garamond serif typography with smooth character reveal animations.
- **Dual Direct CTAs**: "Donate with Gratitude" (with diya icon) and "Explore Our Focus Areas".

### 3. Trust & Transparency Ticker (Marquee)
- **Continuous Seamless Stream**: Infinite, full-width sliding ticker highlighting the foundation's core commitments:
  - *Official Channels Only* (Direct trust accounts)
  - *100% Non-Profit Seva* (Zero intermediary commissions)
  - *Donor Privacy Honoured* (No data sharing or marketing spam)
  - *Transparent Reporting* (Regular photographic & financial updates)
- **Interactive Pause**: Smooth pause on hover for easy reading.

### 4. Mission & Value Pillars
- **Editorial Narrative**: Historical background of Kushbhawanpur's sacred soil and the foundation's solemn pledge.
- **Spotlight Cards**: 4 core values (Civilizational Preservation, Gau Samrakshan, Annadanam, Vedic Knowledge) with dynamic radial mouse-follow illumination.

### 5. Focus Areas (Bento Grid)
- **6 Sacred Mission Verticals**:
  1. *Temple & Heritage Preservation* (Suggested Seva: ₹2,100)
  2. *Dharmic Education & Scriptures* (Suggested Seva: ₹1,100)
  3. *Gau Seva & Animal Care* (Suggested Seva: ₹501)
  4. *Community Seva & Annadanam* (Suggested Seva: ₹5,100)
  5. *Sacred Groves & Banyan Ecology* (Suggested Seva: ₹1,100)
  6. *Manuscript & Heritage Archives* (Suggested Seva: ₹5,100)
- **3D Tilt Interaction**: Responsive cards with realistic physics-based 3D tilt on desktop.

### 6. Interactive Multi-Modal Donation Portal (`#donate`)
- **Flexible Amount Selection**: Preset donation tiles (`₹501`, `₹1,100`, `₹2,100`, `₹5,100`, `₹11,000`, `₹21,000`) with quick custom input.
- **Dynamic Seva Purpose Selector**: Direct your contribution to a specific cause or General Seva.
- **Real-Time Payment Tabs**:
  - **UPI QR Code**: Dynamic QR code generated with `upi://pay` standard specification (pre-filled payee, merchant code, amount, and reference note). Includes quick launch links for Google Pay, PhonePe, and Paytm.
  - **Bank Transfer (NEFT / RTGS / IMPS)**: Verified account details (Account Name, Bank, Account Number, IFSC, Account Type, Branch) with one-click clipboard copy and toast confirmations.
  - **Cheque / Demand Draft**: Step-by-step dispatch guidelines and verified postal address.
- **Celebratory AfterPay Workflow**:
  - Immediate celebratory dialog with dynamic gold & saffron confetti shower.
  - Optional receipt form (Full Name, Email, Phone, PAN Number, Transaction ID, Anonymous toggle).
  - Client-side downloadable summary acknowledging the seva sankalpa.

### 7. Sacred Moments Gallery (Lightbox)
- **Curated Photography**: Pre-optimized responsive imagery of ancient sandstone mandapas, morning aarti, sacred banyan groves, and handwritten Sanskrit granthas.
- **Category Filter Tabs**: All, Heritage, Seva, Gau Seva, Scriptures.
- **Full-Screen Lightbox Modal**: High-resolution view with captions, dates, and category tags.

### 8. Transparency & Community Engagement
- **Impact Tiers**: Clear itemized breakdown of real-world outcomes for contributions of ₹501, ₹1,100, ₹2,100, ₹5,100, and ₹11,000.
- **Get Involved Tabs**: Forms for Volunteering (field work, translation, event seva) and Corporate CSR partnerships with Zod validation.
- **Interactive Dharmic Pledge**: Community counter allowing visitors to take a sacred pledge for heritage conservation.

### 9. FAQ & Legal Policies
- **Filterable Accordion FAQ**: Searchable categorized answers (General, Donations & Tax, Transparency, Volunteering).
- **Embedded Policy Modals**: Terms of Seva, Privacy Policy, Contribution & Refund Policy, and 80G Tax Exemption Status disclosure.

---

## 🎨 Visual Design System

The visual design is inspired by traditional Indian manuscript craft and bookbinding warmth:

| Token | Hex Value | Role |
| :--- | :--- | :--- |
| **Cream** | `#FFF9EF` | Primary page canvas background |
| **Paper** | `#FFFDF8` | Card and modal surface background |
| **Sand** | `#F6EBD6` | Secondary accent, badges, and utility strips |
| **Hairline Border** | `#EADFC8` | Subtle separators and card borders |
| **Maroon** | `#7A1F14` | Primary brand color, headlines, bold accents |
| **Deep Maroon** | `#5C140C` | High-contrast footer background, dark badges |
| **Saffron** | `#E8710A` | Primary CTA, Om emblem, auspicious highlights |
| **Deep Saffron** | `#B8470A` | Primary button background |
| **Gold** | `#D4A02C` | Sacred borders, medallions, diya glows |
| **Banyan Green**| `#3E7B3A` | Environmental and nature accents |
| **Ink** | `#2A1A14` | Primary body typography (warm, dark readable) |

### Typography
- **Headlines & Serif Accents**: [Cormorant Garamond](https://fonts.google.com/specimen/Cormorant+Garamond) (Weights: 600, 700)
- **Body & UI**: [Manrope](https://fonts.google.com/specimen/Manrope) (Weights: 400, 500, 600, 700)
- **Devanagari & Sanskrit Mantras**: [Noto Serif Devanagari](https://fonts.google.com/specimen/Noto+Serif+Devanagari) (Weights: 400, 600, 700)

---

## 🛠️ Tech Stack & Architecture

- **Framework**: [Next.js 16.4.3](https://nextjs.org/) (App Router, Turbopack)
- **Runtime**: [React 19.3.0](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with `@theme` token definitions
- **PostCSS**: `@tailwindcss/postcss`
- **Animations**: [Framer Motion](https://motion.dev/), [GSAP](https://greensock.com/), [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)
- **Icons**: [Lucide React](https://lucide.dev/)
- **QR Code**: [qrcode.react](https://www.npmjs.com/package/qrcode.react) (SVG rendering for crisp scanability)
- **UI Primitives**: Radix UI (Dialog, Accordion, Tabs, Slot)
- **Form Management**: React Hook Form with Zod schema validation
- **Notifications**: Sonner toasts

---

## 🚀 Setup & Local Development Guide

### Prerequisites
- [Node.js](https://nodejs.org/) v18.18.0 or newer (v20+ recommended)
- `npm` (v9+) or `pnpm` / `yarn`

### 1. Clone the Repository
```bash
git clone https://github.com/toshakparmar/kushbhawanpur-sanatan-dharma-heritage-foundation.git
cd kushbhawanpur-sanatan-dharma-heritage-foundation
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build Production Static Export
```bash
npm run build
```
This builds an optimized, static HTML/CSS/JS export in the `out/` directory, ready to be served from any web server, CDN, or hosting provider.

---

## 🌐 Deploying to Vercel

This repository is pre-configured for one-click static deployment on **Vercel**:

1. Push your changes to the `main` branch on GitHub:
   ```bash
   git push origin main
   ```
2. Go to the [Vercel Dashboard](https://vercel.com/dashboard) and click **"Add New Project"**.
3. Import the repository: `toshakparmar/kushbhawanpur-sanatan-dharma-heritage-foundation`.
4. Vercel automatically detects Next.js:
   - **Framework Preset**: Next.js
   - **Build Command**: `next build`
   - **Output Directory**: `out` (automatically configured via `output: "export"`)
5. Click **"Deploy"**. Your official donation website will be live with free global CDN and SSL.

---

## 📁 Repository Structure

```
├── app/
│   ├── globals.css          # Tailwind CSS v4 @theme tokens, keyframes, paper texture
│   ├── layout.tsx           # Root layout, Google Fonts, JSON-LD Schema, SEO meta
│   ├── manifest.ts          # PWA Web App Manifest
│   ├── not-found.tsx        # Dignified 404 error page
│   ├── page.tsx             # Main single-page landing page
│   ├── robots.ts            # Dynamic robots.txt
│   └── sitemap.ts           # Dynamic sitemap.xml
├── components/
│   ├── brand/               # Brand Logo, Diya, Mandala, LotusDivider, Ornaments
│   ├── donate/              # AmountPicker, PurposeSelect, PaymentTabs, UpiQr, BankDetails
│   ├── layout/              # Header, Footer, UtilityBar, MobileSheet, StickyDonateBar
│   ├── reactbits/           # SplitText, BlurText, Magnet, TiltedCard, Marquee, ParticlesBackground
│   ├── sections/            # Hero, TrustStrip, About, Work, Donate, Impact, Gallery, Involve, FAQ, Contact
│   ├── shared/              # SectionHeading, MoneyText, LightboxGallery
│   └── ui/                  # Accordion, Button, Dialog, Sheet, Tabs, Sonner
├── content/
│   ├── site.config.ts       # Single source of truth for bank details, UPI, contacts, focus areas
│   ├── faq.ts               # Structured FAQ items and categories
│   └── policies.ts          # Legal terms, privacy policy, refund policy
├── public/
│   ├── brand/               # Official logo, emblem, wordmark, horizontal lockup, favicons
│   ├── images/              # Curated photographs (temple, gau-seva, scriptures, ghats)
│   └── og/                  # OpenGraph social share card (1200×630)
├── next.config.ts           # Next.js configuration (static export, unoptimized images, trailingSlash)
└── package.json             # Project dependencies and build scripts
```

---

## ⚙️ Content & Organization Customization

All organization data, bank credentials, UPI handles, and focus areas are centralized in a single configuration file:
👉 **[`content/site.config.ts`](file:///d:/Freelancing%20Projects/kushbhawanpur-sanatan-dharma-heritage-foundation/content/site.config.ts)**

To update bank details or UPI ID for production:
```typescript
payment: {
  upi: {
    enabled: true,
    vpa: "kushbhawanpur@sbi",          // Replace with official Foundation UPI VPA
    payeeName: "Kushbhawanpur Foundation",
    merchantCode: "8699",
  },
  bankTransfer: {
    accountName: "Kushbhawanpur Sanatan Dharma & Heritage Foundation",
    bankName: "State Bank of India",
    accountNumber: "XXXXXXXXXXXX",    // Enter official account number
    ifscCode: "SBIN0000123",          // Enter official IFSC code
    branch: "Main Branch, Sultanpur",
  },
}
```

---

## 📄 License & Attribution

All custom code, components, and design implementations are developed for the **Kushbhawanpur Sanatan Dharma & Heritage Foundation**.  
All religious and cultural symbols are used with solemn reverence and devotion.
