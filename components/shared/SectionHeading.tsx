import React from "react";
import { cn } from "@/lib/utils";
import { LotusDivider } from "@/components/brand/Ornaments";

interface SectionHeadingProps {
  badge?: string;
  hindiBadge?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
  showDivider?: boolean;
}

export function SectionHeading({
  badge,
  hindiBadge,
  title,
  description,
  align = "center",
  className,
  showDivider = true,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col space-y-3 max-w-3xl mb-12",
        align === "center" ? "mx-auto text-center items-center" : "text-left items-start",
        className
      )}
    >
      {/* Micro-badge */}
      {(badge || hindiBadge) && (
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sand border border-border text-xs font-semibold uppercase tracking-wider text-maroon select-none">
          {hindiBadge && (
            <span className="font-devanagari text-saffron-deep font-normal normal-case">
              {hindiBadge}
            </span>
          )}
          {hindiBadge && badge && <span className="text-border">·</span>}
          {badge && <span>{badge}</span>}
        </div>
      )}

      {/* Main Serif Headline */}
      <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-maroon text-balance leading-[1.15]">
        {title}
      </h2>

      {/* Description */}
      {description && (
        <p className="text-sm sm:text-base text-ink-muted leading-relaxed font-sans max-w-2xl text-pretty">
          {description}
        </p>
      )}

      {/* Lotus divider */}
      {showDivider && align === "center" && (
        <LotusDivider className="my-2" />
      )}
    </div>
  );
}
