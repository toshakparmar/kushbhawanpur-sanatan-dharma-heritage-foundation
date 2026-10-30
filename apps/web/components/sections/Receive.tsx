import React from "react";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { siteConfig } from "@/content/site.config";
import { FileCheck, MailCheck, ShieldCheck, HeartHandshake } from "lucide-react";

export function Receive() {
  const { donorBenefits, verification } = siteConfig;

  // Filter benefits based on configuration flags
  const activeBenefits = donorBenefits.filter((b) => {
    if (b.id === "tax-exemption") {
      return verification.has80GApproval;
    }
    return b.enabled;
  });

  const iconMap: Record<string, React.ReactNode> = {
    "official-receipt": <MailCheck className="w-5 h-5 text-maroon" />,
    "tax-exemption": <ShieldCheck className="w-5 h-5 text-banyan" />,
    "progress-reports": <FileCheck className="w-5 h-5 text-gold-dark" />,
    "sankalpa-prasad": <HeartHandshake className="w-5 h-5 text-saffron" />,
  };

  return (
    <section className="py-16 lg:py-20 bg-cream relative border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <SectionHeading
          hindiBadge="दाता सम्मान एवं पावती"
          badge="Donor Assurances"
          title="What Every Seva Patron Receives"
          description="Complete statutory transparency, timely digital acknowledgements, and periodic field updates on your seva."
          showDivider={false}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {activeBenefits.map((benefit) => (
            <div
              key={benefit.id}
              className="p-6 rounded-2xl bg-paper border border-border shadow-xs hover:border-gold/60 transition-all text-left flex flex-col space-y-3"
            >
              <div className="w-10 h-10 rounded-xl bg-sand/60 border border-border flex items-center justify-center">
                {iconMap[benefit.id] || <FileCheck className="w-5 h-5 text-maroon" />}
              </div>

              <h4 className="font-serif font-bold text-maroon text-base leading-snug">
                {benefit.title}
              </h4>

              <p className="text-xs text-ink-muted leading-relaxed font-sans">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
