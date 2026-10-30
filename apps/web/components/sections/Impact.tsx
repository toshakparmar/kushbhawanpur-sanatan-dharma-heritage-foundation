"use client";

import React from "react";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { siteConfig, type ImpactItem } from "@/content/site.config";
import { formatINR } from "@/lib/format";
import { MoneyText } from "@/components/shared/MoneyText";
import {
  HeartHandshake,
  BookOpen,
  Landmark,
  Utensils,
  Trees,
  ArrowRight,
  Info,
} from "lucide-react";

interface ImpactProps {
  onSelectAmount?: (amount: number) => void;
}

export function Impact({ onSelectAmount }: ImpactProps) {
  const { impactTiers } = siteConfig;

  const iconMap: Record<string, React.ReactNode> = {
    HeartHandshake: <HeartHandshake className="w-6 h-6 text-saffron" />,
    BookOpen: <BookOpen className="w-6 h-6 text-maroon" />,
    Landmark: <Landmark className="w-6 h-6 text-gold-dark" />,
    Utensils: <Utensils className="w-6 h-6 text-banyan" />,
    Trees: <Trees className="w-6 h-6 text-banyan-deep" />,
  };

  const handleGiveAmount = (amount: number) => {
    if (onSelectAmount) {
      onSelectAmount(amount);
    }
    const donateEl = document.getElementById("donate");
    if (donateEl) {
      donateEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="impact" className="py-20 lg:py-28 bg-sand/40 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <SectionHeading
          hindiBadge="सेवा प्रभाव"
          badge="Impact at a Glance"
          title="What Your Sacred Contribution Can Do"
          description="Every contribution, large or modest, directly translates into tangible protection of sacred sites, nourishing cattle, and spreading scriptural light."
        />

        {/* 5 Impact Tier Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {impactTiers.map((tier, index) => {
            const isFeatured = index === 2; // ₹2,100 Dharohar Raksha

            return (
              <div
                key={tier.amount}
                className={`rounded-2xl p-6 bg-paper border transition-all duration-300 flex flex-col justify-between text-left space-y-4 hover:-translate-y-1.5 hover:shadow-xl ${
                  isFeatured
                    ? "border-2 border-gold shadow-md ring-2 ring-gold/20"
                    : "border-border shadow-xs hover:border-gold/50"
                }`}
              >
                <div className="flex flex-col space-y-3">
                  {/* Top Icon & Auspicious Label */}
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-sand/60 border border-border flex items-center justify-center">
                      {iconMap[tier.iconName] || <HeartHandshake className="w-6 h-6 text-gold" />}
                    </div>
                    {isFeatured && (
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-gold text-maroon-deep px-2 py-0.5 rounded-full">
                        Popular Seva
                      </span>
                    )}
                  </div>

                  {/* Amount Display */}
                  <div>
                    <MoneyText
                      amount={tier.amount}
                      className="text-2xl sm:text-3xl font-serif font-bold text-maroon"
                    />
                    <span className="text-xs text-muted block font-medium font-sans mt-0.5">
                      {tier.label}
                    </span>
                  </div>

                  {/* Outcome Title & Description */}
                  <div className="space-y-1 pt-1">
                    <h4 className="font-serif font-bold text-ink text-sm sm:text-base leading-tight">
                      {tier.outcome}
                    </h4>
                    <p className="text-xs text-ink-muted leading-relaxed font-sans">
                      {tier.description}
                    </p>
                  </div>
                </div>

                {/* Give This Amount Button */}
                <div className="pt-2 border-t border-border">
                  <button
                    type="button"
                    onClick={() => handleGiveAmount(tier.amount)}
                    className="w-full py-2 px-3 rounded-full text-xs font-bold border border-maroon text-maroon hover:bg-maroon hover:text-cream transition-all flex items-center justify-center gap-1.5 group cursor-pointer"
                  >
                    <span>Give {formatINR(tier.amount)}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Note on estimated benchmarks */}
        <div className="mt-8 flex items-center justify-center gap-2 text-xs text-muted">
          <Info className="w-3.5 h-3.5 text-gold-dark shrink-0" />
          <span>
            Outcomes reflect actual operational program unit costs verified by the foundation.
          </span>
        </div>

      </div>
    </section>
  );
}
