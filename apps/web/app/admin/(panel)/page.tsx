"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { adminFetch } from "@/lib/admin-api";
import { formatINR } from "@kushbhawanpur/shared";
import {
  TrendingUp,
  Clock,
  Users2,
  HeartHandshake,
  ArrowRight,
  ShieldCheck,
  Building2,
  Calendar,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminFetch("/admin/dashboard")
      .then((data) => setStats(data))
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-sand/40 rounded-lg" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-paper rounded-2xl border border-border" />
          ))}
        </div>
      </div>
    );
  }

  const allTimeRupees = stats?.allTimeVerifiedRupees || 0;
  const thisFyRupees = (stats?.thisFyVerifiedPaise || 0) / 100;
  const thisMonthRupees = (stats?.thisMonthVerifiedPaise || 0) / 100;
  const pendingCount = stats?.pendingCount || 0;
  const donorCount = stats?.donorCount || 0;
  const verifiedCount = stats?.verifiedCount || 0;
  const avgDonation = stats?.avgDonationRupees || 0;
  const sevas = stats?.sevaDistribution || [];
  const recent = stats?.recentDonations || [];

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-maroon">
            Foundation Dashboard
          </h1>
          <p className="text-xs text-ink-muted">
            Overview of verified seva contributions, pending verifications, and financial year statistics.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2">
          <Link
            href="/admin/donations/pending"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-serif font-bold text-xs shadow-xs"
          >
            <Clock className="w-4 h-4" />
            <span>Pending Queue ({pendingCount})</span>
          </Link>
        </div>
      </div>

      {/* Prominent Pending Alert if items are pending */}
      {pendingCount > 0 && (
        <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500 text-white">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-base text-amber-900 leading-tight">
                {pendingCount} Donation{pendingCount > 1 ? "s" : ""} Awaiting Verification
              </h2>
              <p className="text-xs text-amber-700 font-sans mt-0.5">
                Donors have submitted UTR / transaction proofs. Verify against bank records to allocate receipts.
              </p>
            </div>
          </div>
          <Link
            href="/admin/donations/pending"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 text-white font-serif font-bold text-xs hover:bg-amber-700 transition-all shrink-0"
          >
            <span>Review Queue</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* All-time Verified */}
        <div className="rounded-2xl bg-paper p-5 border border-gold/40 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-sans font-semibold text-ink-muted uppercase tracking-wider">
              Total Verified Seva
            </span>
            <div className="p-2 rounded-lg bg-green-50 text-green-700">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="font-serif text-2xl font-bold text-maroon block">
              {formatINR(allTimeRupees)}
            </span>
            <span className="text-[11px] text-ink-muted">
              {verifiedCount} verified receipts issued
            </span>
          </div>
        </div>

        {/* This Financial Year */}
        <div className="rounded-2xl bg-paper p-5 border border-gold/40 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-sans font-semibold text-ink-muted uppercase tracking-wider">
              This Financial Year
            </span>
            <div className="p-2 rounded-lg bg-sand text-maroon">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="font-serif text-2xl font-bold text-maroon block">
              {formatINR(thisFyRupees)}
            </span>
            <span className="text-[11px] text-ink-muted">
              Current FY 2026-27 total
            </span>
          </div>
        </div>

        {/* This Month */}
        <div className="rounded-2xl bg-paper p-5 border border-gold/40 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-sans font-semibold text-ink-muted uppercase tracking-wider">
              This Month
            </span>
            <div className="p-2 rounded-lg bg-saffron/10 text-saffron-deep">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="font-serif text-2xl font-bold text-saffron-deep block">
              {formatINR(thisMonthRupees)}
            </span>
            <span className="text-[11px] text-ink-muted">
              Avg donation: {formatINR(avgDonation)}
            </span>
          </div>
        </div>

        {/* Donors Registry */}
        <div className="rounded-2xl bg-paper p-5 border border-gold/40 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-sans font-semibold text-ink-muted uppercase tracking-wider">
              Unique Donors
            </span>
            <div className="p-2 rounded-lg bg-sand text-maroon">
              <Users2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="font-serif text-2xl font-bold text-maroon block">
              {donorCount}
            </span>
            <span className="text-[11px] text-ink-muted">
              Devotees across India
            </span>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Seva Breakdown & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Seva Breakdown (5 cols) */}
        <div className="lg:col-span-5 rounded-3xl bg-paper p-6 border border-gold/30 shadow-xs">
          <h2 className="font-serif text-lg font-bold text-maroon mb-1">
            Contributions by Seva Area
          </h2>
          <p className="text-xs text-ink-muted mb-5">
            Verified funds allocated per charitable purpose.
          </p>

          <div className="space-y-4">
            {sevas.map((s: any) => {
              const rupees = (s.totalPaise || 0) / 100;
              const pct = allTimeRupees > 0 ? Math.round((rupees / allTimeRupees) * 100) : 0;
              return (
                <div key={s.id} className="space-y-1">
                  <div className="flex justify-between text-xs font-sans">
                    <span className="font-medium text-maroon truncate max-w-[200px]">
                      {s.title}
                    </span>
                    <span className="font-mono font-semibold text-ink">
                      {formatINR(rupees)} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-sand/50 overflow-hidden">
                    <div
                      className="h-full bg-saffron rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(pct, 2)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Donations Table (7 cols) */}
        <div className="lg:col-span-7 rounded-3xl bg-paper p-6 border border-gold/30 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-serif text-lg font-bold text-maroon">
                  Recent Contributions
                </h2>
                <p className="text-xs text-ink-muted">
                  Latest donation transactions received.
                </p>
              </div>
              <Link
                href="/admin/donations"
                className="text-xs font-serif font-bold text-saffron-deep hover:text-maroon inline-flex items-center gap-1"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead className="bg-sand/30 text-ink-muted uppercase text-[10px] tracking-wider border-b border-border">
                  <tr>
                    <th className="py-2.5 px-3">Ref ID</th>
                    <th className="py-2.5 px-3">Donor</th>
                    <th className="py-2.5 px-3">Amount</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {recent.length > 0 ? (
                    recent.map((r: any) => (
                      <tr key={r.id} className="hover:bg-sand/10">
                        <td className="py-2.5 px-3 font-mono font-bold text-maroon">
                          {r.refId}
                        </td>
                        <td className="py-2.5 px-3 truncate max-w-[120px]">
                          {r.donorName}
                        </td>
                        <td className="py-2.5 px-3 font-serif font-bold text-saffron-deep">
                          {formatINR(r.amountRupees)}
                        </td>
                        <td className="py-2.5 px-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${r.status === "VERIFIED"
                                ? "bg-green-100 text-green-800"
                                : r.status === "PENDING_VERIFICATION"
                                  ? "bg-amber-100 text-amber-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                          >
                            {r.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-6 text-center text-ink-muted">
                        No recent donations recorded yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
