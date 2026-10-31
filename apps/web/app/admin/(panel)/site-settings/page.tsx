"use client";

import React, { useState, useEffect } from "react";
import { adminFetch } from "@/lib/admin-api";
import {
  Building,
  Save,
  Globe,
  Share2,
  Mail,
  Phone,
  BarChart2,
  Bell,
  Loader2,
  MapPin,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { MediaUploader } from "@/components/admin/ui/MediaUploader";

export default function SiteSettingsPage() {
  const [formData, setFormData] = useState<any>({
    siteNameEn: "",
    siteNameHi: "",
    taglineEn: "",
    taglineHi: "",
    logoHeaderUrl: "",
    logoFooterUrl: "",
    logoLightUrl: "",
    faviconUrl: "",
    ogImageUrl: "",
    email: "",
    donationEmail: "",
    phone: "",
    whatsappNumber: "",
    mapEmbedUrl: "",
    addressJson: {
      line1: "",
      line2: "",
      city: "",
      state: "",
      pincode: "",
      country: "",
    },
    socialLinks: {
      twitter: "",
      facebook: "",
      instagram: "",
      youtube: "",
    },
    announcementEnabled: false,
    liveStatsEnabled: false,
    statsHistoricalDonorsOffset: 0,
    statsHistoricalAmountOffsetPaise: 0,
    footerTextEn: "",
    footerTextHi: "",
    copyrightLineEn: "",
    copyrightLineHi: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const data = await adminFetch("/admin/site-settings");
      if (data) {
        setFormData({
          ...data,
          addressJson: data.addressJson || {},
          socialLinks: data.socialLinks || {},
          statsHistoricalAmountOffsetPaise: data.statsHistoricalAmountOffsetPaise ? Number(data.statsHistoricalAmountOffsetPaise) : 0,
        });
      }
    } catch {
      toast.error("Failed to load site settings.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await adminFetch("/admin/site-settings", {
        method: "PUT",
        body: JSON.stringify({
          ...formData,
          statsHistoricalDonorsOffset: Number(formData.statsHistoricalDonorsOffset) || 0,
          statsHistoricalAmountOffsetPaise: Number(formData.statsHistoricalAmountOffsetPaise) || 0,
        }),
      });
      toast.success("Site settings and branding saved successfully!");
    } catch {
      toast.error("Failed to save site settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center gap-3 text-ink-muted">
        <Loader2 className="w-8 h-8 animate-spin text-saffron" />
        <span className="text-xs font-serif">Loading site settings...</span>
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
              <Globe className="w-5 h-5 text-maroon" />
            </span>
            <h1 className="text-2xl font-serif font-bold text-maroon">
              Site & SEO Settings
            </h1>
          </div>
          <p className="text-xs text-ink-muted font-sans">
            Brand identity, contact numbers, social media channels, live donation ticker, and global SEO metadata.
          </p>
        </div>

        <button
          type="button"
          disabled={saving}
          onClick={handleSubmit}
          className="px-5 py-2 rounded-xl bg-maroon hover:bg-maroon-dark text-cream text-xs font-serif font-bold flex items-center gap-1.5 shadow-xs shrink-0 disabled:opacity-50"
        >
          {saving ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Save className="w-3.5 h-3.5 text-gold" />
          )}
          <span>Save Changes</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Foundation Name & Taglines */}
        <div className="p-6 rounded-3xl bg-paper border border-gold/30 shadow-2xs space-y-4">
          <h2 className="text-sm font-serif font-bold text-maroon flex items-center gap-2 border-b border-border/50 pb-2">
            <Building className="w-4 h-4 text-saffron" />
            <span>Identity & Brand Taglines</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-serif font-bold text-maroon block">
                Official Name (English)
              </label>
              <input
                type="text"
                value={formData.siteNameEn || ""}
                onChange={(e) => setFormData({ ...formData, siteNameEn: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-cream/40 focus:border-gold outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-serif font-bold text-maroon block">
                Official Name (Hindi / देवनागरी)
              </label>
              <input
                type="text"
                value={formData.siteNameHi || ""}
                onChange={(e) => setFormData({ ...formData, siteNameHi: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-cream/40 focus:border-gold outline-none font-serif"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-serif font-bold text-maroon block">
                Tagline / Motto (English)
              </label>
              <input
                type="text"
                value={formData.taglineEn || ""}
                onChange={(e) => setFormData({ ...formData, taglineEn: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-cream/40 focus:border-gold outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-serif font-bold text-maroon block">
                Tagline / Shloka (Hindi / देवनागरी)
              </label>
              <input
                type="text"
                value={formData.taglineHi || ""}
                onChange={(e) => setFormData({ ...formData, taglineHi: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-cream/40 focus:border-gold outline-none font-serif"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Logo & Brand Assets */}
        <div className="p-6 rounded-3xl bg-paper border border-gold/30 shadow-2xs space-y-4">
          <h2 className="text-sm font-serif font-bold text-maroon flex items-center gap-2 border-b border-border/50 pb-2">
            <Sparkles className="w-4 h-4 text-saffron" />
            <span>Logos & OpenGraph Visuals</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <MediaUploader
              value={formData.logoHeaderUrl}
              onChange={(url) => setFormData({ ...formData, logoHeaderUrl: url })}
              label="Header & Navigation Logo"
              aspectRatio={1}
            />

            <MediaUploader
              value={formData.ogImageUrl}
              onChange={(url) => setFormData({ ...formData, ogImageUrl: url })}
              label="OpenGraph Social Share Card (1200×630)"
              aspectRatio={1.91 / 1}
            />
          </div>
        </div>

        {/* Section 3: Contact & Communication */}
        <div className="p-6 rounded-3xl bg-paper border border-gold/30 shadow-2xs space-y-4">
          <h2 className="text-sm font-serif font-bold text-maroon flex items-center gap-2 border-b border-border/50 pb-2">
            <Mail className="w-4 h-4 text-saffron" />
            <span>Public Contact Details</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-serif font-bold text-maroon block">
                General Email
              </label>
              <input
                type="email"
                value={formData.email || ""}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-cream/40 focus:border-gold outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-serif font-bold text-maroon block">
                Donation Inquiries Email
              </label>
              <input
                type="email"
                value={formData.donationEmail || ""}
                onChange={(e) => setFormData({ ...formData, donationEmail: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-cream/40 focus:border-gold outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-serif font-bold text-maroon block">
                Phone Number
              </label>
              <input
                type="text"
                value={formData.phone || ""}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-cream/40 focus:border-gold outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-serif font-bold text-maroon block">
                WhatsApp Number
              </label>
              <input
                type="text"
                value={formData.whatsappNumber || ""}
                onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-cream/40 focus:border-gold outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Social Media Links */}
        <div className="p-6 rounded-3xl bg-paper border border-gold/30 shadow-2xs space-y-4">
          <h2 className="text-sm font-serif font-bold text-maroon flex items-center gap-2 border-b border-border/50 pb-2">
            <Share2 className="w-4 h-4 text-saffron" />
            <span>Official Social Channels</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-serif font-bold text-maroon block">Twitter / X URL</label>
              <input
                type="text"
                value={formData.socialLinks?.twitter || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    socialLinks: { ...formData.socialLinks, twitter: e.target.value },
                  })
                }
                className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-cream/40 focus:border-gold outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-serif font-bold text-maroon block">Facebook Page</label>
              <input
                type="text"
                value={formData.socialLinks?.facebook || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    socialLinks: { ...formData.socialLinks, facebook: e.target.value },
                  })
                }
                className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-cream/40 focus:border-gold outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-serif font-bold text-maroon block">Instagram Handle</label>
              <input
                type="text"
                value={formData.socialLinks?.instagram || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    socialLinks: { ...formData.socialLinks, instagram: e.target.value },
                  })
                }
                className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-cream/40 focus:border-gold outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-serif font-bold text-maroon block">YouTube Channel</label>
              <input
                type="text"
                value={formData.socialLinks?.youtube || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    socialLinks: { ...formData.socialLinks, youtube: e.target.value },
                  })
                }
                className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-cream/40 focus:border-gold outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 5: Live Verified Donation Stats Strip */}
        <div className="p-6 rounded-3xl bg-paper border border-gold/30 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-border/50 pb-2">
            <h2 className="text-sm font-serif font-bold text-maroon flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-saffron" />
              <span>Live Verified Donation Stats Strip</span>
            </h2>
            <label className="flex items-center gap-2 cursor-pointer text-xs font-serif font-bold text-maroon">
              <input
                type="checkbox"
                checked={formData.liveStatsEnabled}
                onChange={(e) => setFormData({ ...formData, liveStatsEnabled: e.target.checked })}
                className="w-4 h-4 rounded text-maroon accent-maroon cursor-pointer"
              />
              <span>Display Live Strip on Public Site</span>
            </label>
          </div>

          <p className="text-[11px] text-ink-muted">
            Strict Transparency Guarantee: When enabled, this ticker strictly sums <strong>verified</strong> donations from the database. You can optionally add manual historical offline numbers from prior years.
          </p>

          {formData.liveStatsEnabled && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1">
                <label className="text-xs font-serif font-bold text-maroon block">
                  Historical Donors Offset (Offline Count)
                </label>
                <input
                  type="number"
                  value={formData.statsHistoricalDonorsOffset || 0}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      statsHistoricalDonorsOffset: Number(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-cream/40 focus:border-gold outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-serif font-bold text-maroon block">
                  Historical Amount Offset (in Paise, ₹1 = 100 paise)
                </label>
                <input
                  type="number"
                  value={formData.statsHistoricalAmountOffsetPaise || 0}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      statsHistoricalAmountOffsetPaise: Number(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-cream/40 focus:border-gold outline-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* Save Bar */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-maroon hover:bg-maroon-dark text-cream text-xs font-serif font-bold flex items-center gap-2 shadow-xs disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 text-gold" />}
            <span>Save All Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
}
