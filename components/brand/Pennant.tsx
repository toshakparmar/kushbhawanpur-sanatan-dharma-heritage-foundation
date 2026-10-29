import React from "react";
import { cn } from "@/lib/utils";

interface PennantProps {
  className?: string;
  size?: number;
}

export function Pennant({ className, size = 32 }: PennantProps) {
  return (
    <div
      className={cn("inline-flex items-center justify-center shrink-0 select-none", className)}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full overflow-visible"
      >
        <defs>
          <linearGradient id="pennantGrad" x1="10" y1="6" x2="36" y2="20" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#E8710A" />
            <stop offset="100%" stopColor="#B8470A" />
          </linearGradient>
        </defs>

        {/* Flagpole */}
        <line x1="10" y1="4" x2="10" y2="36" stroke="#D4A02C" strokeWidth="2" strokeLinecap="round" />
        <circle cx="10" cy="4" r="2" fill="#D4A02C" />

        {/* Saffron Pennant Triangle with subtle swallow-tail notch */}
        <path
          d="M10 6L35 14L10 22V6Z"
          fill="url(#pennantGrad)"
          stroke="#7A1F14"
          strokeWidth="0.75"
        />

        {/* Small gold border line */}
        <path
          d="M12 9L29 14L12 19"
          stroke="#D4A02C"
          strokeWidth="0.75"
          strokeOpacity="0.8"
          fill="none"
        />
      </svg>
    </div>
  );
}
