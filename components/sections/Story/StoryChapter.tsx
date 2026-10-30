"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { StoryChapterData } from "@/content/story";
import { cn } from "@/lib/utils";

interface StoryChapterProps {
  chapter: StoryChapterData;
  isActive: boolean;
  isMobileCard?: boolean;
}

export function StoryChapter({
  chapter,
  isActive,
  isMobileCard = false
}: StoryChapterProps) {
  const headingId = `chapter-heading-${chapter.id}`;

  return (
    <article
      id={`story-chapter-${chapter.id}`}
      aria-labelledby={headingId}
      className={cn(
        "relative w-full transition-opacity duration-500",
        isMobileCard
          ? "py-8 border-b border-gold/20 last:border-b-0"
          : "min-h-[85vh] lg:min-h-[92vh] flex flex-col justify-center py-16 scroll-mt-28"
      )}
    >
      <div className="flex flex-col gap-6">
        {/* Mobile Detail Emblem Crop */}
        {isMobileCard && (
          <div className="w-full max-w-[320px] mx-auto aspect-square rounded-2xl p-4 bg-gradient-to-b from-paper to-sand/40 border border-gold/40 shadow-sm flex items-center justify-center relative overflow-hidden">
            <Image
              src={chapter.mobileDetailCrop}
              alt={`${chapter.symbolName} zoomed emblem detail`}
              width={320}
              height={320}
              className="w-full h-full object-contain"
            />
            <div className="absolute top-3 left-3 bg-charcoal/80 text-cream px-2.5 py-0.5 rounded-full text-xs font-serif font-bold">
              {chapter.numberDevanagari} · {chapter.numberLatin}
            </div>
          </div>
        )}

        {/* Chapter Numeral & Devanagari Eyebrow */}
        <div className="flex items-center gap-3">
          {!isMobileCard && (
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gold/20 text-maroon font-serif font-bold text-sm border border-gold/40">
              {chapter.numberDevanagari}
            </span>
          )}
          <span className="text-xs uppercase tracking-widest text-gold-dark font-sans font-semibold">
            Chapter {chapter.numberLatin} · {chapter.symbolName}
          </span>
        </div>

        {/* Titles Header */}
        <div>
          <h3
            id={headingId}
            className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-maroon tracking-tight leading-snug"
          >
            <span lang="hi" className="block text-xl sm:text-2xl text-saffron mb-1">
              {chapter.titleDevanagari}
            </span>
            <span>{chapter.titleEnglish}</span>
          </h3>

          <p className="font-serif italic text-base sm:text-lg text-charcoal/80 mt-1.5 font-medium">
            &ldquo;{chapter.tagline}&rdquo;
          </p>
        </div>

        {/* Arched Illustration/Photo Card (Desktop/Tablet) */}
        {!isMobileCard && (
          <div className="relative w-full max-w-lg aspect-[16/10] rounded-t-[100px] rounded-b-2xl overflow-hidden border border-gold/40 shadow-md bg-paper group">
            <Image
              src={chapter.image}
              alt={chapter.imageAlt}
              fill
              sizes="(max-width: 1024px) 100vw, 500px"
              className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-3 left-4 right-4 text-cream text-xs font-sans font-medium drop-shadow-sm">
              {chapter.imageAlt}
            </div>
          </div>
        )}

        {/* Body Paragraphs */}
        <div className="space-y-4 text-charcoal/85 font-sans text-sm sm:text-base leading-relaxed max-w-xl">
          {chapter.paragraphs.map((p, idx) => (
            <p key={idx}>{p}</p>
          ))}
        </div>

        {/* Optional Scriptural Verse */}
        {chapter.verse && (
          <blockquote className="my-2 p-4 rounded-xl bg-gold-light/25 border-l-4 border-gold/70 text-maroon max-w-xl">
            <p lang="hi" className="font-serif text-base sm:text-lg font-semibold">
              &ldquo;{chapter.verse.text}&rdquo;
            </p>
            <cite className="block text-xs font-sans text-charcoal/70 not-italic mt-1">
              — {chapter.verse.source}
            </cite>
          </blockquote>
        )}

        {/* Optional Faith & Facts note */}
        {chapter.note && (
          <p className="text-xs italic text-charcoal/70 bg-sand/30 p-2.5 rounded-lg border border-gold/20 max-w-xl">
            {chapter.note}
          </p>
        )}

        {/* Fact Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          {chapter.chips.map((chip, idx) => (
            <span
              key={idx}
              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-sans font-medium bg-sand/50 text-charcoal/90 border border-gold/30 shadow-2xs"
            >
              {chip}
            </span>
          ))}

          {/* Seva link if available */}
          {chapter.sevaLink && (
            <Link
              href={chapter.sevaLink.href}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-sans font-semibold bg-saffron/10 text-saffron border border-saffron/30 hover:bg-saffron hover:text-white transition-all shadow-2xs group"
            >
              <span>In our seva: {chapter.sevaLink.label}</span>
              <span className="group-hover:translate-x-0.5 transition-transform">→</span>
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
