"use client";

import React, { useState, useEffect } from "react";
import { adminFetch } from "@/lib/admin-api";
import { ShieldCheck, Plus, KeyRound, UserCheck, UserX } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

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
    try {
      await adminFetch(`/admin/users/${user.id}`, {
        method: "PUT",
        body: JSON.stringify({ active: !user.active }),
      });
      toast.success(`User ${user.active ? "disabled" : "enabled"}.`);
      loadUsers();
    } catch (err: any) {
      toast.error(err.message || "Failed to toggle user status.");
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (resetPassword.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }

    setActionLoading(true);
    try {
      await adminFetch(`/admin/users/${resetUser.id}`, {
        method: "PUT",
        body: JSON.stringify({ password: resetPassword }),
      });
      toast.success("Password reset. User will be forced to change it upon login.");
      setResetUser(null);
      setResetPassword("");
      loadUsers();
    } catch (err: any) {
      toast.error(err.message || "Failed to reset password.");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-maroon flex items-center gap-2">
            <ShieldCheck className="w-7 h-7 text-maroon" />
            <span>Admin Users & Access Control</span>
          </h1>
          <p className="text-xs text-ink-muted">
            Manage admin credentials, roles (SUPER_ADMIN, ACCOUNTS, CONTENT), and force password resets.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-maroon text-cream font-serif font-bold text-xs shadow-xs"
        >
          <Plus className="w-4 h-4 text-gold" />
          <span>Add Admin User</span>
        </button>
      </div>

      <div className="rounded-3xl bg-paper border border-gold/30 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-sand/40 text-ink-muted uppercase text-[10px] tracking-wider border-b border-border">
              <tr>
                <th className="py-3 px-4">User Email</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Must Change Password</th>
                <th className="py-3 px-4">Created Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-ink-muted">
                    Loading users...
                  </td>
                </tr>
              ) : users.length > 0 ? (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-sand/10 transition-colors">
                    <td className="py-3 px-4 font-bold text-maroon font-serif text-sm">
                      {u.email}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-saffron/10 text-saffron-deep">
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          u.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                      >
                        {u.active ? "Active" : "Disabled"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-ink-muted font-mono">
                      {u.mustChangePassword ? "Yes (Forced)" : "No"}
                    </td>
                    <td className="py-3 px-4 text-ink-muted font-mono">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setResetUser(u)}
                          className="p-1.5 rounded-lg border border-gold/40 text-maroon hover:bg-sand/40"
                          title="Reset Password"
                        >
                          <KeyRound className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleActive(u)}
                          className={`p-1.5 rounded-lg border ${
                            u.active
                              ? "border-red-200 text-red-700 hover:bg-red-50"
                              : "border-green-200 text-green-700 hover:bg-green-50"
                          }`}
                          title={u.active ? "Disable Account" : "Enable Account"}
                        >
                          {u.active ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-ink-muted">
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
        <DialogContent className="max-w-md p-6 bg-paper rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-serif text-lg font-bold text-maroon">
              Create Admin Account
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleCreateUser} className="space-y-4 py-2">
            <div>
              <label className="block text-xs font-bold text-maroon mb-1">Email Address *</label>
              <input
                type="email"
                required
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-border text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-maroon mb-1">Temporary Initial Password *</label>
              <input
                type="password"
                required
                minLength={8}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-border text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-maroon mb-1">Role / Permissions *</label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-border text-xs"
              >
                <option value="ACCOUNTS">ACCOUNTS (Donations, Receipts, Reconciliation, Settings View)</option>
                <option value="CONTENT">CONTENT (Team, Certifications, Videos, Sevas, Milestones)</option>
                <option value="SUPER_ADMIN">SUPER_ADMIN (Full unrestricted system control)</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-border">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-3 py-1.5 text-xs text-ink-muted"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={actionLoading}
                className="px-4 py-1.5 rounded-xl bg-maroon text-cream font-bold text-xs"
              >
                {actionLoading ? "Creating..." : "Create User"}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Reset Password Modal */}
      <Dialog open={Boolean(resetUser)} onOpenChange={(open) => !open && setResetUser(null)}>
        <DialogContent className="max-w-md p-6 bg-paper rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-serif text-lg font-bold text-maroon">
              Reset Password for {resetUser?.email}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleResetPassword} className="space-y-4 py-2">
            <div>
              <label className="block text-xs font-bold text-maroon mb-1">New Temporary Password *</label>
              <input
                type="password"
                required
                minLength={8}
                value={resetPassword}
                onChange={(e) => setResetPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-border text-xs"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-border">
              <button
                type="button"
                onClick={() => setResetUser(null)}
                className="px-3 py-1.5 text-xs text-ink-muted"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={actionLoading}
                className="px-4 py-1.5 rounded-xl bg-maroon text-cream font-bold text-xs"
              >
                {actionLoading ? "Resetting..." : "Reset Password"}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
