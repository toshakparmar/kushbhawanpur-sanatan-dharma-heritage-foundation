"use client";

import React, { useState, useEffect } from "react";
import { adminFetch } from "@/lib/admin-api";
import { Layers, Plus, Trash2, Edit3, HeartHandshake, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MediaUploader } from "@/components/admin/ui/MediaUploader";
import { useConfirm } from "@/components/admin/ui/ConfirmDialog";

export default function SevasAdminPage() {
  const [sevas, setSevas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSeva, setEditingSeva] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const { confirm, ConfirmComponent } = useConfirm();

  const loadSevas = async () => {
    setLoading(true);
    try {
      const data = await adminFetch("/admin/sevas");
      setSevas(data || []);
    } catch (err: any) {
      toast.error(err.message || "Failed to load sevas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSevas();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingSeva.id && sevas.some((s) => s.id === editingSeva.id)) {
        await adminFetch(`/admin/sevas/${editingSeva.id}`, {
          method: "PUT",
          body: JSON.stringify(editingSeva),
        });
        toast.success("Seva updated.");
      } else {
        await adminFetch("/admin/sevas", {
          method: "POST",
          body: JSON.stringify(editingSeva),
        });
        toast.success("New seva cause created.");
      }
      setEditingSeva(null);
      loadSevas();
    } catch (err: any) {
      toast.error(err.message || "Failed to save seva.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (seva: any) => {
    const isConfirmed = await confirm({
      title: "Delete Seva Cause?",
      description: `Are you sure you want to delete "${seva.titleEn}"?`,
      consequenceText: "HIGH RISK: Deleting this cause will remove it from the donation selection and impact areas. Donors will not be able to direct gifts toward this seva.",
      itemName: seva.titleEn,
      itemThumbnail: seva.imageUrl,
      highRisk: true,
      confirmMatchText: "DELETE",
      confirmLabel: "Delete Seva",
      variant: "danger",
    });

    if (!isConfirmed) return;

    try {
      await adminFetch(`/admin/sevas/${seva.id}`, { method: "DELETE" });
      toast.success("Seva deleted.");
      loadSevas();
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
            <Layers className="w-7 h-7 text-maroon" />
            <span>Sevas & Charitable Focus Areas</span>
          </h1>
          <p className="text-xs text-ink/70 mt-1">
            The causes displayed on the website, impact calculators, and donation dropdowns.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            setEditingSeva({
              titleEn: "",
              titleHi: "",
              description: "",
              imageUrl: "",
              suggestedAmounts: [501, 1100, 2100, 5100],
              sortOrder: sevas.length + 1,
              active: true,
            })
          }
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-maroon hover:bg-maroon-deep text-cream font-serif font-bold text-xs shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4 text-gold" />
          <span>Add Seva</span>
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 rounded-2xl bg-sand/30 animate-pulse border border-sand" />
          ))}
        </div>
      ) : sevas.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-sand p-12 text-center bg-paper">
          <Layers className="w-12 h-12 text-ink/30 mx-auto mb-3" />
          <h3 className="font-serif font-bold text-base text-ink">No sevas configured yet</h3>
          <p className="text-xs text-ink/60 mt-1 mb-4">
            Add sacred causes like Dhopap Ghat Aarti, Gau Seva, and Vedic Manuscript Preservation.
          </p>
          <button
            type="button"
            onClick={() =>
              setEditingSeva({
                titleEn: "",
                titleHi: "",
                description: "",
                imageUrl: "",
                suggestedAmounts: [501, 1100, 2100, 5100],
                sortOrder: 1,
                active: true,
              })
            }
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-maroon text-cream text-xs font-semibold"
          >
            <Plus className="w-3.5 h-3.5 text-gold" />
            Add First Seva
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {sevas.map((s) => (
            <div
              key={s.id}
              className="rounded-2xl bg-paper p-5 border border-sand hover:border-gold/50 shadow-xs transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-saffron/10 text-saffron-deep uppercase tracking-wider">
                    {s.slug || "Seva"}
                  </span>
                  <span className="text-[11px] font-mono text-ink/50">Sort: {s.sortOrder ?? s.sort ?? 0}</span>
                </div>

                {s.imageUrl && (
                  <div className="aspect-video w-full rounded-xl overflow-hidden bg-sand/30 border border-sand mb-3">
                    <img src={s.imageUrl} alt={s.titleEn} className="w-full h-full object-cover" />
                  </div>
                )}

                <h3 className="font-serif font-bold text-base text-maroon leading-tight truncate">
                  {s.titleEn}
                </h3>
                {s.titleHi && <p className="font-hindi text-xs text-ink/70 mt-0.5">{s.titleHi}</p>}
                <p className="text-xs text-ink/70 line-clamp-2 mt-2 leading-relaxed">{s.description}</p>
              </div>

              <div className="pt-3 mt-4 border-t border-sand/70 flex items-center justify-between">
                <span className="inline-flex items-center gap-1 text-[11px] text-ink/60">
                  <CheckCircle2 className={`w-3.5 h-3.5 ${s.active !== false ? "text-banyan" : "text-ink/30"}`} />
                  {s.active !== false ? "Active on site" : "Draft"}
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setEditingSeva(s)}
                    className="p-1.5 rounded-lg border border-sand text-maroon hover:bg-sand/40 transition-colors"
                    title="Edit"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(s)}
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
      <Dialog open={Boolean(editingSeva)} onOpenChange={(open) => !open && setEditingSeva(null)}>
        <DialogContent className="max-w-lg p-6 bg-paper rounded-2xl max-h-[92vh] overflow-y-auto border border-sand shadow-2xl">
          <DialogHeader>
            <DialogTitle className="font-serif text-lg font-bold text-maroon flex items-center gap-2">
              <HeartHandshake className="w-5 h-5 text-gold" />
              <span>{editingSeva?.id ? "Edit Seva Cause" : "Add Seva Cause"}</span>
            </DialogTitle>
          </DialogHeader>

          {editingSeva && (
            <form onSubmit={handleSave} className="space-y-4 py-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-ink mb-1.5">
                    Title (English) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Daily Ganga-Gomti Aarti"
                    value={editingSeva.titleEn || ""}
                    onChange={(e) => setEditingSeva({ ...editingSeva, titleEn: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-sand bg-paper text-xs text-ink focus:border-gold focus:outline-hidden focus:ring-1 focus:ring-gold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink mb-1.5">
                    Title (Hindi)
                  </label>
                  <input
                    type="text"
                    placeholder="उदा. नित्य गंगा-गोमती महाआरती"
                    value={editingSeva.titleHi || ""}
                    onChange={(e) => setEditingSeva({ ...editingSeva, titleHi: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-sand bg-paper text-xs text-ink font-hindi focus:border-gold focus:outline-hidden focus:ring-1 focus:ring-gold"
                  />
                </div>
              </div>

              {/* Cover Image via MediaUploader */}
              <div>
                <MediaUploader
                  label="Seva Cover Photo"
                  helperText="Upload high quality 16:9 photo. Direct upload to Supabase storage bucket."
                  aspectRatio={16 / 9}
                  allowCrop={true}
                  value={editingSeva.imageUrl}
                  onChange={(url) => setEditingSeva({ ...editingSeva, imageUrl: url })}
                  onRemove={() => setEditingSeva({ ...editingSeva, imageUrl: "" })}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink mb-1.5">
                  Description *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Detail the spiritual, cultural, or ecological impact of this seva..."
                  value={editingSeva.description || ""}
                  onChange={(e) => setEditingSeva({ ...editingSeva, description: e.target.value })}
                  className="w-full p-3 rounded-xl border border-sand bg-paper text-xs text-ink focus:border-gold focus:outline-hidden focus:ring-1 focus:ring-gold leading-relaxed"
                />
              </div>

              {/* Sort Order & Active */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-ink mb-1.5">Sort Order</label>
                  <input
                    type="number"
                    value={editingSeva.sortOrder ?? editingSeva.sort ?? 0}
                    onChange={(e) =>
                      setEditingSeva({
                        ...editingSeva,
                        sortOrder: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-sand bg-paper text-xs font-mono text-ink"
                  />
                </div>

                <div className="flex items-center pt-6">
                  <label className="flex items-center gap-2 cursor-pointer text-xs">
                    <input
                      type="checkbox"
                      checked={editingSeva.active !== false}
                      onChange={(e) =>
                        setEditingSeva({ ...editingSeva, active: e.target.checked })
                      }
                      className="rounded border-sand text-maroon focus:ring-gold h-4 w-4"
                    />
                    <span className="font-semibold text-ink">Active on site</span>
                  </label>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 flex items-center justify-end gap-2.5 pt-4 border-t border-sand">
                <button
                  type="button"
                  onClick={() => setEditingSeva(null)}
                  className="rounded-xl border border-sand bg-white px-4 py-2 text-xs font-medium text-ink hover:bg-sand/30 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-maroon hover:bg-maroon-deep px-5 py-2 text-xs font-bold text-cream shadow-xs transition-colors disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Seva"}
                </button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
