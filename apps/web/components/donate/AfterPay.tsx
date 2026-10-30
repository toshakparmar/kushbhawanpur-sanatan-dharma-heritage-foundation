"use client";

import React, { useState } from "react";
import { Mail, MessageCircle, Heart, CheckCircle2, ShieldCheck } from "lucide-react";
import { siteConfig } from "@/content/site.config";
import { formatINR } from "@/lib/format";
import { ClickSpark } from "@/components/reactbits/ClickSpark";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Diya } from "@/components/brand/Diya";

interface AfterPayProps {
  amount: number;
  purposeTitle: string;
}

export function AfterPay({ amount, purposeTitle }: AfterPayProps) {
  const [showThankYou, setShowThankYou] = useState(false);
  const { contact } = siteConfig;

  // Prefilled mailto link
  const subject = encodeURIComponent(
    `Donation Confirmation: ${formatINR(amount)} for ${purposeTitle}`
  );
  const body = encodeURIComponent(
    `Namaste,\n\nI have completed a donation of ${formatINR(amount)} toward ${purposeTitle}.\n\nPlease issue an official acknowledgement receipt to the following details:\n\nFull Name: \nPAN Number: \nPostal Address: \nTransaction Reference / UTR Number: \nPayment Date: ${new Date().toLocaleDateString("en-IN")}\n\nWith warm regards.`
  );
  const mailtoLink = `mailto:${contact.donationEmail}?subject=${subject}&body=${body}`;

  return (
    <div className="rounded-2xl border border-gold/40 bg-sand/30 p-5 sm:p-6 space-y-4 text-left">
      <div className="flex items-center gap-2 text-maroon font-serif font-bold text-base">
        <ShieldCheck className="w-5 h-5 text-saffron" />
        <span>After Completing Your Transfer</span>
      </div>

      <p className="text-xs text-ink-muted leading-relaxed">
        To receive your formal acknowledgement receipt, please share your{" "}
        <strong>Name, PAN, Donation Amount, and UTR / Transaction ID</strong> with our accounts desk:
      </p>

      {/* Action Buttons: Email and WhatsApp */}
      <div className="flex flex-wrap items-center gap-2.5 pt-1">
        <a
          href={mailtoLink}
          className="px-4 py-2 rounded-full border border-border bg-paper hover:bg-cream text-maroon text-xs font-bold inline-flex items-center gap-1.5 transition-colors shadow-sm"
        >
          <Mail className="w-3.5 h-3.5 text-saffron" />
          <span>Email Transaction Details</span>
        </a>

        {contact.whatsappNumber && (
          <a
            href={`https://wa.me/${contact.whatsappNumber.replace(/[^0-9]/g, "")}?text=Namaste,%20I%20have%20transferred%20${encodeURIComponent(formatINR(amount))}%20for%20${encodeURIComponent(purposeTitle)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-full border border-banyan/30 bg-banyan-light hover:bg-banyan hover:text-white text-banyan text-xs font-bold inline-flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>WhatsApp Confirmation</span>
          </a>
        )}

        {/* Gentle "I've Paid" button with ClickSpark celebratory feedback */}
        <ClickSpark
          onClick={() => setShowThankYou(true)}
          className="inline-block"
        >
          <button
            type="button"
            className="btn-primary px-4 py-2 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>I have completed my payment</span>
          </button>
        </ClickSpark>
      </div>

      {/* Thank You Confirmation Dialog */}
      <Dialog open={showThankYou} onOpenChange={setShowThankYou}>
        <DialogContent className="max-w-md p-6 text-center bg-paper border border-gold/40">
          <div className="flex flex-col items-center justify-center space-y-3 py-2">
            <div className="w-16 h-16 rounded-full bg-sand/80 flex items-center justify-center">
              <Diya size={36} glow={true} />
            </div>

            <DialogTitle className="text-2xl font-serif font-bold text-maroon">
              कृतज्ञतापूर्वक धन्यवाद
            </DialogTitle>

            <span className="text-xs font-semibold uppercase tracking-wider text-saffron-deep">
              Heartfelt Gratitude For Your Sacred Seva
            </span>

            <p className="text-xs text-ink-muted leading-relaxed font-sans max-w-sm">
              Your offering of <strong>{formatINR(amount)}</strong> towards{" "}
              <strong>{purposeTitle}</strong> directly supports our cultural preservation and dharmic seva initiatives.
            </p>

            <div className="p-3 bg-sand/40 rounded-xl text-[11px] text-muted border border-border/80 w-full text-left space-y-1">
              <p className="font-semibold text-ink">Next step for receipt:</p>
              <p>
                Please email your UTR reference number to{" "}
                <span className="font-mono text-maroon">{contact.donationEmail}</span>{" "}
                so we can issue your official foundation receipt.
              </p>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowThankYou(false)}
                className="btn-primary px-6 py-2 text-xs font-bold"
              >
                Close & Return
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
