"use client";

import React, { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Check, Copy, ExternalLink, QrCode, Smartphone } from "lucide-react";
import { siteConfig } from "@/content/site.config";
import { generateUpiUrl } from "@/lib/upi";
import { formatINR } from "@/lib/format";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface UpiQrProps {
  amount: number;
  purposeTitle: string;
  dedication?: string;
}

export function UpiQr({ amount, purposeTitle, dedication }: UpiQrProps) {
  const [copied, setCopied] = useState(false);
  const upiConfig = siteConfig.banking.upi;

  if (!upiConfig.enabled || !upiConfig.upiId) {
    return (
      <div className="p-8 text-center bg-sand/40 rounded-xl border border-border">
        <p className="font-serif font-bold text-maroon text-base">
          Official UPI Channel Being Configured
        </p>
        <p className="text-xs text-muted mt-1">
          Please use direct Bank NEFT/RTGS transfer while the official VPA is activated.
        </p>
      </div>
    );
  }

  // Construct standard note
  const sanitizedPurpose = purposeTitle.split(" ")[0].slice(0, 10);
  const note = dedication
    ? `${sanitizedPurpose}-${dedication.slice(0, 15)}`
    : `${sanitizedPurpose} Seva`;

  const upiUrl = generateUpiUrl({
    upiId: upiConfig.upiId,
    payeeName: upiConfig.payeeName,
    amount,
    note,
  });

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiConfig.upiId);
    setCopied(true);
    toast.success("UPI ID copied to clipboard", {
      description: upiConfig.upiId,
    });
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="flex flex-col items-center text-center p-6 bg-paper rounded-2xl border border-border/80 shadow-sm space-y-5">
      {/* QR Code Container */}
      <div className="relative p-4 bg-white rounded-2xl border-2 border-gold/40 shadow-md">
        <QRCodeSVG
          value={upiUrl}
          size={190}
          level="M"
          includeMargin={false}
          className="mx-auto"
        />
        <div className="absolute inset-0 pointer-events-none rounded-2xl ring-1 ring-gold/20" />
      </div>

      {/* Amount & Purpose Badge */}
      <div className="flex flex-col space-y-1">
        <div className="inline-flex items-center justify-center gap-1.5 text-xs text-muted font-medium">
          <QrCode className="w-3.5 h-3.5 text-gold-dark" />
          <span>Scan with any UPI App</span>
          <span className="text-[10px] bg-sand px-2 py-0.5 rounded-full text-maroon font-semibold">
            GPay · PhonePe · Paytm · BHIM
          </span>
        </div>
        <p className="text-sm font-bold text-maroon font-serif pt-1">
          Prefilled Amount: {formatINR(amount)}
        </p>
      </div>

      {/* Quick Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full max-w-sm pt-1">
        {/* Mobile deep link button */}
        <a
          href={upiUrl}
          className="btn-primary w-full sm:flex-1 py-2.5 px-4 text-xs font-bold inline-flex items-center justify-center gap-2"
        >
          <Smartphone className="w-4 h-4" />
          <span>Pay via UPI App</span>
        </a>

        {/* Copy UPI ID button */}
        <button
          type="button"
          onClick={handleCopyUpi}
          className="w-full sm:w-auto px-3.5 py-2.5 rounded-full border border-border bg-sand/60 hover:bg-sand text-ink text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          {copied ? (
            <Check className="w-3.5 h-3.5 text-banyan" />
          ) : (
            <Copy className="w-3.5 h-3.5 text-muted" />
          )}
          <span>{copied ? "Copied" : "Copy UPI ID"}</span>
        </button>
      </div>

      {/* Payee Info Note */}
      <div className="text-[11px] text-muted space-y-0.5 border-t border-border/60 pt-3 w-full">
        <p>
          Payee: <strong className="text-ink">{upiConfig.payeeName}</strong>
        </p>
        <p className="font-mono text-[10px] text-muted">{upiConfig.upiId}</p>
      </div>
    </div>
  );
}
