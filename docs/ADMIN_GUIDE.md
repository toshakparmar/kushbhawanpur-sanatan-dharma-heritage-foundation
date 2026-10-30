# Kushbhawanpur Foundation — Trustee & Accounts Administration Guide

This non-technical guide explains how foundation administrators, trustees, and accounting volunteers manage the platform.

---

## 1. Accessing the Admin Panel

1. Open your browser and navigate to `/admin` (e.g., `https://kushbhawanpur.org/admin`).
2. Log in with your registered email address and password.
3. **First-Time Login Security**: If logging in with the initial default password, the system will prompt you to set a private password (at least 8 characters) before entering the panel.

---

## 2. Managing the Organisation Profile & Receipt Templates

Navigate to **Foundation Profile** in the left sidebar:
1. **Bilingual Names & Taglines**: Edit the English and Hindi names of the foundation.
2. **About, Vision, & Mission**: Edit the official narrative text. These appear on the homepage About section within 60 seconds.
3. **Statutory Registrations**:
   - Enter your **Registration Number**, **PAN**, **80G Approval Number**, **12A Number**, and **Darpan ID**.
   - *Important*: These details appear on official donation receipts **only when entered**. If left blank, tax exemption claims will never be printed.
4. **Authorised Signatory**:
   - Enter the Signatory's Name and Designation (e.g. "Sri Trustee Name, Treasurer").
   - Upload a transparent signature image (PNG). This will be automatically embedded on generated PDF receipts.

---

## 3. Managing Leadership & Volunteers (Team Section)

Navigate to **Leadership & Team**:
1. Click **Add Member**.
2. **Role / Card Type**:
   - **Founder** or **Co-Founder**: Displays as large, elegant feature cards with arched portrait masks and subtle 3D tilt.
   - **Trustee**: Displays as an executive leadership card.
   - **Volunteer**: Displays in a compact sevadar badge card.
3. Enter Name (English & Hindi), Designation, Bio quote, and upload a portrait photograph.
4. Set the sort order and click **Save**.
5. *Note*: If there are no active members, the Team section hides automatically on the public website.

---

## 4. Video Content Management (Videos CMS)

Navigate to **Videos CMS**:
1. Click **Add Video**.
2. Enter the Video Title, Category (e.g., *Heritage*, *Seva*, *Darshan*), and paste the link.
3. **Supported Links**: Standard YouTube links, YouTube Shorts, Vimeo, Facebook video, Google Drive preview links, or direct `.mp4` URLs.
4. Check **Featured Video** if you want this video to be the primary 16:9 featured player on the homepage carousel.
5. Click **Save Video**. The system safely builds a privacy-preserving lite embed (`youtube-nocookie.com`) without raw iframe code.

---

## 5. Setting Up UPI IDs & Bank Accounts

Navigate to **Payment & UPI Config**:
1. **Primary UPI Account**:
   - Click **Add UPI ID**.
   - Enter Label (e.g. *Main Foundation HDFC UPI*), UPI ID (`name@handle`), and Payee Name.
   - Check **Make this the Primary UPI for public dynamic QR**.
   - The website automatically generates dynamic UPI QR codes containing the donor's exact chosen amount and reference ID using this primary VPA.
2. **Bank Accounts (NEFT/RTGS/IMPS)**:
   - Click **Add Bank Account**.
   - Enter Account Holder, Account Number, IFSC Code, Bank Name, and Branch.
   - The account number is encrypted at rest using AES-256 and masked on public pages for security.

---

## 6. Verifying Donations & Issuing Receipts

Without a costly third-party payment gateway, donors pay directly via UPI or Netbanking and submit their 12-digit UTR number or payment screenshot.

1. Navigate to **Pending Verification** in the sidebar.
2. You will see a list of contributions awaiting verification, sorted oldest first.
3. Click **Review & Verify** next to any record:
   - Note the **Donation Reference ID** (e.g. `KSDHF-7K3Q9M`) and **UTR Number**.
   - Look up this reference or UTR in your bank statement or UPI app.
   - If the received amount matches, click **Verify & Issue Receipt**.
   - *Correction*: If the donor pledged ₹2,100 but actually paid ₹2,500 (or vice versa), adjust the "Actual Received Amount" field before clicking verify.
4. **Instant Automated Delivery**:
   - The system atomically allocates a gapless receipt number (e.g., `KSDHF/2026-27/00001`).
   - Generates the official bilingual PDF receipt with Devanagari Hindi font and verification QR.
   - Automatically emails the PDF receipt to the donor.

---

## 7. Bank Statement CSV Reconciliation

If you have dozens of daily contributions:
1. Navigate to **Bank Reconciliation**.
2. Download a CSV statement from your bank netbanking portal.
3. Click **Select Bank Statement CSV** and upload it.
4. The system automatically extracts UTRs and credit amounts from transaction narrations and matches them against pending records.
5. Review the suggested matches and click **Bulk Verify Selected** to verify all matches in one click.

---

## 8. Voiding a Receipt

Charitable financial records cannot be deleted. If a cheque bounces or an entry was made in error:
1. Open the donation in **All Donations**.
2. Click **Void this Receipt**.
3. Enter the reason (e.g. "Cheque dishonoured by bank").
4. The receipt will permanently display a "VOID" watermark and will be marked as invalid on public verification queries.

---

## 9. Month-End Financial Export

1. Navigate to **All Donations**.
2. Optionally filter by date range or seva purpose.
3. Click **Export CSV** at the top right to download a spreadsheet for your chartered accountant / trust auditor.
