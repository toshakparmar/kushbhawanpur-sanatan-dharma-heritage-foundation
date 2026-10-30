import React from "react";
import Link from "next/link";
import { Diya } from "@/components/brand/Diya";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center py-20 px-4 paper-texture bg-cream text-center">
      <div className="max-w-md mx-auto p-8 sm:p-10 rounded-3xl bg-paper border border-gold/40 shadow-xl space-y-6">
        <div className="w-16 h-16 rounded-full bg-sand mx-auto flex items-center justify-center">
          <Diya size={36} glow={true} />
        </div>

        <div className="space-y-2">
          <span className="font-devanagari text-maroon text-lg font-bold block">
            पृष्ठ नहीं मिला · ४०४
          </span>
          <h1 className="font-serif text-3xl font-bold text-maroon">
            Page Not Found
          </h1>
          <p className="text-xs sm:text-sm text-ink-muted leading-relaxed font-sans">
            The page you are looking for has moved or does not exist. All foundation offerings and details are available on our primary portal.
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/"
            className="btn-primary px-6 py-2.5 text-xs font-bold inline-flex items-center gap-2 shadow-md"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Home Portal</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
