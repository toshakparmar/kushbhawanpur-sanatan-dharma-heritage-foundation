"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowUp, Heart, Shield, Lock, ExternalLink } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { siteConfig } from "@/content/site.config";
import { policies, type PolicyDocument } from "@/content/policies";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { LotusDivider } from "@/components/brand/Ornaments";

export function Footer() {
  const [selectedPolicy, setSelectedPolicy] = useState<PolicyDocument | null>(
    null
  );
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-sand/70 border-t border-border text-ink pt-16 pb-24 lg:pb-16 select-none relative overflow-hidden">
      {/* Background ornament */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 pb-12 border-b border-border">
          {/* Col 1: Brand & Sanskrit Motto */}
          <div className="flex flex-col space-y-4">
            <Logo variant="footer" href="#home" />
            <p className="text-xs text-muted leading-relaxed max-w-sm">
              {siteConfig.meta.tagline}. Dedicated to the restoration of sacred
              heritage, scriptural education, cow sanctuaries, and community
              seva in Kushbhawanpur.
            </p>
            <div className="pt-2">
              <span className="font-devanagari text-xs text-maroon font-semibold bg-paper px-3 py-1.5 rounded-full border border-border inline-block">
                धर्मो रक्षति रक्षितः
              </span>
            </div>
          </div>

          {/* Col 2: Focus Areas */}
          <div className="flex flex-col space-y-3">
            <h4 className="font-serif font-bold text-maroon text-base tracking-wide">
              Sacred Missions
            </h4>
            <ul className="flex flex-col space-y-2 text-xs text-ink-muted">
              {siteConfig.focusAreas.slice(0, 5).map((area) => (
                <li key={area.id}>
                  <a
                    href="#work"
                    className="hover:text-maroon transition-colors hover:underline"
                  >
                    {area.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Navigation & Transparency */}
          <div className="flex flex-col space-y-3">
            <h4 className="font-serif font-bold text-maroon text-base tracking-wide">
              Transparency & Giving
            </h4>
            <ul className="flex flex-col space-y-2 text-xs text-ink-muted">
              <li>
                <a href="#story" className="hover:text-maroon transition-colors font-medium text-maroon">
                  Our Story — Five Symbols
                </a>
              </li>
              <li>
                <a href="#donate" className="hover:text-maroon transition-colors">
                  Online UPI & Bank Giving
                </a>
              </li>
              <li>
                <a href="#impact" className="hover:text-maroon transition-colors">
                  Impact at a Glance
                </a>
              </li>
              <li>
                <a href="#involve" className="hover:text-maroon transition-colors">
                  Volunteer & Kind Donations
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-maroon transition-colors">
                  Frequently Asked Questions
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-maroon transition-colors">
                  Contact & Location
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Institutional & Legal Trust */}
          <div className="flex flex-col space-y-3">
            <h4 className="font-serif font-bold text-maroon text-base tracking-wide">
              Official Registrations
            </h4>
            <div className="p-3.5 rounded-xl bg-paper border border-border text-xs space-y-2">
              <div className="flex items-center gap-1.5 text-maroon font-semibold">
                <Shield className="w-3.5 h-3.5 text-gold-dark" />
                <span>Verified Charitable Trust</span>
              </div>
              <p className="text-[11px] text-muted leading-relaxed">
                Registered non-profit religious and charitable foundation based
                in Uttar Pradesh, India.
              </p>
              {siteConfig.verification.hasRegistrationNumber && (
                <p className="text-[10px] font-mono text-ink">
                  Reg No: {siteConfig.verification.registrationNumber}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2 pt-1 text-[11px] text-muted">
              <Lock className="w-3 h-3 text-banyan" />
              <span>Official channels only. Zero intermediaries.</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Policies, Copyright & Back to Top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4">
            <span>
              © {currentYear} {siteConfig.meta.legalName}. All rights reserved.
            </span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSelectedPolicy(policies.privacy)}
                className="hover:text-maroon transition-colors underline cursor-pointer"
              >
                Privacy Policy
              </button>
              <span>·</span>
              <button
                type="button"
                onClick={() => setSelectedPolicy(policies.terms)}
                className="hover:text-maroon transition-colors underline cursor-pointer"
              >
                Terms of Seva
              </button>
              <span>·</span>
              <button
                type="button"
                onClick={() => setSelectedPolicy(policies.refund)}
                className="hover:text-maroon transition-colors underline cursor-pointer"
              >
                Refund Policy
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={scrollToTop}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-paper hover:bg-sand text-ink transition-colors cursor-pointer text-xs"
            aria-label="Back to top of page"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5 text-maroon" />
          </button>
        </div>
      </div>

      {/* Policy Modal Dialog */}
      <Dialog
        open={Boolean(selectedPolicy)}
        onOpenChange={(open) => !open && setSelectedPolicy(null)}
      >
        <DialogContent className="max-w-2xl bg-paper p-6 sm:p-8">
          <DialogHeader>
            <DialogTitle>{selectedPolicy?.title}</DialogTitle>
            <DialogDescription>
              Last Updated: {selectedPolicy?.lastUpdated} · Kushbhawanpur Sanatan
              Dharma & Heritage Foundation
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 my-4 max-h-[60vh] overflow-y-auto pr-2 text-ink-muted text-xs leading-relaxed">
            <p className="italic text-muted border-l-2 border-gold pl-3 py-0.5">
              Draft template for statutory compliance. Foundation trustees should
              review with legal counsel prior to formal publication.
            </p>
            {selectedPolicy?.sections.map((sec, idx) => (
              <div key={idx} className="space-y-1">
                <h5 className="font-semibold text-ink text-sm">
                  {sec.heading}
                </h5>
                <p>{sec.content}</p>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </footer>
  );
}
