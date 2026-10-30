import { siteConfig } from "@/content/site.config";
import { QrMode } from "@kushbhawanpur/shared";

const API_BASE =
  process.env.INTERNAL_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:4000/api/v1";

export interface SiteData {
  org: {
    nameEn: string;
    nameHi: string;
    logoUrl?: string;
    taglineEn?: string;
    taglineHi?: string;
    aboutEn?: string;
    visionEn?: string;
    missionEn?: string;
    email?: string;
    phone?: string;
    address?: string;
    regNo?: string;
    panNo?: string;
    approval80G?: string;
    approval12A?: string;
    darpanId?: string;
  };
  milestones: Array<{
    id: string;
    year: string;
    title: string;
    text: string;
  }>;
  team: Array<{
    id: string;
    type: "FOUNDER" | "CO_FOUNDER" | "TRUSTEE" | "VOLUNTEER";
    nameEn: string;
    nameHi?: string;
    designation: string;
    photoUrl?: string;
    bio?: string;
    socials?: any;
  }>;
  certifications: Array<{
    id: string;
    title: string;
    issuer: string;
    number?: string;
    issueDate?: string;
    fileUrl: string;
    thumbUrl?: string;
  }>;
  videos: Array<{
    id: string;
    title: string;
    sourceUrl: string;
    provider: string;
    videoId: string;
    embedUrl: string;
    thumbnailUrl?: string;
    category?: string;
    featured?: boolean;
  }>;
}

export interface DonateConfig {
  paymentSettings: {
    qrMode: "DYNAMIC" | "STATIC_IMAGE";
    minAmountPaise: number;
    maxAmountPaise: number;
    presetAmounts: number[];
    allowUpi: boolean;
    allowBank: boolean;
    allowCheque: boolean;
    allowCsr: boolean;
    chequePayee?: string;
    chequeAddress?: string;
    csrContactEmail?: string;
    verificationSlaText?: string;
    staticQrUrl?: string;
  };
  primaryUpi: {
    id: string;
    label: string;
    vpa: string;
    payeeName: string;
  } | null;
  bankAccounts: Array<{
    id: string;
    holder: string;
    bank: string;
    branch?: string;
    ifsc: string;
    type: string;
    accountNumberMasked: string;
  }>;
  sevas: Array<{
    id: string;
    titleEn: string;
    titleHi?: string;
    description: string;
    suggestedAmounts: number[];
    image?: string;
  }>;
}

/**
 * Server component fetcher for public site data (About, Milestones, Team, Certifications, Videos)
 * Includes ISR revalidation (60s) with 100% graceful fallback to static config if the API is offline.
 */
export async function getSiteData(): Promise<SiteData> {
  try {
    const res = await fetch(`${API_BASE}/public/site`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const json = await res.json();
    return json.data || json;
  } catch (err) {
    // Graceful offline fallback: use siteConfig, return empty arrays for dynamic entities
    // Dynamic sections hide automatically when empty per requirements
    return {
      org: {
        nameEn: siteConfig.meta.name,
        nameHi: siteConfig.meta.devanagariName,
        logoUrl: "/brand/logo-original.png",
        taglineEn: siteConfig.meta.tagline,
        taglineHi: siteConfig.meta.devanagariTagline,
        aboutEn:
          "Dedicated to the cultural preservation, temple revival, manuscript conservation, and Gaushala seva of sacred Kushbhawanpur.",
        visionEn:
          "Restoring the sacred heritage of Sultanpur to its timeless Vedic glory and dharmic reverence.",
        missionEn:
          "Engaging local communities, scholars, and devotees in dharmic service, environmental sanctity, and Sanatan traditions.",
        email: siteConfig.contact.email,
        phone: siteConfig.contact.phone || "",
        address: `${siteConfig.contact.registeredAddress.line1}, ${siteConfig.contact.registeredAddress.city}, ${siteConfig.contact.registeredAddress.state} ${siteConfig.contact.registeredAddress.pincode}`,
        regNo: siteConfig.verification.registrationNumber || undefined,
        panNo: undefined,
        approval80G: siteConfig.verification.taxExemption80GNumber || undefined,
        approval12A: siteConfig.verification.taxExemption12ANumber || undefined,
      },
      milestones: [],
      team: [], // Hides team section if database empty
      certifications: [], // Hides certifications if database empty
      videos: [], // Hides videos if database empty
    };
  }
}

/**
 * Server / client fetcher for donation options & configuration
 */
export async function getDonateConfig(): Promise<DonateConfig> {
  try {
    const res = await fetch(`${API_BASE}/public/donate-config`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const json = await res.json();
    return json.data || json;
  } catch (err) {
    return {
      paymentSettings: {
        qrMode: QrMode.DYNAMIC,
        minAmountPaise: 10000,
        maxAmountPaise: 100000000,
        presetAmounts: siteConfig.donation.presetAmounts,
        allowUpi: true,
        allowBank: true,
        allowCheque: true,
        allowCsr: true,
        verificationSlaText:
          "We verify payments against bank records within 1–2 working days and email your official receipt.",
      },
      primaryUpi: {
        id: "default-upi",
        label: "Official Foundation UPI",
        vpa: siteConfig.banking.upi.upiId,
        payeeName: siteConfig.banking.upi.payeeName,
      },
      bankAccounts: [
        {
          id: "default-bank",
          holder: siteConfig.banking.bankTransfer.accountName,
          bank: siteConfig.banking.bankTransfer.bankName,
          branch: siteConfig.banking.bankTransfer.branch,
          ifsc: siteConfig.banking.bankTransfer.ifscCode,
          type: siteConfig.banking.bankTransfer.accountType,
          accountNumberMasked: `****${siteConfig.banking.bankTransfer.accountNumber.slice(-4)}`,
        },
      ],
      sevas: siteConfig.focusAreas.map((f) => ({
        id: f.id,
        titleEn: f.title,
        titleHi: f.hindiTitle,
        description: f.shortDesc,
        suggestedAmounts: [501, 1100, 2100, 5100],
        image: f.image,
      })),
    };
  }
}

/**
 * Initiates a donation and gets dynamic UPI URI & donorToken
 */
export async function createDonation(payload: any) {
  const res = await fetch(`/api/public/donations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.error?.message || "Failed to create donation intent.");
  }
  return json.data || json;
}

/**
 * Submits payment proof (UTR and screenshot)
 */
export async function submitProof(
  refId: string,
  token: string,
  utr: string,
  paymentAt?: string,
  screenshotFile?: File
) {
  const formData = new FormData();
  formData.append("utr", utr);
  formData.append("token", token);
  if (paymentAt) formData.append("paymentAt", paymentAt);
  if (screenshotFile) formData.append("screenshot", screenshotFile);

  const res = await fetch(`/api/public/donations/${refId}/proof`, {
    method: "POST",
    headers: {
      "x-donor-token": token,
    },
    body: formData,
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.error?.message || "Failed to submit payment proof.");
  }
  return json.data || json;
}

/**
 * Checks donation status
 */
export async function getDonationStatus(
  refId: string,
  contact?: string,
  token?: string
) {
  const params = new URLSearchParams();
  if (contact) params.append("contact", contact);
  if (token) params.append("token", token);

  const res = await fetch(`/api/public/donations/${refId}/status?${params.toString()}`, {
    headers: token ? { "x-donor-token": token } : {},
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.error?.message || "Donation not found or access denied.");
  }
  return json.data || json;
}

/**
 * Public receipt verification
 */
export async function verifyReceiptPublic(receiptNo: string) {
  const encNo = encodeURIComponent(receiptNo);
  const res = await fetch(`/api/public/receipts/${encNo}/verify`);
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.error?.message || "Failed to verify receipt.");
  }
  return json.data || json;
}
