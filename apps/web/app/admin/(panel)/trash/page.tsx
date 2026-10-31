"use client";

import React, { useState, useEffect } from "react";
import { adminFetch } from "@/lib/admin-api";
import {
  History,
  RotateCcw,
  Trash2,
  AlertTriangle,
  ShieldAlert,
  Loader2,
  Calendar,
  Layers,
} from "lucide-react";
import { toast } from "sonner";
import { useConfirm } from "@/components/admin/ui/ConfirmDialog";

interface TrashItem {
  id: string;
  entityType: string;
  displayTitle: string;
  deletedAt: string;
}

export default function TrashPage() {
  const { confirm, ConfirmComponent } = useConfirm();
  const [trashItems, setTrashItems] = useState<TrashItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [restoringId, setRestoringId] = useState<string | null>(null);

  useEffect(() => {
    loadTrash();
  }, []);

  const loadTrash = async () => {
    setLoading(true);
    try {
      const data = await adminFetch("/admin/trash");
      setTrashItems(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Failed to load trash items.");
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (item: TrashItem) => {
    setRestoringId(item.id);
    try {
      await adminFetch(`/admin/trash/${item.entityType}/${item.id}/restore`, {
        method: "POST",
      });
      setTrashItems((prev) => prev.filter((i) => !(i.id === item.id && i.entityType === item.entityType)));
      toast.success(`"${item.displayTitle}" restored successfully!`);
    } catch {
      toast.error("Failed to restore item.");
    } finally {
      setRestoringId(null);
    }
  };

  const handlePermanentDelete = async (item: TrashItem) => {
    const isConfirmed = await confirm({
      title: `Permanently delete "${item.displayTitle}"?`,
      description:
        "WARNING: This action CANNOT be undone. The database record will be completely expunged. Type DELETE to confirm.",
      confirmLabel: "Permanently Delete",
      variant: "danger",
      highRisk: true,
      confirmMatchText: "DELETE",
    });

    if (!isConfirmed) return;

    try {
      await adminFetch(`/admin/trash/${item.entityType}/${item.id}`, {
        method: "DELETE",
      });
      setTrashItems((prev) => prev.filter((i) => !(i.id === item.id && i.entityType === item.entityType)));
      toast.success("Item permanently deleted.");
    } catch (err: any) {
      toast.error(err.message || "Failed to permanently delete item.");
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl mx-auto">
      {ConfirmComponent}


      {/* Header */}
      <div className="border-b border-gold/30 pb-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="p-1.5 rounded-lg bg-red-100 text-red-800">
            <History className="w-5 h-5 text-red-800" />
          </span>
          <h1 className="text-2xl font-serif font-bold text-maroon">
            Content Trash & Recovery
          </h1>
        </div>
        <p className="text-xs text-ink-muted font-sans">
          Items soft-deleted across all modules are safely held here for 30 days before permanent purging.
        </p>
      </div>

      {/* Financial Records Immutability Notice */}
      <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-900 leading-relaxed space-y-1">
          <p className="font-serif font-bold">
            Statutory Immutability Guarantee
          </p>
          <p>
            Under Indian Trust Laws and 80G regulations, verified donations, official donation receipts, donor audit histories, and banking records can <strong>never</strong> be deleted from the database. Financial records may only be marked as Void or Rejected with mandatory audit justifications.
          </p>
        </div>
      </div>

      {/* Trash Items List */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3 text-ink-muted">
          <Loader2 className="w-8 h-8 animate-spin text-saffron" />
          <span className="text-xs font-serif">Loading trash items...</span>
        </div>
      ) : trashItems.length === 0 ? (
        <div className="py-20 bg-paper rounded-3xl border border-dashed border-gold/40 text-center space-y-2">
          <History className="w-12 h-12 mx-auto text-gold/40" />
          <p className="text-sm font-serif font-bold text-maroon">Trash is empty</p>
          <p className="text-xs text-ink-muted">No deleted content items currently in trash.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {trashItems.map((item) => (
            <div
              key={`${item.entityType}-${item.id}`}
              className="p-4 rounded-2xl bg-paper border border-gold/20 shadow-2xs hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-sand text-ink-muted">
                    {item.entityType}
                  </span>
                  <h3 className="font-serif font-bold text-sm text-maroon">
                    {item.displayTitle}
                  </h3>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-ink-muted">
                  <Calendar className="w-3 h-3 text-gold" />
                  <span>Deleted on {new Date(item.deletedAt).toLocaleString()}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  disabled={restoringId === item.id}
                  onClick={() => handleRestore(item)}
                  className="px-3 py-1.5 rounded-xl bg-sand/30 hover:bg-sand/60 text-maroon text-xs font-serif font-bold border border-gold/30 flex items-center gap-1.5 shadow-2xs"
                >
                  {restoringId === item.id ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <RotateCcw className="w-3.5 h-3.5 text-saffron" />
                  )}
                  <span>Restore</span>
                </button>

                <button
                  type="button"
                  onClick={() => handlePermanentDelete(item)}
                  className="px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-serif font-semibold border border-red-200 flex items-center gap-1.5 shadow-2xs"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Permanently</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
