"use client";

import React, { useState, useEffect } from "react";
import { adminFetch } from "@/lib/admin-api";
import { History, Shield, RefreshCw } from "lucide-react";
import { toast } from "sonner";

export default function AuditLogPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const loadLogs = async () => {
    setLoading(true);
    try {
      const res = await adminFetch(`/admin/audit-log?page=${page}&limit=50`);
      setLogs(res.items || []);
      setTotal(res.total || 0);
    } catch (err: any) {
      toast.error(err.message || "Failed to load audit logs (Requires SUPER_ADMIN).");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, [page]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-maroon flex items-center gap-2">
            <History className="w-7 h-7 text-maroon" />
            <span>Security & Operational Audit Trail</span>
          </h1>
          <p className="text-xs text-ink-muted">
            Immutable log of all administrative actions, receipt allocations, donation verifications, and logins.
          </p>
        </div>

        <button
          type="button"
          onClick={loadLogs}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gold/40 text-xs font-serif font-bold text-maroon hover:bg-sand/30"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh</span>
        </button>
      </div>

      <div className="rounded-3xl bg-paper border border-gold/30 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-sand/40 text-ink-muted uppercase text-[10px] tracking-wider border-b border-border">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Actor</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Target Entity</th>
                <th className="py-3 px-4">Entity ID</th>
                <th className="py-3 px-4">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-ink-muted">
                    Loading audit trail...
                  </td>
                </tr>
              ) : logs.length > 0 ? (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-sand/10 transition-colors">
                    <td className="py-3 px-4 text-ink font-mono text-[11px]">
                      {new Date(log.at).toLocaleString("en-IN", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-maroon block font-serif">
                        {log.actor?.email || "System"}
                      </span>
                      {log.actor?.role && (
                        <span className="text-[10px] text-ink-muted font-mono">{log.actor.role}</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-xs text-saffron-deep bg-saffron/10 px-2 py-0.5 rounded-md">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-ink">{log.entity}</td>
                    <td className="py-3 px-4 font-mono text-ink-muted text-[11px]">
                      {log.entityId || "—"}
                    </td>
                    <td className="py-3 px-4 font-mono text-ink-muted text-[11px]">
                      {log.ip || "—"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-ink-muted">
                    No audit records recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-border flex items-center justify-between text-xs text-ink-muted">
          <span>Total events recorded: {total}</span>
        </div>
      </div>
    </div>
  );
}
