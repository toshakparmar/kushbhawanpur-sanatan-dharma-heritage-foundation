"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface FadeContentProps {
  children: React.ReactNode;
  blur?: boolean;
  duration?: number;
  easing?: [number, number, number, number];
  delay?: number;
  initialOpacity?: number;
  className?: string;
}

export function FadeContent({
  children,
  blur = false,
  duration = 0.6,
  easing = [0.16, 1, 0.3, 1],
  delay = 0,
  initialOpacity = 0,
  className,
}: FadeContentProps) {
  return (
    <motion.div
      initial={{
        opacity: initialOpacity,
        filter: blur ? "blur(8px)" : "none",
        y: 16,
      }}
      whileInView={{
        opacity: 1,
        filter: "blur(0px)",
        y: 0,
      }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{
        duration,
        ease: easing,
        delay,
      }}
      className={cn("w-full", className)}
    >
      {children}
    </motion.div>
  );
}
