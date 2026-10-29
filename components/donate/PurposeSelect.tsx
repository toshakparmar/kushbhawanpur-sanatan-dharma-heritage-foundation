"use client";

import React from "react";
import { siteConfig } from "@/content/site.config";
import { ChevronDown, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface PurposeSelectProps {
  selectedPurpose: string;
  onPurposeChange: (purposeId: string) => void;
  dedication: string;
  onDedicationChange: (text: string) => void;
}

export function PurposeSelect({
  selectedPurpose,
  onPurposeChange,
  dedication,
  onDedicationChange,
}: PurposeSelectProps) {
  const purposes = [
    {
      id: "general",
      title: "General Fund (Where Most Needed)",
      hindi: "सामान्य न्यास कोष",
    },
    ...siteConfig.focusAreas.map((area) => ({
      id: area.id,
      title: area.title,
      hindi: area.hindiTitle,
    })),
  ];

  return (
    <div className="flex flex-col space-y-4">
      {/* Purpose Dropdown */}
      <div className="flex flex-col space-y-1.5">
        <label className="text-xs font-semibold uppercase tracking-wider text-muted font-sans">
          Dedicate Contribution Toward
        </label>
        <div className="relative">
          <select
            value={selectedPurpose}
            onChange={(e) => onPurposeChange(e.target.value)}
            className="w-full appearance-none rounded-xl border border-border bg-paper px-4 py-2.5 text-sm font-semibold text-ink focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30 pr-10 cursor-pointer shadow-sm"
          >
            {purposes.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title} ({p.hindi})
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3.5 top-3.5 h-4 w-4 text-muted" />
        </div>
      </div>

      {/* Optional In The Name Of / Sankalpa Dedication */}
      <div className="flex flex-col space-y-1.5">
        <label className="text-xs font-semibold uppercase tracking-wider text-muted font-sans flex items-center justify-between">
          <span>In Honor / Memory Of (Optional Sankalpa)</span>
          <span className="text-[11px] text-muted font-normal">
            included in transfer note
          </span>
        </label>
        <div className="relative">
          <input
            type="text"
            placeholder="e.g., In memory of late grandparents or family sankalpa"
            value={dedication}
            onChange={(e) => onDedicationChange(e.target.value)}
            maxLength={60}
            className="w-full rounded-xl border border-border bg-paper px-4 py-2.5 text-xs sm:text-sm text-ink placeholder:text-muted/60 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30 shadow-sm"
          />
        </div>
      </div>
    </div>
  );
}
