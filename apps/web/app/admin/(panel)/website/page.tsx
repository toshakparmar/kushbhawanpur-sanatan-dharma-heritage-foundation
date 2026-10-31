"use client";

import React, { useState, useEffect } from "react";
import { adminFetch } from "@/lib/admin-api";
import {
  Layers,
  CheckCircle2,
  Clock,
  Sparkles,
  Eye,
  History,
  RotateCcw,
  Save,
  ArrowUp,
  ArrowDown,
  Loader2,
  ExternalLink,
  Edit3,
} from "lucide-react";
import { toast } from "sonner";
import { Select } from "@/components/admin/ui/Select";
import { MediaUploader } from "@/components/admin/ui/MediaUploader";
import { HotspotPicker } from "@/components/admin/ui/HotspotPicker";
import { useConfirm } from "@/components/admin/ui/ConfirmDialog";

interface PageSection {
  id: string;
  key: string;
  enabled: boolean;
  sortOrder: number;
  variant: string;
  draftContent: any;
  publishedContent: any;
  publishedAt?: string;
  updatedAt: string;
  updatedBy?: string;
}

const SECTION_LABELS: Record<string, { title: string; desc: string }> = {
  hero: { title: "1. Hero Section", desc: "Main landing statement, sacred badges, and primary action buttons." },
  trust: { title: "2. Trust & Transparency Strip", desc: "Marquee showing direct seva, instant receipts, and transparency metrics." },
  about: { title: "3. About & Philosophy", desc: "Foundation origin, reverence for Kushbhawanpur, and dharmic vision." },
  team: { title: "3.1 Leadership & Trustees", desc: "Trustees, founders, and dedicated sevadars (managed in Team module)." },
  certifications: { title: "3.2 Official Registrations", desc: "80G, 12A, Trust deed, and government certifications." },
  story: { title: "4. Our Story — Sacred Symbols", desc: "The five sacred symbols of the emblem with interactive hotspots and Upanishadic verses." },
  work: { title: "5. Seva Focus Areas", desc: "Temple preservation, Vedic studies, Gaushala, and sacred ecology." },
  videos: { title: "6. Video Chronicles", desc: "Documentaries, aartis, and ground seva videos." },
  donate: { title: "7. Donate Conversion Center", desc: "Direct UPI & Bank transfer donation portal." },
  impact: { title: "8. Impact at a Glance", desc: "What each contribution tier directly manifests on the ground." },
  receive: { title: "9. What Donors Receive", desc: "Official 80G tax exemption, instant verified receipt, and puja sankalpa." },
  gallery: { title: "10. Moments of Heritage (Gallery)", desc: "Photographs of temples, gaushalas, and sacred ghats." },
  involve: { title: "11. Get Involved", desc: "Volunteer registration, community sharing, and CSR partnerships." },
  pledge: { title: "12. Eternal Vedic Pledge", desc: "Brihadaranyaka Upanishad shloka and foundation oath." },
  faq: { title: "13. Frequently Asked Questions", desc: "Common questions regarding donations, visits, and receipts." },
  contact: { title: "14. Contact & Office Details", desc: "Registered office address, contact numbers, email, and inquiry form." },
};

export default function WebsiteCmsPage() {
  const { confirm, ConfirmComponent } = useConfirm();
  const [sections, setSections] = useState<PageSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [publishingKey, setPublishingKey] = useState<string | null>(null);
  const [editingSection, setEditingSection] = useState<PageSection | null>(null);
  const [editFormData, setEditFormData] = useState<any>({});
  const [versions, setVersions] = useState<any[]>([]);
  const [showVersionsModal, setShowVersionsModal] = useState(false);
  const [selectedSectionForVersions, setSelectedSectionForVersions] = useState<string | null>(null);

  useEffect(() => {
    loadSections();
  }, []);

  const loadSections = async () => {
    setLoading(true);
    try {
      const data = await adminFetch("/admin/sections");
      setSections(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Failed to load page sections.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleEnabled = async (section: PageSection) => {
    try {
      const updated = await adminFetch(`/admin/sections/${section.key}`, {
        method: "PUT",
        body: JSON.stringify({ enabled: !section.enabled }),
      });
      setSections((prev) => prev.map((s) => (s.key === section.key ? updated : s)));
      toast.success(`${SECTION_LABELS[section.key]?.title || section.key} ${!section.enabled ? "enabled" : "disabled"}.`);
    } catch {
      toast.error("Failed to toggle section visibility.");
    }
  };

  const handleVariantChange = async (section: PageSection, variant: string) => {
    try {
      const updated = await adminFetch(`/admin/sections/${section.key}`, {
        method: "PUT",
        body: JSON.stringify({ variant }),
      });
      setSections((prev) => prev.map((s) => (s.key === section.key ? updated : s)));
      toast.success("Background styling variant updated.");
    } catch {
      toast.error("Failed to update section variant.");
    }
  };

  const handleMoveOrder = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sections.length) return;

    const newSections = [...sections];
    const [moved] = newSections.splice(index, 1);
    newSections.splice(targetIndex, 0, moved);

    const reordered = newSections.map((s, idx) => ({ key: s.key, sortOrder: idx + 1 }));
    setSections(newSections.map((s, idx) => ({ ...s, sortOrder: idx + 1 })));

    try {
      await adminFetch("/admin/sections/reorder", {
        method: "PATCH",
        body: JSON.stringify(reordered),
      });
      toast.success("Section ordering saved.");
    } catch {
      toast.error("Failed to save reordered sections.");
      loadSections();
    }
  };

  const handleOpenEdit = (section: PageSection) => {
    setEditingSection(section);
    setEditFormData({
      ...section.draftContent,
      variant: section.variant,
      enabled: section.enabled,
    });
  };

  const handleSaveDraft = async () => {
    if (!editingSection) return;
    setSavingKey(editingSection.key);
    try {
      const updated = await adminFetch(`/admin/sections/${editingSection.key}`, {
        method: "PUT",
        body: JSON.stringify({
          draftContent: editFormData,
          variant: editFormData.variant,
          enabled: editFormData.enabled,
        }),
      });
      setSections((prev) => prev.map((s) => (s.key === editingSection.key ? updated : s)));
      setEditingSection(null);
      toast.success("Section draft saved successfully.");
    } catch {
      toast.error("Failed to save section draft.");
    } finally {
      setSavingKey(null);
    }
  };

  const handlePublish = async (section: PageSection) => {
    const isConfirmed = await confirm({
      title: `Publish ${SECTION_LABELS[section.key]?.title || section.key}?`,
      description: "This will make all draft changes immediately visible on the public website and create a permanent version backup in history.",
      confirmLabel: "Publish to Website",
      variant: "warning",
    });

    if (!isConfirmed) return;

    setPublishingKey(section.key);
    try {
      const updated = await adminFetch(`/admin/sections/${section.key}/publish`, {
        method: "POST",
      });
      setSections((prev) => prev.map((s) => (s.key === section.key ? updated : s)));
      toast.success("Section published live to website!");
    } catch {
      toast.error("Failed to publish section.");
    } finally {
      setPublishingKey(null);
    }
  };

  const handleRevert = async (section: PageSection) => {
    const isConfirmed = await confirm({
      title: "Revert draft to published?",
      description: "Any unpublished draft edits in this section will be replaced by the currently live published version.",
      confirmLabel: "Revert Changes",
      variant: "danger",
    });

    if (!isConfirmed) return;

    try {
      const updated = await adminFetch(`/admin/sections/${section.key}/revert`, {
        method: "POST",
      });
      setSections((prev) => prev.map((s) => (s.key === section.key ? updated : s)));
      toast.success("Section draft reverted to published version.");
    } catch {
      toast.error("Failed to revert section.");
    }
  };


  const handleOpenVersions = async (sectionKey: string) => {
    setSelectedSectionForVersions(sectionKey);
    setShowVersionsModal(true);
    try {
      const v = await adminFetch(`/admin/sections/${sectionKey}/versions`);
      setVersions(Array.isArray(v) ? v : []);
    } catch {
      toast.error("Failed to load version history.");
    }
  };

  const handleRestoreVersion = async (versionId: string) => {
    if (!selectedSectionForVersions) return;
    try {
      const updated = await adminFetch(
        `/admin/sections/${selectedSectionForVersions}/versions/${versionId}/restore`,
        { method: "POST" }
      );
      setSections((prev) => prev.map((s) => (s.key === selectedSectionForVersions ? updated : s)));
      setShowVersionsModal(false);
      toast.success("Version restored into draft! You can preview or publish it.");
    } catch {
      toast.error("Failed to restore version.");
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-6xl mx-auto">
      {ConfirmComponent}

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gold/30 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-maroon/10 text-maroon">
              <Layers className="w-5 h-5 text-maroon" />
            </span>
            <h1 className="text-2xl font-serif font-bold text-maroon">
              Website CMS & Dynamic Sections
            </h1>
          </div>
          <p className="text-xs text-ink-muted font-sans">
            Manage, edit, reorder, and publish every public section of the website with instant live previews.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 rounded-xl bg-paper hover:bg-sand/30 border border-gold/40 text-xs font-serif font-semibold text-maroon flex items-center gap-1.5 shadow-xs"
          >
            <span>Live Site</span>
            <ExternalLink className="w-3.5 h-3.5 text-saffron" />
          </a>
        </div>
      </div>

      {/* Sections List */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3 text-ink-muted">
          <Loader2 className="w-8 h-8 animate-spin text-saffron" />
          <span className="text-xs font-serif">Loading CMS sections...</span>
        </div>
      ) : (
        <div className="space-y-3">
          {sections.map((section, idx) => {
            const labelInfo = SECTION_LABELS[section.key] || {
              title: section.key,
              desc: "Dynamic website section.",
            };
            const isModified =
              JSON.stringify(section.draftContent) !== JSON.stringify(section.publishedContent);

            return (
              <div
                key={section.id}
                className={`p-4 rounded-2xl border transition-all ${
                  section.enabled
                    ? "bg-paper border-gold/30 shadow-2xs hover:border-gold"
                    : "bg-sand/20 border-border/50 opacity-70"
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Left: Reorder + Title + Description */}
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="flex flex-col gap-1 shrink-0 pt-0.5">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => handleMoveOrder(idx, "up")}
                        className="p-1 rounded hover:bg-sand/40 disabled:opacity-30 text-ink-muted hover:text-maroon"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === sections.length - 1}
                        onClick={() => handleMoveOrder(idx, "down")}
                        className="p-1 rounded hover:bg-sand/40 disabled:opacity-30 text-ink-muted hover:text-maroon"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-mono font-bold text-saffron-deep">
                          #{section.sortOrder}
                        </span>
                        <h2 className="text-sm font-serif font-bold text-maroon">
                          {labelInfo.title}
                        </h2>
                        {isModified ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-sans font-bold bg-amber-100 text-amber-800 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> Draft Edits
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-sans font-bold bg-green-100 text-green-800 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Live
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-ink-muted mt-0.5 truncate">
                        {labelInfo.desc}
                      </p>
                    </div>
                  </div>

                  {/* Right: Controls & Actions */}
                  <div className="flex items-center gap-2.5 flex-wrap shrink-0">
                    {/* Background Variant Selector */}
                    <div className="w-32">
                      <Select
                        value={section.variant}
                        onChange={(val) => handleVariantChange(section, val)}
                        options={[
                          { label: "Paper (Default)", value: "default" },
                          { label: "Cream Sand", value: "sand" },
                          { label: "Maroon Band", value: "maroon" },
                        ]}
                      />
                    </div>

                    {/* Enable / Disable Switch */}
                    <label className="flex items-center gap-1.5 cursor-pointer text-xs font-serif text-ink-muted">
                      <input
                        type="checkbox"
                        checked={section.enabled}
                        onChange={() => handleToggleEnabled(section)}
                        className="w-4 h-4 rounded text-maroon accent-maroon cursor-pointer"
                      />
                      <span>Visible</span>
                    </label>

                    {/* Edit Content Button */}
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(section)}
                      className="px-3 py-1.5 rounded-xl bg-sand/30 hover:bg-sand/60 text-maroon text-xs font-serif font-semibold border border-gold/30 flex items-center gap-1 shadow-2xs"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-saffron" />
                      <span>Edit Content</span>
                    </button>

                    {/* Version History Button */}
                    <button
                      type="button"
                      onClick={() => handleOpenVersions(section.key)}
                      className="p-1.5 rounded-xl hover:bg-sand/40 text-ink-muted hover:text-maroon border border-border/40"
                      title="Version History"
                    >
                      <History className="w-3.5 h-3.5" />
                    </button>

                    {/* Revert Button (if modified) */}
                    {isModified && (
                      <button
                        type="button"
                        onClick={() => handleRevert(section)}
                        className="p-1.5 rounded-xl hover:bg-red-50 text-ink-muted hover:text-red-700 border border-border/40"
                        title="Revert Draft to Live"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {/* Publish Button */}
                    <button
                      type="button"
                      disabled={!isModified || publishingKey === section.key}
                      onClick={() => handlePublish(section)}
                      className="px-3 py-1.5 rounded-xl bg-maroon hover:bg-maroon-dark text-cream text-xs font-serif font-bold disabled:opacity-40 disabled:pointer-events-none flex items-center gap-1.5 shadow-xs"
                    >
                      {publishingKey === section.key ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-gold" />
                      ) : (
                        <Sparkles className="w-3.5 h-3.5 text-gold" />
                      )}
                      <span>Publish</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Section Content Editor Drawer / Modal */}
      {editingSection && (
        <div className="fixed inset-0 z-50 bg-charcoal/50 flex justify-end">
          <div className="w-full max-w-2xl bg-paper h-full flex flex-col shadow-2xl border-l border-gold/30 overflow-hidden">
            {/* Drawer Header */}
            <div className="p-5 border-b border-border flex items-center justify-between bg-sand/20">
              <div>
                <h3 className="font-serif font-bold text-base text-maroon">
                  Edit {SECTION_LABELS[editingSection.key]?.title || editingSection.key}
                </h3>
                <span className="text-[11px] text-ink-muted font-sans">
                  Changes save to draft. Use Publish to push live to the website.
                </span>
              </div>
              <button
                type="button"
                onClick={() => setEditingSection(null)}
                className="text-ink-muted hover:text-maroon font-bold text-sm px-2 py-1"
              >
                ✕
              </button>
            </div>

            {/* Drawer Scrollable Form */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {/* English Heading */}
              {editFormData.titleEn !== undefined && (
                <div className="space-y-1">
                  <label className="text-xs font-serif font-bold text-maroon block">
                    Title (English)
                  </label>
                  <input
                    type="text"
                    value={editFormData.titleEn || ""}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, titleEn: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-cream/40 focus:border-gold outline-none"
                  />
                </div>
              )}

              {/* Hindi Heading */}
              {editFormData.titleHi !== undefined && (
                <div className="space-y-1">
                  <label className="text-xs font-serif font-bold text-maroon block">
                    Title (Hindi / देवनागरी)
                  </label>
                  <input
                    type="text"
                    value={editFormData.titleHi || ""}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, titleHi: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-cream/40 focus:border-gold outline-none font-serif"
                  />
                </div>
              )}

              {/* Subtitle / Intro English */}
              {(editFormData.subtitleEn !== undefined || editFormData.introEn !== undefined) && (
                <div className="space-y-1">
                  <label className="text-xs font-serif font-bold text-maroon block">
                    Subtitle / Paragraph (English)
                  </label>
                  <textarea
                    rows={3}
                    value={editFormData.subtitleEn || editFormData.introEn || ""}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        subtitleEn: e.target.value,
                        introEn: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-cream/40 focus:border-gold outline-none"
                  />
                </div>
              )}

              {/* Subtitle / Intro Hindi */}
              {(editFormData.subtitleHi !== undefined || editFormData.introHi !== undefined) && (
                <div className="space-y-1">
                  <label className="text-xs font-serif font-bold text-maroon block">
                    Subtitle / Paragraph (Hindi / देवनागरी)
                  </label>
                  <textarea
                    rows={3}
                    value={editFormData.subtitleHi || editFormData.introHi || ""}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        subtitleHi: e.target.value,
                        introHi: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-cream/40 focus:border-gold outline-none font-serif"
                  />
                </div>
              )}

              {/* CTAs */}
              {editFormData.ctaLabelEn !== undefined && (
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="space-y-1">
                    <label className="text-xs font-serif font-bold text-maroon block">
                      Primary CTA Button Label
                    </label>
                    <input
                      type="text"
                      value={editFormData.ctaLabelEn || ""}
                      onChange={(e) =>
                        setEditFormData({ ...editFormData, ctaLabelEn: e.target.value })
                      }
                      className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-cream/40 focus:border-gold outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-serif font-bold text-maroon block">
                      CTA Target (Anchor / URL)
                    </label>
                    <input
                      type="text"
                      value={editFormData.ctaTarget || ""}
                      onChange={(e) =>
                        setEditFormData({ ...editFormData, ctaTarget: e.target.value })
                      }
                      className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-cream/40 focus:border-gold outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Story Section Hotspot Picker */}
              {editingSection.key === "story" && (
                <div className="pt-2">
                  <HotspotPicker
                    value={
                      editFormData.hotspot || { x: 50, y: 34, radius: 12 }
                    }
                    onChange={(hotspot) =>
                      setEditFormData({ ...editFormData, hotspot })
                    }
                  />
                </div>
              )}

              {/* Background Image / Banner Uploader */}
              {editFormData.bgImageUrl !== undefined && (
                <div className="pt-2">
                  <MediaUploader
                    value={editFormData.bgImageUrl}
                    onChange={(url) =>
                      setEditFormData({ ...editFormData, bgImageUrl: url })
                    }
                    label="Background Banner Image"
                    aspectRatio={16 / 9}
                  />
                </div>
              )}
            </div>

            {/* Drawer Footer Actions */}
            <div className="p-4 border-t border-border bg-sand/20 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setEditingSection(null)}
                className="px-4 py-2 rounded-xl text-xs font-serif font-semibold text-ink-muted hover:text-maroon hover:bg-sand/40"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={savingKey !== null}
                onClick={handleSaveDraft}
                className="px-5 py-2 rounded-xl bg-maroon hover:bg-maroon-dark text-cream text-xs font-serif font-bold flex items-center gap-1.5 shadow-xs"
              >
                {savingKey ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Save className="w-3.5 h-3.5 text-gold" />
                )}
                <span>Save Draft</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Version History Modal */}
      {showVersionsModal && (
        <div className="fixed inset-0 z-50 bg-charcoal/50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-paper p-6 rounded-3xl border border-gold/30 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-serif font-bold text-base text-maroon flex items-center gap-1.5">
                <History className="w-4 h-4 text-saffron" />
                <span>Version History — {selectedSectionForVersions}</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowVersionsModal(false)}
                className="text-ink-muted hover:text-maroon font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto space-y-2">
              {versions.length === 0 ? (
                <p className="text-xs text-ink-muted font-serif py-6 text-center">
                  No previous versions recorded yet.
                </p>
              ) : (
                versions.map((ver, idx) => (
                  <div
                    key={ver.id}
                    className="p-3 rounded-xl border border-border/60 bg-cream/40 flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <span className="font-mono font-bold text-maroon block">
                        Version #{versions.length - idx}
                      </span>
                      <span className="text-[10px] text-ink-muted">
                        Published on {new Date(ver.publishedAt).toLocaleString()} by {ver.publishedBy || "admin"}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRestoreVersion(ver.id)}
                      className="px-2.5 py-1 rounded-lg bg-sand/30 hover:bg-sand/60 text-maroon font-serif font-semibold border border-gold/40 text-[11px]"
                    >
                      Restore
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
