"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { STORY_CONTENT } from "@/content/story";
import { StoryEmblem } from "./StoryEmblem";
import { StoryChapter } from "./StoryChapter";
import { StoryProgressRail } from "./StoryProgressRail";
import { StoryClosing } from "./StoryClosing";
import { cn } from "@/lib/utils";

export function Story() {
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const chapterRefs = useRef<(HTMLElement | null)[]>([]);
  const prefersReduced = useReducedMotion();

  // Scroll spy for chapters
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight * 0.45;

      chapterRefs.current.forEach((el, index) => {
        if (!el) return;
        const top = el.offsetTop;
        const height = el.offsetHeight;
        if (scrollPosition >= top && scrollPosition < top + height) {
          setActiveChapterIndex(index);
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isReduced = mounted && Boolean(prefersReduced);

  const handleSelectChapter = (index: number) => {
    setActiveChapterIndex(index);
    const target = chapterRefs.current[index];
    if (target) {
      target.scrollIntoView({ behavior: isReduced ? "auto" : "smooth", block: "center" });
    }
  };

  const currentChapter = STORY_CONTENT.chapters[activeChapterIndex] || STORY_CONTENT.chapters[0];

  return (
    <section
      id="story"
      aria-labelledby="story-section-title"
      className="relative w-full overflow-hidden bg-paper transition-colors duration-700 pt-20 pb-12"
      style={{
        backgroundColor: currentChapter.tint
      }}
    >
      {/* Subtle Grain Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#d4a02c_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

      {/* Floating Diya Embers on Om Chapter (Hydration-safe, client-only, reduced-motion safe) */}
      {mounted && activeChapterIndex === 0 && !isReduced && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 motion-reduce:hidden">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full bg-saffron/40 blur-[1px]"
              initial={{
                x: `${15 + i * 14}%`,
                y: "90%",
                opacity: 0.2
              }}
              animate={{
                y: "15%",
                opacity: [0.2, 0.7, 0]
              }}
              transition={{
                duration: 6 + i * 1.5,
                repeat: Infinity,
                ease: "easeOut",
                delay: i * 0.8
              }}
            />
          ))}
        </div>
      )}

      {/* Section Header */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center mb-12 sm:mb-16">
        <span
          lang="hi"
          className="inline-block text-xs uppercase tracking-widest text-gold-dark font-sans font-semibold mb-2 bg-sand/60 px-3 py-1 rounded-full border border-gold/30"
        >
          {STORY_CONTENT.eyebrow}
        </span>
        <h2
          id="story-section-title"
          className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-maroon tracking-tight"
        >
          {STORY_CONTENT.title}
        </h2>
        <div className="w-16 h-0.5 bg-gold mx-auto my-4" />
        <p className="font-sans text-charcoal/80 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          {STORY_CONTENT.intro}
        </p>
      </div>

      {/* Mobile Chapter Sticky Navigation Pill-Bar (< 768px) */}
      <div className="block md:hidden sticky top-[60px] z-30 mb-6">
        <StoryProgressRail
          activeIndex={activeChapterIndex}
          onSelectChapter={handleSelectChapter}
          variant="mobile-pills"
        />
      </div>

      {/* Tablet Sticky Top Strip (768px - 1023px) */}
      <div className="hidden md:block lg:hidden sticky top-[64px] z-20 bg-paper/90 backdrop-blur-md border-b border-gold/30 shadow-xs mb-8 py-4">
        <StoryEmblem
          activeIndex={activeChapterIndex}
          onSelectChapter={handleSelectChapter}
          isTabletStrip
        />
        <div className="mt-2 flex justify-center">
          <StoryProgressRail
            activeIndex={activeChapterIndex}
            onSelectChapter={handleSelectChapter}
            variant="desktop-dots"
          />
        </div>
      </div>

      {/* Main Chapters Content Area */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop Layout (>= 1024px): 2 Columns (Sticky Emblem Left, Scrolling Chapters Right) */}
        <div className="hidden lg:grid lg:grid-cols-12 lg:gap-12 items-start">
          {/* Left Column: Sticky Emblem */}
          <div className="lg:col-span-5 relative">
            <StoryEmblem
              activeIndex={activeChapterIndex}
              onSelectChapter={handleSelectChapter}
            />
          </div>

          {/* Right Column: Scrolling Chapters */}
          <div className="lg:col-span-7 flex flex-col">
            {STORY_CONTENT.chapters.map((chapter, index) => (
              <div
                key={chapter.id}
                ref={(el) => {
                  chapterRefs.current[index] = el;
                }}
              >
                <StoryChapter
                  chapter={chapter}
                  isActive={activeChapterIndex === index}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Tablet Layout (768px - 1023px): Emblem on top strip, chapters stacked below */}
        <div className="hidden md:flex lg:hidden flex-col gap-16 max-w-2xl mx-auto">
          {STORY_CONTENT.chapters.map((chapter, index) => (
            <div
              key={chapter.id}
              ref={(el) => {
                if (!chapterRefs.current[index]) {
                  chapterRefs.current[index] = el;
                }
              }}
            >
              <StoryChapter
                chapter={chapter}
                isActive={activeChapterIndex === index}
              />
            </div>
          ))}
        </div>

        {/* Mobile Layout (< 768px): Self-contained cards */}
        <div className="flex md:hidden flex-col gap-8">
          {STORY_CONTENT.chapters.map((chapter, index) => (
            <div
              key={chapter.id}
              ref={(el) => {
                if (!chapterRefs.current[index]) {
                  chapterRefs.current[index] = el;
                }
              }}
            >
              <StoryChapter
                chapter={chapter}
                isActive={activeChapterIndex === index}
                isMobileCard
              />
            </div>
          ))}
        </div>
      </div>

      {/* Closing Block */}
      <StoryClosing />
    </section>
  );
}
