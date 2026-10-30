"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface ShinyTextProps {
  text: string;
  className?: string;
  shimmerWidth?: number;
}

export function ShinyText({ text, className, shimmerWidth = 100 }: ShinyTextProps) {
  return (
    <span
      className={cn(
        "relative inline-block bg-clip-text text-transparent bg-gradient-to-r from-maroon via-gold to-maroon bg-[length:250%_100%] animate-[shimmer_5s_infinite_linear]",
        className
      )}
      style={{
        backgroundImage: `linear-gradient(110deg, #7A1F14 0%, #7A1F14 35%, #D4A02C 50%, #7A1F14 65%, #7A1F14 100%)`,
        backgroundSize: `${shimmerWidth * 2.5}% 100%`,
      }}
    >
      {text}
    </span>
  );
}
