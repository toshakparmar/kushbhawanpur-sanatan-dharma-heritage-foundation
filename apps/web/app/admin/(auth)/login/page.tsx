"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { adminFetch } from "@/lib/admin-api";
import { Lock, Mail, KeyRound, ShieldAlert, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Forced password change state
  const [mustChange, setMustChange] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      const res = await adminFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      if (res.user?.mustChangePassword) {
        setMustChange(true);
        setCurrentPassword(password);
        toast.info("Security requirement: Please change your initial password.");
      } else {
        toast.success("Welcome back! Logged in successfully.");
        router.push("/admin");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Invalid credentials.");
      toast.error(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      await adminFetch("/auth/change-password", {
        method: "POST",
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      toast.success("Password updated successfully! Welcome to Admin Panel.");
      router.push("/admin");
    } catch (err: any) {
      toast.error(err.message || "Failed to change password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-linear-to-b from-cream via-sand/30 to-cream">
      <div className="w-full max-w-md">
        {/* Foundation Branding */}
        <div className="text-center mb-8">
          <div className="relative w-20 h-20 mx-auto mb-3">
            <Image
              src="/brand/logo-original.png"
              alt="Foundation Emblem"
              fill
              className="object-contain"
              priority
            />
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-maroon">
            Kushbhawanpur Foundation
          </h1>
          <p className="text-xs text-ink-muted uppercase tracking-wider font-semibold font-sans mt-0.5">
            Admin CMS & Accounts Portal
          </p>
        </div>

        {/* Card */}
        <div className="rounded-3xl bg-paper p-8 border border-gold/40 shadow-xl">
          {!mustChange ? (
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="text-left mb-6">
                <h2 className="font-serif text-xl font-bold text-maroon">
                  Sign in to your account
                </h2>
                <p className="text-xs text-ink-muted">
                  Restricted to authorised foundation trustees & accounts staff.
                </p>
              </div>

              {errorMsg && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div>
                <label className="block font-serif text-xs font-bold text-maroon mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted" />
                  <input
                    type="email"
                    required
                    placeholder="admin@kushbhawanpur.org"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-cream/30 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-serif text-xs font-bold text-maroon mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-cream/30 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-maroon text-cream font-serif font-bold text-sm hover:bg-maroon-dark transition-all shadow-md disabled:opacity-50 cursor-pointer"
              >
                {loading ? "Authenticating..." : "Sign In to Admin"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="text-left mb-4">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-saffron/10 text-saffron-deep text-xs font-bold font-sans">
                  <KeyRound className="w-3.5 h-3.5" />
                  First Login Security
                </span>
                <h2 className="font-serif text-lg font-bold text-maroon mt-2">
                  Create Your Private Password
                </h2>
                <p className="text-xs text-ink-muted">
                  For account safety, default passwords must be changed before entering.
                </p>
              </div>

              <div>
                <label className="block text-xs font-serif font-bold text-maroon mb-1">
                  New Password (min 8 characters) *
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-cream/30 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                />
              </div>

              <div>
                <label className="block text-xs font-serif font-bold text-maroon mb-1">
                  Confirm New Password *
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-cream/30 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-saffron text-white font-serif font-bold text-sm hover:bg-saffron-dark transition-all shadow-md cursor-pointer disabled:opacity-50"
              >
                {loading ? "Saving..." : "Set New Password & Enter"}
              </button>
            </form>
          )}
        </div>

        {/* Footer info for Login */}
        <div className="mt-6 text-center space-y-2">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-serif font-semibold text-maroon hover:text-saffron-deep transition-colors"
          >
            <span>← Return to Public Website</span>
          </Link>
          <p className="text-[11px] text-ink-muted/80 font-sans">
            © {new Date().getFullYear()} Kushbhawanpur Sanatan Dharma & Heritage Foundation · Authorized Personnel Only
          </p>
        </div>
      </div>
    </div>
  );
}
