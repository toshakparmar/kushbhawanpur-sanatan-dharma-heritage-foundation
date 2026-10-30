"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { getDonationStatus } from "@/lib/api";
import { formatINR } from "@kushbhawanpur/shared";
import {
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  FileText,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";

function StatusContent() {
  const searchParams = useSearchParams();
  const initialRef = searchParams.get("ref") || "";
  const initialToken = searchParams.get("token") || "";

  const [refId, setRefId] = useState(initialRef);
  const [contact, setContact] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [statusResult, setStatusResult] = useState<any>(null);

  const fetchStatus = async (ref: string, cont?: string, tok?: string) => {
    if (!ref.trim()) return;
    setErrorMsg(null);
    setLoading(true);

    try {
      const res = await getDonationStatus(ref.trim(), cont?.trim(), tok || undefined);
      setStatusResult(res);
    } catch (err: any) {
      setErrorMsg(err.message || "Could not find donation record with the provided information.");
      setStatusResult(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialRef) {
      fetchStatus(initialRef, undefined, initialToken);
    }
  }, [initialRef, initialToken]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchStatus(refId, contact);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "VERIFIED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 text-green-800 font-semibold text-xs">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            Verified & Receipt Issued
          </span>
        );
      case "PENDING_VERIFICATION":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 font-semibold text-xs">
            <Clock className="w-4 h-4 text-amber-600" />
            Under Bank Verification
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-800 font-semibold text-xs">
            <XCircle className="w-4 h-4 text-red-600" />
            Could Not Verify
          </span>
        );
      case "INITIATED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 font-semibold text-xs">
            <Clock className="w-4 h-4 text-blue-600" />
            Awaiting Payment / Proof
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-gray-800 font-semibold text-xs">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-cream py-16 sm:py-24 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-serif font-semibold text-saffron-deep hover:text-maroon mb-4"
          >
            ← Return to Foundation Homepage
          </Link>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-maroon mb-2">
            Donation Status Tracker
          </h1>
          <p className="text-xs sm:text-sm text-ink-muted font-sans max-w-md mx-auto">
            Check the bank reconciliation and receipt status of your sacred seva contribution.
          </p>
        </div>

        {/* Search Card */}
        <div className="rounded-3xl bg-paper p-6 sm:p-8 border border-gold/40 shadow-xl mb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-serif text-sm font-bold text-maroon mb-1.5">
                Donation Reference ID *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. KSDHF-7K3Q9M"
                value={refId}
                onChange={(e) => setRefId(e.target.value.toUpperCase().trim())}
                className="w-full px-4 py-2.5 rounded-xl border border-gold/50 bg-paper text-maroon font-mono font-bold text-base focus:outline-none focus:ring-2 focus:ring-gold uppercase"
              />
            </div>

            <div>
              <label className="block font-serif text-sm font-bold text-maroon mb-1.5">
                Donor Email or Registered Mobile Number
              </label>
              <input
                type="text"
                placeholder="Enter email or 10-digit mobile"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-paper text-sm text-ink focus:outline-none focus:ring-2 focus:ring-gold"
              />
              <span className="text-[11px] text-ink-muted">
                Required for privacy protection if viewing without direct receipt link.
              </span>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-saffron text-white font-serif font-bold text-sm hover:bg-saffron-dark transition-all shadow-md cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Looking up...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Check Status</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results Display */}
        {statusResult && (
          <div className="rounded-3xl bg-paper p-6 sm:p-8 border-2 border-gold/40 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-border">
              <div>
                <span className="text-xs text-ink-muted block">Reference ID</span>
                <span className="font-mono text-xl font-bold text-maroon">
                  {statusResult.refId}
                </span>
              </div>
              <div>{getStatusBadge(statusResult.status)}</div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs sm:text-sm">
              <div>
                <span className="text-ink-muted block">Seva Purpose</span>
                <span className="font-semibold text-maroon">{statusResult.sevaTitle}</span>
              </div>
              <div>
                <span className="text-ink-muted block">Amount</span>
                <span className="font-serif font-bold text-saffron-deep text-base">
                  {formatINR(statusResult.amountRupees)}
                </span>
              </div>
              <div>
                <span className="text-ink-muted block">Created At</span>
                <span className="font-mono text-ink">
                  {new Date(statusResult.createdAt).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
              {statusResult.utr && (
                <div>
                  <span className="text-ink-muted block">UTR Number</span>
                  <span className="font-mono text-ink">{statusResult.utr}</span>
                </div>
              )}
            </div>

            {/* Rejection notice */}
            {statusResult.status === "REJECTED" && statusResult.rejectReason && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800">
                <strong>Reason:</strong> {statusResult.rejectReason}
              </div>
            )}

            {/* Receipt Download Action */}
            {statusResult.hasReceipt && statusResult.receiptNo && (
              <div className="p-4 rounded-2xl bg-green-50 border border-green-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <FileText className="w-8 h-8 text-green-700 shrink-0" />
                  <div>
                    <span className="text-xs text-green-800 font-semibold block">
                      Receipt No: {statusResult.receiptNo}
                    </span>
                    <span className="text-[11px] text-green-700">
                      Official digital tax receipt generated & emailed.
                    </span>
                  </div>
                </div>

                <Link
                  href={`/verify-receipt/${encodeURIComponent(statusResult.receiptNo)}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-green-700 text-white font-serif font-bold text-xs hover:bg-green-800 shadow-xs"
                >
                  <span>Verify Receipt</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function DonationStatusPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-cream flex items-center justify-center p-8">
          <div className="text-center font-serif text-maroon text-lg">Loading tracker...</div>
        </div>
      }
    >
      <StatusContent />
    </Suspense>
  );
}
