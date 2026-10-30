"use client";

import React, { useState, useEffect } from "react";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { siteConfig } from "@/content/site.config";
import { formatINR, paiseToRupees, rupeesToPaise } from "@kushbhawanpur/shared";
import { QRCodeSVG } from "qrcode.react";
import confetti from "canvas-confetti";
import {
  ShieldCheck,
  Heart,
  Sparkles,
  QrCode,
  Building2,
  FileCheck2,
  CheckCircle2,
  Copy,
  Check,
  Upload,
  ArrowRight,
  ArrowLeft,
  Smartphone,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { createDonation, submitProof, DonateConfig, getDonateConfig } from "@/lib/api";

interface DonateSectionProps {
  initialConfig?: DonateConfig;
  initialAmount?: number;
  initialSevaId?: string;
}

export function Donate({ initialConfig, initialAmount = 2100, initialSevaId }: DonateSectionProps) {
  const [config, setConfig] = useState<DonateConfig | null>(initialConfig || null);
  const [loadingConfig, setLoadingConfig] = useState(!initialConfig);

  // Stepper state: 1 (Seva & Amount), 2 (Details), 3 (Pay), 4 (Proof), 5 (Success)
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Step 1: Seva & Amount
  const [selectedSevaId, setSelectedSevaId] = useState<string>(initialSevaId || "");
  const [amount, setAmount] = useState<number>(initialAmount);
  const [customAmountStr, setCustomAmountStr] = useState<string>("");
  const [isCustom, setIsCustom] = useState<boolean>(false);
  const [dedication, setDedication] = useState<string>("");

  // Step 2: Donor Details
  const [donorName, setDonorName] = useState<string>("");
  const [donorPhone, setDonorPhone] = useState<string>("");
  const [donorEmail, setDonorEmail] = useState<string>("");
  const [donorAddress, setDonorAddress] = useState<string>("");
  const [donorPan, setDonorPan] = useState<string>("");
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const [hasConsented, setHasConsented] = useState<boolean>(false);
  const [honeypot, setHoneypot] = useState<string>(""); // Anti-spam

  // Step 3: Payment Intent info from API
  const [paymentData, setPaymentData] = useState<{
    refId: string;
    donorToken: string;
    upiUri: string;
    amountPaise: number;
    amountRupees: number;
    seva: { id: string; titleEn: string };
  } | null>(null);
  const [payTab, setPayTab] = useState<"UPI" | "BANK" | "CHEQUE">("UPI");
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Step 4: Proof info
  const [utrNumber, setUtrNumber] = useState<string>("");
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);

  // Loading & error states
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Load donate configuration on client mount if not passed as SSR prop
  useEffect(() => {
    if (!initialConfig) {
      getDonateConfig().then((data) => {
        setConfig(data);
        if (!selectedSevaId && data.sevas && data.sevas.length > 0) {
          setSelectedSevaId(data.sevas[0].id);
        }
        setLoadingConfig(false);
      });
    } else if (!selectedSevaId && initialConfig.sevas && initialConfig.sevas.length > 0) {
      setSelectedSevaId(initialConfig.sevas[0].id);
    }
  }, [initialConfig, selectedSevaId]);

  const activeSeva =
    config?.sevas.find((s) => s.id === selectedSevaId) || config?.sevas[0];

  const presets = config?.paymentSettings.presetAmounts || [501, 1100, 2100, 5100, 11000, 21000];

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2500);
  };

  // Step 1 -> Step 2
  const handleProceedToDetails = () => {
    setErrorMsg(null);
    if (!amount || amount < 51) {
      setErrorMsg("Please select or enter a donation amount of at least ₹51.");
      return;
    }
    setStep(2);
  };

  // Step 2 -> Step 3 (Creates donation on backend)
  const handleInitiateDonation = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Anti-bot check
    if (honeypot) return;

    if (!donorName.trim()) {
      setErrorMsg("Please enter your full name.");
      return;
    }
    if (!donorPhone.trim() || donorPhone.replace(/\D/g, "").length < 10) {
      setErrorMsg("Please enter a valid 10-digit mobile number.");
      return;
    }
    if (!donorEmail.trim() || !donorEmail.includes("@")) {
      setErrorMsg("Please enter a valid email address to receive your receipt.");
      return;
    }
    if (!hasConsented) {
      setErrorMsg("Please accept the consent checkbox to proceed.");
      return;
    }

    try {
      setSubmitting(true);
      const res = await createDonation({
        sevaId: selectedSevaId || config?.sevas[0]?.id || "general",
        amountPaise: rupeesToPaise(amount),
        donor: {
          name: donorName.trim(),
          phone: donorPhone.trim(),
          email: donorEmail.trim(),
          address: donorAddress.trim() || undefined,
          pan: donorPan.trim() || undefined,
        },
        method: "UPI",
        anonymous: isAnonymous,
        dedication: dedication.trim() || undefined,
      });

      setPaymentData(res);
      setStep(3);
    } catch (err: any) {
      setErrorMsg(err.message || "Unable to initiate donation. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Step 4 Submit Proof
  const handleSubmitProof = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!paymentData) return;
    if (!utrNumber.trim()) {
      setErrorMsg("Please enter your 12-digit UPI UTR or Bank Reference Number.");
      return;
    }

    try {
      setSubmitting(true);
      await submitProof(
        paymentData.refId,
        paymentData.donorToken,
        utrNumber.trim(),
        new Date().toISOString(),
        screenshotFile || undefined
      );

      // Trigger celebration confetti
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });

      setStep(5);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to submit verification proof.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      setErrorMsg("Screenshot size must be under 3 MB.");
      return;
    }

    setScreenshotFile(file);
    const reader = new FileReader();
    reader.onload = () => setScreenshotPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <section id="donate" className="py-20 lg:py-28 bg-cream relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <SectionHeading
          hindiBadge="पवित्र सेवा दान"
          badge="Direct Giving"
          title="Offer Your Seva with Devotion & Transparency"
          subtitle="Support temple conservation, Vedic learning, cow protection, and community annadanam directly through verified non-profit banking channels."
        />

        {/* Master Stepper Container */}
        <div className="mt-12 rounded-3xl bg-paper border-2 border-gold/40 shadow-xl p-6 sm:p-10 relative">
          {/* Step Indicator Header */}
          <div className="flex items-center justify-between pb-6 mb-8 border-b border-border/80 text-xs sm:text-sm font-sans">
            <div className="flex items-center gap-2">
              <span
                className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                  step === 1 ? "bg-maroon text-cream" : step > 1 ? "bg-saffron text-white" : "bg-sand text-ink-muted"
                }`}
              >
                1
              </span>
              <span className={`font-serif font-semibold hidden sm:inline ${step === 1 ? "text-maroon" : "text-ink-muted"}`}>
                Seva & Amount
              </span>
            </div>

            <div className="w-8 sm:w-16 h-px bg-border" />

            <div className="flex items-center gap-2">
              <span
                className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                  step === 2 ? "bg-maroon text-cream" : step > 2 ? "bg-saffron text-white" : "bg-sand text-ink-muted"
                }`}
              >
                2
              </span>
              <span className={`font-serif font-semibold hidden sm:inline ${step === 2 ? "text-maroon" : "text-ink-muted"}`}>
                Your Details
              </span>
            </div>

            <div className="w-8 sm:w-16 h-px bg-border" />

            <div className="flex items-center gap-2">
              <span
                className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                  step === 3 ? "bg-maroon text-cream" : step > 3 ? "bg-saffron text-white" : "bg-sand text-ink-muted"
                }`}
              >
                3
              </span>
              <span className={`font-serif font-semibold hidden sm:inline ${step === 3 ? "text-maroon" : "text-ink-muted"}`}>
                Pay (QR / Bank)
              </span>
            </div>

            <div className="w-8 sm:w-16 h-px bg-border" />

            <div className="flex items-center gap-2">
              <span
                className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                  step >= 4 ? "bg-maroon text-cream" : "bg-sand text-ink-muted"
                }`}
              >
                4
              </span>
              <span className={`font-serif font-semibold hidden sm:inline ${step >= 4 ? "text-maroon" : "text-ink-muted"}`}>
                Confirm & Receipt
              </span>
            </div>
          </div>

          {/* Global Error Banner */}
          {errorMsg && (
            <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-start gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 text-red-600 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* STEP 1: CHOOSE SEVA & AMOUNT */}
          {step === 1 && (
            <div>
              {/* Seva / Purpose selection */}
              <div className="mb-8">
                <label className="block font-serif text-base sm:text-lg font-bold text-maroon mb-3">
                  1. Select Sacred Seva / Focus Area
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {config?.sevas.map((seva) => {
                    const isSelected = selectedSevaId === seva.id;
                    return (
                      <button
                        key={seva.id}
                        type="button"
                        onClick={() => setSelectedSevaId(seva.id)}
                        className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? "border-saffron bg-saffron/10 ring-2 ring-saffron/30 shadow-sm"
                            : "border-gold/30 bg-cream/30 hover:border-gold hover:bg-cream/60"
                        }`}
                      >
                        <div>
                          <h4 className="font-serif font-bold text-sm sm:text-base text-maroon leading-snug">
                            {seva.titleEn}
                          </h4>
                          {seva.titleHi && (
                            <p className="font-hindi text-xs text-saffron-deep mt-0.5">
                              {seva.titleHi}
                            </p>
                          )}
                        </div>
                        <p className="text-[11px] text-ink-muted line-clamp-2 mt-2 font-sans">
                          {seva.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Amount Selection */}
              <div className="mb-8">
                <label className="block font-serif text-base sm:text-lg font-bold text-maroon mb-3">
                  2. Choose Contribution Amount (INR)
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-4">
                  {presets.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => {
                        setAmount(preset);
                        setIsCustom(false);
                      }}
                      className={`py-3 px-2 rounded-xl border text-center font-serif font-bold text-sm sm:text-base transition-all cursor-pointer ${
                        !isCustom && amount === preset
                          ? "bg-maroon text-cream border-maroon shadow-sm"
                          : "bg-paper text-maroon border-gold/40 hover:border-gold hover:bg-sand/30"
                      }`}
                    >
                      {formatINR(preset)}
                    </button>
                  ))}
                </div>

                {/* Custom Amount Field */}
                <div className="relative max-w-xs">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-serif font-bold text-maroon text-lg">
                    ₹
                  </span>
                  <input
                    type="number"
                    min="51"
                    placeholder="Enter custom amount"
                    value={isCustom ? customAmountStr : ""}
                    onChange={(e) => {
                      setIsCustom(true);
                      setCustomAmountStr(e.target.value);
                      const parsed = parseInt(e.target.value, 10);
                      setAmount(isNaN(parsed) ? 0 : parsed);
                    }}
                    className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-gold/50 bg-paper text-maroon font-serif font-bold text-base focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                </div>
              </div>

              {/* Optional Sankalpa / Dedication */}
              <div className="mb-8">
                <label className="block font-serif text-sm font-semibold text-ink-muted mb-2">
                  Optional: In Honour / Memory of (Sankalpa)
                </label>
                <input
                  type="text"
                  placeholder="e.g. In memory of late grandparents / On my birthday"
                  value={dedication}
                  onChange={(e) => setDedication(e.target.value)}
                  className="w-full max-w-lg px-4 py-2.5 rounded-xl border border-border bg-paper text-sm text-ink focus:outline-none focus:border-gold"
                />
              </div>

              {/* Action Button */}
              <div className="flex justify-end pt-4 border-t border-border/80">
                <button
                  type="button"
                  onClick={handleProceedToDetails}
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-saffron text-white font-serif font-bold text-base hover:bg-saffron-dark transition-all shadow-md cursor-pointer"
                >
                  <span>Continue to Details</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: DONOR DETAILS */}
          {step === 2 && (
            <form onSubmit={handleInitiateDonation}>
              {/* Anti-bot honeypot */}
              <input
                type="text"
                name="b_field"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
              />

              <div className="mb-6 flex items-center justify-between pb-4 border-b border-border">
                <span className="font-serif font-bold text-lg text-maroon">
                  Donation Summary: <span className="text-saffron-deep">{formatINR(amount)}</span> for {activeSeva?.titleEn}
                </span>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs text-ink-muted hover:text-maroon underline cursor-pointer"
                >
                  Change Seva/Amount
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
                <div>
                  <label className="block font-serif text-sm font-bold text-maroon mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Sri / Smt. Donor Name"
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-paper text-sm text-ink focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                </div>

                <div>
                  <label className="block font-serif text-sm font-bold text-maroon mb-1.5">
                    Mobile Number (10 digits) *
                  </label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="9876543210"
                    value={donorPhone}
                    onChange={(e) => setDonorPhone(e.target.value.replace(/\D/g, ""))}
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-paper text-sm text-ink focus:outline-none focus:ring-2 focus:ring-gold font-mono"
                  />
                </div>

                <div>
                  <label className="block font-serif text-sm font-bold text-maroon mb-1.5">
                    Email Address * (For official PDF receipt)
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="donor@example.com"
                    value={donorEmail}
                    onChange={(e) => setDonorEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-paper text-sm text-ink focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                </div>

                <div>
                  <label className="block font-serif text-sm font-bold text-maroon mb-1.5">
                    PAN Number (Optional, for 80G tax benefit)
                  </label>
                  <input
                    type="text"
                    maxLength={10}
                    placeholder="ABCDE1234F"
                    value={donorPan}
                    onChange={(e) => setDonorPan(e.target.value.toUpperCase())}
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-paper text-sm text-ink focus:outline-none focus:ring-2 focus:ring-gold font-mono uppercase"
                  />
                  <span className="text-[11px] text-ink-muted">
                    Required only if you wish to claim Section 80G tax benefits.
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <label className="block font-serif text-sm font-semibold text-ink-muted mb-1.5">
                  Postal Address (Optional, for physical receipt record)
                </label>
                <input
                  type="text"
                  placeholder="Street, City, State, PIN Code"
                  value={donorAddress}
                  onChange={(e) => setDonorAddress(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-paper text-sm text-ink focus:outline-none focus:ring-2 focus:ring-gold"
                />
              </div>

              <div className="mb-6 space-y-3">
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="w-4 h-4 rounded border-border text-maroon focus:ring-gold"
                  />
                  <span className="text-xs sm:text-sm text-ink">
                    Donate anonymously (your name will not appear on public donor walls)
                  </span>
                </label>

                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    required
                    checked={hasConsented}
                    onChange={(e) => setHasConsented(e.target.checked)}
                    className="w-4 h-4 rounded border-border text-maroon focus:ring-gold mt-1 shrink-0"
                  />
                  <span className="text-xs text-ink-muted leading-relaxed">
                    I confirm that this contribution is made from my own legitimate funds, I am a resident Indian citizen, and I consent to the foundation processing my details for receipt generation and statutory reporting under DPDP. *
                  </span>
                </label>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-serif font-semibold text-ink-muted hover:text-maroon cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-saffron text-white font-serif font-bold text-base hover:bg-saffron-dark transition-all shadow-md disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? "Initiating..." : "Proceed to Pay"}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: PAY (DYNAMIC UPI QR & BANK DETAILS) */}
          {step === 3 && paymentData && (
            <div>
              {/* Reference ID Banner */}
              <div className="mb-8 p-4 rounded-2xl bg-saffron/10 border border-saffron/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <span className="text-xs uppercase font-sans font-bold text-saffron-deep block">
                    Your Unique Donation Reference
                  </span>
                  <span className="font-mono text-xl sm:text-2xl font-bold text-maroon tracking-wider">
                    {paymentData.refId}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(paymentData.refId, "ref")}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-paper border border-gold/50 text-xs font-serif font-semibold text-maroon hover:bg-sand/40 cursor-pointer"
                >
                  {copiedField === "ref" ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedField === "ref" ? "Copied!" : "Copy Reference"}
                </button>
              </div>

              {/* Payment Method Tabs */}
              <div className="flex items-center gap-2 mb-6 border-b border-border pb-2">
                <button
                  type="button"
                  onClick={() => setPayTab("UPI")}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-serif text-sm font-semibold transition-all cursor-pointer ${
                    payTab === "UPI"
                      ? "bg-maroon text-cream shadow-xs"
                      : "text-ink-muted hover:text-maroon hover:bg-sand/40"
                  }`}
                >
                  <QrCode className="w-4 h-4" />
                  UPI QR (Instant)
                </button>

                <button
                  type="button"
                  onClick={() => setPayTab("BANK")}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-serif text-sm font-semibold transition-all cursor-pointer ${
                    payTab === "BANK"
                      ? "bg-maroon text-cream shadow-xs"
                      : "text-ink-muted hover:text-maroon hover:bg-sand/40"
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  Bank Transfer (NEFT/RTGS/IMPS)
                </button>
              </div>

              {/* TAB: UPI QR */}
              {payTab === "UPI" && (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center py-4">
                  <div className="md:col-span-5 flex flex-col items-center justify-center p-6 bg-paper rounded-2xl border-2 border-gold/40 shadow-inner">
                    {paymentData.upiUri ? (
                      <div className="p-2 bg-white rounded-xl shadow-xs">
                        <QRCodeSVG
                          value={paymentData.upiUri}
                          size={220}
                          level="M"
                          includeMargin={true}
                        />
                      </div>
                    ) : (
                      <div className="w-48 h-48 flex items-center justify-center bg-sand/30 rounded-xl">
                        <QrCode className="w-16 h-16 text-gold" />
                      </div>
                    )}
                    <span className="text-[11px] font-sans text-ink-muted mt-3 text-center">
                      Scan with Google Pay, PhonePe, Paytm, or BHIM
                    </span>

                    {/* Mobile Deep link */}
                    {paymentData.upiUri && (
                      <a
                        href={paymentData.upiUri}
                        className="mt-4 sm:hidden w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-saffron text-white font-serif font-bold text-sm shadow-sm"
                      >
                        <Smartphone className="w-4 h-4" />
                        Pay with any UPI App
                      </a>
                    )}
                  </div>

                  <div className="md:col-span-7 flex flex-col space-y-4">
                    <div className="p-4 rounded-xl bg-cream/40 border border-border">
                      <span className="text-xs text-ink-muted block mb-0.5">Payee Name</span>
                      <span className="font-serif font-bold text-maroon text-base">
                        {config?.primaryUpi?.payeeName || siteConfig.banking.upi.payeeName}
                      </span>
                    </div>

                    <div className="p-4 rounded-xl bg-cream/40 border border-border flex items-center justify-between">
                      <div>
                        <span className="text-xs text-ink-muted block mb-0.5">UPI ID (VPA)</span>
                        <span className="font-mono font-bold text-maroon text-sm sm:text-base">
                          {config?.primaryUpi?.vpa || siteConfig.banking.upi.upiId}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          handleCopy(
                            config?.primaryUpi?.vpa || siteConfig.banking.upi.upiId,
                            "upi"
                          )
                        }
                        className="p-2 rounded-lg bg-paper border border-gold/40 text-maroon hover:bg-sand/40 cursor-pointer"
                        title="Copy UPI ID"
                      >
                        {copiedField === "upi" ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>

                    <div className="p-4 rounded-xl bg-cream/40 border border-border flex items-center justify-between">
                      <div>
                        <span className="text-xs text-ink-muted block mb-0.5">Exact Amount</span>
                        <span className="font-serif font-bold text-saffron-deep text-lg">
                          {formatINR(paymentData.amountRupees)}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy(String(paymentData.amountRupees), "amt")}
                        className="p-2 rounded-lg bg-paper border border-gold/40 text-maroon hover:bg-sand/40 cursor-pointer"
                        title="Copy Amount"
                      >
                        {copiedField === "amt" ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>

                    <p className="text-xs text-ink-muted leading-relaxed font-sans">
                      💡 <strong>Important:</strong> Please enter reference <strong>{paymentData.refId}</strong> in your UPI remark/note so our accounts team can immediately verify your contribution.
                    </p>
                  </div>
                </div>
              )}

              {/* TAB: BANK TRANSFER */}
              {payTab === "BANK" && (
                <div className="py-4 space-y-4">
                  {config?.bankAccounts && config.bankAccounts.length > 0 ? (
                    config.bankAccounts.map((acc) => (
                      <div
                        key={acc.id}
                        className="p-6 rounded-2xl bg-cream/30 border border-gold/40 grid grid-cols-1 sm:grid-cols-2 gap-4"
                      >
                        <div>
                          <span className="text-xs text-ink-muted block">Account Name</span>
                          <span className="font-serif font-bold text-maroon text-base">
                            {acc.holder}
                          </span>
                        </div>
                        <div>
                          <span className="text-xs text-ink-muted block">Bank Name</span>
                          <span className="font-serif font-bold text-maroon text-base">
                            {acc.bank} {acc.branch ? `(${acc.branch})` : ""}
                          </span>
                        </div>
                        <div>
                          <span className="text-xs text-ink-muted block">Account Number</span>
                          <span className="font-mono font-bold text-maroon text-base">
                            {acc.accountNumberMasked || siteConfig.banking.bankTransfer.accountNumber}
                          </span>
                        </div>
                        <div>
                          <span className="text-xs text-ink-muted block">IFSC Code</span>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-maroon text-base">
                              {acc.ifsc}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCopy(acc.ifsc, "ifsc")}
                              className="p-1 rounded bg-paper border border-border"
                            >
                              {copiedField === "ifsc" ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 rounded-xl bg-sand/30 text-xs text-ink-muted">
                      Please refer to official bank details provided by the trust.
                    </div>
                  )}
                  <p className="text-xs text-ink-muted leading-relaxed">
                    Add reference <strong>{paymentData.refId}</strong> in the NEFT/RTGS transaction description.
                  </p>
                </div>
              )}

              {/* Action Button to Confirm Step 4 */}
              <div className="mt-8 pt-6 border-t border-border flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-serif font-semibold text-ink-muted hover:text-maroon cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>

                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-maroon text-cream font-serif font-bold text-base hover:bg-maroon-dark transition-all shadow-md cursor-pointer"
                >
                  <CheckCircle2 className="w-5 h-5 text-gold" />
                  <span>I Have Paid — Submit UTR / Proof</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: SUBMIT UTR & PROOF */}
          {step === 4 && paymentData && (
            <form onSubmit={handleSubmitProof}>
              <div className="mb-6 p-4 rounded-2xl bg-sand/30 border border-gold/30 flex items-center justify-between">
                <div>
                  <span className="text-xs text-ink-muted block">Donation Reference</span>
                  <span className="font-mono font-bold text-maroon text-lg">{paymentData.refId}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-ink-muted block">Amount Paid</span>
                  <span className="font-serif font-bold text-saffron-deep text-lg">
                    {formatINR(paymentData.amountRupees)}
                  </span>
                </div>
              </div>

              <div className="space-y-6 mb-8">
                <div>
                  <label className="block font-serif text-base font-bold text-maroon mb-1.5">
                    12-Digit UPI Transaction ID (UTR) or Bank Reference Number *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 429381729012"
                    value={utrNumber}
                    onChange={(e) => setUtrNumber(e.target.value.trim())}
                    className="w-full max-w-md px-4 py-3 rounded-xl border border-gold/60 bg-paper text-maroon font-mono text-base font-bold tracking-wider focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                  <p className="text-[11px] text-ink-muted mt-1 font-sans">
                    Visible in your GPay / PhonePe / Paytm payment details screen as &ldquo;UPI transaction ID&rdquo; or &ldquo;UTR&rdquo;.
                  </p>
                </div>

                <div>
                  <label className="block font-serif text-base font-bold text-maroon mb-1.5">
                    Optional: Upload Payment Screenshot (Image, max 3 MB)
                  </label>
                  <div className="mt-2 flex items-center gap-4">
                    <label className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gold/60 bg-paper hover:bg-sand/30 text-maroon font-serif font-semibold text-sm transition-all cursor-pointer shadow-xs">
                      <Upload className="w-4 h-4 text-saffron" />
                      <span>Choose File</span>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                    <span className="text-xs text-ink-muted truncate max-w-xs">
                      {screenshotFile ? screenshotFile.name : "No file chosen"}
                    </span>
                  </div>

                  {screenshotPreview && (
                    <div className="mt-4 w-36 h-36 rounded-xl overflow-hidden border border-gold/40 relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={screenshotPreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-border">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-serif font-semibold text-ink-muted hover:text-maroon cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to QR
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-saffron text-white font-serif font-bold text-base hover:bg-saffron-dark transition-all shadow-md disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? "Submitting..." : "Submit Verification Proof"}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 5: SUCCESS / CONFIRMATION */}
          {step === 5 && paymentData && (
            <div className="text-center py-8 max-w-xl mx-auto">
              <div className="w-16 h-16 rounded-full bg-green-100 text-green-700 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-maroon mb-2">
                Dhanyavad! Proof Received with Devotion
              </h3>
              <p className="text-xs sm:text-sm text-ink-muted font-sans mb-6">
                Your payment proof for reference{" "}
                <strong className="text-maroon font-mono">{paymentData.refId}</strong> has been logged into our accounts queue.
              </p>

              <div className="p-6 rounded-2xl bg-cream/50 border border-gold/40 text-left mb-8 space-y-3 text-xs sm:text-sm">
                <div className="flex justify-between border-b border-border/60 pb-2">
                  <span className="text-ink-muted">Reference ID</span>
                  <span className="font-mono font-bold text-maroon">{paymentData.refId}</span>
                </div>
                <div className="flex justify-between border-b border-border/60 pb-2">
                  <span className="text-ink-muted">Amount</span>
                  <span className="font-serif font-bold text-saffron-deep">{formatINR(paymentData.amountRupees)}</span>
                </div>
                <div className="flex justify-between border-b border-border/60 pb-2">
                  <span className="text-ink-muted">Seva Area</span>
                  <span className="font-semibold text-maroon">{paymentData.seva.titleEn}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-muted">Estimated Receipt SLA</span>
                  <span className="font-semibold text-green-700">1–2 Working Days</span>
                </div>
              </div>

              <p className="text-xs text-ink-muted mb-8 font-sans leading-relaxed">
                Our verification volunteers will match your UTR against the foundation bank records and immediately email your official bilingual 80G receipt (PDF).
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={`/donation-status?ref=${paymentData.refId}`}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-maroon text-cream font-serif font-bold text-sm hover:bg-maroon-dark transition-all shadow-sm"
                >
                  <span>Track Donation Status</span>
                  <ExternalLink className="w-4 h-4" />
                </a>

                <button
                  type="button"
                  onClick={() => {
                    setStep(1);
                    setPaymentData(null);
                    setUtrNumber("");
                    setScreenshotFile(null);
                    setScreenshotPreview(null);
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-gold/60 bg-paper text-maroon font-serif font-semibold text-sm hover:bg-sand/30 transition-all cursor-pointer"
                >
                  Offer Another Seva
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
