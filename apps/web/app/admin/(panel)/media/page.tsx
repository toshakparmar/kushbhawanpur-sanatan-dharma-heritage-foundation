"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { adminFetch } from "@/lib/admin-api";
import {
  Image as ImageIcon,
  FileText,
  Search,
  Filter,
  Trash2,
  Copy,
  ExternalLink,
  Edit2,
  Check,
  Loader2,
  Plus,
  Layers,
  UploadCloud,
} from "lucide-react";
import { toast } from "sonner";
import { useConfirm } from "@/components/admin/ui/ConfirmDialog";
import { MediaUploader } from "@/components/admin/ui/MediaUploader";

interface MediaAsset {
  id: string;
  kind: "IMAGE" | "DOCUMENT";
  originalName: string;
  mime: string;
  sizeBytes: number;
  url: string;
  storageKey: string;
  alt?: string;
  caption?: string;
  status: string;
  usageCount: number;
  createdAt: string;
}

export default function MediaLibraryPage() {
  const { confirm, ConfirmComponent } = useConfirm();
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [kindFilter, setKindFilter] = useState<string>("ALL");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedAssetForEdit, setSelectedAssetForEdit] = useState<MediaAsset | null>(null);
  const [editAlt, setEditAlt] = useState("");
  const [editCaption, setEditCaption] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    loadAssets();
  }, [kindFilter]);

  const loadAssets = async () => {
    setLoading(true);
    try {
      const query = kindFilter !== "ALL" ? `?kind=${kindFilter}` : "";
      const data = await adminFetch(`/admin/media${query}`);
      setAssets(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Failed to load media assets.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    toast.success("CDN URL copied to clipboard.");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (asset: MediaAsset) => {
    const isUsed = (asset.usageCount || 0) > 0;

    const isConfirmed = await confirm({
      title: `Delete "${asset.originalName}"?`,
      description: isUsed
        ? `This media asset is currently used in ${asset.usageCount} place(s) on the website. Deleting it will create a broken link on public pages!`
        : "You can restore this asset from Trash within 30 days.",
      confirmLabel: isUsed ? "Force Delete" : "Move to Trash",
      variant: "danger",
      highRisk: isUsed,
      confirmMatchText: isUsed ? "DELETE" : undefined,
    });

    if (!isConfirmed) return;


    try {
      await adminFetch(`/admin/media/${asset.id}?force=${isUsed ? "true" : "false"}`, {
        method: "DELETE",
      });
      setAssets((prev) => prev.filter((a) => a.id !== asset.id));
      toast.success("Media asset moved to Trash.");
    } catch (err: any) {
      toast.error(err.message || "Failed to delete asset.");
    }
  };

  const handleSaveMetadata = async () => {
    if (!selectedAssetForEdit) return;
    try {
      const updated = await adminFetch(`/admin/media/${selectedAssetForEdit.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          alt: editAlt,
          caption: editCaption,
        }),
      });
      setAssets((prev) =>
        prev.map((a) => (a.id === selectedAssetForEdit.id ? { ...a, ...updated } : a))
      );
      setSelectedAssetForEdit(null);
      toast.success("Image details saved.");
    } catch {
      toast.error("Failed to update media details.");
    }
  };

  const filteredAssets = assets.filter(
    (a) =>
      a.originalName?.toLowerCase().includes(search.toLowerCase()) ||
      a.alt?.toLowerCase().includes(search.toLowerCase()) ||
      a.caption?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {ConfirmComponent}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gold/30 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-maroon/10 text-maroon">
              <ImageIcon className="w-5 h-5 text-maroon" />
            </span>
            <h1 className="text-2xl font-serif font-bold text-maroon">Media Library</h1>
          </div>
          <p className="text-xs text-ink-muted font-sans">
            Central repository of all photos, icons, and official documents stored in Supabase CDN bucket.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowUploadModal(true)}
          className="px-4 py-2 rounded-xl bg-maroon hover:bg-maroon-dark text-cream text-xs font-serif font-bold flex items-center gap-1.5 shadow-xs shrink-0"
        >
          <Plus className="w-4 h-4 text-gold" />
          <span>Upload New Asset</span>
        </button>
      </div>

      {/* Filters & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-paper p-3 rounded-2xl border border-gold/30">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by filename or alt text..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-cream/40 border border-border focus:border-gold outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          {["ALL", "IMAGE", "DOCUMENT"].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setKindFilter(tab)}
              className={`px-3 py-1.5 rounded-xl text-xs font-serif font-semibold transition-all ${
                kindFilter === tab
                  ? "bg-maroon text-cream shadow-xs"
                  : "bg-sand/30 text-ink-muted hover:text-maroon"
              }`}
            >
              {tab === "ALL" ? "All Files" : tab === "IMAGE" ? "Images" : "Documents"}
            </button>
          ))}
        </div>
      </div>

      {/* Media Grid */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3 text-ink-muted">
          <Loader2 className="w-8 h-8 animate-spin text-saffron" />
          <span className="text-xs font-serif">Loading media assets...</span>
        </div>
      ) : filteredAssets.length === 0 ? (
        <div className="py-20 bg-paper rounded-3xl border border-dashed border-gold/40 text-center space-y-3">
          <ImageIcon className="w-12 h-12 mx-auto text-gold/40" />
          <p className="text-sm font-serif font-bold text-maroon">No media files found</p>
          <p className="text-xs text-ink-muted">Upload brand photos, temple shots, or official certificates.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredAssets.map((asset) => (
            <div
              key={asset.id}
              className="group bg-paper rounded-2xl border border-gold/20 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col"
            >
              {/* Media Thumbnail */}
              <div className="relative aspect-square bg-cream/30 overflow-hidden">
                {asset.kind === "IMAGE" ? (
                  <Image
                    src={asset.url}
                    alt={asset.alt || asset.originalName}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-2 p-4 text-ink-muted">
                    <FileText className="w-10 h-10 text-saffron" />
                    <span className="text-[10px] font-mono text-center truncate max-w-full">
                      {asset.mime}
                    </span>
                  </div>
                )}

                {/* Usages Chip */}
                {asset.usageCount > 0 && (
                  <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded-full text-[9px] font-mono font-bold bg-maroon/90 text-cream backdrop-blur-xs flex items-center gap-1 shadow-xs">
                    <Layers className="w-2.5 h-2.5 text-gold" /> {asset.usageCount} in use
                  </span>
                )}
              </div>

              {/* Information & Action bar */}
              <div className="p-2.5 flex-1 flex flex-col justify-between space-y-2">
                <div>
                  <span className="text-xs font-serif font-bold text-maroon block truncate" title={asset.originalName}>
                    {asset.originalName}
                  </span>
                  <span className="text-[10px] text-ink-muted font-mono block">
                    {(asset.sizeBytes / 1024).toFixed(1)} KB
                  </span>
                </div>

                <div className="flex items-center justify-between border-t border-border/50 pt-1.5">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleCopyUrl(asset.url, asset.id)}
                      title="Copy Public URL"
                      className="p-1 rounded-lg hover:bg-sand/40 text-ink-muted hover:text-maroon"
                    >
                      {copiedId === asset.id ? (
                        <Check className="w-3.5 h-3.5 text-green-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <a
                      href={asset.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="View Full Size"
                      className="p-1 rounded-lg hover:bg-sand/40 text-ink-muted hover:text-maroon"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedAssetForEdit(asset);
                        setEditAlt(asset.alt || "");
                        setEditCaption(asset.caption || "");
                      }}
                      title="Edit Details"
                      className="p-1 rounded-lg hover:bg-sand/40 text-ink-muted hover:text-maroon"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDelete(asset)}
                    title="Delete Asset"
                    className="p-1 rounded-lg hover:bg-red-50 text-ink-muted hover:text-red-700"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-charcoal/50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-paper p-6 rounded-3xl border border-gold/30 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-serif font-bold text-base text-maroon flex items-center gap-1.5">
                <UploadCloud className="w-4 h-4 text-saffron" />
                <span>Upload to Media Library</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="text-ink-muted hover:text-maroon font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <MediaUploader
              value={null}
              onChange={(url) => {
                if (url) {
                  loadAssets();
                  setShowUploadModal(false);
                  toast.success("Asset uploaded successfully!");
                }
              }}
              label="Select or Drag & Drop File"
              helperText="Direct upload to Supabase storage. Supports JPG, PNG, WEBP, PDF up to 10 MB."
            />
          </div>
        </div>
      )}

      {/* Edit Metadata Modal */}
      {selectedAssetForEdit && (
        <div className="fixed inset-0 z-50 bg-charcoal/50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-paper p-6 rounded-3xl border border-gold/30 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-serif font-bold text-base text-maroon">
                Edit Image Details
              </h3>
              <button
                type="button"
                onClick={() => setSelectedAssetForEdit(null)}
                className="text-ink-muted hover:text-maroon font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-serif font-bold text-maroon block">
                  Alt Text (for accessibility & SEO)
                </label>
                <input
                  type="text"
                  value={editAlt}
                  onChange={(e) => setEditAlt(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-cream/40 focus:border-gold outline-none"
                  placeholder="e.g. Ancient carved temple pillar at sunrise"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-serif font-bold text-maroon block">
                  Caption / Description
                </label>
                <textarea
                  rows={2}
                  value={editCaption}
                  onChange={(e) => setEditCaption(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-cream/40 focus:border-gold outline-none"
                  placeholder="Optional display caption"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedAssetForEdit(null)}
                className="px-3 py-1.5 rounded-xl text-xs font-serif text-ink-muted hover:text-maroon"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveMetadata}
                className="px-4 py-1.5 rounded-xl bg-maroon text-cream text-xs font-serif font-bold hover:bg-maroon-dark"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
