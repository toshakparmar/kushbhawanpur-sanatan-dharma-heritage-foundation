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

### 3. Truth-in-Content Policy
- **No Fabricated Registrations**: Unlike typical mock websites, all statutory tax approvals (80G, 12A, CSR, Darpan) are guarded by boolean flags in `content/site.config.ts`.
- **Honest FAQ**: When 80G is false, the FAQ explicitly informs donors that the registration is in progress, maintaining ethical transparency.
- **Safe Fallback Channels**: Telephone, WhatsApp, and Google Map embeds cleanly hide when set to `null` to avoid displaying broken links or generic dummy placeholders.

---

### 4. Motion System Architecture
- **Separation of Motion Libraries**: Framer Motion handles interactive layout transitions, spring gestures, and 3D pointer parallax. GSAP and canvas handle continuous ambient rotations (sun rays, background canvas particles). No single element is animated by both frameworks simultaneously.
- **Reduced Motion Compliance**: Whenever `prefers-reduced-motion` is detected, animations gracefully collapse into static, instant transitions.

---

### 5. Story Section ("Five Symbols, One Sankalpa") Design Decisions
- **Sticky Emblem vs. Pinning**:
  - Pinned long scrolling (scroll-jacking) was intentionally avoided to prevent trap states and ensure standard, fluid accessibility across desktop touchpads, mice, and assistive devices.
  - Desktop uses CSS `position: sticky; top: header height + 24px` on the left column with Framer Motion spring interpolation for the gold hotspot ring and dynamic `transform-origin` emblem zoom.
- **Responsive Layout Strategy**:
  - Desktop (≥ 1024px): Two-column sticky emblem + scrolling chapters + 5-dot rail.
  - Tablet (768–1023px): Sticky top emblem strip (≈ 38vh) with centered hotspot and stacked chapter cards.
  - Mobile (< 768px): Sticky horizontal pill-nav under header + self-contained chapter cards featuring dedicated zoomed emblem detail crops (`story-*.webp`) to guarantee maximum clarity on compact viewports.
- **Hotspot Tuning**:
  - Hotspot coordinates are calibrated in `content/story.ts` (Om: 50%, 17%; Book: 50%, 82%; Cow: 75%, 66%; Tree: 22%, 48%; Temple: 50%, 55%).
  - A developer debugging overlay (`?debugHotspots=1`) is provided in non-production environments to verify alignment.
- **Performance & CLS Prevention**:
  - Story section is dynamically loaded with `next/dynamic` with a matching skeleton placeholder, keeping main bundle size lean.
  - Pre-generated WebP detail crops avoid client-side canvas extraction overhead.

