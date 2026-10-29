/**
 * Donation & Content Adapters (Future-Ready abstraction layer)
 * 
 * In this static release, these adapters serve data from site.config.ts and
 * handle interactions client-side. When migrating to a headless CMS or dynamic API,
 * replace the implementations here without altering UI component signatures.
 */

import { siteConfig, type FocusArea, type ImpactItem, type SiteConfig } from "@/content/site.config";
import { faqs, type FAQItem } from "@/content/faq";

export interface DonationIntentInput {
  amount: number;
  frequency: "one-time" | "monthly";
  purposeId: string;
  purposeTitle: string;
  dedication?: string;
  paymentMethod: "upi" | "bank" | "cheque" | "online" | "csr";
}

export interface DonationIntentResult {
  success: boolean;
  intentId: string;
  referenceNote: string;
  timestamp: string;
}

export async function getSiteContent(): Promise<SiteConfig> {
  return siteConfig;
}

export async function getCauses(): Promise<FocusArea[]> {
  return siteConfig.focusAreas;
}

export async function getImpactItems(): Promise<ImpactItem[]> {
  return siteConfig.impactTiers;
}

export async function getFaqs(): Promise<FAQItem[]> {
  return faqs.filter((faq) => faq.visible);
}

export async function createDonationIntent(
  input: DonationIntentInput
): Promise<DonationIntentResult> {
  // Client-side static generation of unique transaction intent reference
  const randomSuffix = Math.random().toString(36).substring(2, 7).toUpperCase();
  const intentId = `KSD-${Date.now().toString().slice(-6)}-${randomSuffix}`;
  
  const purposeShort = input.purposeTitle.split(" ")[0].substring(0, 10);
  const referenceNote = `${purposeShort} Seva ${intentId}`;

  return {
    success: true,
    intentId,
    referenceNote,
    timestamp: new Date().toISOString(),
  };
}
