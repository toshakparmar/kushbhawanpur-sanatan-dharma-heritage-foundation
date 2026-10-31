"use client";

import * as React from "react";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import { AlertTriangle, AlertCircle, X, Loader2 } from "lucide-react";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  consequenceText?: string;
  itemName?: string;
  itemThumbnail?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning" | "info";
  highRisk?: boolean; // Requires typing confirmation text
  confirmMatchText?: string; // Text to type (default: "DELETE" or item name)
  onConfirm: () => Promise<void> | void;
  isLoading?: boolean;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  consequenceText,
  itemName,
  itemThumbnail,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  variant = "danger",
  highRisk = false,
  confirmMatchText,
  onConfirm,
  isLoading = false,
}: ConfirmDialogProps) {
  const [typedText, setTypedText] = React.useState("");
  const requiredText = confirmMatchText || (itemName ? itemName.trim() : "DELETE");
  const isMatch = !highRisk || typedText.trim() === requiredText.trim();

  React.useEffect(() => {
    if (!open) setTypedText("");
  }, [open]);

  const handleConfirm = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isMatch || isLoading) return;
    await onConfirm();
    onOpenChange(false);
  };

  return (
    <AlertDialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <AlertDialogPrimitive.Portal>
        <AlertDialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs transition-opacity data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <AlertDialogPrimitive.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-md translate-x-[-50%] translate-y-[-50%] rounded-2xl border border-sand bg-paper p-6 shadow-2xl transition-all duration-200 focus:outline-hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
          <div className="flex items-start gap-4">
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                variant === "danger"
                  ? "bg-red-50 text-red-600 border border-red-200"
                  : "bg-amber-50 text-amber-600 border border-amber-200"
              }`}
            >
              {variant === "danger" ? (
                <AlertCircle className="h-6 w-6" />
              ) : (
                <AlertTriangle className="h-6 w-6" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <AlertDialogPrimitive.Title className="text-lg font-serif font-bold text-ink">
                {title}
              </AlertDialogPrimitive.Title>
              <AlertDialogPrimitive.Description className="mt-1.5 text-xs text-ink/75 leading-relaxed">
                {description}
              </AlertDialogPrimitive.Description>
            </div>

            <AlertDialogPrimitive.Cancel asChild>
              <button
                type="button"
                className="text-ink/40 hover:text-ink transition-colors p-1 rounded-lg"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </AlertDialogPrimitive.Cancel>
          </div>

          {/* Item details & thumbnail if provided */}
          {itemName && (
            <div className="mt-4 flex items-center gap-3 rounded-xl bg-sand/40 border border-sand/80 p-3">
              {itemThumbnail && (
                <img
                  src={itemThumbnail}
                  alt={itemName}
                  className="h-10 w-10 rounded-lg object-cover border border-sand bg-white"
                />
              )}
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-ink truncate">{itemName}</p>
                <p className="text-[10px] text-ink/60">Selected item</p>
              </div>
            </div>
          )}

          {/* Consequence warning */}
          {consequenceText && (
            <div className="mt-3 rounded-lg bg-amber-50/80 border border-amber-200/80 px-3 py-2 text-[11px] text-amber-900 leading-snug">
              <span className="font-semibold">Note:</span> {consequenceText}
            </div>
          )}

          {/* High risk typing verification */}
          {highRisk && (
            <div className="mt-4 space-y-1.5">
              <label className="text-[11px] font-medium text-ink/80 block">
                Type <span className="font-mono font-bold text-red-700 bg-red-50 px-1 py-0.5 rounded border border-red-200">{requiredText}</span> to confirm:
              </label>
              <input
                type="text"
                value={typedText}
                onChange={(e) => setTypedText(e.target.value)}
                placeholder={requiredText}
                className="w-full rounded-xl border border-sand bg-white px-3 py-2 text-xs font-mono text-ink placeholder:text-ink/30 focus:border-red-500 focus:outline-hidden focus:ring-1 focus:ring-red-500"
                autoFocus
              />
            </div>
          )}

          <div className="mt-6 flex items-center justify-end gap-2.5">
            <AlertDialogPrimitive.Cancel asChild>
              <button
                type="button"
                disabled={isLoading}
                className="rounded-xl border border-sand/90 bg-white px-4 py-2 text-xs font-medium text-ink hover:bg-sand/30 transition-colors focus:outline-hidden disabled:opacity-50"
              >
                {cancelLabel}
              </button>
            </AlertDialogPrimitive.Cancel>

            <button
              type="button"
              disabled={!isMatch || isLoading}
              onClick={handleConfirm}
              className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-medium text-white shadow-xs transition-colors focus:outline-hidden disabled:opacity-40 disabled:cursor-not-allowed ${
                variant === "danger"
                  ? "bg-red-700 hover:bg-red-800 focus:ring-2 focus:ring-red-500"
                  : "bg-maroon hover:bg-maroon-deep focus:ring-2 focus:ring-maroon"
              }`}
            >
              {isLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              {confirmLabel}
            </button>
          </div>
        </AlertDialogPrimitive.Content>
      </AlertDialogPrimitive.Portal>
    </AlertDialogPrimitive.Root>
  );
}

// Hook for promise-based confirmation
interface ConfirmOptions {
  title: string;
  description: string;
  consequenceText?: string;
  itemName?: string;
  itemThumbnail?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning";
  highRisk?: boolean;
  confirmMatchText?: string;
}

export function useConfirm() {
  const [state, setState] = React.useState<{
    isOpen: boolean;
    options: ConfirmOptions;
    resolve: (value: boolean) => void;
  } | null>(null);

  const confirm = React.useCallback((options: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setState({
        isOpen: true,
        options,
        resolve,
      });
    });
  }, []);

  const handleClose = React.useCallback(
    (confirmed: boolean) => {
      if (state) {
        state.resolve(confirmed);
        setState(null);
      }
    },
    [state],
  );

  const ConfirmComponent = React.useMemo(() => {
    if (!state) return null;
    return (
      <ConfirmDialog
        open={state.isOpen}
        onOpenChange={(open) => {
          if (!open) handleClose(false);
        }}
        onConfirm={() => handleClose(true)}
        {...state.options}
      />
    );
  }, [state, handleClose]);

  return { confirm, ConfirmComponent };
}
