"use client";

import React, { useState, useEffect } from "react";
import { adminFetch } from "@/lib/admin-api";
import { Layers, Plus, Trash2, Edit3, Save } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function SevasAdminPage() {
  const [sevas, setSevas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSeva, setEditingSeva] = useState<any>(null);

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
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this seva area?")) return;
    try {
      await adminFetch(`/admin/sevas/${id}`, { method: "DELETE" });
      toast.success("Seva deleted.");
      loadSevas();
    } catch (err: any) {
      toast.error(err.message || "Delete failed.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-maroon flex items-center gap-2">
            <Layers className="w-7 h-7 text-maroon" />
            <span>Sevas & Charitable Focus Areas</span>
          </h1>
          <p className="text-xs text-ink-muted">
            The causes displayed on the website and donation dropdowns.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            setEditingSeva({
              titleEn: "",
              titleHi: "",
              description: "",
              suggestedAmounts: [501, 1100, 2100, 5100],
              sort: sevas.length + 1,
              active: true,
            })
          }
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-maroon text-cream font-serif font-bold text-xs shadow-xs"
        >
          <Plus className="w-4 h-4 text-gold" />
          <span>Add New Seva</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {sevas.map((s) => (
          <div
            key={s.id}
            className="rounded-2xl bg-paper p-5 border border-gold/30 shadow-xs flex flex-col justify-between"
          >
            <div>
              <span className="font-serif font-bold text-base text-maroon block">
                {s.titleEn}
              </span>
              {s.titleHi && (
                <span className="font-hindi text-xs text-saffron-deep block mt-0.5">
                  {s.titleHi}
                </span>
              )}
              <p className="text-xs text-ink-muted line-clamp-3 mt-2 font-sans">
                {s.description}
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-border flex items-center justify-between text-xs">
              <span className="font-mono text-ink-muted">Order: {s.sort}</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setEditingSeva(s)}
                  className="p-1.5 rounded-lg border border-gold/40 text-maroon hover:bg-sand/40"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(s.id)}
                  className="p-1.5 rounded-lg border border-red-200 text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      <Dialog open={Boolean(editingSeva)} onOpenChange={(open) => !open && setEditingSeva(null)}>
        <DialogContent className="max-w-md p-6 bg-paper rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-serif text-lg font-bold text-maroon">
              {editingSeva?.id ? "Edit Seva Cause" : "Create New Seva"}
            </DialogTitle>
          </DialogHeader>

          {editingSeva && (
            <form onSubmit={handleSave} className="space-y-4 py-2">
              <div>
                <label className="block text-xs font-bold text-maroon mb-1">Title (English) *</label>
                <input
                  type="text"
                  required
                  value={editingSeva.titleEn || ""}
                  onChange={(e) => setEditingSeva({ ...editingSeva, titleEn: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-border text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-maroon mb-1">Title (Hindi)</label>
                <input
                  type="text"
                  value={editingSeva.titleHi || ""}
                  onChange={(e) => setEditingSeva({ ...editingSeva, titleHi: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-border text-xs font-hindi"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-maroon mb-1">Description *</label>
                <textarea
                  rows={3}
                  required
                  value={editingSeva.description || ""}
                  onChange={(e) => setEditingSeva({ ...editingSeva, description: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-border text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-maroon mb-1">Sort Order</label>
                  <input
                    type="number"
                    value={editingSeva.sort || 0}
                    onChange={(e) => setEditingSeva({ ...editingSeva, sort: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl border border-border text-xs font-mono"
                  />
                </div>
                <div className="flex items-end pb-2">
                  <label className="flex items-center gap-2 cursor-pointer text-xs">
                    <input
                      type="checkbox"
                      checked={editingSeva.active !== false}
                      onChange={(e) => setEditingSeva({ ...editingSeva, active: e.target.checked })}
                    />
                    <span className="font-bold text-maroon">Active on site</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-border">
                <button
                  type="button"
                  onClick={() => setEditingSeva(null)}
                  className="px-3 py-1.5 text-xs text-ink-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-maroon text-cream font-bold text-xs"
                >
                  Save Seva
                </button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
