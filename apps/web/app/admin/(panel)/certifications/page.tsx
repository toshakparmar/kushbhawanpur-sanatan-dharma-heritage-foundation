"use client";

import React, { useState, useEffect } from "react";
import { adminFetch } from "@/lib/admin-api";
import { Award, Plus, Trash2, Edit3, FileText, CheckCircle2, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MediaUploader } from "@/components/admin/ui/MediaUploader";
import { useConfirm } from "@/components/admin/ui/ConfirmDialog";

export default function CertificationsAdminPage() {
  const [certs, setCerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCert, setEditingCert] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const { confirm, ConfirmComponent } = useConfirm();

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

    setSaving(true);
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
        toast.success("New certification added.");
      }
      setEditingCert(null);
      loadCerts();
    } catch (err: any) {
      toast.error(err.message || "Failed to save certification.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (cert: any) => {
    const isConfirmed = await confirm({
      title: "Delete Certification?",
      description: `Are you sure you want to delete "${cert.title}"?`,
      consequenceText: "This certificate will be removed from the public Trust & Accreditations view immediately.",
      itemName: cert.title,
      confirmLabel: "Delete Certificate",
      variant: "danger",
    });

    if (!isConfirmed) return;

    try {
      await adminFetch(`/admin/certifications/${cert.id}`, { method: "DELETE" });
      toast.success("Certification deleted.");
      loadCerts();
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
            <Award className="w-7 h-7 text-maroon" />
            <span>Official Certifications & Registrations</span>
          </h1>
          <p className="text-xs text-ink/70 mt-1">
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
              sortOrder: certs.length + 1,
              active: true,
            })
          }
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-maroon hover:bg-maroon-deep text-cream font-serif font-bold text-xs shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4 text-gold" />
          <span>Add Certificate</span>
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-52 rounded-2xl bg-sand/30 animate-pulse border border-sand" />
          ))}
        </div>
      ) : certs.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-sand p-12 text-center bg-paper">
          <Award className="w-12 h-12 text-ink/30 mx-auto mb-3" />
          <h3 className="font-serif font-bold text-base text-ink">No certifications uploaded yet</h3>
          <p className="text-xs text-ink/60 mt-1 mb-4">
            Upload your trust deed, 12A/80G approvals, or CSR certificates.
          </p>
          <button
            type="button"
            onClick={() =>
              setEditingCert({
                title: "",
                issuer: "",
                number: "",
                issueDate: "",
                fileUrl: "",
                sortOrder: 1,
                active: true,
              })
            }
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-maroon text-cream text-xs font-semibold"
          >
            <Plus className="w-3.5 h-3.5 text-gold" />
            Add First Certificate
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {certs.map((c) => (
            <div
              key={c.id}
              className="rounded-2xl bg-paper p-5 border border-sand hover:border-gold/50 shadow-xs transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-banyan/10 text-banyan uppercase tracking-wider">
                    Official Document
                  </span>
                  <span className="text-[11px] font-mono text-ink/50">Sort: {c.sortOrder ?? c.sort ?? 0}</span>
                </div>

                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-sand/40 border border-sand flex items-center justify-center text-maroon shrink-0">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-serif font-bold text-base text-maroon leading-tight truncate">
                      {c.title}
                    </h3>
                    <p className="text-xs text-ink/70 font-medium mt-0.5 truncate">{c.issuer}</p>
                    {c.number && (
                      <p className="text-[11px] text-ink/50 font-mono mt-0.5 truncate">
                        Ref: {c.number}
                      </p>
                    )}
                  </div>
                </div>

                {c.fileUrl && (
                  <a
                    href={c.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-saffron-deep hover:text-saffron font-medium mt-1 truncate"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>View uploaded document</span>
                  </a>
                )}
              </div>

              <div className="pt-3 mt-4 border-t border-sand/70 flex items-center justify-between">
                <span className="inline-flex items-center gap-1 text-[11px] text-ink/60">
                  <CheckCircle2 className={`w-3.5 h-3.5 ${c.active !== false ? "text-banyan" : "text-ink/30"}`} />
                  {c.active !== false ? "Active on site" : "Hidden"}
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setEditingCert(c)}
                    className="p-1.5 rounded-lg border border-sand text-maroon hover:bg-sand/40 transition-colors"
                    title="Edit"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(c)}
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
      <Dialog open={Boolean(editingCert)} onOpenChange={(open) => !open && setEditingCert(null)}>
        <DialogContent className="max-w-lg p-6 bg-paper rounded-2xl max-h-[92vh] overflow-y-auto border border-sand shadow-2xl">
          <DialogHeader>
            <DialogTitle className="font-serif text-lg font-bold text-maroon flex items-center gap-2">
              <Award className="w-5 h-5 text-gold" />
              <span>{editingCert?.id ? "Edit Certificate" : "Add Certificate"}</span>
            </DialogTitle>
          </DialogHeader>

          {editingCert && (
            <form onSubmit={handleSave} className="space-y-4 py-2">
              <div>
                <label className="block text-xs font-semibold text-ink mb-1.5">
                  Certificate Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Income Tax Section 80G Approval"
                  value={editingCert.title || ""}
                  onChange={(e) => setEditingCert({ ...editingCert, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-sand bg-paper text-xs text-ink focus:border-gold focus:outline-hidden focus:ring-1 focus:ring-gold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink mb-1.5">
                  Issuing Authority *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Income Tax Department, Govt. of India"
                  value={editingCert.issuer || ""}
                  onChange={(e) => setEditingCert({ ...editingCert, issuer: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-sand bg-paper text-xs text-ink focus:border-gold focus:outline-hidden focus:ring-1 focus:ring-gold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-ink mb-1.5">
                    Registration / Order Number
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. AAATK1234F20231"
                    value={editingCert.number || ""}
                    onChange={(e) => setEditingCert({ ...editingCert, number: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-sand bg-paper text-xs font-mono text-ink focus:border-gold focus:outline-hidden focus:ring-1 focus:ring-gold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink mb-1.5">
                    Issue Date
                  </label>
                  <input
                    type="date"
                    value={editingCert.issueDate ? editingCert.issueDate.slice(0, 10) : ""}
                    onChange={(e) => setEditingCert({ ...editingCert, issueDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-sand bg-paper text-xs text-ink focus:border-gold focus:outline-hidden focus:ring-1 focus:ring-gold"
                  />
                </div>
              </div>

              {/* Document Uploader */}
              <div>
                <MediaUploader
                  label="Certificate Document (PDF / Image) *"
                  helperText="Upload official scan or PDF document up to 10 MB. Direct storage upload."
                  accept="application/pdf,image/jpeg,image/png,image/webp"
                  maxSizeMB={10}
                  allowCrop={false}
                  value={editingCert.fileUrl}
                  onChange={(url) => setEditingCert({ ...editingCert, fileUrl: url })}
                  onRemove={() => setEditingCert({ ...editingCert, fileUrl: "" })}
                />
              </div>

              {/* Sort & Active */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-ink mb-1.5">Sort Order</label>
                  <input
                    type="number"
                    value={editingCert.sortOrder ?? editingCert.sort ?? 0}
                    onChange={(e) =>
                      setEditingCert({
                        ...editingCert,
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
                      checked={editingCert.active !== false}
                      onChange={(e) =>
                        setEditingCert({ ...editingCert, active: e.target.checked })
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
                  onClick={() => setEditingCert(null)}
                  className="rounded-xl border border-sand bg-white px-4 py-2 text-xs font-medium text-ink hover:bg-sand/30 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-maroon hover:bg-maroon-deep px-5 py-2 text-xs font-bold text-cream shadow-xs transition-colors disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Certificate"}
                </button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
