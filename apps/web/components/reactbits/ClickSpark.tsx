"use client";

import React, { useRef } from "react";
import confetti from "canvas-confetti";

interface ClickSparkProps {
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export function ClickSpark({ children, className, onClick }: ClickSparkProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Traditional festive gold and saffron floral celebration spark
    confetti({
      particleCount: 45,
      spread: 60,
      origin: {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      },
      colors: ["#E8710A", "#D4A02C", "#7A1F14", "#FFF9EF", "#3E7B3A"],
      ticks: 200,
      gravity: 1.2,
      scalar: 0.9,
      disableForReducedMotion: true,
    });

    if (onClick) onClick(e);
  };

  return (
    <div
      ref={containerRef}
      onClick={handleClick}
      className={className}
    >
      {children}
    </div>
  );
}
