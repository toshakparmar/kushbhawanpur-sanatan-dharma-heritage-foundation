"use client";

import React, { useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TiltedCardProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
}

export function TiltedCard({
  children,
  className,
  maxTilt = 8,
}: TiltedCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || shouldReduceMotion) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const middleX = rect.width / 2;
    const middleY = rect.height / 2;

    const rX = ((y - middleY) / middleY) * -maxTilt;
    const rY = ((x - middleX) / middleX) * maxTilt;

    setRotateX(rX);
    setRotateY(rY);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: 1000,
      }}
      className={cn("transition-transform duration-200 ease-out", className)}
    >
      <motion.div
        animate={{
          rotateX,
          rotateY,
        }}
        transition={{
          type: "spring",
          stiffness: 240,
          damping: 24,
        }}
        style={{ transformStyle: "preserve-3d" }}
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
