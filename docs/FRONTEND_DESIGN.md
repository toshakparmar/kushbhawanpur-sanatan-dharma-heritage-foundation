# Kushbhawanpur Sanatan Dharma & Heritage Foundation
## Frontend Design System & Motion Specification

---

### 1. Visual Design Principles
- **Editorial Dignity**: The landing page avoids the cold, generic look of modern SaaS templates. Instead, it adopts the warmth of editorial print, historical publications, and sacred stone inscriptions.
- **Natural Light Theme Only**: `color-scheme: light` is enforced globally. No dark mode toggle is provided, reflecting the open daylight of temple courtyards and morning holy ghats.
- **Hairlines & Paper Grain**: 1px borders (`#EADFC8`) on card containers paired with a 3% paper grain texture create an organic, tactile aesthetic.

---

### 2. Design Tokens
```css
:root {
  --cream: #FFF9EF;        /* Page background */
  --paper: #FFFDF8;        /* Card surface */
  --sand: #F6EBD6;         /* Secondary section background */
  --border: #EADFC8;       /* Subtle hairlines */
  --ink: #2A1A14;          /* Primary espresso body text */
  --ink-muted: #57463E;    /* Secondary copy */
  --muted: #6E5E54;        /* Micro labels and subtitles */
  --maroon: #7A1F14;       /* Primary headlines and seal tone */
  --maroon-deep: #5C140C;  /* Contrast headers & quote band */
  --saffron: #E8710A;      /* Radiant accents & icons */
  --saffron-deep: #B8470A; /* Text-safe primary CTA buttons */
  --gold: #D4A02C;         /* Rules, ornaments, glowing halos */
  --gold-light: #F7EBD2;   /* Selection background */
  --banyan: #3E7B3A;       /* Ecological tags & verified badges */
  --banyan-light: #EAF4E8; /* Badges background */
}
```

---

### 3. Motion System & Standards (`lib/motion.ts`)
- **Durations**:
  - Micro-interactions: `120ms` – `180ms` (tab clicks, button hovers, copy feedback)
  - Standard transitions: `250ms` – `350ms` (accordion drops, dialog openings)
  - Emphasis reveals: `700ms` – `1100ms` (hero entrances, split text reveals)
- **Spring Physics**:
  - UI springs: `{ stiffness: 260, damping: 26 }`
  - 3D hero pointer parallax: `{ stiffness: 75, damping: 20, mass: 1 }`
- **Rule of Separation**: Framer Motion and GSAP are never applied to the same DOM element.
- **Reduced Motion**: All animations automatically switch to static transitions when `prefers-reduced-motion` is active.

---

### 4. Future Dynamic Architecture (Planned Evolutions)
The foundation architecture separates all data operations into typed adapters (`lib/donation.ts`):
1. **Direct Gateway Auto-Receipting**: Seamless Razorpay / Cashfree webhook integration that generates PDF 80G tax receipts and emails them immediately upon bank clearance.
2. **Donor Self-Service Dashboard**: Donors log in via OTP to download annual giving statements for tax filings.
3. **Headless CMS for Focus Areas & Field Reports**: Trustees can publish field photos, goshala welfare milestones, and temple restoration updates without touching code.
4. **Multilingual Toggle (EN / HI)**: Full side-by-side localization with Hindi Devanagari copy.
