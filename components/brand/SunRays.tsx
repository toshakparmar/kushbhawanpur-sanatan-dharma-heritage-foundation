import React from "react";
import { cn } from "@/lib/utils";

interface SunRaysProps {
  className?: string;
  size?: number;
}

export function SunRays({ className, size = 420 }: SunRaysProps) {
  // 24 radiant rays emanating symmetrically
  const rayCount = 24;
  const rays = Array.from({ length: rayCount }, (_, i) => {
    const angle = (i * 360) / rayCount;
    return (
      <line
        key={i}
        x1="200"
        y1="200"
        x2="200"
        y2={i % 2 === 0 ? "18" : "38"}
        stroke="url(#sunRayGradient)"
        strokeWidth={i % 2 === 0 ? "2.5" : "1.5"}
        strokeLinecap="round"
        transform={`rotate(${angle} 200 200)`}
      />
    );
  });

  return (
    <div
      className={cn("pointer-events-none select-none flex items-center justify-center animate-sun-rays", className)}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 400 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <defs>
          <radialGradient
            id="sunGlow"
            cx="50%"
            cy="50%"
            r="50%"
            fx="50%"
            fy="50%"
          >
            <stop offset="0%" stopColor="#D4A02C" stopOpacity="0.32" />
            <stop offset="50%" stopColor="#E8710A" stopOpacity="0.14" />
            <stop offset="100%" stopColor="#FFF9EF" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="sunRayGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#D4A02C" stopOpacity="0.9" />
            <stop offset="60%" stopColor="#E8710A" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#7A1F14" stopOpacity="0.05" />
          </linearGradient>
        </defs>

        {/* Central soft halo */}
        <circle cx="200" cy="200" r="140" fill="url(#sunGlow)" />

        {/* Radial burst rays */}
        {rays}
      </svg>
    </div>
  );
}
