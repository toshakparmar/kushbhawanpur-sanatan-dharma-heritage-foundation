"use client";

import React, { useState } from "react";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { AmountPicker } from "@/components/donate/AmountPicker";
import { PurposeSelect } from "@/components/donate/PurposeSelect";
import { PaymentTabs } from "@/components/donate/PaymentTabs";
import { AfterPay } from "@/components/donate/AfterPay";
import { siteConfig } from "@/content/site.config";
import { formatINR } from "@/lib/format";
import { Diya } from "@/components/brand/Diya";
import { ShieldCheck, Heart, Sparkles, AlertCircle } from "lucide-react";

interface DonateSectionProps {
  initialAmount?: number;
  initialPurpose?: string;
}

export function Donate({
  initialAmount = siteConfig.donation.defaultAmount,
  initialPurpose = "general",
}: DonateSectionProps) {
  const [amount, setAmount] = useState<number>(initialAmount);
  const [purposeId, setPurposeId] = useState<string>(initialPurpose);
  const [dedication, setDedication] = useState<string>("");
  const [frequency, setFrequency] = useState<"one-time" | "monthly">("one-time");

  const { verification, banking, donation } = siteConfig;

  // Resolve human title for selected purpose
  const currentPurposeTitle =
    purposeId === "general"
      ? "General Foundation Fund"
      : siteConfig.focusAreas.find((a) => a.id === purposeId)?.title ||
        "Sacred Heritage Seva";

  return (
    <section id="donate" className="py-20 lg:py-28 bg-cream relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <SectionHeading
          hindiBadge="पवित्र सेवा दान"
          badge="Direct Giving"
          title="Offer Your Seva with Devotion & Trust"
          description="Support temple conservation, Vedic learning, cow protection, and community annadanam directly through verified non-profit banking channels."
        />

        {/* Master Framed Donation Card with Gold Hairline */}
        <div className="card-heritage p-6 sm:p-8 lg:p-10 border-2 border-gold/40 shadow-xl max-w-6xl mx-auto">
          
          {/* Top Frequency Toggle (if monthly enabled) & Live Summary */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-border">
            <div className="flex items-center gap-3">
              <Diya size={26} glow={true} />
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-muted font-sans block">
                  Contribution Summary
                </span>
                <p className="font-serif text-lg sm:text-xl font-bold text-maroon leading-tight">
                  You are giving <span className="text-saffron-deep">{formatINR(amount)}</span> · {currentPurposeTitle}
                </p>
              </div>
            </div>

            {/* Optional One-Time / Monthly toggle */}
            {banking.onlineGateway.monthlyGivingEnabled && (
              <div className="inline-flex rounded-full p-1 bg-sand border border-border text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setFrequency("one-time")}
                  className={`px-4 py-1.5 rounded-full transition-all cursor-pointer ${
                    frequency === "one-time"
                      ? "bg-maroon text-cream shadow-xs"
                      : "text-muted hover:text-ink"
                  }`}
                >
                  One-time Seva
                </button>
                <button
                  type="button"
                  onClick={() => setFrequency("monthly")}
                  className={`px-4 py-1.5 rounded-full transition-all cursor-pointer ${
                    frequency === "monthly"
                      ? "bg-maroon text-cream shadow-xs"
                      : "text-muted hover:text-ink"
                  }`}
                >
                  Monthly Sankalpa
                </button>
              </div>
            )}
          </div>

          {/* Two-Column Donation Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 py-8">
            
            {/* Left Column: Seva Amount & Purpose Selector */}
            <div className="lg:col-span-5 flex flex-col space-y-6 text-left">
              <AmountPicker
                selectedAmount={amount}
                onAmountChange={setAmount}
              />

              <PurposeSelect
                selectedPurpose={purposeId}
                onPurposeChange={setPurposeId}
                dedication={dedication}
                onDedicationChange={setDedication}
              />

              {/* Tax Exemption Note (Conditional) */}
              {verification.has80GApproval ? (
                <div className="p-3.5 rounded-xl bg-banyan-light/60 border border-banyan/30 text-xs text-banyan-deep flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-banyan shrink-0 mt-0.5" />
                  <p>
                    <strong>80G Tax Exemption Eligible:</strong> Provide your PAN number after donation to receive an official Section 80G tax certificate.
                  </p>
                </div>
              ) : (
                <div className="p-3.5 rounded-xl bg-sand/60 border border-border text-xs text-muted flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-gold-dark shrink-0 mt-0.5" />
                  <p>
                    All contributions go directly into our dedicated charitable bank account. Formal receipts are issued for every transaction.
                  </p>
                </div>
              )}
            </div>

            {/* Right Column: Payment Methods Tabs */}
            <div className="lg:col-span-7 flex flex-col space-y-6">
              <PaymentTabs
                amount={amount}
                purposeTitle={currentPurposeTitle}
                dedication={dedication}
              />
            </div>

          </div>

          {/* Bottom "After You Pay" Helper & Safety Banner */}
          <div className="pt-6 border-t border-border flex flex-col space-y-6">
            <AfterPay
              amount={amount}
              purposeTitle={currentPurposeTitle}
            />

            {/* Safety & Anti-Fraud Notice */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-xl bg-cream border border-border text-xs text-muted">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-gold-dark shrink-0" />
                <span>
                  <strong>Official Channels Only:</strong> Donate exclusively using the official bank details and QR shown on this page. We never solicit through personal numbers.
                </span>
              </div>
              <span className="text-[11px] font-semibold text-maroon whitespace-nowrap">
                Zero Intermediaries · 100% Direct
              </span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
