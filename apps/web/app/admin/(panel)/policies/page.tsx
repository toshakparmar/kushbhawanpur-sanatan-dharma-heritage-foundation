"use client";

import React, { useState, useEffect } from "react";
import { adminFetch } from "@/lib/admin-api";
import { FileText, Save, Loader2, Calendar } from "lucide-react";
import { toast } from "sonner";

interface PolicyPage {
  id: string;
  slug: string;
  titleEn: string;
  titleHi?: string;
  contentEn: string;
  contentHi?: string;
  updatedAt: string;
}

export default function PoliciesPage() {
  const [policies, setPolicies] = useState<PolicyPage[]>([]);
  const [selectedPolicy, setSelectedPolicy] = useState<PolicyPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadPolicies();
  }, []);

  const loadPolicies = async () => {
    setLoading(true);
    try {
      const data = await adminFetch("/admin/policies");
      if (Array.isArray(data) && data.length > 0) {
        setPolicies(data);
        setSelectedPolicy(data[0]);
      }
    } catch {
      toast.error("Failed to load policy pages.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!selectedPolicy) return;
    setSaving(true);
    try {
      const updated = await adminFetch(`/admin/policies/${selectedPolicy.slug}`, {
        method: "PUT",
        body: JSON.stringify({
          titleEn: selectedPolicy.titleEn,
          titleHi: selectedPolicy.titleHi,
          contentEn: selectedPolicy.contentEn,
          contentHi: selectedPolicy.contentHi,
        }),
      });
      setPolicies((prev) => prev.map((p) => (p.slug === selectedPolicy.slug ? updated : p)));
      setSelectedPolicy(updated);
      toast.success("Policy terms updated successfully!");
    } catch {
      toast.error("Failed to save policy.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center gap-3 text-ink-muted">
        <Loader2 className="w-8 h-8 animate-spin text-saffron" />
        <span className="text-xs font-serif">Loading policies...</span>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gold/30 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-maroon/10 text-maroon">
              <FileText className="w-5 h-5 text-maroon" />
            </span>
            <h1 className="text-2xl font-serif font-bold text-maroon">
              Legal Policies & Terms
            </h1>
          </div>
          <p className="text-xs text-ink-muted font-sans">
            Statutory privacy policy, donation terms, and refund guidelines displayed on the public site and donation receipts.
          </p>
        </div>

        <button
          type="button"
          disabled={saving || !selectedPolicy}
          onClick={handleSave}
          className="px-5 py-2 rounded-xl bg-maroon hover:bg-maroon-dark text-cream text-xs font-serif font-bold flex items-center gap-1.5 shadow-xs disabled:opacity-50 shrink-0"
        >
          {saving ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Save className="w-3.5 h-3.5 text-gold" />
          )}
          <span>Save Policy</span>
        </button>
      </div>

      {/* Policy Selector Tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-3 overflow-x-auto">
        {policies.map((p) => (
          <button
            key={p.slug}
            type="button"
            onClick={() => setSelectedPolicy(p)}
            className={`px-4 py-2 rounded-xl text-xs font-serif font-bold whitespace-nowrap transition-all ${
              selectedPolicy?.slug === p.slug
                ? "bg-maroon text-cream shadow-xs"
                : "bg-sand/30 text-ink-muted hover:text-maroon"
            }`}
          >
            {p.titleEn}
          </button>
        ))}
      </div>

      {selectedPolicy && (
        <div className="p-6 rounded-3xl bg-paper border border-gold/30 shadow-2xs space-y-5">
          <div className="flex items-center justify-between border-b border-border/50 pb-3">
            <h2 className="text-base font-serif font-bold text-maroon">
              {selectedPolicy.titleEn}
            </h2>
            <span className="text-[11px] text-ink-muted font-mono flex items-center gap-1">
              <Calendar className="w-3 h-3 text-gold" /> Last updated:{" "}
              {new Date(selectedPolicy.updatedAt).toLocaleDateString()}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-serif font-bold text-maroon block">
                Policy Title (English)
              </label>
              <input
                type="text"
                value={selectedPolicy.titleEn || ""}
                onChange={(e) =>
                  setSelectedPolicy({ ...selectedPolicy, titleEn: e.target.value })
                }
                className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-cream/40 focus:border-gold outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-serif font-bold text-maroon block">
                Policy Title (Hindi / देवनागरी)
              </label>
              <input
                type="text"
                value={selectedPolicy.titleHi || ""}
                onChange={(e) =>
                  setSelectedPolicy({ ...selectedPolicy, titleHi: e.target.value })
                }
                className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-cream/40 focus:border-gold outline-none font-serif"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-serif font-bold text-maroon block">
              Policy Content (English)
            </label>
            <textarea
              rows={8}
              value={selectedPolicy.contentEn || ""}
              onChange={(e) =>
                setSelectedPolicy({ ...selectedPolicy, contentEn: e.target.value })
              }
              className="w-full p-3 text-xs rounded-xl border border-border bg-cream/40 focus:border-gold outline-none leading-relaxed"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-serif font-bold text-maroon block">
              Policy Content (Hindi / देवनागरी)
            </label>
            <textarea
              rows={8}
              value={selectedPolicy.contentHi || ""}
              onChange={(e) =>
                setSelectedPolicy({ ...selectedPolicy, contentHi: e.target.value })
              }
              className="w-full p-3 text-xs rounded-xl border border-border bg-cream/40 focus:border-gold outline-none font-serif leading-relaxed"
            />
          </div>
        </div>
      )}
    </div>
  );
}
