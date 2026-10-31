"use client";

import React, { useState, useEffect } from "react";
import { adminFetch } from "@/lib/admin-api";
import { Users2, Plus, Trash2, Edit3, UserCheck, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select } from "@/components/admin/ui/Select";
import { MediaUploader } from "@/components/admin/ui/MediaUploader";
import { useConfirm } from "@/components/admin/ui/ConfirmDialog";

const ROLE_OPTIONS = [
  {
    value: "FOUNDER",
    label: "Founder (Large Feature Card)",
    description: "Prominent card at the top with full portrait and statement",
  },
  {
    value: "CO_FOUNDER",
    label: "Co-Founder (Large Feature Card)",
    description: "Featured alongside founders",
  },
  {
    value: "TRUSTEE",
    label: "Trustee (Feature Card)",
    description: "Board members and institutional trustees",
  },
  {
    value: "VOLUNTEER",
    label: "Volunteer / Sevadar (Compact Card)",
    description: "Community organizers and seva coordinators",
  },
];

export default function TeamAdminPage() {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingMember, setEditingMember] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const { confirm, ConfirmComponent } = useConfirm();

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
    setSaving(true);
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
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (member: any) => {
    const isConfirmed = await confirm({
      title: "Delete Team Member?",
      description: `Are you sure you want to remove ${member.nameEn}?`,
      consequenceText: "This will unpublish their card from the Leadership & Team section immediately.",
      itemName: member.nameEn,
      itemThumbnail: member.photoUrl,
      confirmLabel: "Delete Member",
      variant: "danger",
    });

    if (!isConfirmed) return;

    try {
      await adminFetch(`/admin/team/${member.id}`, { method: "DELETE" });
      toast.success("Team member removed.");
      loadTeam();
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
            <Users2 className="w-7 h-7 text-maroon" />
            <span>Leadership & Volunteers</span>
          </h1>
          <p className="text-xs text-ink/70 mt-1">
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
              photoUrl: "",
              sortOrder: members.length + 1,
              active: true,
            })
          }
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-maroon hover:bg-maroon-deep text-cream font-serif font-bold text-xs shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4 text-gold" />
          <span>Add Member</span>
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-56 rounded-2xl bg-sand/30 animate-pulse border border-sand" />
          ))}
        </div>
      ) : members.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-sand p-12 text-center bg-paper">
          <Users2 className="w-12 h-12 text-ink/30 mx-auto mb-3" />
          <h3 className="font-serif font-bold text-base text-ink">No team members added yet</h3>
          <p className="text-xs text-ink/60 mt-1 mb-4">
            Add founders and trustees to showcase the foundation leadership.
          </p>
          <button
            type="button"
            onClick={() =>
              setEditingMember({
                type: "FOUNDER",
                nameEn: "",
                nameHi: "",
                designation: "",
                bio: "",
                photoUrl: "",
                sortOrder: 1,
                active: true,
              })
            }
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-maroon text-cream text-xs font-semibold"
          >
            <Plus className="w-3.5 h-3.5 text-gold" />
            Add First Member
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {members.map((m) => (
            <div
              key={m.id}
              className="rounded-2xl bg-paper p-5 border border-sand hover:border-gold/50 shadow-xs transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-saffron/10 text-saffron-deep uppercase tracking-wider">
                    {m.type.replace("_", " ")}
                  </span>
                  <span className="text-[11px] font-mono text-ink/50">Sort: {m.sortOrder ?? m.sort ?? 0}</span>
                </div>

                <div className="flex items-start gap-3.5 mb-3">
                  {m.photoUrl ? (
                    <img
                      src={m.photoUrl}
                      alt={m.nameEn}
                      className="w-14 h-14 rounded-xl object-cover border border-sand shrink-0 bg-sand/20"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-sand/50 border border-sand flex items-center justify-center text-maroon/60 font-serif font-bold text-lg shrink-0">
                      {m.nameEn?.[0] || "?"}
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <h3 className="font-serif font-bold text-base text-maroon leading-tight truncate">
                      {m.nameEn}
                    </h3>
                    {m.nameHi && <p className="font-hindi text-xs text-ink/70 mt-0.5">{m.nameHi}</p>}
                    <p className="text-xs text-saffron-deep font-medium mt-1 truncate">{m.designation}</p>
                  </div>
                </div>

                {m.bio && <p className="text-xs text-ink/70 line-clamp-2 mt-2 leading-relaxed">&ldquo;{m.bio}&rdquo;</p>}
              </div>

              <div className="pt-3 mt-4 border-t border-sand/70 flex items-center justify-between">
                <span className="inline-flex items-center gap-1 text-[11px] text-ink/60">
                  <UserCheck className={`w-3.5 h-3.5 ${m.active !== false ? "text-banyan" : "text-ink/30"}`} />
                  {m.active !== false ? "Active on site" : "Draft"}
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setEditingMember(m)}
                    className="p-1.5 rounded-lg border border-sand text-maroon hover:bg-sand/40 transition-colors"
                    title="Edit Member"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(m)}
                    className="p-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                    title="Delete Member"
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
      <Dialog open={Boolean(editingMember)} onOpenChange={(open) => !open && setEditingMember(null)}>
        <DialogContent className="max-w-lg p-6 bg-paper rounded-2xl max-h-[92vh] overflow-y-auto border border-sand shadow-2xl">
          <DialogHeader>
            <DialogTitle className="font-serif text-lg font-bold text-maroon flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-gold" />
              <span>{editingMember?.id ? "Edit Team Member" : "Add Team Member"}</span>
            </DialogTitle>
          </DialogHeader>

          {editingMember && (
            <form onSubmit={handleSave} className="space-y-4 py-2">
              {/* Role Select using our custom Brand Combobox */}
              <div>
                <label className="block text-xs font-semibold text-ink mb-1.5">
                  Role / Card Type *
                </label>
                <Select
                  value={editingMember.type}
                  onChange={(val) => setEditingMember({ ...editingMember, type: val })}
                  options={ROLE_OPTIONS}
                  placeholder="Select member role..."
                  searchable={false}
                />
              </div>

              {/* Name (English & Hindi) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-ink mb-1.5">
                    Full Name (English) *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingMember.nameEn || ""}
                    onChange={(e) => setEditingMember({ ...editingMember, nameEn: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-sand bg-paper text-xs text-ink focus:border-gold focus:outline-hidden focus:ring-1 focus:ring-gold"
                    placeholder="e.g. Mr. Sanjay Singh"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink mb-1.5">
                    Full Name (Hindi)
                  </label>
                  <input
                    type="text"
                    value={editingMember.nameHi || ""}
                    onChange={(e) => setEditingMember({ ...editingMember, nameHi: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-sand bg-paper text-xs text-ink font-hindi focus:border-gold focus:outline-hidden focus:ring-1 focus:ring-gold"
                    placeholder="उदा. श्री संजय सिंह"
                  />
                </div>
              </div>

              {/* Designation */}
              <div>
                <label className="block text-xs font-semibold text-ink mb-1.5">
                  Designation *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Educationist, Social Worker & Healthcare Supporter"
                  value={editingMember.designation || ""}
                  onChange={(e) => setEditingMember({ ...editingMember, designation: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-sand bg-paper text-xs text-ink focus:border-gold focus:outline-hidden focus:ring-1 focus:ring-gold"
                />
              </div>

              {/* Portrait Photo via unified MediaUploader */}
              <div>
                <MediaUploader
                  label="Portrait Photo"
                  helperText="Recommended 4:5 portrait ratio (JPG, PNG, WEBP). Supports drag & drop, clipboard paste & crop."
                  aspectRatio={4 / 5}
                  allowCrop={true}
                  value={editingMember.photoUrl}
                  onChange={(url) => setEditingMember({ ...editingMember, photoUrl: url })}
                  onRemove={() => setEditingMember({ ...editingMember, photoUrl: "" })}
                />
              </div>

              {/* Bio / Statement */}
              <div>
                <label className="block text-xs font-semibold text-ink mb-1.5">
                  Bio / Statement
                </label>
                <textarea
                  rows={3}
                  value={editingMember.bio || ""}
                  onChange={(e) => setEditingMember({ ...editingMember, bio: e.target.value })}
                  placeholder="A short inspiring bio or foundation message..."
                  className="w-full p-3 rounded-xl border border-sand bg-paper text-xs text-ink focus:border-gold focus:outline-hidden focus:ring-1 focus:ring-gold"
                />
              </div>

              {/* Sort & Active */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-ink mb-1.5">Sort Order</label>
                  <input
                    type="number"
                    value={editingMember.sortOrder ?? editingMember.sort ?? 0}
                    onChange={(e) =>
                      setEditingMember({
                        ...editingMember,
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
                      checked={editingMember.active !== false}
                      onChange={(e) =>
                        setEditingMember({ ...editingMember, active: e.target.checked })
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
                  onClick={() => setEditingMember(null)}
                  className="rounded-xl border border-sand bg-white px-4 py-2 text-xs font-medium text-ink hover:bg-sand/30 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-maroon hover:bg-maroon-deep px-5 py-2 text-xs font-bold text-cream shadow-xs transition-colors disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Member"}
                </button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
