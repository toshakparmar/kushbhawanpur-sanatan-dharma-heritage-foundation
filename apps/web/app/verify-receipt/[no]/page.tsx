import React from "react";
import Link from "next/link";
import { formatINR } from "@kushbhawanpur/shared";
import { CheckCircle2, XCircle, ShieldCheck, FileCheck, Landmark } from "lucide-react";
import { verifyReceiptPublic } from "@/lib/api";

export default async function VerifyReceiptPage({
  params,
}: {
  params: Promise<{ no: string }>;
}) {
  const resolvedParams = await params;
  const receiptNo = decodeURIComponent(resolvedParams.no);

  let verificationResult: any = null;
  try {
    verificationResult = await verifyReceiptPublic(receiptNo);
  } catch (err: any) {
    verificationResult = { isValid: false, message: err.message };
  }

  const isValid = verificationResult?.isValid;

  return (
    <div className="min-h-screen bg-cream py-16 sm:py-24 px-4 sm:px-6">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-serif font-semibold text-saffron-deep hover:text-maroon mb-4"
          >
            ← Return to Foundation Homepage
          </Link>
          <div className="flex justify-center mb-3">
            <div className="p-3 bg-sand/60 rounded-2xl border border-gold/40">
              <Landmark className="w-8 h-8 text-maroon" />
            </div>
          </div>
          <h1 className="font-serif text-3xl font-bold text-maroon mb-1">
            Official Receipt Verification
          </h1>
          <p className="text-xs text-ink-muted">
            Sanatan Dharma & Heritage Foundation Digital Verification Portal
          </p>
        </div>

        <div className="rounded-3xl bg-paper p-6 sm:p-8 border-2 border-gold/40 shadow-xl space-y-6">
          {isValid ? (
            <>
              {/* Verified Seal */}
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-green-50 border border-green-200">
                <CheckCircle2 className="w-8 h-8 text-green-700 shrink-0" />
                <div>
                  <h2 className="font-serif font-bold text-base text-green-900 leading-tight">
                    Authentic & Valid Donation Receipt
                  </h2>
                  <p className="text-xs text-green-700 font-sans mt-0.5">
                    This document is registered in the official trust accounts ledger.
                  </p>
                </div>
              </div>

              {/* Receipt Parameters (Zero Donor PII as strictly required) */}
              <div className="space-y-3 pt-2 text-xs sm:text-sm">
                <div className="flex justify-between border-b border-border/60 pb-2">
                  <span className="text-ink-muted">Receipt Number</span>
                  <span className="font-mono font-bold text-maroon">
                    {verificationResult.receiptNo}
                  </span>
                </div>

                <div className="flex justify-between border-b border-border/60 pb-2">
                  <span className="text-ink-muted">Issue Date</span>
                  <span className="font-mono text-ink">
                    {new Date(verificationResult.issuedAt).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>

                <div className="flex justify-between border-b border-border/60 pb-2">
                  <span className="text-ink-muted">Seva Purpose</span>
                  <span className="font-semibold text-maroon">
                    {verificationResult.sevaTitle}
                  </span>
                </div>

                <div className="flex justify-between border-b border-border/60 pb-2">
                  <span className="text-ink-muted">Contribution Amount</span>
                  <span className="font-serif font-bold text-saffron-deep text-base">
                    {formatINR(verificationResult.amountRupees)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-ink-muted">Issued By</span>
                  <span className="font-serif font-semibold text-maroon text-right">
                    {verificationResult.orgName}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-border text-center">
                <span className="inline-flex items-center gap-1.5 text-xs text-ink-muted">
                  <ShieldCheck className="w-4 h-4 text-gold" />
                  Encrypted cryptographic verification stamp
                </span>
              </div>
            </>
          ) : (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full bg-red-100 text-red-700 flex items-center justify-center mx-auto mb-4">
                <XCircle className="w-10 h-10" />
              </div>
              <h2 className="font-serif text-2xl font-bold text-maroon mb-2">
                Invalid or Void Receipt
              </h2>
              <p className="text-xs text-ink-muted max-w-sm mx-auto mb-4">
                {verificationResult?.message ||
                  "This receipt number could not be authenticated against foundation records, or has been revoked."}
              </p>
              <div className="p-3 rounded-xl bg-sand/40 border border-border text-xs text-ink-muted font-mono">
                Receipt Ref: {receiptNo}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
