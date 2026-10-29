import React from "react";
import { cn } from "@/lib/utils";

interface MandalaProps {
  className?: string;
  size?: number;
  opacity?: number;
}

export function Mandala({ className, size = 680, opacity = 0.05 }: MandalaProps) {
  return (
    <div
      className={cn("pointer-events-none select-none absolute flex items-center justify-center animate-mandala-spin", className)}
      style={{ width: size, height: size, opacity }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 500 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full text-gold-dark"
      >
        <circle cx="250" cy="250" r="230" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3 3" />
        <circle cx="250" cy="250" r="200" stroke="currentColor" strokeWidth="1" />
        <circle cx="250" cy="250" r="160" stroke="currentColor" strokeWidth="0.8" />
        <circle cx="250" cy="250" r="110" stroke="currentColor" strokeWidth="0.8" />
        <circle cx="250" cy="250" r="60" stroke="currentColor" strokeWidth="1.2" />

        {/* 16 Petals in Outer Ring */}
        {Array.from({ length: 16 }).map((_, i) => (
          <path
            key={`outer-${i}`}
            d="M250 50 C265 90 280 140 250 200 C220 140 235 90 250 50 Z"
            stroke="currentColor"
            strokeWidth="0.8"
            fill="none"
            transform={`rotate(${(i * 360) / 16} 250 250)`}
          />
        ))}

        {/* 12 Inner Petals */}
        {Array.from({ length: 12 }).map((_, i) => (
          <path
            key={`inner-${i}`}
            d="M250 90 C260 130 270 180 250 210 C230 180 240 130 250 90 Z"
            stroke="currentColor"
            strokeWidth="0.8"
            fill="none"
            transform={`rotate(${(i * 360) / 12} 250 250)`}
          />
        ))}

        {/* Center Star / Lotus Core */}
        {Array.from({ length: 8 }).map((_, i) => (
          <circle
            key={`dot-${i}`}
            cx="250"
            cy="140"
            r="3"
            fill="currentColor"
            transform={`rotate(${(i * 360) / 8} 250 250)`}
          />
        ))}
      </svg>
    </div>
  );
}
