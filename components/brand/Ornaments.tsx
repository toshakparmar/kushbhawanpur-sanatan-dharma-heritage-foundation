import React from "react";
import { cn } from "@/lib/utils";

export function LotusDivider({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center gap-3 w-full max-w-md mx-auto my-6 select-none opacity-80", className)}>
      <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-gold to-gold/70" />
      <svg
        width="28"
        height="20"
        viewBox="0 0 28 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 text-gold"
        aria-hidden="true"
      >
        {/* Central petal */}
        <path
          d="M14 2C14 2 11 8 11 12C11 14.5 12.5 17 14 17C15.5 17 17 14.5 17 12C17 8 14 2 14 2Z"
          fill="currentColor"
          fillOpacity="0.85"
        />
        {/* Left inner petal */}
        <path
          d="M12 6C12 6 7 10 7 14C7 16 8.5 17.5 10 17.5C11.5 17.5 12.5 16 12.5 14C12.5 11 12 6 12 6Z"
          fill="currentColor"
          fillOpacity="0.65"
        />
        {/* Right inner petal */}
        <path
          d="M16 6C16 6 21 10 21 14C21 16 19.5 17.5 18 17.5C16.5 17.5 15.5 16 15.5 14C15.5 11 16 6 16 6Z"
          fill="currentColor"
          fillOpacity="0.65"
        />
        {/* Left outer flare */}
        <path
          d="M8.5 11C8.5 11 3 13 3 16C3 17.5 4.5 18 6 18C7.5 18 9 17 9.5 15C10 13 8.5 11 8.5 11Z"
          fill="currentColor"
          fillOpacity="0.45"
        />
        {/* Right outer flare */}
        <path
          d="M19.5 11C19.5 11 25 13 25 16C25 17.5 23.5 18 22 18C20.5 18 19 17 18.5 15C18 13 19.5 11 19.5 11Z"
          fill="currentColor"
          fillOpacity="0.45"
        />
      </svg>
      <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-gold to-gold/70" />
    </div>
  );
}

export function DiyaFlourish({ className }: { className?: string }) {
  return (
    <div className={cn("inline-flex items-center gap-1.5 text-gold-dark", className)}>
      <span className="w-1.5 h-1.5 rounded-full bg-gold" />
      <span className="w-2.5 h-2.5 rounded-full bg-saffron" />
      <span className="w-1.5 h-1.5 rounded-full bg-gold" />
    </div>
  );
}
