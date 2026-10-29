# Kushbhawanpur Sanatan Dharma & Heritage Foundation
## Production Deployment Guide

This website is configured for **Next.js Static Export** (`output: 'export'`). It compiles to pure static HTML, CSS, JavaScript, and pre-optimized assets requiring zero Node.js server runtimes.

---

### 1. Build Specifications
- **Build Command**: `npm run build`
- **Output Directory**: `out/`
- **Node Version**: Node 20.x or higher

---

### 2. Environment Variables
Configure these optional variables in your hosting provider's dashboard or in `.env.local`:

| Variable | Description | Default Fallback |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SITE_URL` | Canonical domain for SEO and OpenGraph tags | `https://kushbhawanpur-foundation.org` |
| `NEXT_PUBLIC_FORM_ENDPOINT` | Formspree or Web3Forms API endpoint for contact messages | `undefined` (falls back to native `mailto:`) |
| `NEXT_PUBLIC_ANALYTICS_ID` | Privacy-focused analytics script ID (Plausible / GA4) | `undefined` (zero trackers loaded) |

---

### 3. Deploying to Static Hosting Platforms

#### A. Vercel
1. Import repository into Vercel.
2. Framework Preset: **Next.js**.
3. Build Command: `npm run build`.
4. Output Directory: `out`.
5. Deploy.

#### B. Cloudflare Pages
1. Connect Git repository.
2. Build command: `npm run build`.
3. Build output directory: `out`.
4. Node version compatibility flag: `20`.

#### C. Netlify
1. Connect Git repository.
2. Build command: `npm run build`.
3. Publish directory: `out`.
4. Deploy site.

#### D. Apache / Nginx / Traditional CPanel Web Hosting
1. Run `npm run build` locally or on CI.
2. Upload the complete contents of the `out/` folder to `public_html/`.

---

### 4. Security & Caching Headers
Recommended response headers for static web servers:
```http
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
Cache-Control: public, max-age=31536000, immutable (for /_next/static/ and /images/)
```

---

### 5. Pre-Launch Verification Checklist
- [ ] Review every item in [`docs/CONTENT_TODO.md`](file:///d:/Freelancing%20Projects/kushbhawanpur-sanatan-dharma-heritage-foundation/docs/CONTENT_TODO.md).
- [ ] Verify foundation bank account number, IFSC code, and payee name with the branch manager.
- [ ] Perform a test transfer of ₹1 via UPI to verify the official VPA name.
- [ ] Confirm registered office postal address and official foundation contact email.
- [ ] Have trustees review the Sanskrit shloka and English translation in `siteConfig.meta.shloka`.
- [ ] Have legal counsel review policy drafts in `content/policies.ts`.
