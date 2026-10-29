"use client";

import React, { useState } from "react";
import { Hero } from "@/components/sections/Hero";
import { TrustStrip } from "@/components/sections/TrustStrip";
import { About } from "@/components/sections/About";
import { Work } from "@/components/sections/Work";
import { Donate } from "@/components/sections/Donate";
import { Impact } from "@/components/sections/Impact";
import { Receive } from "@/components/sections/Receive";
import { Gallery } from "@/components/sections/Gallery";
import { Involve } from "@/components/sections/Involve";
import { Pledge } from "@/components/sections/Pledge";
import { Faq } from "@/components/sections/Faq";
import { Contact } from "@/components/sections/Contact";
import { siteConfig } from "@/content/site.config";

export default function HomePage() {
  const [donateAmount, setDonateAmount] = useState<number>(
    siteConfig.donation.defaultAmount
  );
  const [donatePurpose, setDonatePurpose] = useState<string>("general");

  const handleSelectCause = (causeId: string, suggestedAmount: number) => {
    setDonatePurpose(causeId);
    setDonateAmount(suggestedAmount);
  };

  const handleSelectAmount = (amount: number) => {
    setDonateAmount(amount);
  };

  return (
    <div className="flex flex-col w-full">
      {/* 4.2 Hero Section */}
      <Hero />

      {/* 4.3 Trust & Transparency Marquee */}
      <TrustStrip />

      {/* 4.4 About & Mission Section */}
      <About />

      {/* 4.5 Our Work / Focus Areas Bento */}
      <Work onSelectCause={handleSelectCause} />

      {/* 4.6 Donate Conversion Center */}
      <Donate
        initialAmount={donateAmount}
        initialPurpose={donatePurpose}
      />

      {/* 4.7 Impact at a Glance */}
      <Impact onSelectAmount={handleSelectAmount} />

      {/* 4.8 What Donors Receive */}
      <Receive />

      {/* 4.9 Gallery / Moments of Heritage */}
      <Gallery />

      {/* 4.10 Get Involved */}
      <Involve />

      {/* 4.11 Pledge & Shloka Banner */}
      <Pledge />

      {/* 4.12 Frequently Asked Questions */}
      <Faq />

      {/* 4.13 Contact & Office Details */}
      <Contact />
    </div>
  );
}
