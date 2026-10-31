"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { adminFetch } from "@/lib/admin-api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Search, Image as ImageIcon, Check, Loader2, UploadCloud } from "lucide-react";
import { MediaUploader } from "./MediaUploader";

interface MediaAsset {
  id: string;
  url: string;
  originalName: string;
  alt?: string;
  caption?: string;
  sizeBytes: number;
  mime: string;
  usageCount?: number;
}

interface MediaLibraryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (asset: { url: string; alt?: string; id?: string }) => void;
  title?: string;
}

export function MediaLibraryDialog({
  open,
  onOpenChange,
  onSelect,
  title = "Select from Media Library",
}: MediaLibraryDialogProps) {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"library" | "upload">("library");
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      loadAssets();
    }
  }, [open]);

  const loadAssets = async () => {
    setLoading(true);
    try {
      const data = await adminFetch("/admin/media");
      setAssets(Array.isArray(data) ? data : []);
    } catch {
      setAssets([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredAssets = assets.filter(
    (a) =>
      a.originalName?.toLowerCase().includes(search.toLowerCase()) ||
      a.alt?.toLowerCase().includes(search.toLowerCase()) ||
      a.caption?.toLowerCase().includes(search.toLowerCase())
  );

  const handleChoose = (asset: MediaAsset) => {
    onSelect({
      url: asset.url,
      alt: asset.alt,
      id: asset.id,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col p-6 bg-paper rounded-3xl border border-gold/30">
        <DialogHeader className="pb-3 border-b border-border">
          <DialogTitle className="font-serif text-lg font-bold text-maroon">
            {title}
          </DialogTitle>
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={() => setActiveTab("library")}
              className={`px-3 py-1.5 rounded-xl text-xs font-serif font-bold transition-all ${
                activeTab === "library"
                  ? "bg-maroon text-cream shadow-xs"
                  : "bg-sand/30 text-ink-muted hover:text-maroon"
              }`}
            >
              <span className="flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5" />
                Library Browse ({assets.length})
              </span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("upload")}
              className={`px-3 py-1.5 rounded-xl text-xs font-serif font-bold transition-all ${
                activeTab === "upload"
                  ? "bg-maroon text-cream shadow-xs"
                  : "bg-sand/30 text-ink-muted hover:text-maroon"
              }`}
            >
              <span className="flex items-center gap-1.5">
                <UploadCloud className="w-3.5 h-3.5" />
                Upload New Asset
              </span>
            </button>
          </div>
        </DialogHeader>

        {activeTab === "library" ? (
          <div className="flex-1 flex flex-col min-h-0 pt-3 space-y-4">
            {/* Search Box */}
            <div className="relative">
              <Search className="w-4 h-4 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search media by name or alt text..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-cream/50 border border-border focus:border-gold outline-none"
              />
            </div>

            {/* Asset Grid */}
            <div className="flex-1 overflow-y-auto pr-1">
              {loading ? (
                <div className="py-12 flex flex-col items-center justify-center gap-2 text-ink-muted">
                  <Loader2 className="w-6 h-6 animate-spin text-saffron" />
                  <span className="text-xs font-serif">Loading media library...</span>
                </div>
              ) : filteredAssets.length === 0 ? (
                <div className="py-12 text-center text-ink-muted space-y-2">
                  <ImageIcon className="w-10 h-10 mx-auto text-gold/40" />
                  <p className="text-xs font-serif">No media assets found.</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {filteredAssets.map((asset) => (
                    <div
                      key={asset.id}
                      onClick={() => handleChoose(asset)}
                      className="group relative aspect-square rounded-xl overflow-hidden border border-border hover:border-maroon cursor-pointer bg-cream/40 transition-all shadow-2xs hover:shadow-md"
                    >
                      <Image
                        src={asset.url}
                        alt={asset.alt || asset.originalName}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-maroon/0 group-hover:bg-maroon/40 transition-colors flex items-center justify-center">
                        <span className="opacity-0 group-hover:opacity-100 bg-paper/90 text-maroon text-[11px] font-serif font-bold px-2 py-1 rounded-lg shadow-xs">
                          Select
                        </span>
                      </div>
                      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-charcoal/80 to-transparent p-1.5">
                        <span className="text-[10px] text-cream block truncate font-sans">
                          {asset.originalName}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="py-6">
            <MediaUploader
              value={selectedUrl}
              onChange={(url) => {
                setSelectedUrl(url);
                if (url) {
                  onSelect({ url });
                  onOpenChange(false);
                }
              }}
              label="Upload Asset to Library"
              helperText="Upload high resolution image (PNG, JPG, WEBP). It will be saved directly to Supabase storage."
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
