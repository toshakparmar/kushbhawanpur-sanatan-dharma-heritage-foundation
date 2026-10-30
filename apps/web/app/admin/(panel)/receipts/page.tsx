"use client";

import React, { useState, useEffect } from "react";
import { adminFetch } from "@/lib/admin-api";
import { formatINR } from "@kushbhawanpur/shared";
import {
  FileCheck2,
  Search,
  Download,
  AlertTriangle,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";

export default function ReceiptsListPage() {
  const [receipts, setReceipts] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const loadReceipts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("page", String(page));
      params.append("limit", "25");
      if (search) params.append("search", search);

      const res = await adminFetch(`/admin/receipts?${params.toString()}`);
      setReceipts(res.items || []);
      setTotal(res.total || 0);
    } catch (err: any) {
      toast.error(err.message || "Failed to load receipts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReceipts();
  }, [page]);

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-maroon flex items-center gap-2">
          <FileCheck2 className="w-7 h-7 text-maroon" />
          <span>Issued Donation Receipts</span>
        </h1>
        <p className="text-xs text-ink-muted">
          Official digital receipts allocated gaplessly per financial year.
        </p>
      </div>

      {/* Search */}
      <div className="p-4 rounded-2xl bg-paper border border-gold/30 shadow-xs flex items-center justify-between gap-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            loadReceipts();
          }}
          className="flex items-center gap-2 flex-1 max-w-md"
        >
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
            <input
              type="text"
              placeholder="Search by Receipt No, Ref ID, or Donor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-border bg-cream/30 text-xs focus:ring-2 focus:ring-gold"
            />
          </div>
          <button
            type="submit"
            className="px-3 py-1.5 rounded-xl bg-sand/60 text-xs font-serif font-bold text-maroon"
          >
            Search
          </button>
        </form>
      </div>

      {/* Receipts Table */}
      <div className="rounded-3xl bg-paper border border-gold/30 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-sand/40 text-ink-muted uppercase text-[10px] tracking-wider border-b border-border">
              <tr>
                <th className="py-3 px-4">Receipt Number</th>
                <th className="py-3 px-4">Financial Year</th>
                <th className="py-3 px-4">Donor Name</th>
                <th className="py-3 px-4">Seva Purpose</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Issued Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Download / Verify</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-ink-muted">
                    Loading receipts...
                  </td>
                </tr>
              ) : receipts.length > 0 ? (
                receipts.map((r) => (
                  <tr key={r.id} className="hover:bg-sand/10 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-maroon text-sm">
                      {r.receiptNo}
                    </td>
                    <td className="py-3 px-4 font-mono text-ink-muted">{r.fy}</td>
                    <td className="py-3 px-4 font-semibold text-ink">{r.donorName}</td>
                    <td className="py-3 px-4 text-ink-muted">{r.sevaTitle}</td>
                    <td className="py-3 px-4 font-serif font-bold text-saffron-deep">
                      {formatINR(r.amountRupees)}
                    </td>
                    <td className="py-3 px-4 text-ink-muted font-mono">
                      {new Date(r.issuedAt).toLocaleDateString("en-IN", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-3 px-4">
                      {r.voidedAt ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-100 text-red-800 text-[10px] font-bold">
                          <AlertTriangle className="w-3 h-3" />
                          VOID
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 text-green-800 text-[10px] font-bold">
                          <ShieldCheck className="w-3 h-3" />
                          Valid
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {r.pdfUrl && (
                          <a
                            href={r.pdfUrl}
                            download
                            target="_blank"
                            className="p-1.5 rounded-lg border border-gold/40 text-maroon hover:bg-sand/40"
                            title="Download PDF"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </a>
                        )}
                        <a
                          href={`/verify-receipt/${encodeURIComponent(r.receiptNo)}`}
                          target="_blank"
                          className="p-1.5 rounded-lg border border-border text-ink-muted hover:text-maroon"
                          title="Public Verification View"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-ink-muted">
                    No receipts recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
