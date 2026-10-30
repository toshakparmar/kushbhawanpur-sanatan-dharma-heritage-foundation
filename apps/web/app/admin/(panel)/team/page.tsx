"use client";

import React, { useState, useEffect } from "react";
import { adminFetch } from "@/lib/admin-api";
import { Users2, Plus, Trash2, Edit3, ShieldCheck, CheckCircle2, Upload } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function TeamAdminPage() {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingMember, setEditingMember] = useState<any>(null);

  const loadTeam = async () => {
    setLoading(true);
    try {
      const data = await adminFetch("/admin/team");
      setMembers(data || []);
    } catch (err: any) {
      toast.error(err.message || "Failed to load team.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeam();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingMember.id) {
        await adminFetch(`/admin/team/${editingMember.id}`, {
          method: "PUT",
          body: JSON.stringify(editingMember),
        });
        toast.success("Team member updated.");
      } else {
        await adminFetch("/admin/team", {
          method: "POST",
          body: JSON.stringify(editingMember),
        });
        toast.success("New team member added.");
      }
      setEditingMember(null);
      loadTeam();
    } catch (err: any) {
      toast.error(err.message || "Failed to save team member.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this team member?")) return;
    try {
      await adminFetch(`/admin/team/${id}`, { method: "DELETE" });
      toast.success("Team member deleted.");
      loadTeam();
    } catch (err: any) {
      toast.error(err.message || "Delete failed.");
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/media/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message || "Upload failed");
      const url = json.data?.url || json.url;
      setEditingMember((prev: any) => ({ ...prev, photoUrl: url }));
      toast.success("Portrait photo uploaded!");
    } catch (err: any) {
      toast.error(err.message || "Upload failed.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-maroon flex items-center gap-2">
            <Users2 className="w-7 h-7 text-maroon" />
            <span>Leadership & Volunteers</span>
          </h1>
          <p className="text-xs text-ink-muted">
            Founders, co-founders, trustees, and active seva volunteers. The public section auto-hides if empty.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            setEditingMember({
              type: "FOUNDER",
              nameEn: "",
              nameHi: "",
              designation: "",
              bio: "",
              sort: members.length + 1,
              active: true,
            })
          }
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-maroon text-cream font-serif font-bold text-xs shadow-xs"
        >
          <Plus className="w-4 h-4 text-gold" />
          <span>Add Member</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {members.map((m) => (
          <div
            key={m.id}
            className="rounded-2xl bg-paper p-5 border border-gold/30 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-saffron/10 text-saffron-deep uppercase">
                  {m.type}
                </span>
                <span className="text-[11px] font-mono text-ink-muted">Sort: {m.sort}</span>
              </div>
              <h3 className="font-serif font-bold text-base text-maroon">{m.nameEn}</h3>
              {m.nameHi && <p className="font-hindi text-xs text-ink-muted">{m.nameHi}</p>}
              <p className="text-xs text-saffron-deep font-medium mt-1">{m.designation}</p>
              {m.bio && <p className="text-xs text-ink-muted line-clamp-2 mt-2">&ldquo;{m.bio}&rdquo;</p>}
            </div>

            <div className="pt-3 mt-4 border-t border-border flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingMember(m)}
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
      <Dialog open={Boolean(editingMember)} onOpenChange={(open) => !open && setEditingMember(null)}>
        <DialogContent className="max-w-md p-6 bg-paper rounded-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif text-lg font-bold text-maroon">
              {editingMember?.id ? "Edit Team Member" : "Add Team Member"}
            </DialogTitle>
          </DialogHeader>

          {editingMember && (
            <form onSubmit={handleSave} className="space-y-4 py-2">
              <div>
                <label className="block text-xs font-bold text-maroon mb-1">Role / Card Type *</label>
                <select
                  value={editingMember.type}
                  onChange={(e) => setEditingMember({ ...editingMember, type: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-border text-xs"
                >
                  <option value="FOUNDER">Founder (Large Feature Card)</option>
                  <option value="CO_FOUNDER">Co-Founder (Large Feature Card)</option>
                  <option value="TRUSTEE">Trustee (Feature Card)</option>
                  <option value="VOLUNTEER">Volunteer / Sevadar (Compact Card)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-maroon mb-1">Full Name (English) *</label>
                <input
                  type="text"
                  required
                  value={editingMember.nameEn || ""}
                  onChange={(e) => setEditingMember({ ...editingMember, nameEn: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-border text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-maroon mb-1">Full Name (Hindi)</label>
                <input
                  type="text"
                  value={editingMember.nameHi || ""}
                  onChange={(e) => setEditingMember({ ...editingMember, nameHi: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-border text-xs font-hindi"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-maroon mb-1">Designation *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Managing Trustee / Vedic Research Volunteer"
                  value={editingMember.designation || ""}
                  onChange={(e) => setEditingMember({ ...editingMember, designation: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-border text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-maroon mb-1">Portrait Photo</label>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handlePhotoUpload}
                  className="text-xs text-ink-muted"
                />
                {editingMember.photoUrl && (
                  <span className="text-[11px] text-green-700 font-bold block mt-1">
                    Photo attached.
                  </span>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-maroon mb-1">Bio / Statement</label>
                <textarea
                  rows={3}
                  value={editingMember.bio || ""}
                  onChange={(e) => setEditingMember({ ...editingMember, bio: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-border text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-maroon mb-1">Sort Order</label>
                  <input
                    type="number"
                    value={editingMember.sort || 0}
                    onChange={(e) => setEditingMember({ ...editingMember, sort: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl border border-border text-xs font-mono"
                  />
                </div>
                <div className="flex items-end pb-2">
                  <label className="flex items-center gap-2 cursor-pointer text-xs">
                    <input
                      type="checkbox"
                      checked={editingMember.active !== false}
                      onChange={(e) => setEditingMember({ ...editingMember, active: e.target.checked })}
                    />
                    <span className="font-bold text-maroon">Active on site</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-border">
                <button
                  type="button"
                  onClick={() => setEditingMember(null)}
                  className="px-3 py-1.5 text-xs text-ink-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-maroon text-cream font-bold text-xs"
                >
                  Save Member
                </button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
