"use client";

import React, { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

export function ParticlesBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    // Only on desktop and when reduced-motion is not requested
    if (shouldReduceMotion || typeof window === "undefined" || window.innerWidth < 1024) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    // Subtle 28 golden particles
    const particleCount = 28;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 1,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: -Math.random() * 0.4 - 0.1, // Drifting gently upward like diya warmth
      opacity: Math.random() * 0.35 + 0.1,
      fadeSpeed: (Math.random() * 0.005 + 0.002) * (Math.random() > 0.5 ? 1 : -1),
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.opacity += p.fadeSpeed;

        if (p.opacity > 0.45 || p.opacity < 0.08) {
          p.fadeSpeed = -p.fadeSpeed;
        }

        // Wrap around bounds
        if (p.y < 0) p.y = height;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212, 160, 44, ${p.opacity})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = "rgba(232, 113, 10, 0.4)";
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [shouldReduceMotion]);

  if (shouldReduceMotion) return null;

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-0 hidden lg:block opacity-70"
      aria-hidden="true"
    />
  );
}
