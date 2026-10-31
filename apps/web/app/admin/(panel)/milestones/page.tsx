"use client";

import React, { useState, useEffect } from "react";
import { adminFetch } from "@/lib/admin-api";
import { Calendar, Plus, Trash2, Edit3, History, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useConfirm } from "@/components/admin/ui/ConfirmDialog";

export default function MilestonesAdminPage() {
  const [milestones, setMilestones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingMilestone, setEditingMilestone] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const { confirm, ConfirmComponent } = useConfirm();

  const loadMilestones = async () => {
    setLoading(true);
    try {
      const data = await adminFetch("/admin/milestones");
      setMilestones(data || []);
    } catch (err: any) {
      toast.error(err.message || "Failed to load milestones.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMilestones();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingMilestone.id) {
        await adminFetch(`/admin/milestones/${editingMilestone.id}`, {
          method: "PUT",
          body: JSON.stringify(editingMilestone),
        });
        toast.success("Milestone updated.");
      } else {
        await adminFetch("/admin/milestones", {
          method: "POST",
          body: JSON.stringify(editingMilestone),
        });
        toast.success("New milestone created.");
      }
      setEditingMilestone(null);
      loadMilestones();
    } catch (err: any) {
      toast.error(err.message || "Failed to save milestone.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (milestone: any) => {
    const isConfirmed = await confirm({
      title: "Delete Milestone?",
      description: `Are you sure you want to delete the ${milestone.year} milestone "${milestone.title}"?`,
      consequenceText: "This event will be removed from the public foundation timeline immediately.",
      itemName: `${milestone.year} — ${milestone.title}`,
      confirmLabel: "Delete Milestone",
      variant: "danger",
    });

    if (!isConfirmed) return;

    try {
      await adminFetch(`/admin/milestones/${milestone.id}`, { method: "DELETE" });
      toast.success("Milestone deleted.");
      loadMilestones();
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
            <Calendar className="w-7 h-7 text-maroon" />
            <span>Journey Milestones & Timeline</span>
          </h1>
          <p className="text-xs text-ink/70 mt-1">
            The foundation&apos;s key historical milestones shown in the About section timeline.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            setEditingMilestone({
              year: new Date().getFullYear().toString(),
              title: "",
              text: "",
              sortOrder: milestones.length + 1,
            })
          }
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-maroon hover:bg-maroon-deep text-cream font-serif font-bold text-xs shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4 text-gold" />
          <span>Add Milestone</span>
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-44 rounded-2xl bg-sand/30 animate-pulse border border-sand" />
          ))}
        </div>
      ) : milestones.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-sand p-12 text-center bg-paper">
          <History className="w-12 h-12 text-ink/30 mx-auto mb-3" />
          <h3 className="font-serif font-bold text-base text-ink">No timeline milestones added yet</h3>
          <p className="text-xs text-ink/60 mt-1 mb-4">
            Document key foundation events like trust registration, first Dhopap Aarti, or Gau Seva initiation.
          </p>
          <button
            type="button"
            onClick={() =>
              setEditingMilestone({
                year: "2024",
                title: "",
                text: "",
                sortOrder: 1,
              })
            }
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-maroon text-cream text-xs font-semibold"
          >
            <Plus className="w-3.5 h-3.5 text-gold" />
            Add First Milestone
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {milestones.map((m) => (
            <div
              key={m.id}
              className="rounded-2xl bg-paper p-5 border border-sand hover:border-gold/50 shadow-xs transition-all flex flex-col justify-between"
            >
              <div>
                <span className="font-serif font-bold text-2xl text-saffron block mb-1">
                  {m.year}
                </span>
                <h3 className="font-serif font-bold text-base text-maroon mb-1.5">{m.title}</h3>
                <p className="text-xs text-ink/70 line-clamp-3 leading-relaxed">{m.text}</p>
              </div>

              <div className="pt-3 mt-4 border-t border-sand/70 flex items-center justify-between">
                <span className="text-[11px] font-mono text-ink/50">Sort: {m.sortOrder ?? m.sort ?? 0}</span>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setEditingMilestone(m)}
                    className="p-1.5 rounded-lg border border-sand text-maroon hover:bg-sand/40 transition-colors"
                    title="Edit"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(m)}
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
      <Dialog open={Boolean(editingMilestone)} onOpenChange={(open) => !open && setEditingMilestone(null)}>
        <DialogContent className="max-w-md p-6 bg-paper rounded-2xl border border-sand shadow-2xl">
          <DialogHeader>
            <DialogTitle className="font-serif text-lg font-bold text-maroon flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-gold" />
              <span>{editingMilestone?.id ? "Edit Milestone" : "Add Journey Milestone"}</span>
            </DialogTitle>
          </DialogHeader>

          {editingMilestone && (
            <form onSubmit={handleSave} className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-ink mb-1.5">Year / Era *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 2024"
                    value={editingMilestone.year || ""}
                    onChange={(e) => setEditingMilestone({ ...editingMilestone, year: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-sand bg-paper text-xs font-serif font-bold text-ink focus:border-gold focus:outline-hidden focus:ring-1 focus:ring-gold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-ink mb-1.5">Sort Order</label>
                  <input
                    type="number"
                    value={editingMilestone.sortOrder ?? editingMilestone.sort ?? 0}
                    onChange={(e) =>
                      setEditingMilestone({
                        ...editingMilestone,
                        sortOrder: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-sand bg-paper text-xs font-mono text-ink"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink mb-1.5">Title / Milestone Event *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dhopap Ghat Heritage Restoration Initiative"
                  value={editingMilestone.title || ""}
                  onChange={(e) => setEditingMilestone({ ...editingMilestone, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-sand bg-paper text-xs text-ink focus:border-gold focus:outline-hidden focus:ring-1 focus:ring-gold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink mb-1.5">Description *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Brief description of the milestone and its historical/spiritual significance..."
                  value={editingMilestone.text || ""}
                  onChange={(e) => setEditingMilestone({ ...editingMilestone, text: e.target.value })}
                  className="w-full p-3 rounded-xl border border-sand bg-paper text-xs text-ink focus:border-gold focus:outline-hidden focus:ring-1 focus:ring-gold leading-relaxed"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-4 border-t border-sand">
                <button
                  type="button"
                  onClick={() => setEditingMilestone(null)}
                  className="rounded-xl border border-sand bg-white px-4 py-2 text-xs font-medium text-ink hover:bg-sand/30 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-maroon hover:bg-maroon-deep px-5 py-2 text-xs font-bold text-cream shadow-xs transition-colors disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Milestone"}
                </button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
