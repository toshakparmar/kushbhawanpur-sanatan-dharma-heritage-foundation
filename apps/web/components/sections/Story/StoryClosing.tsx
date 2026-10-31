"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useSafeReducedMotion } from "@/lib/use-safe-reduced-motion";
import { STORY_CONTENT } from "@/content/story";
import { StorySymbolIcon } from "./icons";
import { Magnet } from "@/components/reactbits/Magnet";
import { GOMTI_RIVER_SVG_PATH } from "@/lib/story-motion";

export function StoryClosing() {
  const closing = STORY_CONTENT.closing;
  const prefersReduced = useSafeReducedMotion();
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const isReduced = mounted && Boolean(prefersReduced);

  return (
    <div className="relative w-full mt-20 pt-16 pb-20 border-t border-gold/30">
      {/* Background Soft Grain & Radial Glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-paper via-sand/20 to-paper pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
        {/* Devanagari & English Heading */}
        <div className="mb-12">
          <span
            lang="hi"
            className="block font-serif text-2xl sm:text-3xl text-saffron font-bold mb-2 tracking-wide"
          >
            {closing.titleDevanagari}
          </span>
          <h3 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-maroon tracking-tight">
            {closing.titleEnglish}
          </h3>
          <p className="font-sans text-sm sm:text-base text-charcoal/80 max-w-2xl mx-auto mt-4 leading-relaxed">
            {closing.description}
          </p>
        </div>

        {/* Gomti River Connecting SVG Wave (Desktop / Tablet) */}
        <div className="relative hidden md:block w-full h-12 my-2 overflow-hidden pointer-events-none">
          <svg
            viewBox="0 0 1440 100"
            fill="none"
            className="w-full h-full text-gold/60"
            preserveAspectRatio="none"
          >
            <motion.path
              d={GOMTI_RIVER_SVG_PATH}
              stroke="currentColor"
              strokeWidth="2.5"
              strokeDasharray="6 6"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: isReduced ? 0.01 : 1.8, ease: "easeInOut" }}
            />
          </svg>
        </div>

        {/* Five Symbols Row (Cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 lg:gap-6 my-10">
          {closing.symbols.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: isReduced ? 0.01 : 0.45, delay: isReduced ? 0 : index * 0.08 }}
              whileHover={isReduced ? {} : { y: -4, transition: { duration: 0.2 } }}
              className="relative p-5 rounded-2xl bg-cream/90 backdrop-blur-xs border border-gold/40 shadow-xs hover:border-gold hover:shadow-md transition-all flex flex-col items-center text-center group motion-reduce:transform-none motion-reduce:opacity-100"
            >
              {/* Icon circle */}
              <div className="w-12 h-12 rounded-full bg-sand/60 border border-gold/40 text-saffron flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-gold-light/40 transition-transform">
                <StorySymbolIcon name={item.iconName} size={24} />
              </div>

              {/* Symbol name */}
              <h4 className="font-serif font-bold text-base text-maroon mb-1">
                {item.symbol}
              </h4>

              {/* What it stands for */}
              <p className="font-sans text-xs text-charcoal/75 leading-tight mb-3">
                {item.standsFor}
              </p>

              {/* Mapped Focus Area */}
              <div className="mt-auto pt-2 border-t border-gold/20 w-full">
                <span className="text-[10px] font-sans font-semibold uppercase tracking-wider text-gold-dark block">
                  Focus Area
                </span>
                <span className="text-xs font-serif font-medium text-charcoal block mt-0.5">
                  {item.focusArea}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12">
          <Magnet strength={isReduced ? 0 : 0.35}>
            <Link
              href={closing.primaryCta.href}
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-saffron text-white font-serif font-bold text-base hover:bg-saffron-dark transition-all shadow-md hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            >
              {closing.primaryCta.label}
            </Link>
          </Magnet>

          <Link
            href={closing.secondaryCta.href}
            className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-paper text-maroon border border-gold/60 font-serif font-semibold text-base hover:bg-sand/30 hover:border-gold transition-all shadow-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            {closing.secondaryCta.label}
          </Link>
        </div>
      </div>
    </div>
  );
}
