"use client";

import React, { useState } from "react";
import { formatINR } from "@kushbhawanpur/shared";
import {
  FileSpreadsheet,
  Upload,
  CheckCircle2,
  AlertCircle,
  FileCheck2,
  Check,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";

export default function BankReconciliationPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [selectedMatches, setSelectedMatches] = useState<string[]>([]);
  const [verifying, setVerifying] = useState(false);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please choose a bank statement CSV file.");
      return;
    }

    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/reconciliation/import", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message || "Reconciliation failed.");

      const data = json.data || json;
      setResult(data);
      setSelectedMatches(data.matches?.map((m: any) => m.donation.id) || []);
      toast.success(
        `Statement reconciled: ${data.matchedCount} matched, ${data.unmatchedCount} unmatched.`
      );
    } catch (err: any) {
      toast.error(err.message || "Failed to process bank statement.");
    } finally {
      setLoading(false);
    }
  };

  const handleBulkVerify = async () => {
    if (selectedMatches.length === 0) {
      toast.error("Please select at least one matched donation to verify.");
      return;
    }

    setVerifying(true);
    try {
      const res = await fetch("/api/admin/reconciliation/bulk-verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ donationIds: selectedMatches }),
        credentials: "include",
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message || "Bulk verification failed.");

      const data = json.data || json;
      toast.success(`Successfully verified ${data.verifiedCount} donations with gapless receipts!`);

      // Filter out verified matches from result
      setResult((prev: any) => ({
        ...prev,
        matches: prev.matches.filter((m: any) => !selectedMatches.includes(m.donation.id)),
        matchedCount: prev.matches.filter((m: any) => !selectedMatches.includes(m.donation.id)).length,
      }));
      setSelectedMatches([]);
    } catch (err: any) {
      toast.error(err.message || "Bulk verification error.");
    } finally {
      setVerifying(false);
    }
  };

  const toggleMatch = (id: string) => {
    setSelectedMatches((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-maroon flex items-center gap-2">
          <FileSpreadsheet className="w-7 h-7 text-green-700" />
          <span>Bank Statement Reconciliation</span>
        </h1>
        <p className="text-xs text-ink-muted">
          Upload your bank statement CSV to automatically match credit entries against pending donor UTRs and bulk-verify receipts.
        </p>
      </div>

      {/* Upload Box */}
      <div className="rounded-3xl bg-paper p-6 sm:p-8 border border-gold/40 shadow-xs">
        <form onSubmit={handleUpload} className="space-y-4">
          <div className="border-2 border-dashed border-gold/50 rounded-2xl p-6 sm:p-8 text-center bg-sand/20 hover:bg-sand/30 transition-colors">
            <Upload className="w-10 h-10 text-saffron mx-auto mb-3" />
            <span className="font-serif font-bold text-maroon text-base block mb-1">
              Select Bank Statement CSV
            </span>
            <p className="text-xs text-ink-muted mb-4 max-w-sm mx-auto">
              Supports standard HDFC, SBI, ICICI, Axis, PNB statement exports containing transaction dates, narration (UTR), and credit amounts.
            </p>
            <input
              type="file"
              accept=".csv"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="text-xs text-ink-muted file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-serif file:font-bold file:bg-maroon file:text-cream hover:file:bg-maroon-dark file:cursor-pointer"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading || !file}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-saffron text-white font-serif font-bold text-sm hover:bg-saffron-dark transition-all shadow-xs disabled:opacity-50 cursor-pointer"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <FileCheck2 className="w-4 h-4" />}
              <span>{loading ? "Matching Records..." : "Process & Match Statement"}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Results Section */}
      {result && (
        <div className="space-y-6">
          {/* Summary Chips */}
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-paper border border-border">
              <span className="text-xs text-ink-muted block">Total Credit Rows</span>
              <span className="font-mono text-xl font-bold text-ink">{result.totalRows}</span>
            </div>
            <div className="p-4 rounded-2xl bg-green-50 border border-green-200">
              <span className="text-xs text-green-700 block">Matched Pending</span>
              <span className="font-mono text-xl font-bold text-green-800">{result.matchedCount}</span>
            </div>
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
              <span className="text-xs text-amber-700 block">Unmatched Credits</span>
              <span className="font-mono text-xl font-bold text-amber-800">{result.unmatchedCount}</span>
            </div>
          </div>

          {/* Matches List */}
          {result.matches?.length > 0 && (
            <div className="rounded-3xl bg-paper p-6 border border-green-300 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="font-serif text-lg font-bold text-maroon flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <span>Suggested Matches ({result.matches.length})</span>
                </h3>

                <button
                  type="button"
                  disabled={verifying || selectedMatches.length === 0}
                  onClick={handleBulkVerify}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-green-700 hover:bg-green-800 text-white font-serif font-bold text-xs shadow-xs disabled:opacity-50 cursor-pointer"
                >
                  {verifying ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  <span>Bulk Verify Selected ({selectedMatches.length})</span>
                </button>
              </div>

              <div className="divide-y divide-border/60">
                {result.matches.map((m: any) => {
                  const isChecked = selectedMatches.includes(m.donation.id);
                  return (
                    <div
                      key={m.donation.id}
                      className="py-3 flex items-center justify-between gap-4 text-xs font-sans"
                    >
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleMatch(m.donation.id)}
                          className="w-4 h-4 rounded text-green-700"
                        />
                        <div>
                          <span className="font-mono font-bold text-maroon text-sm block">
                            {m.donation.refId} · {m.donation.donorName}
                          </span>
                          <span className="text-[11px] text-ink-muted">
                            Bank Narration: &ldquo;{m.statementRow.description}&rdquo;
                          </span>
                        </div>
                      </label>

                      <div className="text-right shrink-0">
                        <span className="font-serif font-bold text-saffron-deep text-sm block">
                          {formatINR(m.donation.amountRupees)}
                        </span>
                        <span className="text-[10px] text-green-700 font-bold uppercase tracking-wider">
                          Confidence: {m.confidence}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
