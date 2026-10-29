"use client";

import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { UpiQr } from "@/components/donate/UpiQr";
import { BankDetails } from "@/components/donate/BankDetails";
import { siteConfig } from "@/content/site.config";
import {
  Building2,
  ExternalLink,
  FileCheck2,
  HandCoins,
  QrCode,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaymentTabsProps {
  amount: number;
  purposeTitle: string;
  dedication?: string;
}

export function PaymentTabs({
  amount,
  purposeTitle,
  dedication,
}: PaymentTabsProps) {
  const { banking, contact } = siteConfig;

  return (
    <Tabs defaultValue="upi" className="w-full">
      <TabsList className="grid grid-cols-3 sm:grid-cols-4 gap-1 h-auto p-1.5 bg-sand/50 rounded-xl border border-border">
        <TabsTrigger
          value="upi"
          className="flex items-center gap-1.5 text-xs py-2"
        >
          <QrCode className="w-3.5 h-3.5" />
          <span>UPI / QR</span>
        </TabsTrigger>

        <TabsTrigger
          value="bank"
          className="flex items-center gap-1.5 text-xs py-2"
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Bank Transfer</span>
        </TabsTrigger>

        <TabsTrigger
          value="cheque"
          className="flex items-center gap-1.5 text-xs py-2"
        >
          <FileCheck2 className="w-3.5 h-3.5" />
          <span>Cheque / DD</span>
        </TabsTrigger>

        <TabsTrigger
          value="csr"
          className="flex items-center gap-1.5 text-xs py-2"
        >
          <HandCoins className="w-3.5 h-3.5" />
          <span>CSR Giving</span>
        </TabsTrigger>
      </TabsList>

      {/* Tab 1: UPI */}
      <TabsContent value="upi">
        <UpiQr
          amount={amount}
          purposeTitle={purposeTitle}
          dedication={dedication}
        />
      </TabsContent>

      {/* Tab 2: Bank Transfer */}
      <TabsContent value="bank">
        <BankDetails />
      </TabsContent>

      {/* Tab 3: Cheque / Demand Draft */}
      <TabsContent value="cheque">
        <div className="p-6 bg-paper rounded-2xl border border-border space-y-4 text-left">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <FileCheck2 className="w-4 h-4 text-maroon" />
            <h4 className="font-serif font-bold text-maroon text-base">
              Donation by Cheque / Demand Draft
            </h4>
          </div>

          <div className="space-y-3 text-xs text-ink-muted">
            <div className="p-3 bg-sand/30 rounded-xl border border-border">
              <span className="text-[10px] uppercase font-semibold text-muted block mb-0.5">
                Cheque Payable To
              </span>
              <strong className="text-ink text-sm font-serif">
                {banking.cheque.payableTo}
              </strong>
            </div>

            <div className="p-3 bg-sand/30 rounded-xl border border-border">
              <span className="text-[10px] uppercase font-semibold text-muted block mb-0.5">
                Courier / Registered Post Address
              </span>
              <p className="text-xs text-ink">
                {banking.cheque.mailingAddress}
              </p>
            </div>

            <p className="text-[11px] text-muted italic">
              Please write your Name, Mobile Number, and PAN on the back of the cheque along with a cover note indicating your intended seva dedication.
            </p>
          </div>
        </div>
      </TabsContent>

      {/* Tab 4: CSR & Institutional Giving */}
      <TabsContent value="csr">
        <div className="p-6 bg-paper rounded-2xl border border-border space-y-4 text-left">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <HandCoins className="w-4 h-4 text-maroon" />
            <h4 className="font-serif font-bold text-maroon text-base">
              Corporate Social Responsibility (CSR)
            </h4>
          </div>

          <div className="space-y-3 text-xs text-ink-muted leading-relaxed">
            <p>
              Under <strong>Item (v) of Schedule VII</strong> of the Companies Act, 2013, corporate entities may direct CSR capital toward the protection of national heritage, art and culture, restoration of historical monuments, and promotion of traditional crafts and scriptural study.
            </p>
            <p>
              We provide formal CSR partnership proposals, statutory audit documentation, and measurable impact tracking metrics for corporate foundations and ESG desks.
            </p>
            <div className="pt-2">
              <a
                href={`mailto:${contact.email}?subject=CSR%20Partnership%20Inquiry%20-%20Kushbhawanpur%20Foundation`}
                className="btn-primary py-2.5 px-5 text-xs font-bold inline-flex items-center gap-2"
              >
                <Mail className="w-4 h-4" />
                <span>Contact CSR Partnership Desk</span>
              </a>
            </div>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
