"use client";

import React, { useState, useEffect } from "react";
import { adminFetch } from "@/lib/admin-api";
import { formatINR } from "@kushbhawanpur/shared";
import {
  Users2,
  Search,
  Eye,
  ShieldAlert,
  UserX,
  Calendar,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function DonorsRegistryPage() {
  const [donors, setDonors] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Detail Modal
  const [selectedDonor, setSelectedDonor] = useState<any>(null);
  const [showAnonymizeDialog, setShowAnonymizeDialog] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const loadDonors = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("page", String(page));
      params.append("limit", "25");
      if (search) params.append("search", search);

      const res = await adminFetch(`/admin/donors?${params.toString()}`);
      setDonors(res.items || []);
      setTotal(res.total || 0);
    } catch (err: any) {
      toast.error(err.message || "Failed to load donors.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDonors();
  }, [page]);

  const openDetail = async (id: string) => {
    try {
      const full = await adminFetch(`/admin/donors/${id}`);
      setSelectedDonor(full);
    } catch (err: any) {
      toast.error(err.message || "Failed to load donor history.");
    }
  };

  const handleAnonymize = async () => {
    if (!selectedDonor) return;
    setActionLoading(true);
    try {
      await adminFetch(`/admin/donors/${selectedDonor.id}/anonymize`, {
        method: "POST",
      });
      toast.success("Donor data erased under DPDP request.");
      setShowAnonymizeDialog(false);
      setSelectedDonor(null);
      loadDonors();
    } catch (err: any) {
      toast.error(err.message || "Failed to erase donor data.");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-maroon flex items-center gap-2">
            <Users2 className="w-7 h-7 text-maroon" />
            <span>Donors Registry</span>
          </h1>
          <p className="text-xs text-ink-muted">
            All registered devotees, lifetime contributions, and DPDP compliance actions.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4 rounded-2xl bg-paper border border-gold/30 shadow-xs flex items-center justify-between gap-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            loadDonors();
          }}
          className="flex items-center gap-2 flex-1 max-w-md"
        >
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
            <input
              type="text"
              placeholder="Search donor by Name, Email, or Mobile..."
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

      {/* Donors Table */}
      <div className="rounded-3xl bg-paper border border-gold/30 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-sand/40 text-ink-muted uppercase text-[10px] tracking-wider border-b border-border">
              <tr>
                <th className="py-3 px-4">Donor Name</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Phone</th>
                <th className="py-3 px-4">Lifetime Donated</th>
                <th className="py-3 px-4">Total Sevas</th>
                <th className="py-3 px-4">First Contribution</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-ink-muted">
                    Loading donors...
                  </td>
                </tr>
              ) : donors.length > 0 ? (
                donors.map((d) => (
                  <tr key={d.id} className="hover:bg-sand/10 transition-colors">
                    <td className="py-3 px-4 font-semibold text-maroon font-serif text-sm">
                      {d.name}
                    </td>
                    <td className="py-3 px-4 text-ink-muted">{d.email}</td>
                    <td className="py-3 px-4 font-mono text-ink-muted">{d.phone}</td>
                    <td className="py-3 px-4 font-serif font-bold text-saffron-deep">
                      {formatINR(d.totalDonatedRupees)}
                    </td>
                    <td className="py-3 px-4 font-bold text-ink">{d.donationCount}</td>
                    <td className="py-3 px-4 text-ink-muted font-mono">
                      {d.firstDonation
                        ? new Date(d.firstDonation).toLocaleDateString("en-IN", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "—"}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => openDetail(d.id)}
                        className="p-1.5 rounded-lg border border-gold/40 text-maroon hover:bg-sand/40 cursor-pointer shadow-xs"
                        title="View Donor History"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-ink-muted">
                    No donors recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border flex items-center justify-between text-xs text-ink-muted">
          <span>Showing {donors.length} of {total} donors</span>
        </div>
      </div>

      {/* Donor Detail Modal */}
      <Dialog open={Boolean(selectedDonor)} onOpenChange={(open) => !open && setSelectedDonor(null)}>
        <DialogContent className="max-w-xl max-h-[90vh] p-6 bg-paper rounded-3xl overflow-y-auto">
          {selectedDonor && (
            <div className="space-y-4">
              <DialogHeader className="border-b border-border pb-3">
                <DialogTitle className="font-serif text-2xl font-bold text-maroon">
                  {selectedDonor.name}
                </DialogTitle>
                <p className="text-xs text-ink-muted font-sans">
                  {selectedDonor.email} · {selectedDonor.phone}
                </p>
              </DialogHeader>

              {/* Encrypted profile data if available */}
              {(selectedDonor.pan || selectedDonor.address) && (
                <div className="p-3 rounded-xl bg-sand/30 border border-border text-xs space-y-1">
                  {selectedDonor.pan && (
                    <div>
                      <span className="text-ink-muted">PAN:</span>{" "}
                      <span className="font-mono font-bold text-maroon">{selectedDonor.pan}</span>
                    </div>
                  )}
                  {selectedDonor.address && (
                    <div>
                      <span className="text-ink-muted">Address:</span>{" "}
                      <span className="font-semibold text-ink">{selectedDonor.address}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Seva History */}
              <div>
                <h4 className="font-serif font-bold text-sm text-maroon mb-2">
                  Contribution History ({selectedDonor.donations?.length || 0})
                </h4>
                <div className="divide-y divide-border/60 max-h-56 overflow-y-auto border rounded-xl">
                  {selectedDonor.donations?.map((don: any) => (
                    <div key={don.id} className="p-3 flex justify-between items-center text-xs">
                      <div>
                        <span className="font-mono font-bold text-maroon block">{don.refId}</span>
                        <span className="text-[11px] text-ink-muted">{don.sevaTitle}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-serif font-bold text-saffron-deep block">
                          {formatINR(don.amountRupees)}
                        </span>
                        <span className="text-[10px] text-green-700 font-bold">{don.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* DPDP Erase Action */}
              <div className="pt-4 border-t border-border flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setShowAnonymizeDialog(true)}
                  className="inline-flex items-center gap-1.5 text-xs text-red-700 hover:text-red-800 font-semibold cursor-pointer"
                >
                  <UserX className="w-3.5 h-3.5" />
                  <span>Erase Personal Data (DPDP Request)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedDonor(null)}
                  className="px-4 py-1.5 rounded-xl border border-border text-xs text-ink-muted"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Confirm DPDP Erase Modal */}
      <Dialog open={showAnonymizeDialog} onOpenChange={setShowAnonymizeDialog}>
        <DialogContent className="max-w-md p-6 bg-paper rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-serif text-lg font-bold text-red-800 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-red-600" />
              <span>Confirm Data Erasure</span>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2 text-xs">
            <p className="text-ink-muted leading-relaxed">
              This action complies with Indian Digital Personal Data Protection (DPDP) rights. The donor&apos;s name, email, phone, and PAN will be replaced with anonymous placeholders. Financial receipt totals remain intact in trust accounts.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAnonymizeDialog(false)}
                className="px-3 py-1.5 text-xs text-ink-muted"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={actionLoading}
                onClick={handleAnonymize}
                className="px-4 py-1.5 rounded-xl bg-red-700 text-white font-bold text-xs"
              >
                {actionLoading ? "Erasing..." : "Confirm Erasure"}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
