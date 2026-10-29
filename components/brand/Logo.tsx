import React from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  variant?: "header" | "footer" | "compact" | "emblem-only";
  className?: string;
  href?: string;
}

export function Logo({ variant = "header", className, href = "#home" }: LogoProps) {
  const content = (
    <div className={cn("flex items-center gap-3 select-none", className)}>
      {/* Medallion Emblem */}
      <div className="relative shrink-0 rounded-full overflow-hidden p-0.5 bg-gradient-to-br from-gold via-saffron to-maroon shadow-sm">
        <div className="relative rounded-full overflow-hidden bg-cream border border-gold/40">
          <Image
            src="/brand/logo-original.png"
            alt="Kushbhawanpur Sanatan Dharma & Heritage Foundation Seal"
            width={variant === "footer" ? 56 : 46}
            height={variant === "footer" ? 56 : 46}
            className="object-cover rounded-full transform hover:scale-105 transition-transform duration-300"
            priority
          />
        </div>
      </div>

      {variant !== "emblem-only" && (
        <div className="flex flex-col justify-center text-left">
          <span className="font-serif font-bold tracking-tight text-maroon text-base sm:text-lg leading-tight">
            Kushbhawanpur
          </span>
          <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-muted font-sans leading-none mt-0.5">
            Sanatan Dharma & Heritage
          </span>
          {variant === "footer" && (
            <span className="text-[9px] font-medium tracking-widest text-gold-dark font-sans uppercase mt-0.5">
              Foundation · न्यास
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-block transition-opacity hover:opacity-90">
        {content}
      </Link>
    );
  }

  return content;
}
