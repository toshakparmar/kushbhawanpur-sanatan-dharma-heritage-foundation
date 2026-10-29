"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface MarqueeProps {
  children: React.ReactNode;
  direction?: "left" | "right";
  speed?: number; // seconds
  pauseOnHover?: boolean;
  className?: string;
}

export function Marquee({
  children,
  direction = "left",
  speed = 40,
  pauseOnHover = true,
  className,
}: MarqueeProps) {
  return (
    <div
      className={cn(
        "group flex overflow-hidden select-none [mask-image:linear-gradient(to_right,transparent,white_10%,white_90%,transparent)]",
        className
      )}
    >
      <div
        className={cn(
          "flex shrink-0 items-center gap-8 py-2",
          direction === "left" ? "animate-marquee-left" : "animate-marquee-right",
          pauseOnHover && "group-hover:[animation-play-state:paused]"
        )}
        style={{ animationDuration: `${speed}s` }}
      >
        {children}
      </div>
      <div
        className={cn(
          "flex shrink-0 items-center gap-8 py-2",
          direction === "left" ? "animate-marquee-left" : "animate-marquee-right",
          pauseOnHover && "group-hover:[animation-play-state:paused]"
        )}
        style={{ animationDuration: `${speed}s` }}
        aria-hidden="true"
      >
        {children}
      </div>
    </div>
  );
}
