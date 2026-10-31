"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { adminFetch } from "@/lib/admin-api";
import {
  LayoutDashboard,
  Clock,
  HeartHandshake,
  FileCheck2,
  Users2,
  Building,
  CreditCard,
  Layers,
  Award,
  Video,
  Calendar,
  ShieldCheck,
  History,
  LogOut,
  ExternalLink,
  Menu,
  X,
  FileSpreadsheet,
} from "lucide-react";
import { toast } from "sonner";

interface AdminUser {
  id: string;
  email: string;
  role: "SUPER_ADMIN" | "ACCOUNTS" | "CONTENT";
}

export default function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState<number>(0);

  useEffect(() => {
    adminFetch("/auth/me")
      .then((user) => setCurrentUser(user))
      .catch(() => {
        router.push("/admin/login");
      });

    // Fetch dashboard stats to get pending count
    adminFetch("/admin/dashboard")
      .then((data) => {
        if (data?.pendingCount !== undefined) {
          setPendingCount(data.pendingCount);
        }
      })
      .catch(() => {});
  }, [router]);

  const handleLogout = async () => {
    try {
      await adminFetch("/auth/logout", { method: "POST" });
      toast.success("Logged out successfully.");
      router.push("/admin/login");
    } catch {
      router.push("/admin/login");
    }
  };

  const navGroups = [
    {
      title: "Core Operations",
      items: [
        { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
        {
          label: "Pending Verification",
          href: "/admin/donations/pending",
          icon: Clock,
          badge: pendingCount > 0 ? pendingCount : undefined,
          badgeColor: "bg-amber-600 text-white",
        },
        { label: "All Donations", href: "/admin/donations", icon: HeartHandshake },
        { label: "Bank Reconciliation", href: "/admin/reconciliation", icon: FileSpreadsheet },
        { label: "Donors Registry", href: "/admin/donors", icon: Users2 },
        { label: "Receipts Issued", href: "/admin/receipts", icon: FileCheck2 },
      ],
    },
    {
      title: "Content & CMS",
      items: [
        { label: "Sevas & Causes", href: "/admin/sevas", icon: Layers },
        { label: "Leadership & Team", href: "/admin/team", icon: Users2 },
        { label: "Certifications", href: "/admin/certifications", icon: Award },
        { label: "Videos CMS", href: "/admin/videos", icon: Video },
        { label: "Journey Milestones", href: "/admin/milestones", icon: Calendar },
      ],
    },
    {
      title: "Settings & System",
      items: [
        { label: "Foundation Profile", href: "/admin/organization", icon: Building },
        { label: "Payment & UPI Config", href: "/admin/payment-settings", icon: CreditCard },
        { label: "Admin Users", href: "/admin/users", icon: ShieldCheck },
        { label: "Audit Trail", href: "/admin/audit-log", icon: History },
      ],
    },
  ];

  return (
    <div className="min-h-screen flex bg-cream/50">
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-charcoal/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-paper border-r border-gold/30 flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          {/* Logo / Brand Header */}
          <div className="h-16 px-5 border-b border-border flex items-center justify-between">
            <Link href="/admin" className="flex items-center gap-3">
              <div className="relative w-8 h-8 shrink-0">
                <Image
                  src="/brand/logo-original.png"
                  alt="Emblem"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="min-w-0">
                <span className="font-serif font-bold text-sm text-maroon block truncate">
                  Kushbhawanpur
                </span>
                <span className="text-[10px] text-ink-muted uppercase font-sans tracking-wider block">
                  Admin Panel
                </span>
              </div>
            </Link>
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 text-ink-muted hover:text-maroon"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav links */}
          <div className="p-3 space-y-6 overflow-y-auto max-h-[calc(100vh-130px)]">
            {navGroups.map((group, idx) => (
              <div key={idx}>
                <span className="px-3 text-[10px] font-sans font-bold uppercase tracking-wider text-ink-muted/80 block mb-1.5">
                  {group.title}
                </span>
                <nav className="space-y-0.5">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-serif font-semibold transition-all ${
                          isActive
                            ? "bg-maroon text-cream shadow-xs"
                            : "text-ink-muted hover:text-maroon hover:bg-sand/40"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-gold" : "text-ink-muted"}`} />
                          <span className="truncate">{item.label}</span>
                        </div>
                        {item.badge !== undefined && (
                          <span
                            className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${item.badgeColor || "bg-saffron text-white"}`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </nav>
              </div>
            ))}
          </div>
        </div>

        {/* User bar at bottom */}
        <div className="p-3 border-t border-border bg-sand/20 flex items-center justify-between">
          <div className="min-w-0 pr-2">
            <span className="text-xs font-serif font-bold text-maroon block truncate">
              {currentUser?.email || "Admin"}
            </span>
            <span className="text-[10px] text-saffron-deep font-sans uppercase tracking-wider font-semibold">
              {currentUser?.role || "ACCOUNTS"}
            </span>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            title="Log Out"
            className="p-1.5 rounded-lg text-ink-muted hover:text-red-700 hover:bg-red-50 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Top bar */}
        <header className="h-16 bg-paper/90 border-b border-gold/30 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 backdrop-blur-xs">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-ink-muted hover:text-maroon hover:bg-sand/40"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="font-serif font-bold text-maroon text-base sm:text-lg hidden sm:inline">
              Kushbhawanpur Sanatan Dharma & Heritage Foundation
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gold/50 bg-paper hover:bg-sand/30 text-xs font-serif font-semibold text-maroon transition-all shadow-xs"
            >
              <span>View Public Site</span>
              <ExternalLink className="w-3.5 h-3.5 text-saffron" />
            </Link>
          </div>
        </header>

        {/* Main Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>

        {/* Admin Panel Footer */}
        <footer className="mt-auto border-t border-gold/30 bg-paper/60 px-6 py-4 flex flex-col sm:flex-row items-center justify-between text-xs text-ink-muted/80 gap-2">
          <span>
            © {new Date().getFullYear()} Kushbhawanpur Sanatan Dharma & Heritage Foundation · Secure Admin Management Portal
          </span>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              target="_blank"
              className="hover:text-maroon transition-colors"
            >
              Public Website
            </Link>
            <span>·</span>
            <Link
              href="/admin/audit-log"
              className="hover:text-maroon transition-colors"
            >
              Audit Trail
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
