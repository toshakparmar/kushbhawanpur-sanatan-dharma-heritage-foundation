# REST API Reference — Kushbhawanpur Foundation Platform

Base URL: `/api/v1`
Interactive Swagger Documentation: `/api/docs`

Uniform Response Envelope:
```json
{
  "data": { ... },
  "meta": { "page": 1, "total": 42 }
}
```

Uniform Error Envelope:
```json
{
  "error": {
    "code": "BAD_REQUEST",
    "message": "Human-readable description of error",
    "details": ["Validation failure details..."],
    "requestId": "uuid",
    "timestamp": "2026-10-30T14:45:00.000Z",
    "path": "/api/v1/public/donations"
  }
}
```

---

## 1. Public Endpoints (No Auth Required)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/public/site` | Fetches foundation profile, active milestones, published videos, active leadership/volunteers, and certifications. Used for ISR (60s). |
| `GET` | `/public/donate-config` | Fetches active sevas, payment limits, primary UPI VPA, and public bank account details. |
| `POST` | `/public/donations` | Initiates a donation record. Returns unique `refId`, private `donorToken`, and dynamic UPI URI. |
| `POST` | `/public/donations/:ref/proof` | Submits donor payment proof (UTR number + optional screenshot image). Moves status to `PENDING_VERIFICATION`. |
| `GET` | `/public/donations/:ref/status` | Retrieves status of a donation (`INITIATED`, `PENDING_VERIFICATION`, `VERIFIED`, `REJECTED`, `VOID`). |
| `GET` | `/public/receipts/:receiptNo/verify` | Public verification check of an issued receipt. Confirms validity, issue date, seva, and amount. Zero donor PII returned. |
| `POST` | `/public/reminders` | Subscribes an email to monthly donation reminders. |

---

## 2. Authentication Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/auth/login` | Authenticates with email & password. Issues httpOnly Secure cookie `auth_token` and returns user profile. |
| `POST` | `/auth/logout` | Clears authentication cookie. |
| `GET` | `/auth/me` | Returns currently authenticated user and role. |
| `POST` | `/auth/change-password` | Updates password. Clears `mustChangePassword` flag. |

---

## 3. Administrative Endpoints (RBAC Guarded)

All admin endpoints require an active JWT session. Roles: `SUPER_ADMIN`, `ACCOUNTS`, `CONTENT`.

### Donations & Reconciliation
- `GET /admin/dashboard`: Metrics for verified donations (all-time, this FY, this month), pending counts, and seva distribution.
- `GET /admin/donations`: Paginated donations table with filters (`status`, `sevaId`, `search`, `startDate`, `endDate`).
- `GET /admin/donations/export/csv`: Exports donations spreadsheet for chartered accountants.
- `GET /admin/donations/:id`: Full details of a donation including decrypted PAN & address, proof preview, and audit trail.
- `POST /admin/donations/:id/verify`: Atomically allocates gapless receipt number, generates bilingual Devanagari PDF receipt, and enqueues transactional email.
- `POST /admin/donations/:id/reject`: Rejects unverified payment proof with reason and notifies donor.
- `POST /admin/donations/:id/void`: Marks receipt as voided with mandatory reason (SUPER_ADMIN only).
- `POST /admin/donations/manual`: Records manual offline/cash donation with immediate verified receipt issuance.
- `POST /admin/reconciliation/import`: Uploads bank statement CSV and suggests matches against pending records.
- `POST /admin/reconciliation/bulk-verify`: Verifies selected bank statement matches in bulk.

### Content & Configuration
- `GET /admin/organization` & `PUT /admin/organization`: Foundation profile, statutory numbers (80G/12A), signatory details, and receipt prefix.
- `GET /admin/payment-settings` & `PUT /admin/payment-settings`: Preset amounts, thresholds, QR mode (`DYNAMIC` vs `STATIC_IMAGE`).
- `CRUD /admin/upi-accounts`: Management of UPI IDs and toggling of primary VPA.
- `CRUD /admin/bank-accounts`: Management of bank accounts with AES-256 encryption.
- `CRUD /admin/sevas`: Management of causes and focus areas.
- `CRUD /admin/team`: Management of Founder, Co-Founder, Trustee, and Volunteer cards.
- `CRUD /admin/certifications`: Management of official certificates with image/PDF lightboxes.
- `CRUD /admin/videos`: Video CMS with automatic provider detection (YouTube, Vimeo, FB, Drive, MP4).
- `CRUD /admin/milestones`: Foundation journey timeline.

### Users & Audit
- `GET /admin/users` & `POST /admin/users`: Management of admin accounts and roles (SUPER_ADMIN only).
- `PUT /admin/users/:id`: Updates role, status (active/disabled), or resets password.
- `GET /admin/audit-log`: Immutable chronological log of administrative operations.
- `POST /admin/media/upload`: Uploads validated image/PDF files with MIME and size enforcement.
