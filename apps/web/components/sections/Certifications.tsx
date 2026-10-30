"use client";

import React, { useState } from "react";
import Image from "next/image";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Award, ExternalLink, Download, FileText, CheckCircle2 } from "lucide-react";

interface CertificationItem {
  id: string;
  title: string;
  issuer: string;
  number?: string;
  issueDate?: string;
  fileUrl: string;
  thumbUrl?: string;
}

interface CertificationsProps {
  certifications: CertificationItem[];
}

export function Certifications({ certifications }: CertificationsProps) {
  // CRITICAL RULE: Automatically hide when empty! Never display placeholder certificates.
  if (!certifications || certifications.length === 0) {
    return null;
  }

  const [activeCert, setActiveCert] = useState<CertificationItem | null>(null);

  const isPdf = (url: string) => url.toLowerCase().endsWith(".pdf");

  return (
    <section id="certifications" className="py-20 sm:py-24 bg-paper relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <SectionHeading
          badge="Official Recognition"
          title="Trust, Transparency & Governance"
          subtitle="Registered statutory approvals, tax exemptions, and government certifications validating our non-profit heritage stewardship."
        />

        <div className="mt-12 sm:mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {certifications.map((cert) => {
            const formattedDate = cert.issueDate
              ? new Date(cert.issueDate).toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })
              : null;

            return (
              <div
                key={cert.id}
                className="group relative rounded-3xl bg-cream/30 border border-gold/40 p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
              >
                <div>
                  {/* Certificate preview / badge */}
                  <div className="relative w-full h-48 rounded-2xl overflow-hidden border border-gold/30 bg-sand/20 mb-5 flex items-center justify-center">
                    {cert.thumbUrl && !cert.thumbUrl.endsWith(".pdf") ? (
                      <Image
                        src={cert.thumbUrl}
                        alt={cert.title}
                        fill
                        className="object-cover group-hover:scale-102 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center p-4 text-center">
                        <Award className="w-12 h-12 text-gold mb-2" />
                        <span className="text-xs font-serif font-semibold text-maroon">
                          Verified Document
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-flex items-center gap-1 text-[11px] font-sans font-semibold uppercase tracking-wider text-saffron-deep bg-saffron/10 px-2.5 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3 text-saffron" />
                      {cert.issuer}
                    </span>
                  </div>

                  <h3 className="font-serif text-xl font-bold text-maroon group-hover:text-saffron-deep transition-colors leading-snug">
                    {cert.title}
                  </h3>

                  {cert.number && (
                    <p className="text-xs text-ink-muted font-mono mt-1.5">
                      Reg / Ref: <span className="text-ink font-semibold">{cert.number}</span>
                    </p>
                  )}

                  {formattedDate && (
                    <p className="text-xs text-ink-muted font-sans mt-0.5">
                      Issued: {formattedDate}
                    </p>
                  )}
                </div>

                {/* View button */}
                <button
                  type="button"
                  onClick={() => setActiveCert(cert)}
                  className="mt-6 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gold/60 bg-paper hover:bg-sand/40 text-maroon font-serif font-semibold text-sm transition-all shadow-xs group-hover:border-gold cursor-pointer"
                >
                  <span>View Certificate</span>
                  <ExternalLink className="w-3.5 h-3.5 text-saffron" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lightbox Dialog */}
      <Dialog open={Boolean(activeCert)} onOpenChange={(open) => !open && setActiveCert(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] p-6 bg-paper border border-gold/60 rounded-3xl overflow-y-auto">
          {activeCert && (
            <div>
              <DialogHeader className="mb-4">
                <DialogTitle className="font-serif text-2xl font-bold text-maroon">
                  {activeCert.title}
                </DialogTitle>
                <p className="text-xs text-ink-muted">
                  Issued by: <span className="font-semibold text-saffron-deep">{activeCert.issuer}</span>
                  {activeCert.number ? ` • Ref: ${activeCert.number}` : ""}
                </p>
              </DialogHeader>

              {/* Document display */}
              <div className="relative w-full min-h-[400px] max-h-[600px] rounded-2xl overflow-hidden border border-gold/30 bg-sand/20 flex items-center justify-center mb-6">
                {isPdf(activeCert.fileUrl) ? (
                  <iframe
                    src={activeCert.fileUrl}
                    title={activeCert.title}
                    className="w-full h-[550px] border-none"
                  />
                ) : (
                  <div className="relative w-full h-[500px]">
                    <Image
                      src={activeCert.fileUrl}
                      alt={activeCert.title}
                      fill
                      className="object-contain"
                    />
                  </div>
                )}
              </div>

              {/* Download / Open action */}
              <div className="flex justify-end gap-3">
                <a
                  href={activeCert.fileUrl}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-saffron text-white font-serif font-semibold text-sm hover:bg-saffron-dark transition-all shadow-sm"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Document</span>
                </a>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
