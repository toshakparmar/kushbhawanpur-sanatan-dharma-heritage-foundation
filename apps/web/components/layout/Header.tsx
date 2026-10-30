
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Logo } from "@/components/brand/Logo";
import { Magnet } from "@/components/reactbits/Magnet";
import { Diya } from "@/components/brand/Diya";
import { MobileSheet } from "@/components/layout/MobileSheet";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "#about", label: "About" },
  { href: "#team", label: "Team" },
  { href: "#story", label: "Story" },
  { href: "#work", label: "Work" },
  { href: "#videos", label: "Videos" },
  { href: "#donate", label: "Donate" },
  { href: "#contact", label: "Contact" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 24);

      // Scroll-spy detector for current active anchor
      const sections = NAV_LINKS.map((link) => link.href.substring(1));
      const scrollPos = window.scrollY + 160;

      for (let i = sections.length - 1; i >= 0; i--) {
        const sectionEl = document.getElementById(sections[i]);
        if (sectionEl) {
          const top = sectionEl.offsetTop;
          if (scrollPos >= top) {
            setActiveSection(sections[i]);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-all duration-300 backdrop-blur-md",
        scrolled
          ? "bg-cream/95 border-b border-border shadow-sm py-2.5"
          : "bg-cream/80 border-b border-border/40 py-4"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Foundation Brand Logo */}
        <Logo variant={scrolled ? "compact" : "header"} href="#home" />

        {/* Desktop Anchor Navigation with Framer layoutId underline */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {NAV_LINKS.map((link) => {
            const sectionId = link.href.substring(1);
            const isActive = activeSection === sectionId;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative px-3 py-1.5 text-sm font-medium transition-colors select-none",
                  isActive
                    ? "text-maroon font-bold"
                    : "text-ink-muted hover:text-maroon"
                )}
              >
                <span>{link.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="header-active-pill"
                    className="absolute bottom-0 left-2 right-2 h-[2px] bg-gradient-to-r from-saffron via-gold to-maroon rounded-full"
                    transition={{
                      type: "spring",
                      stiffness: 380,
                      damping: 30,
                    }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {/* Desktop Magnet CTA button */}
          <div className="hidden sm:block">
            <Magnet strength={0.25}>
              <a
                href="#donate"
                className="btn-primary px-5 py-2.5 text-sm inline-flex items-center gap-2 group cursor-pointer shadow-md"
              >
                <Diya size={18} glow={false} />
                <span>Donate Now</span>
                <span className="font-devanagari text-xs opacity-90">दान</span>
              </a>
            </Magnet>
          </div>

          {/* Mobile Navigation Sheet Trigger */}
          <MobileSheet navLinks={NAV_LINKS} activeSection={activeSection} />
        </div>
      </div>
    </header>
  );
}
