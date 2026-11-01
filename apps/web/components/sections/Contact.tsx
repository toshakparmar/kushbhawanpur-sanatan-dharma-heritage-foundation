"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { siteConfig } from "@/content/site.config";
import { contactFormSchema, type ContactFormData, submitContactMessage } from "@/lib/forms";
import { Mail, MapPin, Phone, Send, CheckCircle2, Map } from "lucide-react";
import { toast } from "sonner";

interface ContactProps {
  org?: {
    nameEn?: string;
    nameHi?: string;
    email?: string;
    phone?: string;
    address?: string;
  };
  siteSettings?: {
    email?: string;
    donationEmail?: string;
    phone?: string;
    whatsappNumber?: string;
    mapEmbedUrl?: string;
    siteNameHi?: string;
  };
}

export function Contact({ org, siteSettings }: ContactProps = {}) {
  const [submitted, setSubmitted] = useState(false);
  const [loadMap, setLoadMap] = useState(false);
  const { contact, meta } = siteConfig;

  const displayEmail = siteSettings?.email || org?.email || contact.email;
  const displayDonationEmail = siteSettings?.donationEmail || contact.donationEmail || displayEmail;
  const displayPhone = siteSettings?.phone || org?.phone || contact.phone;
  const displayAddress = org?.address || `${contact.registeredAddress.line1}, ${contact.registeredAddress.city}, ${contact.registeredAddress.state} - ${contact.registeredAddress.pincode}`;
  const displayMapEmbed = siteSettings?.mapEmbedUrl || contact.mapEmbedUrl;
  const devanagariName = siteSettings?.siteNameHi || org?.nameHi || meta.devanagariName;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      interest: "donate",
      message: "",
      organization_website_hp: "",
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      const result = await submitContactMessage(data);
      if (result.success) {
        toast.success(result.message);
        setSubmitted(true);
        if (result.mailtoUrl) {
          window.location.href = result.mailtoUrl;
        }
        reset();
      } else {
        toast.error("Submission failed. Please email us directly.");
      }
    } catch {
      toast.error("An error occurred. Please write directly to our email.");
    }
  };

  return (
    <section id="contact" className="py-20 lg:py-28 bg-cream relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <SectionHeading
          hindiBadge="संपर्क एवं संवाद"
          badge="Reach Us"
          title="Connect with the Foundation"
          description="Whether you have questions regarding temple conservation, wish to visit our rural cow shelter, or plan an institutional partnership, we are here to welcome you."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start max-w-6xl mx-auto">
          
          {/* Left Column: Direct Foundation Contacts */}
          <div className="lg:col-span-5 flex flex-col space-y-6 text-left">
            <div className="p-6 sm:p-8 rounded-2xl bg-paper border border-border shadow-xs space-y-6">
              <h3 className="font-serif font-bold text-maroon text-2xl leading-tight">
                Trust Office Details
              </h3>

              <div className="space-y-5 text-sm text-ink-muted">
                {/* Address */}
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-sand flex items-center justify-center shrink-0 border border-border">
                    <MapPin className="w-4 h-4 text-maroon" />
                  </div>
                  <div>
                    <span className="text-xs uppercase font-semibold text-muted block">
                      Registered Address
                    </span>
                    <p className="text-ink font-medium mt-0.5 leading-snug">
                      {displayAddress}
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-sand flex items-center justify-center shrink-0 border border-border">
                    <Mail className="w-4 h-4 text-saffron" />
                  </div>
                  <div>
                    <span className="text-xs uppercase font-semibold text-muted block">
                      Email Communication
                    </span>
                    <a
                      href={`mailto:${displayEmail}`}
                      className="text-ink hover:text-maroon font-medium transition-colors block mt-0.5"
                    >
                      {displayEmail}
                    </a>
                    {displayDonationEmail && displayDonationEmail !== displayEmail && (
                      <a
                        href={`mailto:${displayDonationEmail}`}
                        className="text-xs text-muted hover:text-maroon transition-colors block"
                      >
                        Donations: {displayDonationEmail}
                      </a>
                    )}
                  </div>
                </div>

                {/* Phone (if configured) */}
                {displayPhone && (
                  <div className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-sand flex items-center justify-center shrink-0 border border-border">
                      <Phone className="w-4 h-4 text-banyan" />
                    </div>
                    <div>
                      <span className="text-xs uppercase font-semibold text-muted block">
                        Telephone
                      </span>
                      <a
                        href={`tel:${displayPhone}`}
                        className="text-ink hover:text-maroon font-medium transition-colors block mt-0.5"
                      >
                        {displayPhone}
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Cultural Tagline */}
              <div className="pt-4 border-t border-border flex items-center justify-between">
                <span className="font-devanagari text-xs text-maroon font-semibold">
                  {devanagariName}
                </span>
                <span className="text-[11px] text-muted">
                  {meta.city}
                </span>
              </div>
            </div>

            {/* Privacy-Preserving Map Facade (click to load) */}
            {displayMapEmbed && (
              <div className="rounded-2xl border border-border overflow-hidden bg-sand/30 aspect-[16/9] relative flex items-center justify-center">
                {loadMap ? (
                  <iframe
                    src={displayMapEmbed}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={false}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Foundation Office Map Location"
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => setLoadMap(true)}
                    className="flex flex-col items-center gap-2 p-4 text-xs font-semibold text-maroon hover:text-saffron-deep transition-colors cursor-pointer"
                  >
                    <Map className="w-8 h-8 text-gold-dark" />
                    <span>Click to view interactive map</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Right Column: Validated Contact Form */}
          <div className="lg:col-span-7 bg-paper p-6 sm:p-8 rounded-2xl border border-border shadow-xs text-left">
            <h3 className="font-serif font-bold text-maroon text-2xl leading-tight mb-2">
              Send a Message
            </h3>
            <p className="text-xs text-muted mb-6">
              Share your message or inquiry. We typically reply within 24–48 hours.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              
              {/* Honeypot field (hidden from real users) */}
              <input
                type="text"
                tabIndex={-1}
                autoComplete="off"
                className="hidden"
                {...register("organization_website_hp")}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="flex flex-col space-y-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted font-sans">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    {...register("name")}
                    className="w-full rounded-xl border border-border bg-cream/40 px-3.5 py-2.5 text-sm text-ink placeholder:text-muted/60 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30 transition-all"
                  />
                  {errors.name && (
                    <span className="text-[11px] text-maroon">
                      {errors.name.message}
                    </span>
                  )}
                </div>

                {/* Email Address */}
                <div className="flex flex-col space-y-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted font-sans">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    {...register("email")}
                    className="w-full rounded-xl border border-border bg-cream/40 px-3.5 py-2.5 text-sm text-ink placeholder:text-muted/60 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30 transition-all"
                  />
                  {errors.email && (
                    <span className="text-[11px] text-maroon">
                      {errors.email.message}
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Phone Number */}
                <div className="flex flex-col space-y-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted font-sans">
                    Phone / WhatsApp (Optional)
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    {...register("phone")}
                    className="w-full rounded-xl border border-border bg-cream/40 px-3.5 py-2.5 text-sm text-ink placeholder:text-muted/60 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30 transition-all"
                  />
                  {errors.phone && (
                    <span className="text-[11px] text-maroon">
                      {errors.phone.message}
                    </span>
                  )}
                </div>

                {/* Interest Dropdown */}
                <div className="flex flex-col space-y-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted font-sans">
                    Primary Interest *
                  </label>
                  <select
                    {...register("interest")}
                    className="w-full rounded-xl border border-border bg-cream/40 px-3.5 py-2.5 text-sm text-ink focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30 transition-all cursor-pointer"
                  >
                    <option value="donate">Donation / Seva Inquiry</option>
                    <option value="volunteer">Volunteering & Seva Time</option>
                    <option value="heritage-preservation">Temple & Monument Conservation</option>
                    <option value="gau-seva">Gau Seva & Animal Welfare</option>
                    <option value="csr">Corporate CSR Alliance</option>
                    <option value="other">General Query / Blessing</option>
                  </select>
                </div>
              </div>

              {/* Message Textarea */}
              <div className="flex flex-col space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted font-sans">
                  Your Message *
                </label>
                <textarea
                  rows={4}
                  placeholder="Share details of your inquiry, ideas, or questions..."
                  {...register("message")}
                  className="w-full rounded-xl border border-border bg-cream/40 px-3.5 py-2.5 text-sm text-ink placeholder:text-muted/60 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30 transition-all resize-none"
                />
                {errors.message && (
                  <span className="text-[11px] text-maroon">
                    {errors.message.message}
                  </span>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full sm:w-auto px-8 py-3 text-sm font-bold inline-flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? "Submitting..." : "Send Message"}</span>
                </button>
              </div>

            </form>
          </div>

        </div>

      </div>
    </section>
  );
}
