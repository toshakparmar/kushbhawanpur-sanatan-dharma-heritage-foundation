"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface BlurTextProps {
  text: string;
  delay?: number;
  className?: string;
  animateBy?: "words" | "letters";
  direction?: "top" | "bottom";
}

export function BlurText({
  text,
  delay = 0.05,
  className,
  animateBy = "words",
  direction = "bottom",
}: BlurTextProps) {
  const shouldReduceMotion = useReducedMotion();
  const elements = animateBy === "words" ? text.split(" ") : Array.from(text);

  if (shouldReduceMotion) {
    return <span className={className}>{text}</span>;
  }

  const yOffset = direction === "top" ? -14 : 14;

  return (
    <span className={cn("inline-flex flex-wrap", className)}>
      {elements.map((el, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, filter: "blur(8px)", y: yOffset }}
          whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.45,
            delay: i * delay,
            ease: [0.16, 1, 0.3, 1],
          }}
          className={cn("inline-block", animateBy === "words" ? "mr-[0.3em]" : "")}
        >
          {el}
        </motion.span>
      ))}
    </span>
  );
}
