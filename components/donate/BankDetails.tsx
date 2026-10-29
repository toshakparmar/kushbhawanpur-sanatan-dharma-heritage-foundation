"use client";

import React, { useState } from "react";
import { Check, Copy, Landmark, ShieldCheck } from "lucide-react";
import { siteConfig } from "@/content/site.config";
import { toast } from "sonner";

export function BankDetails() {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const { bankTransfer } = siteConfig.banking;

  const handleCopy = (key: string, value: string, label: string) => {
    navigator.clipboard.writeText(value);
    setCopiedKey(key);
    toast.success(`${label} copied to clipboard`);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const fields = [
    { key: "name", label: "Account Name", value: bankTransfer.accountName },
    { key: "accNo", label: "Account Number", value: bankTransfer.accountNumber, isMono: true },
    { key: "type", label: "Account Type", value: bankTransfer.accountType },
    { key: "bank", label: "Bank Name", value: bankTransfer.bankName },
    { key: "ifsc", label: "IFSC Code", value: bankTransfer.ifscCode, isMono: true },
    { key: "branch", label: "Branch", value: bankTransfer.branch },
  ];

  return (
    <div className="flex flex-col p-6 bg-paper rounded-2xl border border-border/80 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-border/80 pb-3">
        <div className="flex items-center gap-2">
          <Landmark className="w-4 h-4 text-maroon" />
          <h4 className="font-serif font-bold text-maroon text-base">
            Direct Bank Transfer (NEFT / RTGS / IMPS)
          </h4>
        </div>
        <span className="text-[10px] font-semibold text-banyan bg-banyan-light px-2.5 py-0.5 rounded-full">
          Institutional Account
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
        {fields.map((field) => (
          <div
            key={field.key}
            className="p-3 rounded-xl bg-sand/30 border border-border flex items-center justify-between group hover:border-gold/50 transition-colors"
          >
            <div className="flex flex-col space-y-0.5 pr-2 overflow-hidden">
              <span className="text-[10px] uppercase font-semibold tracking-wider text-muted font-sans">
                {field.label}
              </span>
              <span
                className={`text-xs font-semibold text-ink truncate select-all ${
                  field.isMono ? "font-mono font-bold text-maroon" : ""
                }`}
              >
                {field.value}
              </span>
            </div>

            <button
              type="button"
              onClick={() => handleCopy(field.key, field.value, field.label)}
              className="p-1.5 rounded-lg text-muted hover:text-maroon hover:bg-sand/80 transition-colors shrink-0 cursor-pointer"
              aria-label={`Copy ${field.label}`}
            >
              {copiedKey === field.key ? (
                <Check className="w-3.5 h-3.5 text-banyan" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        ))}
      </div>

      <div className="pt-2 text-[11px] text-muted flex items-start gap-1.5 border-t border-border/60">
        <ShieldCheck className="w-3.5 h-3.5 text-gold-dark shrink-0 mt-0.5" />
        <p>
          Always verify the beneficiary name matches{" "}
          <strong>&quot;{bankTransfer.accountName}&quot;</strong> before completing transfer.
        </p>
      </div>
    </div>
  );
}
