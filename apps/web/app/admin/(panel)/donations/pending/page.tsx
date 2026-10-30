"use client";

import React, { useState, useEffect } from "react";
import { adminFetch } from "@/lib/admin-api";
import { formatINR } from "@kushbhawanpur/shared";
import {
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  ExternalLink,
  AlertCircle,
  FileText,
  Search,
  Check,
  Building,
} from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function PendingVerificationQueuePage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDonation, setSelectedDonation] = useState<any>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [customAmountRupees, setCustomAmountRupees] = useState<string>("");

  const loadPending = async () => {
    setLoading(true);
    try {
      const res = await adminFetch("/admin/donations?status=PENDING_VERIFICATION&limit=100");
      setItems(res.items || []);
    } catch (err: any) {
      toast.error(err.message || "Failed to load pending queue.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPending();
  }, []);

  const openDetail = async (id: string) => {
    try {
      const full = await adminFetch(`/admin/donations/${id}`);
      setSelectedDonation(full);
      setCustomAmountRupees(String((full.receivedAmountPaise || full.amountPaise) / 100));
    } catch (err: any) {
      toast.error(err.message || "Failed to load donation details.");
    }
  };

  const handleVerify = async (donationId: string) => {
    setActionLoading(true);
    try {
      const parsedAmount = parseFloat(customAmountRupees);
      const receivedAmountPaise =
        !isNaN(parsedAmount) && parsedAmount > 0
          ? Math.round(parsedAmount * 100)
          : undefined;

      const res = await adminFetch(`/admin/donations/${donationId}/verify`, {
        method: "POST",
        body: JSON.stringify({ receivedAmountPaise }),
      });

      toast.success(`Donation verified! Receipt #${res.receiptNo} generated & emailed.`);
      setSelectedDonation(null);
      loadPending();
    } catch (err: any) {
      toast.error(err.message || "Verification failed.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      toast.error("Please enter a reason for rejecting the payment proof.");
      return;
    }

    setActionLoading(true);
    try {
      await adminFetch(`/admin/donations/${selectedDonation.id}/reject`, {
        method: "POST",
        body: JSON.stringify({ reason: rejectReason.trim() }),
      });

      toast.success("Donation marked as rejected. Donor has been notified by email.");
      setShowRejectDialog(false);
      setSelectedDonation(null);
      setRejectReason("");
      loadPending();
    } catch (err: any) {
      toast.error(err.message || "Rejection failed.");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-maroon flex items-center gap-2.5">
            <Clock className="w-7 h-7 text-amber-600" />
            <span>Pending Verification Queue</span>
          </h1>
          <p className="text-xs text-ink-muted">
            Incoming donor proofs awaiting matching against bank statements and UPI credit records.
          </p>
        </div>

        <button
          type="button"
          onClick={loadPending}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gold/50 bg-paper hover:bg-sand/30 text-xs font-serif font-bold text-maroon shadow-xs cursor-pointer"
        >
          <span>Refresh Queue ({items.length})</span>
        </button>
      </div>

      {/* Instructional helper card */}
      <div className="p-4 rounded-2xl bg-sand/30 border border-gold/40 text-xs text-ink-muted flex items-start gap-3">
        <Building className="w-5 h-5 text-saffron shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Bank Statement Verification Guide:</strong> Check your netbanking or UPI business app for the expected amount and reference ID. Once confirmed, click <strong>Verify & Issue Receipt</strong> to allocate a gapless financial year receipt and trigger automated transactional delivery to the donor.
        </p>
      </div>

      {/* Table */}
      <div className="rounded-3xl bg-paper border border-gold/30 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-sand/40 text-ink-muted uppercase text-[10px] tracking-wider border-b border-border">
              <tr>
                <th className="py-3 px-4">Ref to Look in Bank</th>
                <th className="py-3 px-4">Expected Amount</th>
                <th className="py-3 px-4">Donor Name & Contact</th>
                <th className="py-3 px-4">Submitted UTR</th>
                <th className="py-3 px-4">Seva Area</th>
                <th className="py-3 px-4">Submitted At</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-ink-muted">
                    Loading pending donations...
                  </td>
                </tr>
              ) : items.length > 0 ? (
                items.map((item) => (
                  <tr key={item.id} className="hover:bg-sand/10 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-maroon text-sm">
                      {item.refId}
                    </td>
                    <td className="py-3 px-4 font-serif font-bold text-saffron-deep text-base">
                      {formatINR(item.amountRupees)}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-ink block">{item.donorName}</span>
                      <span className="text-[11px] text-ink-muted block">{item.donorEmail}</span>
                      <span className="text-[11px] font-mono text-ink-muted">{item.donorPhone}</span>
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold text-ink">
                      {item.utr || "—"}
                    </td>
                    <td className="py-3 px-4 text-ink-muted">{item.sevaTitle}</td>
                    <td className="py-3 px-4 text-ink-muted font-mono">
                      {new Date(item.paymentAt || item.createdAt).toLocaleDateString("en-IN", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => openDetail(item.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-maroon text-cream font-serif font-bold text-xs hover:bg-maroon-dark transition-all cursor-pointer shadow-xs"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Review & Verify</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-ink-muted">
                    <CheckCircle2 className="w-10 h-10 text-green-600 mx-auto mb-2 opacity-80" />
                    <p className="font-serif font-bold text-base text-maroon">
                      Pending Queue is Clean!
                    </p>
                    <p className="text-xs text-ink-muted">
                      All submitted donation proofs have been reviewed and verified.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail & Action Modal */}
      <Dialog
        open={Boolean(selectedDonation)}
        onOpenChange={(open) => !open && setSelectedDonation(null)}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] p-6 bg-paper border border-gold/60 rounded-3xl overflow-y-auto">
          {selectedDonation && (
            <div>
              <DialogHeader className="mb-4 pb-3 border-b border-border">
                <DialogTitle className="font-serif text-2xl font-bold text-maroon flex items-center justify-between">
                  <span>Verify Contribution</span>
                  <span className="font-mono text-sm px-2.5 py-1 rounded bg-amber-100 text-amber-900">
                    {selectedDonation.refId}
                  </span>
                </DialogTitle>
              </DialogHeader>

              {/* Data Grid */}
              <div className="grid grid-cols-2 gap-4 text-xs sm:text-sm mb-6">
                <div className="p-3 rounded-xl bg-sand/30 border border-border">
                  <span className="text-ink-muted block text-[11px]">Donor Name</span>
                  <span className="font-bold text-maroon text-base block">{selectedDonation.donor.name}</span>
                  <span className="text-xs text-ink-muted">{selectedDonation.donor.email}</span>
                </div>

                <div className="p-3 rounded-xl bg-sand/30 border border-border">
                  <span className="text-ink-muted block text-[11px]">Seva Purpose</span>
                  <span className="font-bold text-maroon text-base block">{selectedDonation.seva.titleEn}</span>
                  {selectedDonation.dedication && (
                    <span className="text-xs text-saffron-deep italic block">
                      &ldquo;{selectedDonation.dedication}&rdquo;
                    </span>
                  )}
                </div>

                <div className="p-3 rounded-xl bg-sand/30 border border-border">
                  <span className="text-ink-muted block text-[11px]">Submitted UTR / Transaction Ref</span>
                  <span className="font-mono font-bold text-maroon text-base block tracking-wider">
                    {selectedDonation.utr || "Not provided"}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-sand/30 border border-border">
                  <span className="text-ink-muted block text-[11px]">Actual Received Amount (INR)</span>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="font-bold text-maroon">₹</span>
                    <input
                      type="number"
                      value={customAmountRupees}
                      onChange={(e) => setCustomAmountRupees(e.target.value)}
                      className="w-28 px-2 py-1 rounded border border-gold font-bold text-maroon text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Screenshot display if uploaded */}
              {selectedDonation.proofUrl && (
                <div className="mb-6">
                  <span className="text-xs font-serif font-bold text-maroon block mb-2">
                    Payment Screenshot Submitted by Donor:
                  </span>
                  <div className="relative w-full max-h-72 rounded-2xl overflow-hidden border border-gold/40 bg-sand/20 flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={selectedDonation.proofUrl}
                      alt="Proof"
                      className="max-h-72 object-contain"
                    />
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowRejectDialog(true)}
                  className="px-4 py-2.5 rounded-xl border border-red-300 text-red-700 hover:bg-red-50 font-serif font-bold text-xs cursor-pointer"
                >
                  Reject Proof
                </button>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedDonation(null)}
                    className="px-4 py-2.5 rounded-xl border border-border text-ink-muted hover:text-ink text-xs font-serif cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    disabled={actionLoading}
                    onClick={() => handleVerify(selectedDonation.id)}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-green-700 hover:bg-green-800 text-white font-serif font-bold text-sm shadow-sm cursor-pointer disabled:opacity-50"
                  >
                    <CheckCircle2 className="w-4 h-4 text-gold" />
                    <span>{actionLoading ? "Verifying..." : "Verify & Issue Receipt"}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Reject Reason Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent className="max-w-md p-6 bg-paper rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-serif text-lg font-bold text-red-800">
              Reject Payment Proof
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <p className="text-xs text-ink-muted">
              Enter the reason why this payment cannot be matched. This message will be emailed to the donor so they can re-submit valid details.
            </p>
            <textarea
              required
              rows={3}
              placeholder="e.g. UTR number not found in bank statement; amount mismatch."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full p-3 rounded-xl border border-border text-xs focus:outline-none focus:ring-2 focus:ring-red-400"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowRejectDialog(false)}
                className="px-3 py-1.5 text-xs text-ink-muted"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={actionLoading}
                onClick={handleReject}
                className="px-4 py-1.5 rounded-xl bg-red-700 text-white text-xs font-bold"
              >
                {actionLoading ? "Rejecting..." : "Confirm Reject"}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
