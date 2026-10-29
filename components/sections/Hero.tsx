"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { siteConfig } from "@/content/site.config";
import { SunRays } from "@/components/brand/SunRays";
import { Mandala } from "@/components/brand/Mandala";
import { Diya } from "@/components/brand/Diya";
import { Pennant } from "@/components/brand/Pennant";
import { ParticlesBackground } from "@/components/reactbits/ParticlesBackground";
import { SplitText } from "@/components/reactbits/SplitText";
import { Magnet } from "@/components/reactbits/Magnet";
import { ArrowDown, ShieldCheck, HeartHandshake } from "lucide-react";

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Pointer position for 3D depth parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 120, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Multi-layer parallax depths
  const layer1X = useTransform(smoothX, [-0.5, 0.5], [-12, 12]);
  const layer1Y = useTransform(smoothY, [-0.5, 0.5], [-12, 12]);

  const layer2X = useTransform(smoothX, [-0.5, 0.5], [-24, 24]);
  const layer2Y = useTransform(smoothY, [-0.5, 0.5], [-24, 24]);

  const layer3X = useTransform(smoothX, [-0.5, 0.5], [18, -18]);
  const layer3Y = useTransform(smoothY, [-0.5, 0.5], [18, -18]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const { verification } = siteConfig;

  return (
    <section
      id="home"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-[92svh] flex items-center justify-center pt-8 pb-16 lg:py-24 overflow-hidden paper-texture bg-cream"
    >
      {/* Background Mandala & Particles */}
      <Mandala className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      <ParticlesBackground />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Dignified Editorial Headline & CTAs */}
          <div className="lg:col-span-7 flex flex-col space-y-6 text-left">
            {/* Top Micro-label */}
            <div className="inline-flex items-center gap-2 self-start px-3.5 py-1.5 rounded-full bg-sand/80 border border-border text-xs font-semibold tracking-wider text-maroon select-none">
              <span className="font-devanagari text-saffron-deep font-bold">ॐ</span>
              <span className="text-border">·</span>
              <span className="uppercase text-[11px] text-muted">
                Sanatan Dharma · Heritage · Seva
              </span>
            </div>

            {/* Headline with SplitText reveal */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-maroon leading-[1.1] text-balance">
              <SplitText
                text="Preserving Sacred Heritage & Serving Dharma Through Seva"
                delay={0.03}
              />
            </h1>

            {/* Supportive Paragraph */}
            <p className="text-base sm:text-lg text-ink-muted leading-relaxed font-sans max-w-2xl text-pretty">
              The Kushbhawanpur Foundation is dedicated to the timeless restoration
              of ancient Hindu shrines, nurturing indigenous cow sanctuaries,
              archiving sacred Sanskrit scriptures, and serving satvik prasad to pilgrims.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <Magnet strength={0.3}>
                <a
                  href="#donate"
                  className="btn-primary px-8 py-3.5 text-base font-bold inline-flex items-center justify-center gap-2.5 shadow-lg group cursor-pointer"
                >
                  <Diya size={20} glow={true} />
                  <span>Donate with Gratitude</span>
                  <span className="font-devanagari text-sm opacity-90">दान</span>
                </a>
              </Magnet>

              <a
                href="#work"
                className="btn-secondary px-7 py-3.5 text-sm font-semibold inline-flex items-center justify-center gap-2"
              >
                <span>Explore Our Focus Areas</span>
                <span className="text-maroon">→</span>
              </a>
            </div>

            {/* Trust Chips (Only render when config values exist) */}
            <div className="pt-4 flex flex-wrap items-center gap-3">
              {verification.has80GApproval && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sand/60 border border-border text-xs text-ink-muted font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-banyan" />
                  <span>Section 80G Tax Exemption</span>
                </div>
              )}
              {verification.has12AApproval && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sand/60 border border-border text-xs text-ink-muted font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-banyan" />
                  <span>12A Certified Foundation</span>
                </div>
              )}
              {verification.hasRegistrationNumber && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sand/60 border border-border text-xs text-ink-muted font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-gold-dark" />
                  <span>Official Registration Verified</span>
                </div>
              )}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sand/40 border border-border text-xs text-muted font-medium">
                <HeartHandshake className="w-3.5 h-3.5 text-saffron" />
                <span>Direct Beneficiary Impact</span>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Layered Sacred Composition */}
          <div className="lg:col-span-5 flex items-center justify-center relative select-none">
            <div className="relative w-[320px] sm:w-[420px] h-[380px] sm:h-[480px] flex items-center justify-center">
              
              {/* Layer 0: Rotating Sun-Ray Burst */}
              <motion.div
                style={{ x: layer1X, y: layer1Y }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
              >
                <SunRays size={460} />
              </motion.div>

              {/* Layer 1: Circular Heritage Arch Photo with Ken Burns */}
              <motion.div
                style={{ x: layer2X, y: layer2Y }}
                className="relative w-[280px] sm:w-[350px] h-[340px] sm:h-[420px] rounded-t-full rounded-b-3xl overflow-hidden border-2 border-gold/70 shadow-2xl bg-paper"
              >
                <div className="relative w-full h-full overflow-hidden">
                  <Image
                    src="/images/hero-temple.webp"
                    alt="Ancient Hindu heritage temple at golden sunrise"
                    width={400}
                    height={500}
                    priority
                    sizes="(max-width: 768px) 300px, 400px"
                    className="w-full h-full object-cover scale-105 animate-[pulse_14s_ease-in-out_infinite_alternate]"
                  />
                  {/* Subtle warm overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-maroon/60 via-transparent to-saffron/10 mix-blend-multiply" />
                </div>
              </motion.div>

              {/* Layer 2: Floating Golden Om Medallion (Top Left) */}
              <motion.div
                style={{ x: layer3X, y: layer3Y }}
                className="absolute -top-3 -left-3 sm:-left-6 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-paper border-2 border-gold flex items-center justify-center shadow-xl glow-gold"
              >
                <span className="font-devanagari text-2xl sm:text-3xl font-bold text-saffron-deep">
                  ॐ
                </span>
              </motion.div>

              {/* Layer 3: Floating Pennant Dhwaja (Top Right) */}
              <motion.div
                style={{ x: layer2X, y: layer1Y }}
                className="absolute -top-2 -right-2 sm:-right-4 p-2 rounded-2xl bg-paper/95 border border-gold/60 shadow-lg"
              >
                <Pennant size={32} />
              </motion.div>

              {/* Layer 4: Floating Lit Diya Emblem (Bottom Right) */}
              <motion.div
                style={{ x: layer3X, y: layer2Y }}
                className="absolute -bottom-4 right-2 sm:right-0 p-3 rounded-2xl bg-paper/95 border border-gold shadow-xl flex items-center gap-2"
              >
                <Diya size={26} glow={true} />
                <div className="text-left">
                  <span className="font-serif font-bold text-maroon text-xs block leading-none">
                    अखण्ड सेवा
                  </span>
                  <span className="text-[10px] text-muted font-sans font-medium">
                    Sanatan Dharma
                  </span>
                </div>
              </motion.div>
            </div>
          </div>

        </div>

        {/* Scroll Cue */}
        <div className="pt-12 sm:pt-16 flex justify-center">
          <a
            href="#about"
            className="inline-flex items-center gap-2 text-xs text-muted hover:text-maroon transition-colors"
            aria-label="Scroll to mission section"
          >
            <span>Learn About Our Mission</span>
            <ArrowDown className="w-3.5 h-3.5 text-gold-dark animate-bounce" />
          </a>
        </div>
      </div>
    </section>
  );
}
