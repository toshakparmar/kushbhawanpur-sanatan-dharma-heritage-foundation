"use client";

import React from "react";
import { Marquee } from "@/components/reactbits/Marquee";
import { siteConfig } from "@/content/site.config";
import { ShieldCheck, Sparkles, Lock, FileCheck } from "lucide-react";

export function TrustStrip() {
  const { commitments } = siteConfig;

  const iconMap: Record<string, React.ReactNode> = {
    ShieldCheck: <ShieldCheck className="w-4 h-4 text-gold-dark" />,
    Sparkles: <Sparkles className="w-4 h-4 text-saffron" />,
    Lock: <Lock className="w-4 h-4 text-banyan" />,
    FileCheck: <FileCheck className="w-4 h-4 text-maroon" />,
  };

  return (
    <section className="bg-sand/70 border-y border-border py-4 overflow-hidden select-none">
      <div className="max-w-7xl mx-auto px-4">
        <Marquee speed={35} pauseOnHover={true}>
          {commitments.map((item, index) => (
            <div
              key={index}
              className="inline-flex items-center gap-3 px-5 py-1.5 rounded-full bg-paper border border-border shadow-xs shrink-0"
            >
              {iconMap[item.icon] || <ShieldCheck className="w-4 h-4 text-gold" />}
              <span className="font-serif font-bold text-maroon text-sm">
                {item.title}
              </span>
              <span className="text-border">·</span>
              <span className="text-xs text-ink-muted font-sans">
                {item.desc}
              </span>
            </div>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
