import React from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";


interface LogoProps {
  variant?: "header" | "footer" | "compact" | "emblem-only" | "full" | "horizontal";
  className?: string;
  href?: string;
}

export function Logo({ variant = "header", className, href = "#home" }: LogoProps) {
  let content: React.ReactNode;

  if (variant === "full") {
    content = (
      <div className={cn("flex flex-col items-center select-none", className)}>
        <Image
          src="/brand/logo-original.png"
          alt="Kushbhawanpur Sanatan Dharma & Heritage Foundation Official Logo"
          width={300}
          height={200}
          className="object-contain hover:scale-105 transition-transform duration-300"
          priority
        />
      </div>
    );
  } else if (variant === "horizontal") {
    content = (
      <div className={cn("flex items-center select-none", className)}>
        <Image
          src="/brand/logo-horizontal.png"
          alt="Kushbhawanpur Sanatan Dharma & Heritage Foundation Logo"
          width={220}
          height={56}
          className="h-11 sm:h-12 w-auto object-contain hover:scale-105 transition-transform duration-300"
          priority
        />
      </div>
    );
  } else if (variant === "emblem-only") {
    content = (
      <div className={cn("relative shrink-0 select-none", className)}>
        <Image
          src="/brand/logo-emblem.png"
          alt="Kushbhawanpur Sanatan Dharma & Heritage Foundation Seal"
          width={48}
          height={48}
          className="object-contain hover:scale-105 transition-transform duration-300"
          priority
        />
      </div>
    );
  } else {
    // Header & Compact: Clean emblem + typography lockup
    content = (
      <div className={cn("flex items-center gap-3 select-none", className)}>
        {/* Sacred Seal Emblem */}
        <div className="relative shrink-0 flex items-center justify-center">
          <Image
            src="/brand/logo-emblem.png"
            alt="Kushbhawanpur Sanatan Dharma & Heritage Foundation Official Seal"
            width={variant === "footer" ? 52 : variant === "compact" ? 40 : 46}
            height={variant === "footer" ? 52 : variant === "compact" ? 40 : 46}
            className="object-contain transform hover:scale-105 transition-transform duration-300 drop-shadow-xs"
            priority
          />
        </div>

        {/* Wordmark Typography */}
        <div className="flex flex-col justify-center text-left">
          <span
            className={cn(
              "font-serif font-bold tracking-tight text-maroon leading-tight",
              variant === "footer" ? "text-lg sm:text-xl" : "text-base sm:text-lg"
            )}
          >
            Kushbhawanpur
          </span>
          <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-muted font-sans leading-none mt-0.5">
            Sanatan Dharma & Heritage
          </span>
          {variant === "footer" && (
            <span className="text-[9px] font-medium tracking-widest text-gold-dark font-sans uppercase mt-1">
              Foundation · न्यास
            </span>
          )}
        </div>
      </div>
    );
  }

  if (href) {
    return (
      <Link href={href} className="inline-block transition-opacity hover:opacity-90">
        {content}
      </Link>
    );
  }

  return content;
}
