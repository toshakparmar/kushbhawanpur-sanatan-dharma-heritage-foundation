"use client";

import React from "react";
import Image from "next/image";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { TiltedCard } from "@/components/reactbits/TiltedCard";
import { siteConfig, type FocusArea } from "@/content/site.config";
import { ArrowRight, Heart } from "lucide-react";

interface WorkProps {
  onSelectCause?: (causeId: string, suggestedAmount: number) => void;
}

export function Work({ onSelectCause }: WorkProps) {
  const { focusAreas } = siteConfig;

  const handleSupportCause = (area: FocusArea) => {
    if (onSelectCause) {
      onSelectCause(area.id, area.suggestedAmount);
    }
    const donateEl = document.getElementById("donate");
    if (donateEl) {
      donateEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="work" className="py-20 lg:py-28 bg-sand/40 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <SectionHeading
          hindiBadge="प्रमुख कार्यक्षेत्र"
          badge="Focus Areas"
          title="Sacred Missions of the Foundation"
          description="Six dedicated verticals committed to reviving civilizational heritage, supporting traditional learning, and sustaining nature and cattle with compassion."
        />

        {/* Bento Grid with TiltedCard 3D tilt */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {focusAreas.map((area, index) => {
            return (
              <TiltedCard key={area.id} maxTilt={6}>
                <div className="h-full rounded-2xl overflow-hidden border border-border bg-paper shadow-sm hover:shadow-xl hover:border-gold/50 transition-all duration-300 flex flex-col justify-between">
                  {/* Photo with Badge */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-sand/30">
                    <Image
                      src={area.image}
                      alt={area.title}
                      width={600}
                      height={375}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
                    
                    <div className="absolute top-3 left-3 bg-paper/95 backdrop-blur-xs px-2.5 py-1 rounded-full border border-border text-[11px] font-semibold text-maroon">
                      {area.badge}
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 text-cream">
                      <span className="font-devanagari text-xs text-sand font-medium">
                        {area.hindiTitle}
                      </span>
                      <h4 className="font-serif text-lg sm:text-xl font-bold leading-tight drop-shadow-xs">
                        {area.title}
                      </h4>
                    </div>
                  </div>

                  {/* Body Copy */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4 text-left">
                    <p className="text-xs sm:text-sm text-ink-muted leading-relaxed font-sans">
                      {area.shortDesc}
                    </p>

                    {/* Support Button */}
                    <div className="pt-2 border-t border-border flex items-center justify-between">
                      <span className="text-xs text-muted font-medium">
                        Suggested Seva: <strong className="text-maroon">₹{area.suggestedAmount}</strong>
                      </span>
                      
                      <button
                        type="button"
                        onClick={() => handleSupportCause(area)}
                        className="btn-primary py-2 px-3.5 text-xs font-bold inline-flex items-center gap-1.5 group cursor-pointer"
                      >
                        <span>Support</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              </TiltedCard>
            );
          })}
        </div>

      </div>
    </section>
  );
}
