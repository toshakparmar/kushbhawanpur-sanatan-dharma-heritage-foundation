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
