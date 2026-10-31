"use client";

import React, { useState, useEffect } from "react";
import { adminFetch } from "@/lib/admin-api";
import { Building, Save, ShieldCheck, CheckCircle2, Sparkles, FileSignature } from "lucide-react";
import { toast } from "sonner";
import { MediaUploader } from "@/components/admin/ui/MediaUploader";

export default function OrganizationAdminPage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await adminFetch("/admin/organization");
        setProfile(data || {});
      } catch (err: any) {
        toast.error(err.message || "Failed to load organization settings.");
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await adminFetch("/admin/organization", {
        method: "PUT",
        body: JSON.stringify(profile),
      });
      toast.success("Organization details and statutory accreditations updated.");
    } catch (err: any) {
      toast.error(err.message || "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-64 bg-sand/30 rounded-xl animate-pulse" />
        <div className="h-96 rounded-3xl bg-sand/20 border border-sand animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-maroon flex items-center gap-2.5">
            <Building className="w-7 h-7 text-maroon" />
            <span>Organization Profile & Statutory Settings</span>
          </h1>
          <p className="text-xs text-ink/70 mt-1">
            Foundation identity, 12A/80G approvals, CSR registration, and official receipt parameters.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          type="button"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-maroon hover:bg-maroon-deep text-cream font-serif font-bold text-xs shadow-xs transition-colors disabled:opacity-50"
        >
          <Save className="w-4 h-4 text-gold" />
          <span>{saving ? "Saving..." : "Save Changes"}</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Identity & Brand Logos */}
        <div className="rounded-3xl bg-paper p-6 sm:p-8 border border-sand shadow-xs space-y-5">
          <h2 className="font-serif text-base font-bold text-maroon border-b border-sand pb-2.5 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-gold" />
            <span>1. Foundation Identity & Brand Media</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-ink mb-1.5">
                Foundation Name (English) *
              </label>
              <input
                type="text"
                required
                value={profile.nameEn || ""}
                onChange={(e) => setProfile({ ...profile, nameEn: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-sand bg-paper text-xs text-ink focus:border-gold focus:outline-hidden focus:ring-1 focus:ring-gold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink mb-1.5">
                Foundation Name (Hindi / Devanagari)
              </label>
              <input
                type="text"
                value={profile.nameHi || ""}
                onChange={(e) => setProfile({ ...profile, nameHi: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-sand bg-paper text-xs font-hindi text-ink focus:border-gold focus:outline-hidden focus:ring-1 focus:ring-gold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink mb-1.5">
                Tagline (English)
              </label>
              <input
                type="text"
                value={profile.taglineEn || ""}
                onChange={(e) => setProfile({ ...profile, taglineEn: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-sand bg-paper text-xs text-ink focus:border-gold focus:outline-hidden focus:ring-1 focus:ring-gold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink mb-1.5">
                Tagline (Hindi)
              </label>
              <input
                type="text"
                value={profile.taglineHi || ""}
                onChange={(e) => setProfile({ ...profile, taglineHi: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-sand bg-paper text-xs font-hindi text-ink focus:border-gold focus:outline-hidden focus:ring-1 focus:ring-gold"
              />
            </div>
          </div>

          {/* Official Logo Uploader */}
          <div className="pt-2">
            <MediaUploader
              label="Official Foundation Logo"
              helperText="Upload transparent PNG or SVG logo. Direct upload to Supabase storage bucket."
              aspectRatio={1}
              allowCrop={true}
              value={profile.logoUrl}
              onChange={(url) => setProfile({ ...profile, logoUrl: url })}
              onRemove={() => setProfile({ ...profile, logoUrl: "" })}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink mb-1.5">
              About Foundation (Paragraphs)
            </label>
            <textarea
              rows={3}
              value={profile.aboutEn || ""}
              onChange={(e) => setProfile({ ...profile, aboutEn: e.target.value })}
              className="w-full p-3.5 rounded-xl border border-sand bg-paper text-xs text-ink focus:border-gold focus:outline-hidden focus:ring-1 focus:ring-gold leading-relaxed"
            />
          </div>
        </div>

        {/* Section 2: Statutory & Tax Approvals */}
        <div className="rounded-3xl bg-paper p-6 sm:p-8 border border-sand shadow-xs space-y-5">
          <h2 className="font-serif text-base font-bold text-maroon border-b border-sand pb-2.5 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-banyan" />
            <span>2. Statutory Registrations & Tax Exemption Numbers</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-ink mb-1.5">
                Permanent Account Number (PAN) *
              </label>
              <input
                type="text"
                required
                value={profile.panNo || ""}
                onChange={(e) => setProfile({ ...profile, panNo: e.target.value.toUpperCase() })}
                className="w-full px-3.5 py-2 rounded-xl border border-sand bg-paper text-xs font-mono uppercase text-ink focus:border-gold focus:outline-hidden"
                placeholder="AAATK1234F"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink mb-1.5">
                Trust Registration Number
              </label>
              <input
                type="text"
                value={profile.regNo || ""}
                onChange={(e) => setProfile({ ...profile, regNo: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-sand bg-paper text-xs font-mono text-ink focus:border-gold focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink mb-1.5">
                Section 80G Approval Number
              </label>
              <input
                type="text"
                value={profile.approval80G || ""}
                onChange={(e) => setProfile({ ...profile, approval80G: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-sand bg-paper text-xs font-mono text-ink focus:border-gold focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink mb-1.5">
                Section 12A Registration Number
              </label>
              <input
                type="text"
                value={profile.approval12A || ""}
                onChange={(e) => setProfile({ ...profile, approval12A: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-sand bg-paper text-xs font-mono text-ink focus:border-gold focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink mb-1.5">
                MCA CSR Registration Number
              </label>
              <input
                type="text"
                value={profile.csrNo || ""}
                onChange={(e) => setProfile({ ...profile, csrNo: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-sand bg-paper text-xs font-mono text-ink focus:border-gold focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink mb-1.5">
                NITI Aayog Darpan ID
              </label>
              <input
                type="text"
                value={profile.darpanId || ""}
                onChange={(e) => setProfile({ ...profile, darpanId: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-sand bg-paper text-xs font-mono text-ink focus:border-gold focus:outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Official Receipt Signatory */}
        <div className="rounded-3xl bg-paper p-6 sm:p-8 border border-sand shadow-xs space-y-5">
          <h2 className="font-serif text-base font-bold text-maroon border-b border-sand pb-2.5 flex items-center gap-2">
            <FileSignature className="w-4 h-4 text-saffron" />
            <span>3. Automated 80G Receipt & Signatory Configuration</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-ink mb-1.5">
                Authorized Signatory Name
              </label>
              <input
                type="text"
                value={profile.signatoryName || ""}
                onChange={(e) => setProfile({ ...profile, signatoryName: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-sand bg-paper text-xs text-ink focus:border-gold focus:outline-hidden"
                placeholder="e.g. Managing Trustee"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink mb-1.5">
                Signatory Designation
              </label>
              <input
                type="text"
                value={profile.signatoryDesignation || ""}
                onChange={(e) =>
                  setProfile({ ...profile, signatoryDesignation: e.target.value })
                }
                className="w-full px-3.5 py-2 rounded-xl border border-sand bg-paper text-xs text-ink focus:border-gold focus:outline-hidden"
                placeholder="Managing Trustee / General Secretary"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink mb-1.5">
                Receipt Prefix Code
              </label>
              <input
                type="text"
                value={profile.receiptPrefix || "KSDHF"}
                onChange={(e) => setProfile({ ...profile, receiptPrefix: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-sand bg-paper text-xs font-mono uppercase text-ink focus:border-gold focus:outline-hidden"
              />
              <span className="text-[11px] text-ink/50 mt-1 block">
                Generates receipts like: {profile.receiptPrefix || "KSDHF"}/2026-27/00001
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink mb-1.5">
                Receipt Footer Note
              </label>
              <input
                type="text"
                value={profile.receiptFooterNote || ""}
                onChange={(e) =>
                  setProfile({ ...profile, receiptFooterNote: e.target.value })
                }
                className="w-full px-3.5 py-2 rounded-xl border border-sand bg-paper text-xs text-ink focus:border-gold focus:outline-hidden"
                placeholder="This is a computer-generated 80G donation receipt."
              />
            </div>
          </div>

          {/* Digital Signature Upload via MediaUploader */}
          <div className="pt-2">
            <MediaUploader
              label="Digital Signature for Official PDF Receipts"
              helperText="Upload transparent PNG of the authorized signatory's signature. Automatically embedded into generated 80G PDF receipts."
              accept="image/png,image/jpeg"
              allowCrop={false}
              value={profile.signatureUrl}
              onChange={(url) => setProfile({ ...profile, signatureUrl: url })}
              onRemove={() => setProfile({ ...profile, signatureUrl: "" })}
            />
          </div>
        </div>

        {/* Section 4: Public Contact & Address */}
        <div className="rounded-3xl bg-paper p-6 sm:p-8 border border-sand shadow-xs space-y-4">
          <h2 className="font-serif text-base font-bold text-maroon border-b border-sand pb-2.5">
            4. Registered Office & Contact Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-ink mb-1.5">Official Email</label>
              <input
                type="email"
                value={profile.email || ""}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-sand bg-paper text-xs text-ink focus:border-gold focus:outline-hidden"
                placeholder="contact@kushbhawanpur.org"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink mb-1.5">Official Phone / Helpline</label>
              <input
                type="text"
                value={profile.phone || ""}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-sand bg-paper text-xs text-ink focus:border-gold focus:outline-hidden"
                placeholder="+91 94150 XXXXX"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink mb-1.5">Registered Office Address</label>
            <textarea
              rows={2}
              value={profile.address || ""}
              onChange={(e) => setProfile({ ...profile, address: e.target.value })}
              className="w-full p-3.5 rounded-xl border border-sand bg-paper text-xs text-ink focus:border-gold focus:outline-hidden leading-relaxed"
              placeholder="Dhopap Ghat, Sultanpur (Kushbhawanpur), Uttar Pradesh - 228001"
            />
          </div>
        </div>

        {/* Sticky Save Bar */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-maroon hover:bg-maroon-deep text-cream font-serif font-bold text-sm shadow-sm transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4 text-gold" />
            <span>{saving ? "Saving All Settings..." : "Save Organization Profile"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
