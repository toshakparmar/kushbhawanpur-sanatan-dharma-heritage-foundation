"use client";

import React, { useState, useEffect } from "react";
import { adminFetch } from "@/lib/admin-api";
import { Video as VideoIcon, Plus, Trash2, Edit3, Play, Star, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select } from "@/components/admin/ui/Select";
import { MediaUploader } from "@/components/admin/ui/MediaUploader";
import { useConfirm } from "@/components/admin/ui/ConfirmDialog";

const CATEGORY_OPTIONS = [
  { value: "Heritage", label: "Heritage & History" },
  { value: "Seva", label: "Seva & Community Work" },
  { value: "Documentary", label: "Documentary & Research" },
  { value: "Events", label: "Events & Festivals" },
  { value: "Bhajan", label: "Vedic Chants & Bhajans" },
];

export default function VideosAdminPage() {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingVideo, setEditingVideo] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const { confirm, ConfirmComponent } = useConfirm();

  const loadVideos = async () => {
    setLoading(true);
    try {
      const data = await adminFetch("/admin/videos");
      setVideos(data || []);
    } catch (err: any) {
      toast.error(err.message || "Failed to load videos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVideos();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingVideo.id) {
        await adminFetch(`/admin/videos/${editingVideo.id}`, {
          method: "PUT",
          body: JSON.stringify(editingVideo),
        });
        toast.success("Video updated.");
      } else {
        await adminFetch("/admin/videos", {
          method: "POST",
          body: JSON.stringify(editingVideo),
        });
        toast.success("New video added to CMS.");
      }
      setEditingVideo(null);
      loadVideos();
    } catch (err: any) {
      toast.error(err.message || "Failed to save video.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (video: any) => {
    const isConfirmed = await confirm({
      title: "Delete Video?",
      description: `Are you sure you want to remove "${video.title}"?`,
      consequenceText: "This video will be removed from the public website gallery.",
      itemName: video.title,
      itemThumbnail: video.thumbUrl,
      confirmLabel: "Delete Video",
      variant: "danger",
    });

    if (!isConfirmed) return;

    try {
      await adminFetch(`/admin/videos/${video.id}`, { method: "DELETE" });
      toast.success("Video deleted.");
      loadVideos();
    } catch (err: any) {
      toast.error(err.message || "Delete failed.");
    }
  };

  return (
    <div className="space-y-6">
      {ConfirmComponent}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-maroon flex items-center gap-2.5">
            <VideoIcon className="w-7 h-7 text-maroon" />
            <span>Video Content Management</span>
          </h1>
          <p className="text-xs text-ink/70 mt-1">
            Add YouTube, Vimeo, Facebook, Google Drive, or MP4 links. URLs are safely parsed into lite embeds without raw iframes.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            setEditingVideo({
              title: "",
              sourceUrl: "",
              category: "Heritage",
              featured: false,
              sortOrder: videos.length + 1,
              published: true,
            })
          }
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-maroon hover:bg-maroon-deep text-cream font-serif font-bold text-xs shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4 text-gold" />
          <span>Add Video</span>
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 rounded-2xl bg-sand/30 animate-pulse border border-sand" />
          ))}
        </div>
      ) : videos.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-sand p-12 text-center bg-paper">
          <VideoIcon className="w-12 h-12 text-ink/30 mx-auto mb-3" />
          <h3 className="font-serif font-bold text-base text-ink">No videos added yet</h3>
          <p className="text-xs text-ink/60 mt-1 mb-4">
            Add YouTube links of Vedic lectures, Dhopap Ghat documentaries, and seva activities.
          </p>
          <button
            type="button"
            onClick={() =>
              setEditingVideo({
                title: "",
                sourceUrl: "",
                category: "Heritage",
                featured: true,
                sortOrder: 1,
                published: true,
              })
            }
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-maroon text-cream text-xs font-semibold"
          >
            <Plus className="w-3.5 h-3.5 text-gold" />
            Add First Video
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {videos.map((v) => (
            <div
              key={v.id}
              className={`rounded-2xl bg-paper p-4 border transition-all flex flex-col justify-between ${
                v.featured ? "border-gold ring-1 ring-gold shadow-md" : "border-sand hover:border-gold/40 shadow-xs"
              }`}
            >
              <div>
                <div className="relative aspect-video rounded-xl overflow-hidden bg-sand/40 border border-sand mb-3 group">
                  {v.thumbUrl ? (
                    <img src={v.thumbUrl} alt={v.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-ink/40">
                      <Play className="w-8 h-8" />
                    </div>
                  )}

                  {v.featured && (
                    <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-maroon text-gold flex items-center gap-1 shadow-sm">
                      <Star className="w-3 h-3 fill-gold" />
                      Featured Hero
                    </span>
                  )}

                  <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded text-[10px] font-mono bg-black/70 text-white">
                    {v.provider}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-ink/50 mb-1">
                  <span className="font-semibold text-saffron-deep">{v.category}</span>
                  <span className="font-mono">Sort: {v.sortOrder ?? v.sort ?? 0}</span>
                </div>

                <h3 className="font-serif font-bold text-sm text-maroon line-clamp-2 leading-snug">
                  {v.title}
                </h3>
              </div>

              <div className="pt-3 mt-3 border-t border-sand/70 flex items-center justify-between">
                <span className="text-[11px] text-ink/60">
                  {v.published !== false ? "✓ Published" : "Hidden"}
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setEditingVideo(v)}
                    className="p-1.5 rounded-lg border border-sand text-maroon hover:bg-sand/40 transition-colors"
                    title="Edit"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(v)}
                    className="p-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit / Add Modal */}
      <Dialog open={Boolean(editingVideo)} onOpenChange={(open) => !open && setEditingVideo(null)}>
        <DialogContent className="max-w-lg p-6 bg-paper rounded-2xl max-h-[92vh] overflow-y-auto border border-sand shadow-2xl">
          <DialogHeader>
            <DialogTitle className="font-serif text-lg font-bold text-maroon flex items-center gap-2">
              <VideoIcon className="w-5 h-5 text-gold" />
              <span>{editingVideo?.id ? "Edit Video" : "Add Video"}</span>
            </DialogTitle>
          </DialogHeader>

          {editingVideo && (
            <form onSubmit={handleSave} className="space-y-4 py-2">
              <div>
                <label className="block text-xs font-semibold text-ink mb-1.5">
                  Video Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sacred Aarti at Dhopap Ghat — Kushbhawanpur"
                  value={editingVideo.title || ""}
                  onChange={(e) => setEditingVideo({ ...editingVideo, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-sand bg-paper text-xs text-ink focus:border-gold focus:outline-hidden focus:ring-1 focus:ring-gold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink mb-1.5">
                  Video URL (YouTube, Vimeo, Facebook, Google Drive, or MP4) *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={editingVideo.sourceUrl || ""}
                  onChange={(e) => setEditingVideo({ ...editingVideo, sourceUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-sand bg-paper text-xs font-mono text-ink focus:border-gold focus:outline-hidden focus:ring-1 focus:ring-gold"
                />
                <span className="text-[11px] text-ink/50 mt-1 block">
                  YouTube video ID and thumbnail are automatically detected from the link.
                </span>
              </div>

              {/* Custom Thumbnail Uploader */}
              <div>
                <MediaUploader
                  label="Custom Thumbnail (Optional)"
                  helperText="Upload a custom 16:9 thumbnail if you wish to override the video provider's default thumbnail."
                  aspectRatio={16 / 9}
                  value={editingVideo.thumbUrl}
                  onChange={(url) => setEditingVideo({ ...editingVideo, thumbUrl: url })}
                  onRemove={() => setEditingVideo({ ...editingVideo, thumbUrl: "" })}
                />
              </div>

              {/* Category Combobox */}
              <div>
                <label className="block text-xs font-semibold text-ink mb-1.5">Category</label>
                <Select
                  value={editingVideo.category}
                  onChange={(val) => setEditingVideo({ ...editingVideo, category: val })}
                  options={CATEGORY_OPTIONS}
                  searchable={false}
                />
              </div>

              {/* Sort Order */}
              <div>
                <label className="block text-xs font-semibold text-ink mb-1.5">Sort Order</label>
                <input
                  type="number"
                  value={editingVideo.sortOrder ?? editingVideo.sort ?? 0}
                  onChange={(e) =>
                    setEditingVideo({
                      ...editingVideo,
                      sortOrder: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-sand bg-paper text-xs font-mono text-ink"
                />
              </div>

              {/* Featured & Published */}
              <div className="space-y-2.5 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={Boolean(editingVideo.featured)}
                    onChange={(e) => setEditingVideo({ ...editingVideo, featured: e.target.checked })}
                    className="rounded border-sand text-maroon focus:ring-gold h-4 w-4"
                  />
                  <span className="font-semibold text-ink">Make this the Featured Hero Video in large player</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={editingVideo.published !== false}
                    onChange={(e) => setEditingVideo({ ...editingVideo, published: e.target.checked })}
                    className="rounded border-sand text-maroon focus:ring-gold h-4 w-4"
                  />
                  <span className="font-semibold text-ink">Published on public site</span>
                </label>
              </div>

              {/* Actions */}
              <div className="mt-6 flex items-center justify-end gap-2.5 pt-4 border-t border-sand">
                <button
                  type="button"
                  onClick={() => setEditingVideo(null)}
                  className="rounded-xl border border-sand bg-white px-4 py-2 text-xs font-medium text-ink hover:bg-sand/30 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-maroon hover:bg-maroon-deep px-5 py-2 text-xs font-bold text-cream shadow-xs transition-colors disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Video"}
                </button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
