"use client";

import { useState, useEffect } from "react";

/**
 * Native, warning-free reduced-motion hook that listens to the browser/OS
 * media query without triggering Framer Motion's dev-mode console warning.
 */
export function useSafeReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReduced(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => {
      setPrefersReduced(e.matches);
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handler);
      return () => mediaQuery.removeEventListener("change", handler);
    }
  }, []);

  return prefersReduced;
}
