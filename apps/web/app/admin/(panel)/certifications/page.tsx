"use client";

import React, { useState, useEffect } from "react";
import { adminFetch } from "@/lib/admin-api";
import { Award, Plus, Trash2, Edit3, Upload, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function CertificationsAdminPage() {
  const [certs, setCerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCert, setEditingCert] = useState<any>(null);

  const loadCerts = async () => {
    setLoading(true);
    try {
      const data = await adminFetch("/admin/certifications");
      setCerts(data || []);
    } catch (err: any) {
      toast.error(err.message || "Failed to load certifications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCerts();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCert.fileUrl) {
      toast.error("Please upload the certificate file (PDF/Image).");
      return;
    }

    try {
      if (editingCert.id) {
        await adminFetch(`/admin/certifications/${editingCert.id}`, {
          method: "PUT",
          body: JSON.stringify(editingCert),
        });
        toast.success("Certification updated.");
      } else {
        await adminFetch("/admin/certifications", {
          method: "POST",
          body: JSON.stringify(editingCert),
        });
        toast.success("Certification added.");
      }
      setEditingCert(null);
      loadCerts();
    } catch (err: any) {
      toast.error(err.message || "Failed to save certification.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this certificate?")) return;
    try {
      await adminFetch(`/admin/certifications/${id}`, { method: "DELETE" });
      toast.success("Certification deleted.");
      loadCerts();
    } catch (err: any) {
      toast.error(err.message || "Delete failed.");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
      setEditingCert((prev: any) => ({
        ...prev,
        fileUrl: url,
        thumbUrl: prev?.thumbUrl || url,
      }));
      toast.success("Certificate file uploaded successfully!");
    } catch (err: any) {
      toast.error(err.message || "Upload failed.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-maroon flex items-center gap-2">
            <Award className="w-7 h-7 text-maroon" />
            <span>Official Certifications & Registrations</span>
          </h1>
          <p className="text-xs text-ink-muted">
            Uploaded trust deeds, 80G approvals, and government certificates. Public section auto-hides if empty.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            setEditingCert({
              title: "",
              issuer: "",
              number: "",
              issueDate: "",
              fileUrl: "",
              sort: certs.length + 1,
              active: true,
            })
          }
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-maroon text-cream font-serif font-bold text-xs shadow-xs"
        >
          <Plus className="w-4 h-4 text-gold" />
          <span>Add Certification</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {certs.map((c) => (
          <div
            key={c.id}
            className="rounded-2xl bg-paper p-5 border border-gold/30 shadow-xs flex flex-col justify-between"
          >
            <div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sand text-maroon uppercase">
                {c.issuer}
              </span>
              <h3 className="font-serif font-bold text-base text-maroon mt-2">{c.title}</h3>
              {c.number && (
                <p className="text-xs text-ink font-mono mt-1">Ref: {c.number}</p>
              )}
            </div>

            <div className="pt-3 mt-4 border-t border-border flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingCert(c)}
                className="p-1.5 rounded-lg border border-gold/40 text-maroon hover:bg-sand/40"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleDelete(c.id)}
                className="p-1.5 rounded-lg border border-red-200 text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      <Dialog open={Boolean(editingCert)} onOpenChange={(open) => !open && setEditingCert(null)}>
        <DialogContent className="max-w-md p-6 bg-paper rounded-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif text-lg font-bold text-maroon">
              {editingCert?.id ? "Edit Certification" : "Add Certification"}
            </DialogTitle>
          </DialogHeader>

          {editingCert && (
            <form onSubmit={handleSave} className="space-y-4 py-2">
              <div>
                <label className="block text-xs font-bold text-maroon mb-1">Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Income Tax Section 80G Approval"
                  value={editingCert.title || ""}
                  onChange={(e) => setEditingCert({ ...editingCert, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-border text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-maroon mb-1">Issuing Authority *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Income Tax Department, Govt. of India"
                  value={editingCert.issuer || ""}
                  onChange={(e) => setEditingCert({ ...editingCert, issuer: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-border text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-maroon mb-1">Certificate / Registration Number</label>
                <input
                  type="text"
                  placeholder="Optional registration / order number"
                  value={editingCert.number || ""}
                  onChange={(e) => setEditingCert({ ...editingCert, number: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-border text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-maroon mb-1">Issue Date</label>
                <input
                  type="date"
                  value={editingCert.issueDate ? editingCert.issueDate.slice(0, 10) : ""}
                  onChange={(e) => setEditingCert({ ...editingCert, issueDate: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-border text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-maroon mb-1">Certificate Document (PDF / Image) *</label>
                <input
                  type="file"
                  accept="application/pdf,image/jpeg,image/png,image/webp"
                  onChange={handleFileUpload}
                  className="text-xs text-ink-muted"
                />
                {editingCert.fileUrl && (
                  <span className="text-[11px] text-green-700 font-bold block mt-1">
                    Document attached.
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-maroon mb-1">Sort Order</label>
                  <input
                    type="number"
                    value={editingCert.sort || 0}
                    onChange={(e) => setEditingCert({ ...editingCert, sort: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl border border-border text-xs font-mono"
                  />
                </div>
                <div className="flex items-end pb-2">
                  <label className="flex items-center gap-2 cursor-pointer text-xs">
                    <input
                      type="checkbox"
                      checked={editingCert.active !== false}
                      onChange={(e) => setEditingCert({ ...editingCert, active: e.target.checked })}
                    />
                    <span className="font-bold text-maroon">Active on site</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-border">
                <button
                  type="button"
                  onClick={() => setEditingCert(null)}
                  className="px-3 py-1.5 text-xs text-ink-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-maroon text-cream font-bold text-xs"
                >
                  Save Certificate
                </button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
