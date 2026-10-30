import React from "react";
import { siteConfig } from "@/content/site.config";
import { Diya } from "@/components/brand/Diya";
import { LotusDivider } from "@/components/brand/Ornaments";

export function Pledge() {
  const { shloka } = siteConfig.meta;

  return (
    <section className="py-20 lg:py-24 bg-maroon-deep text-cream relative overflow-hidden select-none">
      {/* Decorative background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,160,44,0.15),transparent_70%)] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10 flex flex-col items-center space-y-6">
        
        {/* Glowing Diya Lamp */}
        <div className="w-14 h-14 rounded-full bg-maroon flex items-center justify-center border border-gold/40 shadow-lg glow-gold">
          <Diya size={32} glow={true} />
        </div>

        {/* Sacred Sanskrit Shloka */}
        <div className="space-y-3 max-w-2xl">
          <p className="font-devanagari text-2xl sm:text-3xl lg:text-4xl font-bold text-sand leading-relaxed whitespace-pre-line tracking-wide drop-shadow-sm">
            {shloka.sanskrit}
          </p>
          <p className="font-sans italic text-xs sm:text-sm text-gold-light/90 tracking-wide">
            {shloka.transliteration}
          </p>
        </div>

        <LotusDivider className="my-2 opacity-60 text-gold" />

        {/* English Meaning & Pledge */}
        <div className="space-y-2 max-w-xl">
          <p className="font-serif text-lg sm:text-xl text-cream/90 italic leading-relaxed">
            &ldquo;{shloka.meaning}&rdquo;
          </p>
          <span className="text-[11px] uppercase tracking-widest text-gold-dark font-sans font-semibold block">
            — {shloka.source}
          </span>
        </div>

      </div>
    </section>
  );
}
