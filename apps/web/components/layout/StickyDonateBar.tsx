"use client";

import React, { useEffect, useState } from "react";
import { MessageCircle, Phone } from "lucide-react";
import { siteConfig } from "@/content/site.config";
import { Diya } from "@/components/brand/Diya";
import { cn } from "@/lib/utils";

export function StickyDonateBar() {
  const [visible, setVisible] = useState(false);
  const { contact } = siteConfig;

  useEffect(() => {
    const handleScroll = () => {
      const heroEl = document.getElementById("home");
      const donateEl = document.getElementById("donate");

      if (!heroEl) return;

      const heroBottom = heroEl.offsetTop + heroEl.offsetHeight - 120;
      const scrollY = window.scrollY;

      let isDonateInView = false;
      if (donateEl) {
        const donateTop = donateEl.offsetTop - 200;
        const donateBottom = donateEl.offsetTop + donateEl.offsetHeight - 50;
        if (scrollY >= donateTop && scrollY <= donateBottom) {
          isDonateInView = true;
        }
      }

      // Appears after hero, hides when inside donate section
      if (scrollY > heroBottom && !isDonateInView) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-paper/95 backdrop-blur-md border-t border-border px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] transition-all duration-300 pb-[calc(0.75rem+env(safe-area-inset-bottom))]"
      )}
    >
      <div className="flex items-center gap-2 max-w-md mx-auto">
        <a
          href="#donate"
          className="btn-primary flex-1 py-3 px-4 flex items-center justify-center gap-2 font-bold text-sm shadow-md"
        >
          <Diya size={18} glow={false} />
          <span>Donate Now</span>
          <span className="font-devanagari text-xs opacity-90">· सेवा</span>
        </a>

        {contact.whatsappNumber && (
          <a
            href={`https://wa.me/${contact.whatsappNumber.replace(/[^0-9]/g, "")}?text=Namaste,%20I%20would%20like%20to%20support%20Kushbhawanpur%20Sanatan%20Dharma%20Foundation`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-11 h-11 rounded-full bg-banyan-light text-banyan border border-banyan/30 flex items-center justify-center hover:bg-banyan hover:text-white transition-colors shrink-0"
            aria-label="Contact on WhatsApp"
          >
            <MessageCircle className="w-5 h-5" />
          </a>
        )}

        {contact.phone && (
          <a
            href={`tel:${contact.phone}`}
            className="w-11 h-11 rounded-full bg-sand text-maroon border border-border flex items-center justify-center hover:bg-maroon hover:text-white transition-colors shrink-0"
            aria-label="Call Foundation Office"
          >
            <Phone className="w-5 h-5" />
          </a>
        )}
      </div>
    </div>
  );
}
