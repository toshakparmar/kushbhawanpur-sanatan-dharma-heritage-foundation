/**
 * Motion System Standards & Framer/GSAP Configurations
 * 
 * Rules:
 * - GSAP and Framer Motion must NEVER animate the same element.
 * - Respects prefers-reduced-motion everywhere.
 * - Durations: micro (150ms), standard (300ms), emphasis (800ms)
 */

export const transitions = {
  micro: { duration: 0.16, ease: [0.16, 1, 0.3, 1] },
  standard: { duration: 0.32, ease: [0.16, 1, 0.3, 1] },
  emphasis: { duration: 0.85, ease: [0.16, 1, 0.3, 1] },
  spring: { type: "spring", stiffness: 260, damping: 26 },
  gentleSpring: { type: "spring", stiffness: 120, damping: 18, mass: 0.8 },
  heroDepth: { type: "spring", stiffness: 75, damping: 20, mass: 1 },
} as const;

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: transitions.standard,
  },
};

export const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitions.emphasis,
  },
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: transitions.standard,
  },
};
