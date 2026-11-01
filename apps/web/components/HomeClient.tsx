"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Hero } from "@/components/sections/Hero";
import { TrustStrip } from "@/components/sections/TrustStrip";
import { About } from "@/components/sections/About";
import { Team } from "@/components/sections/Team";
import { Certifications } from "@/components/sections/Certifications";
import { Work } from "@/components/sections/Work";
import { Videos } from "@/components/sections/Videos";
import { Donate } from "@/components/sections/Donate";
import { Impact } from "@/components/sections/Impact";
import { Receive } from "@/components/sections/Receive";
import { Gallery } from "@/components/sections/Gallery";
import { Involve } from "@/components/sections/Involve";
import { Pledge } from "@/components/sections/Pledge";
import { Faq } from "@/components/sections/Faq";
import { Contact } from "@/components/sections/Contact";
import { SiteData, DonateConfig } from "@/lib/api";

const Story = dynamic(
  () => import("@/components/sections/Story/Story").then((mod) => mod.Story),
  {
    loading: () => (
      <div className="w-full min-h-[600px] bg-paper animate-pulse flex items-center justify-center">
        <span className="text-gold font-serif text-sm">Loading Our Story...</span>
      </div>
    ),
    ssr: true,
  }
);

interface HomeClientProps {
  siteData: SiteData;
  donateConfig: DonateConfig;
}

export function HomeClient({ siteData, donateConfig }: HomeClientProps) {
  const [selectedSevaId, setSelectedSevaId] = useState<string>("temple-preservation");
  const [selectedAmount, setSelectedAmount] = useState<number>(2100);

  const handleSelectCause = (causeId: string, suggestedAmount: number) => {
    setSelectedSevaId(causeId);
    setSelectedAmount(suggestedAmount);
  };

  const handleSelectAmount = (amount: number) => {
    setSelectedAmount(amount);
  };

  // Helper to check if admin enabled or disabled a section
  const isEnabled = (key: string): boolean => {
    if (!siteData?.pageSections || siteData.pageSections.length === 0) return true;
    const found = siteData.pageSections.find((s: any) => s.key === key);
    return found ? found.enabled !== false : true;
  };

  return (
    <div className="flex flex-col w-full">
      {/* 1. Hero Section */}
      {isEnabled("hero") && <Hero />}

      {/* Optional Live Verified Stats Strip (Opt-in by Admin) */}
      {siteData.stats && (
        <div className="w-full bg-maroon text-cream py-2.5 px-4 text-center border-y border-gold/30">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-4 text-xs font-serif">
            <span className="flex items-center gap-1.5 font-bold text-gold">
              <span>●</span> Verified Seva So Far:
            </span>
            <span>
              ₹{siteData.stats.totalAmountRupees.toLocaleString("en-IN")} Contributed
            </span>
            <span className="text-gold/40">|</span>
            <span>
              {siteData.stats.totalDonorsCount.toLocaleString("en-IN")} Dharmic Patrons
            </span>
            <span className="text-gold/40">|</span>
            <span className="text-gold">100% Dedicated to Preserved Shrines</span>
          </div>
        </div>
      )}

      {/* 2. Trust & Transparency Marquee */}
      {isEnabled("trust") && <TrustStrip />}

      {/* 3. About Section (Foundation details, Vision, Mission, Journey Timeline) */}
      {isEnabled("about") && (
        <About org={siteData.org} milestones={siteData.milestones} />
      )}

      {/* 3.1 Leadership & Volunteers (Auto-hides if empty or disabled) */}
      {isEnabled("team") && <Team team={siteData.team} />}

      {/* 3.2 Official Registrations & Certifications (Auto-hides if empty or disabled) */}
      {isEnabled("certifications") && (
        <Certifications certifications={siteData.certifications} />
      )}

      {/* 4. Our Story — Five Symbols, One Sankalpa */}
      {isEnabled("story") && <Story />}

      {/* 5. Our Work / Focus Areas Bento */}
      {isEnabled("work") && <Work onSelectCause={handleSelectCause} />}

      {/* 6. Videos Carousel with 16:9 Lite Embed Player (Auto-hides if empty or disabled) */}
      {isEnabled("videos") && <Videos videos={siteData.videos} />}

      {/* 7. Donate Conversion Center (Dynamic 4-Step Flow without Gateway) */}
      {isEnabled("donate") && (
        <Donate
          initialConfig={donateConfig}
          initialAmount={selectedAmount}
          initialSevaId={selectedSevaId}
        />
      )}

      {/* 8. Impact at a Glance */}
      {isEnabled("impact") && <Impact onSelectAmount={handleSelectAmount} />}

      {/* 9. What Donors Receive */}
      {isEnabled("receive") && <Receive />}

      {/* 10. Gallery / Moments of Heritage */}
      {isEnabled("gallery") && <Gallery />}

      {/* 11. Get Involved */}
      {isEnabled("involve") && <Involve />}

      {/* 12. Pledge & Shloka Banner */}
      {isEnabled("pledge") && <Pledge />}

      {/* 13. Frequently Asked Questions */}
      {isEnabled("faq") && <Faq />}

      {/* 14. Contact & Office Details */}
      {isEnabled("contact") && (
        <Contact org={siteData.org} siteSettings={siteData.siteSettings} />
      )}
    </div>
  );
}

