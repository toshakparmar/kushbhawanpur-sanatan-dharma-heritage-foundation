"use client";

import React, { useState, useEffect } from "react";
import { adminFetch } from "@/lib/admin-api";
import { CreditCard, Plus, Trash2, CheckCircle2, Save, QrCode } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useConfirm } from "@/components/admin/ui/ConfirmDialog";

export default function PaymentSettingsPage() {
  const [settings, setSettings] = useState<any>({});
  const [upiAccounts, setUpiAccounts] = useState<any[]>([]);
  const [bankAccounts, setBankAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // New UPI modal
  const [showUpiModal, setShowUpiModal] = useState(false);
  const [newUpiLabel, setNewUpiLabel] = useState("");
  const [newUpiVpa, setNewUpiVpa] = useState("");
  const [newUpiPayee, setNewUpiPayee] = useState("");
  const [newUpiPrimary, setNewUpiPrimary] = useState(false);

  // New Bank modal
  const [showBankModal, setShowBankModal] = useState(false);
  const [newBankHolder, setNewBankHolder] = useState("");
  const [newBankNumber, setNewBankNumber] = useState("");
  const [newBankIfsc, setNewBankIfsc] = useState("");
  const [newBankName, setNewBankName] = useState("");
  const [newBankBranch, setNewBankBranch] = useState("");

  const loadData = async () => {
    setLoading(true);
    try {
      const [s, u, b] = await Promise.all([
        adminFetch("/admin/payment-settings"),
        adminFetch("/admin/upi-accounts"),
        adminFetch("/admin/bank-accounts"),
      ]);
      setSettings(s || {});
      setUpiAccounts(u || []);
      setBankAccounts(b || []);
    } catch (err: any) {
      toast.error(err.message || "Failed to load payment settings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await adminFetch("/admin/payment-settings", {
        method: "PUT",
        body: JSON.stringify(settings),
      });
      toast.success("Payment parameters saved successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  const handleCreateUpi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUpiVpa.includes("@")) {
      toast.error("Please enter a valid UPI ID (e.g. name@bank).");
      return;
    }

    try {
      await adminFetch("/admin/upi-accounts", {
        method: "POST",
        body: JSON.stringify({
          label: newUpiLabel.trim(),
          vpa: newUpiVpa.trim(),
          payeeName: newUpiPayee.trim(),
          isPrimary: newUpiPrimary,
        }),
      });
      toast.success("UPI account added.");
      setShowUpiModal(false);
      setNewUpiLabel("");
      setNewUpiVpa("");
      setNewUpiPayee("");
      loadData();
    } catch (err: any) {
      toast.error(err.message || "Failed to add UPI account.");
    }
  };

  const { confirm, ConfirmComponent } = useConfirm();

  const handleDeleteUpi = async (account: any) => {
    const isConfirmed = await confirm({
      title: "Delete UPI Account?",
      description: `Are you sure you want to delete ${account.label} (${account.vpa})?`,
      consequenceText: account.isPrimary
        ? "CRITICAL: This is your PRIMARY receiving UPI ID. Deleting it will prevent dynamic UPI QR generation until another account is made primary."
        : "This UPI ID will no longer be available for donation receipts.",
      itemName: account.vpa,
      highRisk: account.isPrimary,
      confirmMatchText: account.isPrimary ? "DELETE" : undefined,
      confirmLabel: "Delete UPI Account",
      variant: "danger",
    });

    if (!isConfirmed) return;

    try {
      await adminFetch(`/admin/upi-accounts/${account.id}`, { method: "DELETE" });
      toast.success("UPI account deleted.");
      loadData();
    } catch (err: any) {
      toast.error(err.message || "Delete failed.");
    }
  };

  const handleCreateBank = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminFetch("/admin/bank-accounts", {
        method: "POST",
        body: JSON.stringify({
          holder: newBankHolder.trim(),
          accountNumber: newBankNumber.trim(),
          ifsc: newBankIfsc.trim(),
          bank: newBankName.trim(),
          branch: newBankBranch.trim() || undefined,
          showPublic: true,
        }),
      });
      toast.success("Bank account added securely with AES-256 encryption.");
      setShowBankModal(false);
      setNewBankHolder("");
      setNewBankNumber("");
      setNewBankIfsc("");
      setNewBankName("");
      setNewBankBranch("");
      loadData();
    } catch (err: any) {
      toast.error(err.message || "Failed to add bank account.");
    }
  };

  const handleDeleteBank = async (account: any) => {
    const isConfirmed = await confirm({
      title: "Delete Bank Account?",
      description: `Are you sure you want to delete the ${account.bank} account?`,
      consequenceText: "This account details will be removed from the public Direct Bank Transfer section immediately.",
      itemName: `${account.bank} (${account.accountNumberMasked})`,
      confirmLabel: "Delete Account",
      variant: "danger",
    });

    if (!isConfirmed) return;

    try {
      await adminFetch(`/admin/bank-accounts/${account.id}`, { method: "DELETE" });
      toast.success("Bank account deleted.");
      loadData();
    } catch (err: any) {
      toast.error(err.message || "Delete failed.");
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-ink-muted">Loading payment configuration...</div>;
  }

  return (
    <div className="space-y-8">
      {ConfirmComponent}

      {/* Title */}
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-maroon flex items-center gap-2">
          <CreditCard className="w-7 h-7 text-maroon" />
          <span>Payment & Direct Banking Configuration</span>
        </h1>
        <p className="text-xs text-ink-muted">
          Manage dynamic UPI QR generation, primary receiving VPAs, encrypted bank account numbers, and donor limits.
        </p>
      </div>

      {/* Section 1: UPI Accounts */}
      <div className="rounded-3xl bg-paper p-6 sm:p-8 border border-gold/40 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div>
            <h2 className="font-serif text-lg font-bold text-maroon">
              1. UPI Accounts (Exactly One Primary for Public QR)
            </h2>
            <p className="text-xs text-ink-muted">
              Dynamic UPI QR on the website is generated using the active Primary UPI ID.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowUpiModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-maroon text-cream font-serif font-bold text-xs shadow-xs"
          >
            <Plus className="w-4 h-4 text-gold" />
            <span>Add UPI ID</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {upiAccounts.map((upi) => (
            <div
              key={upi.id}
              className={`p-4 rounded-2xl border flex items-center justify-between ${
                upi.isPrimary
                  ? "border-saffron bg-saffron/10 ring-2 ring-saffron/30"
                  : "border-border bg-sand/10"
              }`}
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-serif font-bold text-sm text-maroon">{upi.label}</span>
                  {upi.isPrimary && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-saffron text-white">
                      PRIMARY
                    </span>
                  )}
                </div>
                <span className="font-mono text-xs font-semibold text-ink block mt-0.5">
                  {upi.vpa}
                </span>
                <span className="text-[11px] text-ink-muted block">Payee: {upi.payeeName}</span>
              </div>

              <button
                type="button"
                onClick={() => handleDeleteUpi(upi)}
                className="p-1.5 rounded-lg text-ink-muted hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Section 2: Bank Accounts */}
      <div className="rounded-3xl bg-paper p-6 sm:p-8 border border-gold/40 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div>
            <h2 className="font-serif text-lg font-bold text-maroon">
              2. Registered Bank Accounts (Encrypted at Rest)
            </h2>
            <p className="text-xs text-ink-muted">
              Account numbers are encrypted with AES-256-GCM and masked on the public site.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowBankModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-maroon text-cream font-serif font-bold text-xs shadow-xs"
          >
            <Plus className="w-4 h-4 text-gold" />
            <span>Add Bank Account</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {bankAccounts.map((bank) => (
            <div
              key={bank.id}
              className="p-4 rounded-2xl border border-border bg-sand/10 flex items-center justify-between"
            >
              <div>
                <span className="font-serif font-bold text-sm text-maroon block">
                  {bank.holder}
                </span>
                <span className="text-xs text-ink font-mono block">
                  {bank.bank} ({bank.branch || "Main"}) · IFSC: {bank.ifsc}
                </span>
                <span className="text-xs font-mono font-bold text-saffron-deep block mt-0.5">
                  Account: {bank.accountNumberMasked}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleDeleteBank(bank)}
                className="p-1.5 rounded-lg text-ink-muted hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Section 3: General Payment Parameters */}
      <form onSubmit={handleSaveSettings} className="rounded-3xl bg-paper p-6 sm:p-8 border border-gold/40 shadow-xs space-y-4">
        <h2 className="font-serif text-lg font-bold text-maroon border-b border-border pb-2">
          3. Donor Thresholds & Method Toggles
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-maroon mb-1">
              Minimum Allowed Amount (INR)
            </label>
            <input
              type="number"
              min="1"
              value={(settings.minAmountPaise || 10000) / 100}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  minAmountPaise: Math.round(parseFloat(e.target.value) * 100),
                })
              }
              className="w-full px-3 py-2 rounded-xl border border-border text-xs font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-maroon mb-1">
              Maximum Allowed Amount (INR)
            </label>
            <input
              type="number"
              min="1"
              value={(settings.maxAmountPaise || 100000000) / 100}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  maxAmountPaise: Math.round(parseFloat(e.target.value) * 100),
                })
              }
              className="w-full px-3 py-2 rounded-xl border border-border text-xs font-bold"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-maroon mb-1">
            Verification SLA Text (Shown to donors on confirmation)
          </label>
          <input
            type="text"
            value={settings.verificationSlaText || ""}
            onChange={(e) =>
              setSettings({ ...settings, verificationSlaText: e.target.value })
            }
            className="w-full px-3 py-2 rounded-xl border border-border text-xs"
          />
        </div>

        <div className="flex justify-end pt-4 border-t border-border">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-8 py-2.5 rounded-xl bg-maroon text-cream font-serif font-bold text-xs hover:bg-maroon-dark transition-all shadow-md cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4 text-gold" />
            <span>{saving ? "Saving..." : "Save Payment Parameters"}</span>
          </button>
        </div>
      </form>

      {/* Add UPI Modal */}
      <Dialog open={showUpiModal} onOpenChange={setShowUpiModal}>
        <DialogContent className="max-w-md p-6 bg-paper rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-serif text-lg font-bold text-maroon">
              Add Foundation UPI Account
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateUpi} className="space-y-4 py-2">
            <div>
              <label className="block text-xs font-bold text-maroon mb-1">Label (e.g. Primary Foundation UPI) *</label>
              <input
                type="text"
                required
                value={newUpiLabel}
                onChange={(e) => setNewUpiLabel(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-border text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-maroon mb-1">UPI ID (VPA) *</label>
              <input
                type="text"
                required
                placeholder="trust@okhdfcbank"
                value={newUpiVpa}
                onChange={(e) => setNewUpiVpa(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-border text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-maroon mb-1">Payee Name *</label>
              <input
                type="text"
                required
                placeholder="Kushbhawanpur Foundation"
                value={newUpiPayee}
                onChange={(e) => setNewUpiPayee(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-border text-xs"
              />
            </div>
            <label className="flex items-center gap-2 cursor-pointer text-xs">
              <input
                type="checkbox"
                checked={newUpiPrimary}
                onChange={(e) => setNewUpiPrimary(e.target.checked)}
                className="rounded"
              />
              <span className="font-bold text-maroon">Make this the Primary UPI for public dynamic QR</span>
            </label>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowUpiModal(false)}
                className="px-3 py-1.5 text-xs text-ink-muted"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-xl bg-maroon text-cream font-bold text-xs"
              >
                Add UPI ID
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Bank Modal */}
      <Dialog open={showBankModal} onOpenChange={setShowBankModal}>
        <DialogContent className="max-w-md p-6 bg-paper rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-serif text-lg font-bold text-maroon">
              Add Secure Bank Account
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateBank} className="space-y-4 py-2">
            <div>
              <label className="block text-xs font-bold text-maroon mb-1">Account Holder Name *</label>
              <input
                type="text"
                required
                value={newBankHolder}
                onChange={(e) => setNewBankHolder(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-border text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-maroon mb-1">Bank Account Number *</label>
              <input
                type="text"
                required
                value={newBankNumber}
                onChange={(e) => setNewBankNumber(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-border text-xs font-mono"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-maroon mb-1">Bank Name *</label>
                <input
                  type="text"
                  required
                  value={newBankName}
                  onChange={(e) => setNewBankName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-border text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-maroon mb-1">IFSC Code *</label>
                <input
                  type="text"
                  required
                  value={newBankIfsc}
                  onChange={(e) => setNewBankIfsc(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 rounded-xl border border-border text-xs font-mono uppercase"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-maroon mb-1">Branch</label>
              <input
                type="text"
                value={newBankBranch}
                onChange={(e) => setNewBankBranch(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-border text-xs"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowBankModal(false)}
                className="px-3 py-1.5 text-xs text-ink-muted"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-xl bg-maroon text-cream font-bold text-xs"
              >
                Add Account
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
