"use client";

import React, { useState, useEffect } from "react";
import { adminFetch } from "@/lib/admin-api";
import { Calendar, Plus, Trash2, Edit3 } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function MilestonesAdminPage() {
  const [milestones, setMilestones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingMilestone, setEditingMilestone] = useState<any>(null);

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
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this milestone?")) return;
    try {
      await adminFetch(`/admin/milestones/${id}`, { method: "DELETE" });
      toast.success("Milestone deleted.");
      loadMilestones();
    } catch (err: any) {
      toast.error(err.message || "Delete failed.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-maroon flex items-center gap-2">
            <Calendar className="w-7 h-7 text-maroon" />
            <span>Journey Milestones & Timeline</span>
          </h1>
          <p className="text-xs text-ink-muted">
            The foundation&apos;s key historical milestones shown in the About section mini-timeline.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            setEditingMilestone({
              year: new Date().getFullYear().toString(),
              title: "",
              text: "",
              sort: milestones.length + 1,
            })
          }
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-maroon text-cream font-serif font-bold text-xs shadow-xs"
        >
          <Plus className="w-4 h-4 text-gold" />
          <span>Add Milestone</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {milestones.map((m) => (
          <div
            key={m.id}
            className="rounded-2xl bg-paper p-5 border border-gold/30 shadow-xs flex flex-col justify-between"
          >
            <div>
              <span className="font-serif font-bold text-2xl text-saffron block mb-1">
                {m.year}
              </span>
              <h3 className="font-serif font-bold text-base text-maroon mb-1.5">{m.title}</h3>
              <p className="text-xs text-ink-muted line-clamp-3 leading-relaxed">{m.text}</p>
            </div>

            <div className="pt-3 mt-4 border-t border-border flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingMilestone(m)}
                className="p-1.5 rounded-lg border border-gold/40 text-maroon hover:bg-sand/40"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleDelete(m.id)}
                className="p-1.5 rounded-lg border border-red-200 text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      <Dialog open={Boolean(editingMilestone)} onOpenChange={(open) => !open && setEditingMilestone(null)}>
        <DialogContent className="max-w-md p-6 bg-paper rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-serif text-lg font-bold text-maroon">
              {editingMilestone?.id ? "Edit Milestone" : "Add Journey Milestone"}
            </DialogTitle>
          </DialogHeader>

          {editingMilestone && (
            <form onSubmit={handleSave} className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-maroon mb-1">Year / Era *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 2024"
                    value={editingMilestone.year || ""}
                    onChange={(e) => setEditingMilestone({ ...editingMilestone, year: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-border text-xs font-serif font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-maroon mb-1">Sort Order</label>
                  <input
                    type="number"
                    value={editingMilestone.sort || 0}
                    onChange={(e) => setEditingMilestone({ ...editingMilestone, sort: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl border border-border text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-maroon mb-1">Milestone Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Foundation Trust Inception & First Seva"
                  value={editingMilestone.title || ""}
                  onChange={(e) => setEditingMilestone({ ...editingMilestone, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-border text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-maroon mb-1">Description *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Brief summary of the achievement..."
                  value={editingMilestone.text || ""}
                  onChange={(e) => setEditingMilestone({ ...editingMilestone, text: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-border text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-border">
                <button
                  type="button"
                  onClick={() => setEditingMilestone(null)}
                  className="px-3 py-1.5 text-xs text-ink-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-maroon text-cream font-bold text-xs"
                >
                  Save Milestone
                </button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
