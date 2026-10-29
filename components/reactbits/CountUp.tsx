"use client";

import React, { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

interface CountUpProps {
  to: number;
  from?: number;
  duration?: number;
  separator?: string;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export function CountUp({
  to,
  from = 0,
  duration = 2,
  separator = ",",
  prefix = "",
  suffix = "",
  className,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const shouldReduceMotion = useReducedMotion();
  const [value, setValue] = useState(from);

  useEffect(() => {
    if (!inView || shouldReduceMotion) {
      if (shouldReduceMotion) setValue(to);
      return;
    }

    let startTime: number | null = null;
    let animationFrameId: number;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(from + (to - from) * eased);
      setValue(current);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        setValue(to);
      }
    };

    animationFrameId = requestAnimationFrame(step);

    return () => cancelAnimationFrame(animationFrameId);
  }, [inView, from, to, duration, shouldReduceMotion]);

  const formatted = new Intl.NumberFormat("en-IN", {
    useGrouping: Boolean(separator),
  }).format(value);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
