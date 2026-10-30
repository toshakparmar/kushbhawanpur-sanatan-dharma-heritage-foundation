"use client";

import React from "react";
import { motion } from "framer-motion";
import { STORY_CONTENT } from "@/content/story";
import { cn } from "@/lib/utils";

interface StoryProgressRailProps {
  activeIndex: number;
  onSelectChapter: (index: number) => void;
  variant?: "desktop-dots" | "mobile-pills";
  className?: string;
}

export function StoryProgressRail({
  activeIndex,
  onSelectChapter,
  variant = "desktop-dots",
  className
}: StoryProgressRailProps) {
  const chapters = STORY_CONTENT.chapters;

  if (variant === "mobile-pills") {
    return (
      <nav
        aria-label="Story Chapters Navigation"
        className={cn(
          "sticky top-[64px] z-30 w-full bg-paper/95 backdrop-blur-md border-b border-gold/30 px-3 py-2 overflow-x-auto scrollbar-none",
          className
        )}
      >
        <div className="flex items-center gap-2 min-w-max mx-auto justify-start sm:justify-center">
          {chapters.map((ch, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={ch.id}
                type="button"
                onClick={() => onSelectChapter(idx)}
                aria-current={isActive ? "step" : undefined}
                className={cn(
                  "relative min-h-[44px] min-w-[44px] px-3.5 py-1.5 rounded-full text-xs font-serif font-semibold transition-all flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold",
                  isActive
                    ? "text-maroon font-bold shadow-xs"
                    : "text-muted hover:text-maroon/80 bg-sand/30"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="mobile-pill-active"
                    className="absolute inset-0 bg-gold-light/40 border border-gold/60 rounded-full"
                    transition={{ type: "spring", stiffness: 300, damping: 28 }}
                  />
                )}
                <span className="relative z-10 text-[11px] font-bold text-saffron">
                  {ch.numberDevanagari}
                </span>
                <span className="relative z-10 whitespace-nowrap">
                  {ch.symbolName}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    );
  }

  // Desktop 5-dot rail
  return (
    <nav
      aria-label="Story Chapters Progress"
      className={cn("flex flex-col items-center gap-3 select-none", className)}
    >
      <div className="flex items-center gap-3 bg-cream/80 backdrop-blur-xs px-4 py-2.5 rounded-full border border-gold/30 shadow-xs">
        {chapters.map((ch, idx) => {
          const isActive = idx === activeIndex;
          return (
            <button
              key={ch.id}
              type="button"
              onClick={() => onSelectChapter(idx)}
              aria-current={isActive ? "step" : undefined}
              aria-label={`Go to Chapter ${ch.numberLatin}: ${ch.symbolName}`}
              className="group relative flex items-center justify-center p-2 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            >
              {/* Dot circle */}
              <div
                className={cn(
                  "w-3 h-3 rounded-full transition-all duration-300",
                  isActive
                    ? "bg-saffron scale-125 ring-4 ring-gold/30"
                    : "bg-charcoal/20 group-hover:bg-charcoal/50 group-hover:scale-110"
                )}
              />

              {/* Hover tooltip */}
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 pointer-events-none opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity bg-charcoal text-cream text-[11px] font-sans font-medium px-2 py-0.5 rounded shadow-md whitespace-nowrap z-20">
                {ch.numberDevanagari} · {ch.symbolName}
              </span>
            </button>
          );
        })}
      </div>

      <div className="text-center">
        <span className="text-xs font-serif font-bold text-maroon">
          {chapters[activeIndex].numberDevanagari} · {chapters[activeIndex].symbolName}
        </span>
        <span className="text-[11px] text-muted block font-sans">
          {activeIndex + 1} of {chapters.length}
        </span>
      </div>
    </nav>
  );
}
