"use client";

import React, { useState, useEffect } from "react";
import { adminFetch } from "@/lib/admin-api";
import { Building, Save, ShieldCheck, CheckCircle2, Upload } from "lucide-react";
import { toast } from "sonner";

export default function OrganizationProfilePage() {
  const [profile, setProfile] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    adminFetch("/admin/organization")
      .then((data) => {
        if (data) setProfile(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await adminFetch("/admin/organization", {
        method: "PUT",
        body: JSON.stringify(profile),
      });
      setProfile(res);
      toast.success("Organisation profile and receipt settings updated!");
    } catch (err: any) {
      toast.error(err.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
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
      setProfile((prev: any) => ({ ...prev, [field]: url }));
      toast.success("Image uploaded successfully!");
    } catch (err: any) {
      toast.error(err.message || "Upload error.");
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-ink-muted">Loading profile...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-maroon flex items-center gap-2">
          <Building className="w-7 h-7 text-maroon" />
          <span>Organisation Profile & Receipt Settings</span>
        </h1>
        <p className="text-xs text-ink-muted">
          Manage foundation public details, statutory registrations (80G/12A), authorised signatory, and digital receipt templates.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Section 1: Identity & Names */}
        <div className="rounded-3xl bg-paper p-6 sm:p-8 border border-gold/40 shadow-xs space-y-4">
          <h2 className="font-serif text-lg font-bold text-maroon border-b border-border pb-2">
            1. Foundation Identity (Bilingual)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-maroon mb-1">
                Foundation Name (English) *
              </label>
              <input
                type="text"
                required
                value={profile.nameEn || ""}
                onChange={(e) => setProfile({ ...profile, nameEn: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-border text-xs focus:ring-2 focus:ring-gold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-maroon mb-1">
                Foundation Name (Hindi / Devanagari)
              </label>
              <input
                type="text"
                value={profile.nameHi || ""}
                onChange={(e) => setProfile({ ...profile, nameHi: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-border text-xs font-hindi focus:ring-2 focus:ring-gold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-maroon mb-1">
                Tagline (English)
              </label>
              <input
                type="text"
                value={profile.taglineEn || ""}
                onChange={(e) => setProfile({ ...profile, taglineEn: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-border text-xs focus:ring-2 focus:ring-gold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-maroon mb-1">
                Tagline (Hindi)
              </label>
              <input
                type="text"
                value={profile.taglineHi || ""}
                onChange={(e) => setProfile({ ...profile, taglineHi: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-border text-xs font-hindi focus:ring-2 focus:ring-gold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-maroon mb-1">
              About Foundation (Paragraphs)
            </label>
            <textarea
              rows={3}
              value={profile.aboutEn || ""}
              onChange={(e) => setProfile({ ...profile, aboutEn: e.target.value })}
              className="w-full p-3 rounded-xl border border-border text-xs leading-relaxed focus:ring-2 focus:ring-gold"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-maroon mb-1">Vision Statement</label>
              <textarea
                rows={2}
                value={profile.visionEn || ""}
                onChange={(e) => setProfile({ ...profile, visionEn: e.target.value })}
                className="w-full p-3 rounded-xl border border-border text-xs focus:ring-2 focus:ring-gold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-maroon mb-1">Mission Statement</label>
              <textarea
                rows={2}
                value={profile.missionEn || ""}
                onChange={(e) => setProfile({ ...profile, missionEn: e.target.value })}
                className="w-full p-3 rounded-xl border border-border text-xs focus:ring-2 focus:ring-gold"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Contact & Official Address */}
        <div className="rounded-3xl bg-paper p-6 sm:p-8 border border-gold/40 shadow-xs space-y-4">
          <h2 className="font-serif text-lg font-bold text-maroon border-b border-border pb-2">
            2. Official Contacts & Registered Office
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-maroon mb-1">Official Email</label>
              <input
                type="email"
                value={profile.email || ""}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-border text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-maroon mb-1">Official Phone</label>
              <input
                type="text"
                value={profile.phone || ""}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-border text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-maroon mb-1">Registered Address</label>
              <input
                type="text"
                value={profile.address || ""}
                onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-border text-xs"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Statutory Approvals (80G, 12A, Reg, PAN) */}
        <div className="rounded-3xl bg-paper p-6 sm:p-8 border border-gold/40 shadow-xs space-y-4">
          <div className="border-b border-border pb-2 flex items-center justify-between">
            <h2 className="font-serif text-lg font-bold text-maroon">
              3. Statutory Approvals & Tax Exemptions
            </h2>
            <span className="text-[11px] text-ink-muted">
              Appears on receipts only if filled.
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-maroon mb-1">Trust Registration No.</label>
              <input
                type="text"
                placeholder="Optional"
                value={profile.regNo || ""}
                onChange={(e) => setProfile({ ...profile, regNo: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-border text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-maroon mb-1">Trust PAN Number</label>
              <input
                type="text"
                placeholder="Optional"
                value={profile.panNo || ""}
                onChange={(e) => setProfile({ ...profile, panNo: e.target.value.toUpperCase() })}
                className="w-full px-3 py-2 rounded-xl border border-border text-xs font-mono uppercase"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-maroon mb-1">Section 80G Approval No.</label>
              <input
                type="text"
                placeholder="Optional (Never claim if blank)"
                value={profile.approval80G || ""}
                onChange={(e) => setProfile({ ...profile, approval80G: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-border text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-maroon mb-1">Section 12A Registration No.</label>
              <input
                type="text"
                placeholder="Optional"
                value={profile.approval12A || ""}
                onChange={(e) => setProfile({ ...profile, approval12A: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-border text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-maroon mb-1">NITI Aayog Darpan ID</label>
              <input
                type="text"
                placeholder="Optional"
                value={profile.darpanId || ""}
                onChange={(e) => setProfile({ ...profile, darpanId: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-border text-xs font-mono"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Authorised Signatory & Receipt Templates */}
        <div className="rounded-3xl bg-paper p-6 sm:p-8 border border-gold/40 shadow-xs space-y-4">
          <h2 className="font-serif text-lg font-bold text-maroon border-b border-border pb-2">
            4. Authorised Signatory & Digital Receipt Template
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-maroon mb-1">Signatory Name</label>
              <input
                type="text"
                placeholder="e.g. Swami / Trustee Name"
                value={profile.signatoryName || ""}
                onChange={(e) => setProfile({ ...profile, signatoryName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-border text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-maroon mb-1">Signatory Designation</label>
              <input
                type="text"
                placeholder="e.g. Managing Trustee / Treasurer"
                value={profile.signatoryDesignation || ""}
                onChange={(e) => setProfile({ ...profile, signatoryDesignation: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-border text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-maroon mb-1">Receipt Prefix</label>
              <input
                type="text"
                required
                value={profile.receiptPrefix || "KSDHF"}
                onChange={(e) => setProfile({ ...profile, receiptPrefix: e.target.value.toUpperCase() })}
                className="w-full px-3 py-2 rounded-xl border border-border text-xs font-mono uppercase"
              />
              <span className="text-[11px] text-ink-muted">
                Generates e.g. {profile.receiptPrefix || "KSDHF"}/2026-27/00001
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-maroon mb-1">
                Upload Digital Signature (PNG, Transparent)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  accept="image/png,image/jpeg"
                  onChange={(e) => handleFileUpload(e, "signatureUrl")}
                  className="text-xs text-ink-muted"
                />
                {profile.signatureUrl && (
                  <span className="text-[11px] text-green-700 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Uploaded
                  </span>
                )}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-maroon mb-1">
              Receipt Footer Note
            </label>
            <input
              type="text"
              value={profile.receiptFooterNote || ""}
              onChange={(e) => setProfile({ ...profile, receiptFooterNote: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-border text-xs"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-maroon text-cream font-serif font-bold text-sm hover:bg-maroon-dark transition-all shadow-md disabled:opacity-50 cursor-pointer"
          >
            <Save className="w-4 h-4 text-gold" />
            <span>{saving ? "Saving Changes..." : "Save Organisation Settings"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
