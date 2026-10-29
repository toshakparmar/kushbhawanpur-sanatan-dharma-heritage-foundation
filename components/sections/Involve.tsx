"use client";

import React, { useState } from "react";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { siteConfig } from "@/content/site.config";
import {
  Users,
  Share2,
  PackageOpen,
  Briefcase,
  Check,
  Mail,
  MessageCircle,
} from "lucide-react";
import { toast } from "sonner";

export function Involve() {
  const [copiedShare, setCopiedShare] = useState(false);
  const { contact, meta } = siteConfig;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: meta.name,
          text: `${meta.tagline} — Join us in preserving ancient shrines and supporting dharmic seva.`,
          url: window.location.href,
        });
      } catch {
        // Fallback to clipboard
        copyShareLink();
      }
    } else {
      copyShareLink();
    }
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedShare(true);
    toast.success("Page link copied to clipboard", {
      description: "Share with family, friends, and community groups.",
    });
    setTimeout(() => setCopiedShare(false), 2500);
  };

  const ways = [
    {
      id: "volunteer",
      title: "Volunteer Your Time & Skills",
      hindi: "सेवा स्वयंसेवक",
      description:
        "Join our on-ground temple cleaning drives, Gau Seva weekends, or offer your professional expertise in civil architecture, archival scanning, or photography.",
      icon: Users,
      ctaText: "Volunteer With Us",
      ctaHref: `mailto:${contact.email}?subject=Volunteer%20Interest%20-%20Kushbhawanpur%20Foundation`,
    },
    {
      id: "share",
      title: "Spread the Sacred Word",
      hindi: "धर्म प्रसार",
      description:
        "Amplify our mission by sharing this portal with like-minded cultural patrons, family elders, and dharmic WhatsApp study circles.",
      icon: Share2,
      isShareAction: true,
      ctaText: copiedShare ? "Link Copied!" : "Share This Portal",
    },
    {
      id: "kind",
      title: "Donate Materials in Kind",
      hindi: "सामग्री दान",
      description:
        "Contribute essential supplies directly: cattle fodder, restoration-grade lime, brass lamps, Sanskrit texts for students, or grocery grains for Annadanam.",
      icon: PackageOpen,
      ctaText: "Coordinate In-Kind Giving",
      ctaHref: `mailto:${contact.email}?subject=In-Kind%20Donation%20Inquiry%20-%20Kushbhawanpur%20Foundation`,
    },
    {
      id: "csr",
      title: "CSR & Corporate Partnerships",
      hindi: "संस्थागत सहभागिता",
      description:
        "Partner with us under Schedule VII (Item v) national heritage conservation mandates with project reports and statutory compliance.",
      icon: Briefcase,
      ctaText: "Explore CSR Alliance",
      ctaHref: `mailto:${contact.email}?subject=CSR%20Partnership%20Proposal`,
    },
  ];

  return (
    <section id="involve" className="py-20 lg:py-28 bg-cream relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <SectionHeading
          hindiBadge="सहभागिता के अवसर"
          badge="Get Involved"
          title="Ways to Support Beyond Financial Giving"
          description="Every hand that offers seva strengthens our collective cultural heritage. Discover meaningful avenues to contribute your energy and goodwill."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {ways.map((way) => {
            const Icon = way.icon;

            return (
              <div
                key={way.id}
                className="p-6 rounded-2xl bg-paper border border-border shadow-xs hover:shadow-xl hover:border-gold/50 transition-all flex flex-col justify-between space-y-4 text-left"
              >
                <div className="flex flex-col space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-sand flex items-center justify-center border border-border">
                    <Icon className="w-6 h-6 text-maroon" />
                  </div>

                  <div>
                    <span className="font-devanagari text-xs text-saffron-deep font-semibold">
                      {way.hindi}
                    </span>
                    <h4 className="font-serif font-bold text-maroon text-lg leading-tight mt-0.5">
                      {way.title}
                    </h4>
                  </div>

                  <p className="text-xs text-ink-muted leading-relaxed font-sans">
                    {way.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-border">
                  {way.isShareAction ? (
                    <button
                      type="button"
                      onClick={handleShare}
                      className="btn-primary w-full py-2.5 px-3 text-xs font-bold inline-flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      {copiedShare ? (
                        <Check className="w-3.5 h-3.5" />
                      ) : (
                        <Share2 className="w-3.5 h-3.5" />
                      )}
                      <span>{way.ctaText}</span>
                    </button>
                  ) : (
                    <a
                      href={way.ctaHref}
                      className="btn-secondary w-full py-2.5 px-3 text-xs font-bold inline-flex items-center justify-center gap-1.5 text-center"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>{way.ctaText}</span>
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
