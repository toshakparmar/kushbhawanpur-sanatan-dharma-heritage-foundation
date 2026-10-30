import { z } from "zod";

// ==========================================
// 1. ROLES & STATUS ENUMS
// ==========================================

export const Role = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ACCOUNTS: "ACCOUNTS",
  CONTENT: "CONTENT",
} as const;
export type Role = (typeof Role)[keyof typeof Role];

export const DonationStatus = {
  INITIATED: "INITIATED",
  PENDING_VERIFICATION: "PENDING_VERIFICATION",
  VERIFIED: "VERIFIED",
  REJECTED: "REJECTED",
  EXPIRED: "EXPIRED",
  VOID: "VOID",
} as const;
export type DonationStatus = (typeof DonationStatus)[keyof typeof DonationStatus];

export const PaymentMethod = {
  UPI: "UPI",
  BANK_TRANSFER: "BANK_TRANSFER",
  CHEQUE_DD: "CHEQUE_DD",
  CASH: "CASH",
  CSR: "CSR",
  OTHER: "OTHER",
} as const;
export type PaymentMethod = (typeof PaymentMethod)[keyof typeof PaymentMethod];

export const QrMode = {
  DYNAMIC: "DYNAMIC",
  STATIC_IMAGE: "STATIC_IMAGE",
} as const;
export type QrMode = (typeof QrMode)[keyof typeof QrMode];

export const TeamMemberType = {
  FOUNDER: "FOUNDER",
  CO_FOUNDER: "CO_FOUNDER",
  TRUSTEE: "TRUSTEE",
  VOLUNTEER: "VOLUNTEER",
} as const;
export type TeamMemberType = (typeof TeamMemberType)[keyof typeof TeamMemberType];

export const VideoProvider = {
  YOUTUBE: "YOUTUBE",
  VIMEO: "VIMEO",
  FACEBOOK: "FACEBOOK",
  GOOGLE_DRIVE: "GOOGLE_DRIVE",
  DIRECT_MP4: "DIRECT_MP4",
  OTHER: "OTHER",
} as const;
export type VideoProvider = (typeof VideoProvider)[keyof typeof VideoProvider];

// ==========================================
// 2. MONEY & FORMATTING HELPERS
// ==========================================

export function paiseToRupees(paise: number): number {
  return Math.round(paise) / 100;
}

export function rupeesToPaise(rupees: number): number {
  return Math.round(rupees * 100);
}

/**
 * Formats a rupee amount in Indian currency format (e.g., ₹1,25,000)
 */
export function formatINR(amount: number, showDecimals: boolean = false): string {
  const parts = amount.toFixed(showDecimals ? 2 : 0).split(".");
  let integerPart = parts[0];
  const decimalPart = parts[1];

  let lastThree = integerPart.substring(integerPart.length - 3);
  const otherNumbers = integerPart.substring(0, integerPart.length - 3);
  if (otherNumbers !== "") {
    lastThree = "," + lastThree;
  }
  const formattedInteger =
    otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;

  return `₹${formattedInteger}${decimalPart ? "." + decimalPart : ""}`;
}

/**
 * Converts Indian Rupee amounts into English words using the Indian numbering system.
 * Example: 250100 -> "Rupees Two Lakh Fifty Thousand One Hundred Only"
 */
export function amountInWords(rupees: number): string {
  const num = Math.floor(Math.abs(rupees));
  if (num === 0) return "Rupees Zero Only";

  const a = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];
  const b = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];

  function twoDigits(n: number): string {
    if (n < 20) return a[n];
    return b[Math.floor(n / 10)] + (n % 10 !== 0 ? " " + a[n % 10] : "");
  }

  function threeDigits(n: number): string {
    const hundred = Math.floor(n / 100);
    const rest = n % 100;
    let res = "";
    if (hundred > 0) {
      res += a[hundred] + " Hundred";
    }
    if (rest > 0) {
      res += (hundred > 0 ? " and " : "") + twoDigits(rest);
    }
    return res;
  }

  let crore = Math.floor(num / 10000000);
  let remainder = num % 10000000;
  let lakh = Math.floor(remainder / 100000);
  remainder = remainder % 100000;
  let thousand = Math.floor(remainder / 1000);
  remainder = remainder % 1000;

  const parts: string[] = [];
  if (crore > 0) {
    parts.push(twoDigits(crore) + " Crore");
  }
  if (lakh > 0) {
    parts.push(twoDigits(lakh) + " Lakh");
  }
  if (thousand > 0) {
    parts.push(twoDigits(thousand) + " Thousand");
  }
  if (remainder > 0) {
    parts.push(threeDigits(remainder));
  }

  return `Rupees ${parts.join(" ")} Only`;
}

// ==========================================
// 3. ZOD VALIDATION SCHEMAS
// ==========================================

export const CreateDonationSchema = z.object({
  sevaId: z.string().min(1, "Please select a seva or purpose"),
  amountRupees: z
    .number()
    .min(10, "Minimum donation amount is ₹10")
    .max(10000000, "For donations exceeding ₹1 Crore, please contact CSR directly"),
  donorName: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().trim().email("Please provide a valid email address"),
  phone: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit Indian mobile number"),
  address: z.string().trim().max(300).optional(),
  pan: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Please enter a valid 10-character Indian PAN (e.g. ABCDE1234F)")
    .optional()
    .or(z.literal("")),
  isAnonymous: z.boolean().default(false),
  consent: z.literal(true, {
    message: "You must accept the terms & privacy policy to proceed",
  }),
  dedication: z.string().trim().max(200).optional(),
  honeypot: z.string().max(0).optional(),
});
export type CreateDonationInput = z.infer<typeof CreateDonationSchema>;

export const SubmitProofSchema = z.object({
  utr: z
    .string()
    .trim()
    .min(8, "UTR / Transaction reference must be at least 8 characters")
    .max(30, "Reference number cannot exceed 30 characters"),
  paymentAt: z.string().optional(),
  appUsed: z.string().trim().max(50).optional(),
  remarks: z.string().trim().max(300).optional(),
});
export type SubmitProofInput = z.infer<typeof SubmitProofSchema>;

export const VerifyDonationSchema = z.object({
  receivedAmountRupees: z.number().min(1).optional(),
  notes: z.string().trim().max(500).optional(),
});
export type VerifyDonationInput = z.infer<typeof VerifyDonationSchema>;

export const RejectDonationSchema = z.object({
  reason: z.string().trim().min(4, "Please provide a reason for rejection").max(300),
});
export type RejectDonationInput = z.infer<typeof RejectDonationSchema>;

export const VoidReceiptSchema = z.object({
  reason: z.string().trim().min(4, "Please provide a reason for voiding the receipt").max(300),
});
export type VoidReceiptInput = z.infer<typeof VoidReceiptSchema>;

export const ManualDonationSchema = z.object({
  sevaId: z.string().min(1, "Please select a seva"),
  amountRupees: z.number().min(1, "Amount must be at least ₹1"),
  method: z.enum([
    PaymentMethod.CASH,
    PaymentMethod.BANK_TRANSFER,
    PaymentMethod.CHEQUE_DD,
    PaymentMethod.UPI,
    PaymentMethod.CSR,
    PaymentMethod.OTHER,
  ]),
  donorName: z.string().trim().min(2, "Donor name required"),
  email: z.string().trim().email("Valid email required"),
  phone: z.string().trim().min(10, "Valid phone required"),
  address: z.string().trim().optional(),
  pan: z.string().trim().toUpperCase().optional(),
  utr: z.string().trim().optional(),
  paymentAt: z.string().optional(),
  remarks: z.string().trim().optional(),
});
export type ManualDonationInput = z.infer<typeof ManualDonationSchema>;

export const UpiAccountSchema = z.object({
  label: z.string().trim().min(2),
  vpa: z
    .string()
    .trim()
    .regex(/^[\w.-]+@[\w.-]+$/, "Invalid UPI VPA format (e.g. name@bank)"),
  payeeName: z.string().trim().min(2),
  isPrimary: z.boolean().default(false),
  active: z.boolean().default(true),
});
export type UpiAccountInput = z.infer<typeof UpiAccountSchema>;

export const BankAccountSchema = z.object({
  holder: z.string().trim().min(2),
  accountNumber: z.string().trim().min(6).max(30),
  ifsc: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid Indian IFSC code format"),
  bank: z.string().trim().min(2),
  branch: z.string().trim().min(2),
  type: z.string().trim().default("Current Account"),
  showPublic: z.boolean().default(true),
});
export type BankAccountInput = z.infer<typeof BankAccountSchema>;

export const OrganizationProfileSchema = z.object({
  nameEn: z.string().trim().min(2),
  nameHi: z.string().trim().min(2),
  taglineEn: z.string().trim().optional(),
  taglineHi: z.string().trim().optional(),
  aboutEn: z.string().trim().optional(),
  visionEn: z.string().trim().optional(),
  missionEn: z.string().trim().optional(),
  email: z.string().trim().email().optional(),
  phone: z.string().trim().optional(),
  address: z.string().trim().optional(),
  regNo: z.string().trim().optional(),
  panNo: z.string().trim().optional(),
  approval80G: z.string().trim().optional(),
  approval12A: z.string().trim().optional(),
  csrNo: z.string().trim().optional(),
  darpanId: z.string().trim().optional(),
  signatoryName: z.string().trim().optional(),
  signatoryDesignation: z.string().trim().optional(),
  receiptPrefix: z.string().trim().default("KSDHF"),
  receiptFooterNote: z.string().trim().optional(),
  fyStartMonth: z.number().int().min(1).max(12).default(4), // April
});
export type OrganizationProfileInput = z.infer<typeof OrganizationProfileSchema>;

export const SevaSchema = z.object({
  titleEn: z.string().trim().min(2),
  titleHi: z.string().trim().min(2),
  description: z.string().trim().min(5),
  suggestedAmounts: z.array(z.number().int().positive()).min(1),
  image: z.string().optional(),
  active: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
});
export type SevaInput = z.infer<typeof SevaSchema>;

export const TeamMemberSchema = z.object({
  type: z.enum([
    TeamMemberType.FOUNDER,
    TeamMemberType.CO_FOUNDER,
    TeamMemberType.TRUSTEE,
    TeamMemberType.VOLUNTEER,
  ]),
  nameEn: z.string().trim().min(2),
  nameHi: z.string().trim().optional(),
  designation: z.string().trim().min(2),
  photoUrl: z.string().optional(),
  bio: z.string().trim().max(1000).optional(),
  socialLinks: z
    .object({
      twitter: z.string().url().optional().or(z.literal("")),
      linkedin: z.string().url().optional().or(z.literal("")),
      website: z.string().url().optional().or(z.literal("")),
    })
    .optional(),
  sortOrder: z.number().int().default(0),
  active: z.boolean().default(true),
});
export type TeamMemberInput = z.infer<typeof TeamMemberSchema>;

export const CertificationSchema = z.object({
  title: z.string().trim().min(2),
  issuer: z.string().trim().min(2),
  number: z.string().trim().optional(),
  issueDate: z.string().optional(),
  fileUrl: z.string().min(1, "Certificate file is required"),
  thumbUrl: z.string().optional(),
  sortOrder: z.number().int().default(0),
  active: z.boolean().default(true),
});
export type CertificationInput = z.infer<typeof CertificationSchema>;

export const VideoSchema = z.object({
  title: z.string().trim().min(2),
  sourceUrl: z.string().trim().url("Please provide a valid video URL"),
  description: z.string().trim().optional(),
  category: z.string().trim().default("Heritage"),
  featured: z.boolean().default(false),
  sortOrder: z.number().int().default(0),
  published: z.boolean().default(true),
});
export type VideoInput = z.infer<typeof VideoSchema>;

export const MilestoneSchema = z.object({
  year: z.string().trim().min(2),
  title: z.string().trim().min(2),
  text: z.string().trim().min(5),
  sortOrder: z.number().int().default(0),
});
export type MilestoneInput = z.infer<typeof MilestoneSchema>;

export const ReminderSubscriptionSchema = z.object({
  name: z.string().trim().min(2),
  email: z.string().trim().email(),
  phone: z.string().trim().min(10),
  sevaId: z.string().optional(),
  preferredDay: z.number().int().min(1).max(28).default(1),
  consent: z.literal(true),
});
export type ReminderSubscriptionInput = z.infer<typeof ReminderSubscriptionSchema>;
