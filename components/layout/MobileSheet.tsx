"use client";

import React from "react";
import Link from "next/link";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Heart } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { siteConfig } from "@/content/site.config";
import { Diya } from "@/components/brand/Diya";

interface MobileSheetProps {
  navLinks: { href: string; label: string }[];
  activeSection: string;
}

export function MobileSheet({ navLinks, activeSection }: MobileSheetProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          type="button"
          className="lg:hidden inline-flex items-center justify-center p-2 rounded-full text-maroon hover:bg-sand/80 focus:outline-none focus:ring-2 focus:ring-gold"
          aria-label="Open navigation menu"
        >
          <Menu className="w-6 h-6" />
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="flex flex-col justify-between w-[85vw] max-w-sm bg-paper p-6">
        <div className="flex flex-col space-y-6">
          <Logo variant="compact" href="#home" />
          
          <div className="h-[1px] bg-border my-2" />

          {/* Navigation Links */}
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.replace("#", "");
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center justify-between py-3 px-3.5 rounded-xl font-serif text-lg transition-colors ${
                    isActive
                      ? "bg-sand/80 text-maroon font-bold"
                      : "text-ink hover:text-maroon hover:bg-sand/40"
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-saffron" />}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Pinned Bottom CTA & Trust Note */}
        <div className="pt-6 border-t border-border flex flex-col gap-3">
          <a
            href="#donate"
            onClick={() => setOpen(false)}
            className="btn-primary w-full py-3.5 flex items-center justify-center gap-2 text-center text-base font-bold shadow-md"
          >
            <Diya size={20} glow={false} />
            <span>Donate Now · सेवा</span>
          </a>
          <p className="text-[11px] text-muted text-center leading-tight">
            Official donation portal · Direct bank & UPI transfer
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
