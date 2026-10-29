"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Maximize2, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface GalleryItem {
  id: string;
  title: string;
  hindiTitle: string;
  category: string;
  image: string;
  aspect: "square" | "portrait" | "landscape";
  caption: string;
}

interface LightboxGalleryProps {
  items: GalleryItem[];
}

export function LightboxGallery({ items }: LightboxGalleryProps) {
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);

  return (
    <div>
      {/* Asymmetric offset-grid layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item, index) => {
          const isLarge = index === 0 || index === 4;

          return (
            <div
              key={item.id}
              onClick={() => setActiveItem(item)}
              className={cn(
                "group relative rounded-2xl overflow-hidden border border-border bg-paper shadow-sm cursor-pointer transition-all duration-300 hover:shadow-xl hover:border-gold/50",
                isLarge ? "sm:col-span-2 sm:row-span-2 lg:col-span-2 lg:row-span-2" : ""
              )}
            >
              <div className="relative aspect-[4/3] w-full h-full overflow-hidden bg-sand/30" style={{ position: "relative" }}>
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />

                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent opacity-60 group-hover:opacity-85 transition-opacity" />

                {/* Open icon badge */}
                <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-cream/90 text-maroon flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                  <Maximize2 className="w-4 h-4" />
                </div>

                {/* Content caption */}
                <div className="absolute bottom-0 left-0 right-0 p-5 text-cream flex flex-col space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-gold-light bg-maroon-deep/70 px-2 py-0.5 rounded-full">
                      {item.category}
                    </span>
                    <span className="font-devanagari text-xs text-sand">
                      {item.hindiTitle}
                    </span>
                  </div>
                  <h4 className="font-serif text-lg sm:text-xl font-bold leading-tight">
                    {item.title}
                  </h4>
                  <p className="text-xs text-cream/80 line-clamp-2 font-sans pt-0.5">
                    {item.caption}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Lightbox Dialog */}
      <Dialog
        open={Boolean(activeItem)}
        onOpenChange={(open) => !open && setActiveItem(null)}
      >
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-cream border border-gold/40">
          {activeItem && (
            <div className="flex flex-col">
              <div className="relative aspect-[16/10] w-full bg-black/5" style={{ position: "relative" }}>
                <Image
                  src={activeItem.image}
                  alt={activeItem.title}
                  fill
                  className="object-contain"
                />
              </div>
              <div className="p-6 bg-paper border-t border-border flex flex-col space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-devanagari text-maroon font-semibold text-sm">
                      {activeItem.hindiTitle}
                    </span>
                    <span className="text-border">·</span>
                    <span className="text-xs font-semibold text-gold-dark uppercase tracking-wider">
                      {activeItem.category}
                    </span>
                  </div>
                </div>
                <DialogTitle className="text-2xl font-serif font-bold text-maroon">
                  {activeItem.title}
                </DialogTitle>
                <p className="text-sm text-ink-muted leading-relaxed">
                  {activeItem.caption}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
