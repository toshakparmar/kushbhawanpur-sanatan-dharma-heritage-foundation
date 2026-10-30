import { Transition } from "framer-motion";
import { Hotspot } from "@/content/story";

export const STORY_SPRING_TRANSITION: Transition = {
  type: "spring",
  stiffness: 140,
  damping: 24,
  mass: 0.8
};

export const HOTSPOT_RING_TRANSITION: Transition = {
  type: "spring",
  stiffness: 120,
  damping: 22,
  mass: 0.9
};

export const STORY_FADE_TRANSITION: Transition = {
  duration: 0.35,
  ease: [0.25, 0.1, 0.25, 1.0]
};

/**
 * Calculates transform origin and scale for emblem zoom based on symbol hotspot.
 */
export function getEmblemTransform(
  hotspot: Hotspot,
  isReducedMotion: boolean = false
): {
  scale: number;
  originX: string;
  originY: string;
} {
  if (isReducedMotion) {
    return {
      scale: 1,
      originX: "50%",
      originY: "50%"
    };
  }

  // Smooth zoom towards symbol without excessive clipping
  // When hotspot is near border or center, adjust target scale ~1.42 - 1.58
  const baseScale = hotspot.radius < 15 ? 1.55 : 1.45;

  return {
    scale: baseScale,
    originX: `${hotspot.x}%`,
    originY: `${hotspot.y}%`
  };
}

/**
 * SVG Path for the Gomti River wave line connecting the 5 symbols in the closing block.
 */
export const GOMTI_RIVER_SVG_PATH =
  "M 20 50 C 150 15, 250 85, 380 50 C 510 15, 620 85, 750 50 C 880 15, 980 85, 1100 50 C 1220 15, 1320 85, 1420 50";
