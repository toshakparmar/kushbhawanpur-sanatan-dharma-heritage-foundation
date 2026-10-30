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

  return (
    <div className="flex flex-col w-full">
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Trust & Transparency Marquee */}
      <TrustStrip />

      {/* 3. About Section (Foundation details, Vision, Mission, Journey Timeline) */}
      <About org={siteData.org} milestones={siteData.milestones} />

      {/* 3.1 Leadership & Volunteers (Auto-hides if empty!) */}
      <Team team={siteData.team} />

      {/* 3.2 Official Registrations & Certifications (Auto-hides if empty!) */}
      <Certifications certifications={siteData.certifications} />

      {/* 4. Our Story — Five Symbols, One Sankalpa */}
      <Story />

      {/* 5. Our Work / Focus Areas Bento */}
      <Work onSelectCause={handleSelectCause} />

      {/* 6. Videos Carousel with 16:9 Lite Embed Player (Auto-hides if empty!) */}
      <Videos videos={siteData.videos} />

      {/* 7. Donate Conversion Center (Dynamic 4-Step Flow without Gateway) */}
      <Donate
        initialConfig={donateConfig}
        initialAmount={selectedAmount}
        initialSevaId={selectedSevaId}
      />

      {/* 8. Impact at a Glance */}
      <Impact onSelectAmount={handleSelectAmount} />

      {/* 9. What Donors Receive */}
      <Receive />

      {/* 10. Gallery / Moments of Heritage */}
      <Gallery />

      {/* 11. Get Involved */}
      <Involve />

      {/* 12. Pledge & Shloka Banner */}
      <Pledge />

      {/* 13. Frequently Asked Questions */}
      <Faq />

      {/* 14. Contact & Office Details */}
      <Contact />
    </div>
  );
}
