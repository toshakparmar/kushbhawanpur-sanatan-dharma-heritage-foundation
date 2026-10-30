"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Play, Film, ChevronLeft, ChevronRight, Video as VideoIcon } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";

interface VideoItem {
  id: string;
  title: string;
  sourceUrl: string;
  provider: string;
  videoId: string;
  embedUrl: string;
  thumbnailUrl?: string;
  category?: string;
  featured?: boolean;
}

interface VideosProps {
  videos: VideoItem[];
}

export function Videos({ videos }: VideosProps) {
  // CRITICAL RULE: Automatically hide if no published videos!
  if (!videos || videos.length === 0) {
    return null;
  }

  // Find initial featured video (or first video)
  const defaultFeatured = videos.find((v) => v.featured) || videos[0];
  const [selectedVideo, setSelectedVideo] = useState<VideoItem>(defaultFeatured);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  // Embla carousel setup
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: "start",
    slidesToScroll: 1,
  });

  const categories = useMemo(() => {
    const cats = Array.from(new Set(videos.map((v) => v.category || "General")));
    return ["ALL", ...cats];
  }, [videos]);

  const filteredVideos = useMemo(() => {
    if (selectedCategory === "ALL") return videos;
    return videos.filter((v) => (v.category || "General") === selectedCategory);
  }, [videos, selectedCategory]);

  const handleSelectVideo = (video: VideoItem) => {
    setSelectedVideo(video);
    setIsPlaying(false); // Reset to lite thumbnail mode until user clicks play
  };

  const scrollPrev = () => emblaApi && emblaApi.scrollPrev();
  const scrollNext = () => emblaApi && emblaApi.scrollNext();

  return (
    <section id="videos" className="py-20 sm:py-24 bg-cream/40 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <SectionHeading
          badge="Sacred Sight & Sound"
          title="Glimpses of Heritage, Seva & Darshan"
          subtitle="Watch discourses, historical documentaries, gau seva sanctuaries, and ground updates from the sacred shrines of Kushbhawanpur."
        />

        {/* Category Filter Chips */}
        {categories.length > 2 && (
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-serif font-semibold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-maroon text-cream shadow-sm"
                    : "bg-paper text-ink-muted hover:text-maroon border border-gold/40 hover:border-gold"
                }`}
              >
                {cat === "ALL" ? "All Videos" : cat}
              </button>
            ))}
          </div>
        )}

        {/* Featured Video Player (Large 16:9, Lite Embed) */}
        <div className="mt-10 sm:mt-12 max-w-4xl mx-auto">
          <div className="relative aspect-video w-full rounded-3xl overflow-hidden border-2 border-gold/50 shadow-2xl bg-charcoal">
            <AnimatePresence mode="wait">
              {isPlaying ? (
                <motion.div
                  key={`embed-${selectedVideo.id}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full h-full"
                >
                  <iframe
                    src={`${selectedVideo.embedUrl}${
                      selectedVideo.embedUrl.includes("?") ? "&" : "?"
                    }autoplay=1&rel=0`}
                    title={selectedVideo.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full border-none"
                  />
                </motion.div>
              ) : (
                <motion.div
                  key={`poster-${selectedVideo.id}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="relative w-full h-full cursor-pointer group"
                  onClick={() => setIsPlaying(true)}
                >
                  {selectedVideo.thumbnailUrl ? (
                    <Image
                      src={selectedVideo.thumbnailUrl}
                      alt={selectedVideo.title}
                      fill
                      className="object-cover group-hover:scale-103 transition-transform duration-500"
                      priority
                      sizes="(max-width: 1024px) 100vw, 896px"
                    />
                  ) : (
                    <div className="w-full h-full bg-linear-to-br from-maroon/90 to-charcoal flex items-center justify-center">
                      <Film className="w-16 h-16 text-gold/40" />
                    </div>
                  )}

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-linear-to-t from-charcoal/80 via-charcoal/20 to-transparent" />

                  {/* Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-saffron text-white flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:bg-saffron-dark transition-all duration-300">
                      <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-current translate-x-0.5" />
                    </div>
                  </div>

                  {/* Title Bar in Overlay */}
                  <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6">
                    <span className="inline-block px-3 py-1 rounded-full bg-maroon/80 text-cream text-[11px] font-sans font-semibold uppercase tracking-wider mb-2 backdrop-blur-xs">
                      {selectedVideo.category || "Featured Video"}
                    </span>
                    <h3 className="font-serif text-lg sm:text-2xl font-bold text-cream drop-shadow-md line-clamp-2">
                      {selectedVideo.title}
                    </h3>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Embla Carousel for Video Selection */}
        {filteredVideos.length > 1 && (
          <div className="mt-8 sm:mt-10 max-w-4xl mx-auto relative">
            <div className="flex items-center justify-between mb-4 px-2">
              <span className="font-serif text-sm font-semibold text-maroon flex items-center gap-1.5">
                <VideoIcon className="w-4 h-4 text-saffron" />
                More Videos ({filteredVideos.length})
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={scrollPrev}
                  className="p-2 rounded-full border border-gold/40 bg-paper text-maroon hover:bg-sand/40 hover:border-gold transition-all cursor-pointer shadow-xs"
                  aria-label="Previous videos"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={scrollNext}
                  className="p-2 rounded-full border border-gold/40 bg-paper text-maroon hover:bg-sand/40 hover:border-gold transition-all cursor-pointer shadow-xs"
                  aria-label="Next videos"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex gap-4">
                {filteredVideos.map((video) => {
                  const isCurrent = video.id === selectedVideo.id;
                  return (
                    <div
                      key={video.id}
                      onClick={() => handleSelectVideo(video)}
                      className={`flex-[0_0_240px] sm:flex-[0_0_280px] rounded-2xl overflow-hidden border p-2 bg-paper transition-all cursor-pointer group ${
                        isCurrent
                          ? "border-saffron ring-2 ring-saffron/40 shadow-md"
                          : "border-gold/30 hover:border-gold hover:shadow-md"
                      }`}
                    >
                      <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-sand/30 mb-2">
                        {video.thumbnailUrl ? (
                          <Image
                            src={video.thumbnailUrl}
                            alt={video.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            sizes="280px"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-sand/40">
                            <Film className="w-6 h-6 text-gold" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-charcoal/20 group-hover:bg-charcoal/0 transition-colors" />
                        <div className="absolute inset-0 flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity">
                          <div className="w-8 h-8 rounded-full bg-saffron text-white flex items-center justify-center shadow-md">
                            <Play className="w-3.5 h-3.5 fill-current translate-x-0.5" />
                          </div>
                        </div>
                      </div>
                      <h4 className="font-serif text-xs sm:text-sm font-bold text-maroon line-clamp-2 leading-snug group-hover:text-saffron-deep transition-colors">
                        {video.title}
                      </h4>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
