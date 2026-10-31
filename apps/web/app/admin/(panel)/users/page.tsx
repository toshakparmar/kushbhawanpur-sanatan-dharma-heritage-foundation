"use client";

import React, { useState, useEffect } from "react";
import { adminFetch } from "@/lib/admin-api";
import { ShieldCheck, Plus, KeyRound, UserCheck, UserX, UserPlus, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select } from "@/components/admin/ui/Select";
import { useConfirm } from "@/components/admin/ui/ConfirmDialog";

const ROLE_OPTIONS = [
  {
    value: "ACCOUNTS",
    label: "ACCOUNTS",
    description: "Donations verification, 80G receipts, bank reconciliation & payment settings view",
  },
  {
    value: "CONTENT",
    label: "CONTENT",
    description: "CMS content, leadership team, certifications, video gallery, and sevas",
  },
  {
    value: "SUPER_ADMIN",
    label: "SUPER_ADMIN",
    description: "Full unrestricted access including user management and system audits",
  },
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState("ACCOUNTS");
  const [actionLoading, setActionLoading] = useState(false);

  // Reset password modal
  const [resetUser, setResetUser] = useState<any>(null);
  const [resetPassword, setResetPassword] = useState("");

  const { confirm, ConfirmComponent } = useConfirm();

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await adminFetch("/admin/users");
      setUsers(data || []);
    } catch (err: any) {
      toast.error(err.message || "Failed to load users (Requires SUPER_ADMIN).");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }

    setActionLoading(true);
    try {
      await adminFetch("/admin/users", {
        method: "POST",
        body: JSON.stringify({
          email: newEmail.trim(),
          password: newPassword,
          role: newRole,
        }),
      });
      toast.success("Admin user created.");
      setShowAddModal(false);
      setNewEmail("");
      setNewPassword("");
      loadUsers();
    } catch (err: any) {
      toast.error(err.message || "Failed to create user.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleActive = async (user: any) => {
    const isDisabling = user.active;
    if (isDisabling) {
      const isConfirmed = await confirm({
        title: "Disable Admin User?",
        description: `Are you sure you want to disable access for ${user.email}?`,
        consequenceText: "HIGH RISK: This user will immediately be blocked from logging into the admin portal.",
        itemName: user.email,
        highRisk: user.role === "SUPER_ADMIN",
        confirmMatchText: user.role === "SUPER_ADMIN" ? "DELETE" : undefined,
        confirmLabel: "Disable Access",
        variant: "danger",
      });

      if (!isConfirmed) return;
    }

    try {
      await adminFetch(`/admin/users/${user.id}`, {
        method: "PUT",
        body: JSON.stringify({ active: !user.active }),
      });
      toast.success(`User ${user.active ? "disabled" : "activated"}.`);
      loadUsers();
    } catch (err: any) {
      toast.error(err.message || "Failed to update user status.");
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (resetPassword.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }

    try {
      await adminFetch(`/admin/users/${resetUser.id}`, {
        method: "PUT",
        body: JSON.stringify({
          password: resetPassword,
          mustChangePassword: true,
        }),
      });
      toast.success("Password reset. User will be prompted to change password on next login.");
      setResetUser(null);
      setResetPassword("");
    } catch (err: any) {
      toast.error(err.message || "Password reset failed.");
    }
  };

  return (
    <div className="space-y-6">
      {ConfirmComponent}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-maroon flex items-center gap-2.5">
            <ShieldCheck className="w-7 h-7 text-maroon" />
            <span>Admin Users & Access Control (RBAC)</span>
          </h1>
          <p className="text-xs text-ink/70 mt-1">
            Manage authenticated accounts and role-based permissions (SUPER_ADMIN, ACCOUNTS, CONTENT).
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-maroon hover:bg-maroon-deep text-cream font-serif font-bold text-xs shadow-xs transition-colors"
        >
          <UserPlus className="w-4 h-4 text-gold" />
          <span>Add Admin User</span>
        </button>
      </div>

      {/* Users Table */}
      <div className="rounded-3xl bg-paper border border-sand shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-sand/30 text-ink/70 uppercase text-[10px] tracking-wider border-b border-sand">
              <tr>
                <th className="py-3 px-4 font-semibold">User Email</th>
                <th className="py-3 px-4 font-semibold">Role</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold">Must Change Password</th>
                <th className="py-3 px-4 font-semibold">Created Date</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand/60">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-ink/50">
                    Loading users...
                  </td>
                </tr>
              ) : users.length > 0 ? (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-sand/20 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-maroon font-serif text-sm">
                      {u.email}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-saffron/10 text-saffron-deep font-mono">
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                          u.active ? "bg-banyan/10 text-banyan" : "bg-red-100 text-red-700"
                        }`}
                      >
                        {u.active ? "Active" : "Disabled"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-ink/60 font-mono">
                      {u.mustChangePassword ? "Yes (Forced)" : "No"}
                    </td>
                    <td className="py-3.5 px-4 text-ink/60 font-mono">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setResetUser(u)}
                          className="p-1.5 rounded-lg border border-sand text-maroon hover:bg-sand/40 transition-colors"
                          title="Reset Password"
                        >
                          <KeyRound className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleToggleActive(u)}
                          className={`p-1.5 rounded-lg border transition-colors ${
                            u.active
                              ? "border-sand text-ink/60 hover:text-red-700 hover:bg-red-50"
                              : "border-sand text-ink/40 hover:text-banyan hover:bg-banyan/10"
                          }`}
                          title={u.active ? "Disable User" : "Activate User"}
                        >
                          {u.active ? (
                            <UserX className="w-3.5 h-3.5" />
                          ) : (
                            <UserCheck className="w-3.5 h-3.5 text-banyan" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-ink/50">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-md p-6 bg-paper rounded-2xl border border-sand shadow-2xl">
          <DialogHeader>
            <DialogTitle className="font-serif text-lg font-bold text-maroon flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-gold" />
              <span>Create New Admin User</span>
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleCreateUser} className="space-y-4 py-2">
            <div>
              <label className="block text-xs font-semibold text-ink mb-1.5">
                Official Email Address *
              </label>
              <input
                type="email"
                required
                placeholder="trustee@kushbhawanpur.org"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-sand bg-paper text-xs text-ink focus:border-gold focus:outline-hidden focus:ring-1 focus:ring-gold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink mb-1.5">
                Initial Temporary Password *
              </label>
              <input
                type="password"
                required
                minLength={8}
                placeholder="At least 8 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-sand bg-paper text-xs font-mono text-ink focus:border-gold focus:outline-hidden focus:ring-1 focus:ring-gold"
              />
              <span className="text-[11px] text-ink/50 mt-1 block">
                User will be forced to choose their own password on first login.
              </span>
            </div>

            {/* Role Select via custom Combobox */}
            <div>
              <label className="block text-xs font-semibold text-ink mb-1.5">
                Role / Permissions *
              </label>
              <Select
                value={newRole}
                onChange={(val) => setNewRole(val)}
                options={ROLE_OPTIONS}
                searchable={false}
              />
            </div>

            <div className="flex justify-end gap-2.5 pt-4 border-t border-sand">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="rounded-xl border border-sand bg-white px-4 py-2 text-xs font-medium text-ink hover:bg-sand/30 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={actionLoading}
                className="rounded-xl bg-maroon hover:bg-maroon-deep px-5 py-2 text-xs font-bold text-cream shadow-xs transition-colors disabled:opacity-50"
              >
                {actionLoading ? "Creating..." : "Create User"}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Reset Password Modal */}
      <Dialog open={Boolean(resetUser)} onOpenChange={(open) => !open && setResetUser(null)}>
        <DialogContent className="max-w-md p-6 bg-paper rounded-2xl border border-sand shadow-2xl">
          <DialogHeader>
            <DialogTitle className="font-serif text-lg font-bold text-maroon flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-gold" />
              <span>Reset Password for {resetUser?.email}</span>
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleResetPassword} className="space-y-4 py-2">
            <div>
              <label className="block text-xs font-semibold text-ink mb-1.5">
                New Temporary Password *
              </label>
              <input
                type="password"
                required
                minLength={8}
                value={resetPassword}
                onChange={(e) => setResetPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-sand bg-paper text-xs font-mono text-ink focus:border-gold focus:outline-hidden focus:ring-1 focus:ring-gold"
                placeholder="At least 8 characters"
              />
            </div>
            <div className="flex justify-end gap-2.5 pt-4 border-t border-sand">
              <button
                type="button"
                onClick={() => setResetUser(null)}
                className="rounded-xl border border-sand bg-white px-4 py-2 text-xs font-medium text-ink hover:bg-sand/30 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-maroon hover:bg-maroon-deep px-5 py-2 text-xs font-bold text-cream shadow-xs transition-colors"
              >
                Confirm Password Reset
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
