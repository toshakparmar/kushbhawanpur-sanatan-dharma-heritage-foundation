"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { STORY_CONTENT, StoryChapterData } from "@/content/story";
import { HOTSPOT_RING_TRANSITION, getEmblemTransform } from "@/lib/story-motion";
import { StoryProgressRail } from "./StoryProgressRail";

interface StoryEmblemProps {
  activeIndex: number;
  onSelectChapter: (index: number) => void;
  isTabletStrip?: boolean;
}

export function StoryEmblem({
  activeIndex,
  onSelectChapter,
  isTabletStrip = false
}: StoryEmblemProps) {
  const currentChapter = STORY_CONTENT.chapters[activeIndex] || STORY_CONTENT.chapters[0];
  const prefersReduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [debugHotspots, setDebugHotspots] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("debugHotspots") === "1" && process.env.NODE_ENV !== "production") {
        setDebugHotspots(true);
      }
    }
  }, []);

  const isReduced = mounted && Boolean(prefersReduced);
  const transform = getEmblemTransform(currentChapter.hotspot, isReduced);

  return (
    <div className="w-full flex flex-col items-center justify-center">
      {/* Active Symbol Indicator Badge on Desktop */}
      {!isTabletStrip && (
        <div className="mb-5 inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cream/90 border border-gold/40 text-maroon text-xs font-serif font-semibold shadow-xs">
          <span className="text-saffron font-bold">{currentChapter.numberDevanagari}</span>
          <span className="text-gold/80">·</span>
          <span>{currentChapter.symbolName}</span>
          <span className="text-gold/80">·</span>
          <span className="text-muted text-[11px] font-sans">
            Symbol {currentChapter.index + 1} of 5
          </span>
        </div>
      )}

      {/* Emblem Frame with Arched Border & Glow */}
      <div
        className={
          isTabletStrip
            ? "relative w-[240px] h-[240px] sm:w-[280px] sm:h-[280px] rounded-full p-2 bg-gradient-to-b from-paper to-sand/40 border border-gold/40 shadow-md overflow-hidden flex items-center justify-center"
            : "relative w-[340px] h-[340px] xl:w-[400px] xl:h-[400px] rounded-full p-3 bg-gradient-to-b from-paper to-sand/50 border border-gold/40 shadow-lg overflow-hidden flex items-center justify-center"
        }
      >
        {/* Subtle radial sunburst behind emblem */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,160,44,0.12)_0%,transparent_70%)] pointer-events-none" />

        {/* Zooming Emblem Container */}
        <motion.div
          className="relative w-full h-full flex items-center justify-center select-none"
          animate={{
            scale: isTabletStrip ? 1 : transform.scale,
            transformOrigin: `${transform.originX} ${transform.originY}`
          }}
          transition={HOTSPOT_RING_TRANSITION}
        >
          <Image
            src="/brand/emblem.webp"
            alt="Kushbhawanpur Foundation Sacred Emblem"
            width={480}
            height={480}
            priority
            className="w-full h-full object-contain filter drop-shadow-sm pointer-events-none"
          />

          {/* Gliding Hotspot Gold Ring */}
          <motion.div
            className="absolute rounded-full pointer-events-none border-2 border-saffron/90 bg-gold/15 shadow-[0_0_20px_rgba(232,113,10,0.5)] z-20 flex items-center justify-center"
            animate={{
              left: `${currentChapter.hotspot.x}%`,
              top: `${currentChapter.hotspot.y}%`,
              width: `${currentChapter.hotspot.radius * 2}%`,
              height: `${currentChapter.hotspot.radius * 2}%`,
              x: "-50%",
              y: "-50%"
            }}
            transition={HOTSPOT_RING_TRANSITION}
          >
            {/* Inner pulsing aura */}
            <motion.div
              className="w-full h-full rounded-full border border-gold/60 motion-reduce:hidden"
              animate={isReduced ? {} : { scale: [1, 1.15, 1], opacity: [0.6, 0.2, 0.6] }}
              transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
            />
          </motion.div>

          {/* Dev Debug Overlays if ?debugHotspots=1 */}
          {debugHotspots && (
            <div className="absolute inset-0 pointer-events-none z-30">
              {STORY_CONTENT.chapters.map((ch) => (
                <div
                  key={ch.id}
                  className="absolute border border-dashed border-red-500 rounded-full flex items-center justify-center text-[10px] text-red-600 font-bold bg-red-500/10"
                  style={{
                    left: `${ch.hotspot.x}%`,
                    top: `${ch.hotspot.y}%`,
                    width: `${ch.hotspot.radius * 2}%`,
                    height: `${ch.hotspot.radius * 2}%`,
                    transform: "translate(-50%, -50%)"
                  }}
                >
                  {ch.numberLatin}
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Progress Rail beneath emblem on desktop */}
      {!isTabletStrip && (
        <div className="mt-8">
          <StoryProgressRail
            activeIndex={activeIndex}
            onSelectChapter={onSelectChapter}
            variant="desktop-dots"
          />
        </div>
      )}
    </div>
  );
}
