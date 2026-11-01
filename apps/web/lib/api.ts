import { siteConfig } from "@/content/site.config";
import {
  defaultSiteSettings,
  defaultNavItems,
  defaultHeroSlides,
  defaultTrustItems,
  defaultValuePillars,
  defaultFocusAreas,
  defaultStoryChapters,
  defaultImpactItems,
  defaultDonorBenefits,
  defaultGalleryItems,
  defaultInvolveCards,
  defaultFaqs,
  defaultPledge,
  defaultTeam,
} from "@/content/defaults";
import { QrMode } from "@kushbhawanpur/shared";

function getApiBase(): string {
  const raw =
    process.env.INTERNAL_API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:4000/api/v1";
  const trimmed = raw.replace(/\/+$/, "");
  return trimmed.endsWith("/api/v1") ? trimmed : `${trimmed}/api/v1`;
}

const API_BASE = getApiBase();

export interface SiteData {
  siteSettings?: any;
  navItems?: any[];
  pageSections?: any[];
  heroSlides?: any[];
  trustItems?: any[];
  valuePillars?: any[];
  focusAreas?: any[];
  storyChapters?: any[];
  impactItems?: any[];
  donorBenefits?: any[];
  galleryItems?: any[];
  involveCards?: any[];
  faqItems?: any[];
  pledgeContent?: any;
  policies?: any[];
  announcements?: any[];
  stats?: {
    totalAmountRupees: number;
    totalDonationsCount: number;
    totalDonorsCount: number;
  } | null;
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
 * Server component fetcher for public site data (CMS Sections, About, Milestones, Team, Certifications, Videos)
 * Includes ISR revalidation (60s) with 100% graceful fallback to static defaults if the API is offline.
 */
export async function getSiteData(): Promise<SiteData> {
  try {
    const res = await fetch(`${API_BASE}/public/site`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const json = await res.json();
    const data = json.data || json;
    return {
      siteSettings: data.siteSettings || defaultSiteSettings,
      navItems: data.navItems || defaultNavItems,
      pageSections: data.pageSections || [],
      heroSlides: data.heroSlides?.length ? data.heroSlides : defaultHeroSlides,
      trustItems: data.trustItems?.length ? data.trustItems : defaultTrustItems,
      valuePillars: data.valuePillars?.length ? data.valuePillars : defaultValuePillars,
      focusAreas: data.focusAreas?.length ? data.focusAreas : defaultFocusAreas,
      storyChapters: data.storyChapters?.length ? data.storyChapters : defaultStoryChapters,
      impactItems: data.impactItems?.length ? data.impactItems : defaultImpactItems,
      donorBenefits: data.donorBenefits?.length ? data.donorBenefits : defaultDonorBenefits,
      galleryItems: data.galleryItems?.length ? data.galleryItems : defaultGalleryItems,
      involveCards: data.involveCards?.length ? data.involveCards : defaultInvolveCards,
      faqItems: data.faqItems?.length ? data.faqItems : defaultFaqs,
      pledgeContent: data.pledgeContent || defaultPledge,
      policies: data.policies || [],
      announcements: data.announcements || [],
      org: data.org || {
        nameEn: defaultSiteSettings.siteNameEn,
        nameHi: defaultSiteSettings.siteNameHi,
        logoUrl: defaultSiteSettings.logoHeaderUrl,
        taglineEn: defaultSiteSettings.taglineEn,
        taglineHi: defaultSiteSettings.taglineHi,
        aboutEn: "Dedicated to the cultural preservation, temple revival, manuscript conservation, and Gaushala seva of sacred Kushbhawanpur.",
        visionEn: "Restoring the sacred heritage of Sultanpur to its timeless Vedic glory and dharmic reverence.",
        missionEn: "Engaging local communities, scholars, and devotees in dharmic service, environmental sanctity, and Sanatan traditions.",
        email: defaultSiteSettings.email,
        phone: defaultSiteSettings.phone,
        address: "Kushbhawanpur (Sultanpur), Uttar Pradesh - 228001, India",
      },
      milestones: data.milestones || [],
      team: (data.team && data.team.length > 0) ? data.team : defaultTeam,
      certifications: data.certifications || [],
      videos: data.videos || [],
      stats: data.stats || null,
    };
  } catch (err) {
    // Graceful offline fallback: use defaults
    return {
      siteSettings: defaultSiteSettings,
      navItems: defaultNavItems,
      pageSections: [],
      heroSlides: defaultHeroSlides,
      trustItems: defaultTrustItems,
      valuePillars: defaultValuePillars,
      focusAreas: defaultFocusAreas,
      storyChapters: defaultStoryChapters,
      impactItems: defaultImpactItems,
      donorBenefits: defaultDonorBenefits,
      galleryItems: defaultGalleryItems,
      involveCards: defaultInvolveCards,
      faqItems: defaultFaqs,
      pledgeContent: defaultPledge,
      policies: [],
      announcements: [],
      org: {
        nameEn: defaultSiteSettings.siteNameEn,
        nameHi: defaultSiteSettings.siteNameHi,
        logoUrl: defaultSiteSettings.logoHeaderUrl,
        taglineEn: defaultSiteSettings.taglineEn,
        taglineHi: defaultSiteSettings.taglineHi,
        aboutEn:
          "Dedicated to the cultural preservation, temple revival, manuscript conservation, and Gaushala seva of sacred Kushbhawanpur.",
        visionEn:
          "Restoring the sacred heritage of Sultanpur to its timeless Vedic glory and dharmic reverence.",
        missionEn:
          "Engaging local communities, scholars, and devotees in dharmic service, environmental sanctity, and Sanatan traditions.",
        email: defaultSiteSettings.email,
        phone: defaultSiteSettings.phone,
        address: "Kushbhawanpur (Sultanpur), Uttar Pradesh - 228001, India",
      },
      milestones: [],
      team: defaultTeam,
      certifications: [],
      videos: [],
      stats: null,
    };
  }
}


/**
 * Server / client fetcher for donation options & configuration
 */
export async function getDonateConfig(): Promise<DonateConfig> {
  try {
    const res = await fetch(`${API_BASE}/public/donate-config`, {
      cache: "no-store",
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
