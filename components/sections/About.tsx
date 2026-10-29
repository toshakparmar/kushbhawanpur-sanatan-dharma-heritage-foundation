import React from "react";
import Image from "next/image";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { SpotlightCard } from "@/components/reactbits/SpotlightCard";
import { siteConfig } from "@/content/site.config";
import { Shield, BookOpen, HeartHandshake, Sparkles, Compass } from "lucide-react";

export function About() {
  const pillars = [
    {
      title: "Dharma (Righteous Living)",
      hindi: "धर्म निष्ठा",
      desc: "Upholding the timeless universal principles of truth, compassion, austerity, and cleanliness embedded in Sanatan Dharma.",
      icon: Shield,
    },
    {
      title: "Dharohar (Heritage Care)",
      hindi: "धरोहर संरक्षण",
      desc: "Restoring sacred stone architecture, neglected teertha kundas, and architectural monuments with respectful conservation methods.",
      icon: Compass,
    },
    {
      title: "Nishkama Seva (Selfless Giving)",
      hindi: "निःस्वार्थ सेवा",
      desc: "Providing dignified care for indigenous cows, sharing nutritious satvik meals with pilgrims, and serving rural communities.",
      icon: HeartHandshake,
    },
    {
      title: "Jnana (Scriptural Wisdom)",
      hindi: "ज्ञान संवर्धन",
      desc: "Preserving ancient handwritten Sanskrit granthas, supporting traditional Vedic scholars, and fostering sacred learning for youth.",
      icon: BookOpen,
    },
  ];

  return (
    <section id="about" className="py-20 lg:py-28 bg-cream relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <SectionHeading
          hindiBadge="हमारी संकल्पना एवं उद्देश्य"
          badge="Mission & Vision"
          title="Rooted in Tradition, Preserving for Tomorrow"
          description="The Kushbhawanpur Sanatan Dharma & Heritage Foundation works at the sacred intersection of historic monument conservation, Vedic scholarship, and compassionate seva."
        />

        {/* Editorial Story Layout with Overlapping Photos */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center mb-16">
          
          {/* Photos Layering */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden border border-border shadow-xl aspect-[4/3] bg-paper" style={{ position: "relative" }}>
              <Image
                src="/images/about-arches.webp"
                alt="Intricate ancient Indian temple courtyard arches and carved pillars"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-transparent" />
            </div>

            {/* Overlapping Secondary Image */}
            <div className="hidden sm:block absolute -bottom-8 -right-6 w-56 h-40 rounded-2xl overflow-hidden border-2 border-cream shadow-2xl bg-paper" style={{ position: "relative" }}>
              <Image
                src="/images/gallery-aarti.webp"
                alt="Floating diyas on holy ghat water"
                fill
                sizes="240px"
                className="object-cover"
              />
            </div>

            {/* Cultural Badge */}
            <div className="absolute -top-4 -left-4 bg-paper px-4 py-2 rounded-2xl border border-gold/60 shadow-lg text-left select-none">
              <span className="font-serif font-bold text-maroon text-sm block">
                कुशभवनपुर धरोहर
              </span>
              <span className="text-[10px] text-muted uppercase tracking-wider font-semibold">
                Sacred Cultural Soil
              </span>
            </div>
          </div>

          {/* Mission Copy */}
          <div className="lg:col-span-6 flex flex-col space-y-5 text-left">
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-maroon leading-snug">
              Guarding the Sacred Roots of Kushbhawanpur
            </h3>

            <p className="text-sm sm:text-base text-ink-muted leading-relaxed font-sans">
              Kushbhawanpur, an ancient cultural geography rich in epic history, holds sacred shrines, centuries-old stone temples, and revered banyan groves that require urgent structural and spiritual revival.
            </p>

            <p className="text-sm sm:text-base text-ink-muted leading-relaxed font-sans">
              Through collaborative donor partnerships, traditional stone carvers, and scholarly researchers, the foundation ensures that sacred shrines remain living centres of worship, wisdom, and selfless community seva.
            </p>

            <div className="p-4 rounded-2xl bg-sand/50 border border-border flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-saffron shrink-0 mt-0.5" />
              <p className="text-xs text-ink-muted leading-relaxed">
                <strong className="text-maroon font-semibold">Our Solemn Pledge:</strong> Every contribution is allocated strictly toward verified charitable causes without institutional intermediaries or excessive administrative costs.
              </p>
            </div>
          </div>

        </div>

        {/* 4 Value Pillars as SpotlightCards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
          {pillars.map((pillar, index) => {
            const Icon = pillar.icon;
            return (
              <SpotlightCard
                key={index}
                className="p-6 text-left flex flex-col justify-between space-y-4 hover:border-gold/50"
              >
                <div className="flex flex-col space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-sand flex items-center justify-center border border-border">
                    <Icon className="w-6 h-6 text-maroon" />
                  </div>
                  <div className="flex flex-col space-y-0.5">
                    <span className="font-devanagari text-xs text-saffron-deep font-semibold">
                      {pillar.hindi}
                    </span>
                    <h4 className="font-serif font-bold text-maroon text-lg leading-tight">
                      {pillar.title}
                    </h4>
                  </div>
                  <p className="text-xs text-ink-muted leading-relaxed font-sans">
                    {pillar.desc}
                  </p>
                </div>
              </SpotlightCard>
            );
          })}
        </div>

      </div>
    </section>
  );
}
