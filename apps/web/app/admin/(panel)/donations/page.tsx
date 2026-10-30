"use client";

import React, { useState, useEffect } from "react";
import { adminFetch } from "@/lib/admin-api";
import { formatINR } from "@kushbhawanpur/shared";
import {
  Download,
  Plus,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  XCircle,
  FileText,
  AlertCircle,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function AllDonationsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // Detail Modal
  const [selectedDonation, setSelectedDonation] = useState<any>(null);

  // Manual Donation Modal
  const [showManualModal, setShowManualModal] = useState(false);
  const [manualName, setManualName] = useState("");
  const [manualEmail, setManualEmail] = useState("");
  const [manualPhone, setManualPhone] = useState("");
  const [manualAmount, setManualAmount] = useState("");
  const [manualSevaId, setManualSevaId] = useState("");
  const [manualMethod, setManualMethod] = useState("CASH");
  const [manualUtr, setManualUtr] = useState("");
  const [sevasList, setSevasList] = useState<any[]>([]);
  const [actionLoading, setActionLoading] = useState(false);

  // Void Receipt Modal
  const [showVoidModal, setShowVoidModal] = useState(false);
  const [voidReason, setVoidReason] = useState("");

  const loadDonations = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("page", String(page));
      params.append("limit", "25");
      if (statusFilter) params.append("status", statusFilter);
      if (searchQuery) params.append("search", searchQuery);

      const res = await adminFetch(`/admin/donations?${params.toString()}`);
      setItems(res.items || []);
      setTotal(res.total || 0);
    } catch (err: any) {
      toast.error(err.message || "Failed to load donations.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDonations();
  }, [page, statusFilter]);

  useEffect(() => {
    adminFetch("/admin/sevas")
      .then((sevas) => {
        setSevasList(sevas || []);
        if (sevas && sevas.length > 0) setManualSevaId(sevas[0].id);
      })
      .catch(() => {});
  }, []);

  const openDetail = async (id: string) => {
    try {
      const full = await adminFetch(`/admin/donations/${id}`);
      setSelectedDonation(full);
    } catch (err: any) {
      toast.error(err.message || "Failed to load donation detail.");
    }
  };

  const handleCreateManual = async (e: React.FormEvent) => {
    e.preventDefault();
    const rupees = parseFloat(manualAmount);
    if (isNaN(rupees) || rupees <= 0) {
      toast.error("Please enter a valid amount.");
      return;
    }

    setActionLoading(true);
    try {
      const res = await adminFetch("/admin/donations/manual", {
        method: "POST",
        body: JSON.stringify({
          sevaId: manualSevaId,
          amountPaise: Math.round(rupees * 100),
          donor: {
            name: manualName.trim(),
            email: manualEmail.trim() || `${manualName.toLowerCase().replace(/\s+/g, "")}@offline.local`,
            phone: manualPhone.trim() || "0000000000",
          },
          method: manualMethod,
          utr: manualUtr.trim() || undefined,
        }),
      });

      toast.success(`Manual donation added! Receipt #${res.receiptNo} generated.`);
      setShowManualModal(false);
      setManualName("");
      setManualEmail("");
      setManualPhone("");
      setManualAmount("");
      setManualUtr("");
      loadDonations();
    } catch (err: any) {
      toast.error(err.message || "Failed to create manual donation.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleVoidReceipt = async () => {
    if (!voidReason.trim()) {
      toast.error("Please provide a reason for voiding this receipt.");
      return;
    }
    setActionLoading(true);
    try {
      await adminFetch(`/admin/donations/${selectedDonation.id}/void`, {
        method: "POST",
        body: JSON.stringify({ reason: voidReason.trim() }),
      });
      toast.success("Receipt marked as VOID.");
      setShowVoidModal(false);
      setSelectedDonation(null);
      setVoidReason("");
      loadDonations();
    } catch (err: any) {
      toast.error(err.message || "Failed to void receipt.");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-maroon">
            Donation Records
          </h1>
          <p className="text-xs text-ink-muted">
            All online and offline seva contributions, receipt linkages, and audit states.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/api/admin/donations/export/csv"
            download
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-gold/50 bg-paper text-maroon font-serif font-bold text-xs hover:bg-sand/30 shadow-xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-saffron" />
            <span>Export CSV</span>
          </a>

          <button
            type="button"
            onClick={() => setShowManualModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-maroon text-cream font-serif font-bold text-xs hover:bg-maroon-dark shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4 text-gold" />
            <span>Add Offline / Cash</span>
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="p-4 rounded-2xl bg-paper border border-gold/30 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            loadDonations();
          }}
          className="flex items-center gap-2 flex-1 max-w-md"
        >
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
            <input
              type="text"
              placeholder="Search by Ref ID, Donor, Email, Phone, UTR..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-border bg-cream/30 text-xs focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </div>
          <button
            type="submit"
            className="px-3 py-1.5 rounded-xl bg-sand/60 hover:bg-sand text-xs font-serif font-bold text-maroon"
          >
            Search
          </button>
        </form>

        <div className="flex items-center gap-2">
          <span className="text-xs text-ink-muted flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            Status:
          </span>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="px-3 py-1.5 rounded-xl border border-border bg-paper text-xs font-serif text-maroon cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="VERIFIED">Verified</option>
            <option value="PENDING_VERIFICATION">Pending Verification</option>
            <option value="REJECTED">Rejected</option>
            <option value="INITIATED">Initiated</option>
            <option value="VOID">Void</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-3xl bg-paper border border-gold/30 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-sand/40 text-ink-muted uppercase text-[10px] tracking-wider border-b border-border">
              <tr>
                <th className="py-3 px-4">Ref ID</th>
                <th className="py-3 px-4">Donor Name</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Seva Area</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Receipt No</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-ink-muted">
                    Loading records...
                  </td>
                </tr>
              ) : items.length > 0 ? (
                items.map((item) => (
                  <tr key={item.id} className="hover:bg-sand/10 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-maroon">
                      {item.refId}
                    </td>
                    <td className="py-3 px-4 font-semibold text-ink">
                      {item.donorName}
                    </td>
                    <td className="py-3 px-4 font-serif font-bold text-saffron-deep text-sm">
                      {formatINR(item.amountRupees)}
                    </td>
                    <td className="py-3 px-4 text-ink-muted">{item.sevaTitle}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          item.status === "VERIFIED"
                            ? "bg-green-100 text-green-800"
                            : item.status === "PENDING_VERIFICATION"
                            ? "bg-amber-100 text-amber-800"
                            : item.status === "REJECTED"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-ink">
                      {item.receiptNo || "—"}
                    </td>
                    <td className="py-3 px-4 text-ink-muted font-mono">
                      {new Date(item.createdAt).toLocaleDateString("en-IN", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => openDetail(item.id)}
                        className="p-1.5 rounded-lg border border-gold/40 text-maroon hover:bg-sand/40 cursor-pointer shadow-xs"
                        title="View Full Detail"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-ink-muted">
                    No donation records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 border-t border-border flex items-center justify-between text-xs text-ink-muted">
          <span>Showing {items.length} of {total} records</span>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
              className="px-3 py-1 rounded border border-border disabled:opacity-40 cursor-pointer"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={items.length < 25}
              onClick={() => setPage(page + 1)}
              className="px-3 py-1 rounded border border-border disabled:opacity-40 cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Detail Drawer */}
      <Dialog open={Boolean(selectedDonation)} onOpenChange={(open) => !open && setSelectedDonation(null)}>
        <DialogContent className="max-w-xl max-h-[90vh] p-6 bg-paper rounded-3xl overflow-y-auto">
          {selectedDonation && (
            <div className="space-y-4">
              <DialogHeader className="border-b border-border pb-3">
                <DialogTitle className="font-serif text-xl font-bold text-maroon flex justify-between items-center">
                  <span>Donation Ref: {selectedDonation.refId}</span>
                  <span className="text-xs px-2 py-0.5 rounded font-mono font-bold bg-sand text-maroon">
                    {selectedDonation.status}
                  </span>
                </DialogTitle>
              </DialogHeader>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-ink-muted block">Donor</span>
                  <span className="font-bold text-ink">{selectedDonation.donor.name}</span>
                  <span className="block text-ink-muted">{selectedDonation.donor.email}</span>
                  <span className="block font-mono text-ink-muted">{selectedDonation.donor.phone}</span>
                </div>
                <div>
                  <span className="text-ink-muted block">Seva Purpose</span>
                  <span className="font-bold text-maroon">{selectedDonation.seva.titleEn}</span>
                  <span className="text-saffron-deep font-bold text-sm block">
                    {formatINR((selectedDonation.receivedAmountPaise || selectedDonation.amountPaise) / 100)}
                  </span>
                </div>
              </div>

              {selectedDonation.donor.pan && (
                <div className="p-3 rounded-xl bg-sand/30 border border-border text-xs">
                  <span className="text-ink-muted block">Donor PAN</span>
                  <span className="font-mono font-bold text-maroon">{selectedDonation.donor.pan}</span>
                </div>
              )}

              {selectedDonation.receipt && (
                <div className="p-4 rounded-xl bg-green-50 border border-green-200 text-xs flex justify-between items-center">
                  <div>
                    <span className="font-bold text-green-800 block">
                      Receipt No: {selectedDonation.receipt.receiptNo}
                    </span>
                    <span className="text-green-700 font-mono text-[11px]">
                      Issued: {new Date(selectedDonation.receipt.issuedAt).toLocaleDateString()}
                    </span>
                  </div>
                  {selectedDonation.receipt.pdfUrl && (
                    <a
                      href={selectedDonation.receipt.pdfUrl}
                      target="_blank"
                      download
                      className="px-3 py-1 rounded bg-green-700 text-white font-bold"
                    >
                      Download PDF
                    </a>
                  )}
                </div>
              )}

              {/* Void receipt button (SUPER_ADMIN only) */}
              {selectedDonation.receipt && !selectedDonation.receipt.voidedAt && (
                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setShowVoidModal(true)}
                    className="text-xs text-red-700 underline font-semibold cursor-pointer"
                  >
                    Void this Receipt
                  </button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Manual / Offline Donation Modal */}
      <Dialog open={showManualModal} onOpenChange={setShowManualModal}>
        <DialogContent className="max-w-md p-6 bg-paper rounded-3xl">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl font-bold text-maroon">
              Record Offline / Manual Donation
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleCreateManual} className="space-y-4 py-2">
            <div>
              <label className="block text-xs font-bold text-maroon mb-1">Donor Name *</label>
              <input
                type="text"
                required
                value={manualName}
                onChange={(e) => setManualName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-border text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-maroon mb-1">Email</label>
                <input
                  type="email"
                  value={manualEmail}
                  onChange={(e) => setManualEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-border text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-maroon mb-1">Mobile</label>
                <input
                  type="tel"
                  value={manualPhone}
                  onChange={(e) => setManualPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-border text-xs font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-maroon mb-1">Amount (INR) *</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={manualAmount}
                  onChange={(e) => setManualAmount(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-border text-xs font-bold font-serif"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-maroon mb-1">Payment Method</label>
                <select
                  value={manualMethod}
                  onChange={(e) => setManualMethod(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-border text-xs"
                >
                  <option value="CASH">Cash</option>
                  <option value="CHEQUE_DD">Cheque / DD</option>
                  <option value="BANK_TRANSFER">Bank Transfer (RTGS/NEFT)</option>
                  <option value="CSR">CSR Grant</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-maroon mb-1">Seva Purpose</label>
              <select
                value={manualSevaId}
                onChange={(e) => setManualSevaId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-border text-xs"
              >
                {sevasList.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.titleEn}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-maroon mb-1">Cheque / Ref No.</label>
              <input
                type="text"
                value={manualUtr}
                onChange={(e) => setManualUtr(e.target.value)}
                placeholder="Cheque No or Bank Ref"
                className="w-full px-3 py-2 rounded-xl border border-border text-xs font-mono"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-border">
              <button
                type="button"
                onClick={() => setShowManualModal(false)}
                className="px-4 py-2 rounded-xl text-xs text-ink-muted"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={actionLoading}
                className="px-5 py-2 rounded-xl bg-maroon text-cream font-bold text-xs"
              >
                {actionLoading ? "Saving..." : "Create Verified Receipt"}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Void Receipt Modal */}
      <Dialog open={showVoidModal} onOpenChange={setShowVoidModal}>
        <DialogContent className="max-w-md p-6 bg-paper rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-serif text-lg font-bold text-red-800">
              Void Donation Receipt
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <p className="text-xs text-ink-muted">
              Charitable receipts cannot be deleted. Voiding will permanently stamp this receipt as &ldquo;VOID&rdquo; in the ledger.
            </p>
            <textarea
              required
              rows={3}
              placeholder="Reason for voiding (e.g. cheque bounced, duplicate entry)..."
              value={voidReason}
              onChange={(e) => setVoidReason(e.target.value)}
              className="w-full p-3 rounded-xl border border-border text-xs focus:ring-2 focus:ring-red-400"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowVoidModal(false)}
                className="px-3 py-1.5 text-xs text-ink-muted"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={actionLoading}
                onClick={handleVoidReceipt}
                className="px-4 py-1.5 rounded-xl bg-red-700 text-white text-xs font-bold"
              >
                {actionLoading ? "Voiding..." : "Confirm Void"}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
