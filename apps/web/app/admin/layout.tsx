import type { Metadata } from "next";
import React from "react";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Admin Panel | Kushbhawanpur Foundation",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-cream/70 text-ink font-sans antialiased selection:bg-gold/20 selection:text-maroon">
      {children}
      <Toaster position="top-right" richColors />
    </div>
  );
}
