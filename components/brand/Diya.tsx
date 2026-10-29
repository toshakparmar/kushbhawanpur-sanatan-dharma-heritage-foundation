import React from "react";
import { cn } from "@/lib/utils";

interface DiyaProps {
  className?: string;
  size?: number;
  glow?: boolean;
}

export function Diya({ className, size = 28, glow = true }: DiyaProps) {
  return (
    <div
      className={cn("inline-flex items-center justify-center shrink-0 select-none", className)}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full overflow-visible"
      >
        {/* Glow halo */}
        {glow && (
          <circle
            cx="16"
            cy="11"
            r="8"
            fill="url(#diyaFlameGlow)"
            className="animate-pulse opacity-75"
          />
        )}

        <defs>
          <radialGradient
            id="diyaFlameGlow"
            cx="50%"
            cy="50%"
            r="50%"
          >
            <stop offset="0%" stopColor="#E8710A" stopOpacity="0.8" />
            <stop offset="60%" stopColor="#D4A02C" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#FFF9EF" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="flameGrad" x1="16" y1="4" x2="16" y2="16" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFF9EF" />
            <stop offset="35%" stopColor="#D4A02C" />
            <stop offset="85%" stopColor="#E8710A" />
            <stop offset="100%" stopColor="#7A1F14" />
          </linearGradient>
          <linearGradient id="bowlGrad" x1="6" y1="16" x2="26" y2="28" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#D4A02C" />
            <stop offset="50%" stopColor="#B8470A" />
            <stop offset="100%" stopColor="#7A1F14" />
          </linearGradient>
        </defs>

        {/* Diya Clay/Brass Bowl */}
        <path
          d="M6 18C6 24 10.5 28 16 28C21.5 28 26 24 26 18C23 18 19 19 16 19C13 19 9 18 6 18Z"
          fill="url(#bowlGrad)"
          stroke="#D4A02C"
          strokeWidth="0.8"
        />

        {/* Bowl Rim */}
        <ellipse
          cx="16"
          cy="18"
          rx="10"
          ry="2.5"
          fill="#5C140C"
          stroke="#D4A02C"
          strokeWidth="0.6"
        />

        {/* Flickering Flame */}
        <path
          d="M16 4C14.5 8 13.5 11 13.5 13.5C13.5 15.5 14.6 17 16 17C17.4 17 18.5 15.5 18.5 13.5C18.5 11 17.5 8 16 4Z"
          fill="url(#flameGrad)"
          className="glow-diya origin-bottom"
        />
      </svg>
    </div>
  );
}
