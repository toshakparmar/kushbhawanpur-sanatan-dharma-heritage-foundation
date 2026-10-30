"use client";

import React, { useState, useEffect } from "react";
import { adminFetch } from "@/lib/admin-api";
import { Video, Plus, Trash2, Edit3, Play, Star, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function VideosAdminPage() {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingVideo, setEditingVideo] = useState<any>(null);

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
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this video?")) return;
    try {
      await adminFetch(`/admin/videos/${id}`, { method: "DELETE" });
      toast.success("Video deleted.");
      loadVideos();
    } catch (err: any) {
      toast.error(err.message || "Delete failed.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-maroon flex items-center gap-2">
            <Video className="w-7 h-7 text-maroon" />
            <span>Video Content Management</span>
          </h1>
          <p className="text-xs text-ink-muted">
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
              featured: videos.length === 0,
              sort: videos.length + 1,
              published: true,
            })
          }
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-maroon text-cream font-serif font-bold text-xs shadow-xs"
        >
          <Plus className="w-4 h-4 text-gold" />
          <span>Add Video</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {videos.map((v) => (
          <div
            key={v.id}
            className="rounded-2xl bg-paper p-4 border border-gold/30 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-sand/30 mb-3 flex items-center justify-center">
                {v.thumbnailUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={v.thumbnailUrl} alt={v.title} className="w-full h-full object-cover" />
                ) : (
                  <Play className="w-8 h-8 text-gold" />
                )}
                {v.featured && (
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-saffron text-white text-[10px] font-bold flex items-center gap-1">
                    <Star className="w-3 h-3 fill-current" />
                    Featured
                  </span>
                )}
                <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-charcoal/80 text-cream text-[10px] font-mono">
                  {v.provider}
                </span>
              </div>

              <span className="text-[10px] uppercase font-bold text-saffron-deep block">
                {v.category || "General"}
              </span>
              <h3 className="font-serif font-bold text-sm text-maroon mt-0.5 line-clamp-2">
                {v.title}
              </h3>
            </div>

            <div className="pt-3 mt-3 border-t border-border flex items-center justify-between text-xs">
              <span className={`text-[10px] font-bold ${v.published ? "text-green-700" : "text-ink-muted"}`}>
                {v.published ? "Published" : "Draft"}
              </span>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditingVideo(v)}
                  className="p-1.5 rounded-lg border border-gold/40 text-maroon hover:bg-sand/40"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(v.id)}
                  className="p-1.5 rounded-lg border border-red-200 text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Video Modal */}
      <Dialog open={Boolean(editingVideo)} onOpenChange={(open) => !open && setEditingVideo(null)}>
        <DialogContent className="max-w-md p-6 bg-paper rounded-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif text-lg font-bold text-maroon">
              {editingVideo?.id ? "Edit Video" : "Add Video Link"}
            </DialogTitle>
          </DialogHeader>

          {editingVideo && (
            <form onSubmit={handleSave} className="space-y-4 py-2">
              <div>
                <label className="block text-xs font-bold text-maroon mb-1">Video Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sacred Dhopap Dham Teertha Aarti & History"
                  value={editingVideo.title || ""}
                  onChange={(e) => setEditingVideo({ ...editingVideo, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-border text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-maroon mb-1">
                  Video URL (YouTube, Vimeo, Facebook, Google Drive, or MP4) *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={editingVideo.sourceUrl || ""}
                  onChange={(e) => setEditingVideo({ ...editingVideo, sourceUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-border text-xs font-mono"
                />
                <span className="text-[11px] text-ink-muted">
                  The backend automatically detects the provider, thumbnail, and creates a clean lite embed.
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-maroon mb-1">Category</label>
                  <input
                    type="text"
                    placeholder="e.g. Heritage, Seva, Events"
                    value={editingVideo.category || ""}
                    onChange={(e) => setEditingVideo({ ...editingVideo, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-border text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-maroon mb-1">Sort Order</label>
                  <input
                    type="number"
                    value={editingVideo.sort || 0}
                    onChange={(e) => setEditingVideo({ ...editingVideo, sort: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl border border-border text-xs font-mono"
                  />
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={Boolean(editingVideo.featured)}
                    onChange={(e) => setEditingVideo({ ...editingVideo, featured: e.target.checked })}
                  />
                  <span className="font-bold text-maroon">Make this the Featured Video in large player</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={editingVideo.published !== false}
                    onChange={(e) => setEditingVideo({ ...editingVideo, published: e.target.checked })}
                  />
                  <span className="font-bold text-maroon">Published on public site</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-border">
                <button
                  type="button"
                  onClick={() => setEditingVideo(null)}
                  className="px-3 py-1.5 text-xs text-ink-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-maroon text-cream font-bold text-xs"
                >
                  Save Video
                </button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
