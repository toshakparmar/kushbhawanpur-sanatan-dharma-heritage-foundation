import React from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { siteConfig } from "@/content/site.config";

export function UtilityBar() {
  const { contact, meta } = siteConfig;

  return (
    <div className="hidden lg:block bg-sand/80 border-b border-border/80 text-xs text-ink-muted py-1.5 px-4 font-sans select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Sanskrit & Hindi motto badge */}
        <div className="flex items-center gap-2">
          <span className="font-devanagari text-maroon font-semibold tracking-wide text-xs">
            {meta.devanagariTagline}
          </span>
          <span className="text-border">·</span>
          <span className="text-muted text-[11px]">
            {meta.city}, {meta.state}
          </span>
        </div>

        {/* Contact items */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1.5 text-muted hover:text-maroon transition-colors">
            <MapPin className="w-3.5 h-3.5 text-gold-dark shrink-0" />
            <span>
              {contact.registeredAddress.line1}, {contact.registeredAddress.city}
            </span>
          </div>

          <a
            href={`mailto:${contact.donationEmail}`}
            className="flex items-center gap-1.5 text-muted hover:text-maroon transition-colors"
          >
            <Mail className="w-3.5 h-3.5 text-saffron shrink-0" />
            <span>{contact.donationEmail}</span>
          </a>

          {contact.phone && (
            <a
              href={`tel:${contact.phone}`}
              className="flex items-center gap-1.5 text-muted hover:text-maroon transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-banyan shrink-0" />
              <span>{contact.phone}</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
