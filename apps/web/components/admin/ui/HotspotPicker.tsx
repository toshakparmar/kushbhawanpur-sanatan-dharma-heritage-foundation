"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { Crosshair, ZoomIn, Info } from "lucide-react";

interface Hotspot {
  x: number; // 0-100%
  y: number; // 0-100%
  radius: number; // percentage of width/height
}

interface HotspotPickerProps {
  value: Hotspot;
  onChange: (hotspot: Hotspot) => void;
  imageUrl?: string;
  label?: string;
}

export function HotspotPicker({
  value,
  onChange,
  imageUrl = "/brand/emblem.png",
  label = "Emblem Hotspot & Focus Area",
}: HotspotPickerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const x = Math.max(0, Math.min(100, Math.round((clickX / rect.width) * 100)));
    const y = Math.max(0, Math.min(100, Math.round((clickY / rect.height) * 100)));

    onChange({
      ...value,
      x,
      y,
    });
  };

  const handleRadiusChange = (radius: number) => {
    onChange({
      ...value,
      radius,
    });
  };

  return (
    <div className="space-y-3 bg-paper p-4 rounded-2xl border border-gold/30">
      <div className="flex items-center justify-between">
        <label className="text-xs font-serif font-bold text-maroon flex items-center gap-1.5">
          <Crosshair className="w-3.5 h-3.5 text-saffron" />
          <span>{label}</span>
        </label>
        <span className="text-[11px] font-mono font-semibold text-ink-muted">
          X: {value.x}% · Y: {value.y}% · R: {value.radius}%
        </span>
      </div>

      <p className="text-[11px] text-ink-muted flex items-center gap-1">
        <Info className="w-3 h-3 shrink-0 text-gold" />
        Click anywhere on the emblem below to anchor the chapter's sacred symbol.
      </p>

      {/* Emblem Interactive Box */}
      <div className="relative flex justify-center py-2 bg-cream/30 rounded-xl border border-border/60">
        <div
          ref={containerRef}
          onClick={handleClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="relative w-64 h-64 select-none cursor-crosshair rounded-full bg-paper/80 border border-gold/20 shadow-inner flex items-center justify-center overflow-hidden"
        >
          <Image
            src={imageUrl}
            alt="Foundation Emblem"
            fill
            className="object-contain p-4 pointer-events-none"
          />

          {/* Hotspot Circle Indicator */}
          <div
            style={{
              left: `${value.x}%`,
              top: `${value.y}%`,
              width: `${value.radius * 2}%`,
              height: `${value.radius * 2}%`,
            }}
            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-saffron bg-saffron/20 shadow-md pointer-events-none flex items-center justify-center transition-all duration-150"
          >
            <div className="w-2 h-2 rounded-full bg-saffron" />
          </div>
        </div>
      </div>

      {/* Radius Slider */}
      <div className="flex items-center gap-3 pt-1">
        <span className="text-xs font-serif text-ink-muted shrink-0 flex items-center gap-1">
          <ZoomIn className="w-3.5 h-3.5 text-gold" /> Focus Radius:
        </span>
        <input
          type="range"
          min="5"
          max="35"
          step="1"
          value={value.radius}
          onChange={(e) => handleRadiusChange(Number(e.target.value))}
          className="w-full accent-saffron cursor-pointer"
        />
        <span className="text-xs font-mono font-bold text-maroon w-8 text-right">
          {value.radius}%
        </span>
      </div>
    </div>
  );
}
