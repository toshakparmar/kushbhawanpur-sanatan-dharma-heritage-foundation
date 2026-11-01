import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope, Noto_Serif_Devanagari } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/content/site.config";
import { Toaster } from "@/components/ui/sonner";
import { PublicLayout } from "@/components/layout/PublicLayout";

const cormorant = Cormorant_Garamond({
  weight: ["600", "700"],
  subsets: ["latin"],
  variable: "--font-cormorant",
  display: "swap",
});

const manrope = Manrope({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const notoDevanagari = Noto_Serif_Devanagari({
  weight: ["400", "600", "700"],
  subsets: ["devanagari", "latin"],
  variable: "--font-devanagari",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#FFF9EF",
  width: "device-width",
  initialScale: 1,
  colorScheme: "light",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.meta.siteUrl),
  title: {
    default: "Kushbhawanpur Sanatan Dharma & Heritage Foundation · Official Donation Portal",
    template: "%s | Kushbhawanpur Foundation",
  },
  description:
    "Official donation and seva portal for Kushbhawanpur Sanatan Dharma & Heritage Foundation. Support ancient temple restoration, gau seva, Vedic education, and community annadanam.",
  keywords: [
    "Kushbhawanpur Foundation",
    "Sanatan Dharma",
    "Temple Restoration",
    "Gau Seva",
    "Heritage Preservation",
    "Vedic Education",
    "Annadanam",
    "Sultanpur",
    "Uttar Pradesh",
    "Charitable Trust",
  ],
  authors: [{ name: "Kushbhawanpur Sanatan Dharma & Heritage Foundation" }],
  creator: "Kushbhawanpur Sanatan Dharma & Heritage Foundation",
  publisher: "Kushbhawanpur Sanatan Dharma & Heritage Foundation",
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: "/brand/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/brand/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/brand/apple-touch-icon.png",
  },
  manifest: "/manifest.webmanifest",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteConfig.meta.siteUrl,
    siteName: siteConfig.meta.name,
    title: "Kushbhawanpur Sanatan Dharma & Heritage Foundation · Official Donation Portal",
    description:
      "Preserving Sacred Heritage · Serving Dharma · Empowering Seva. Official direct donation portal for temple conservation, gau seva, and Vedic archives.",
    images: [
      {
        url: "/og/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Kushbhawanpur Sanatan Dharma & Heritage Foundation Seal and Motto",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kushbhawanpur Sanatan Dharma & Heritage Foundation",
    description: "Preserving Sacred Heritage · Serving Dharma · Empowering Seva",
    images: ["/og/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Structured JSON-LD Schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NGO",
    name: siteConfig.meta.name,
    legalName: siteConfig.meta.legalName,
    alternateName: siteConfig.meta.devanagariName,
    url: siteConfig.meta.siteUrl,
    logo: `${siteConfig.meta.siteUrl}/brand/logo-original.png`,
    description: siteConfig.meta.tagline,
    address: {
      "@type": "PostalAddress",
      streetAddress: `${siteConfig.contact.registeredAddress.line1}${siteConfig.contact.registeredAddress.line2 ? `, ${siteConfig.contact.registeredAddress.line2}` : ""
        }`,
      addressLocality: siteConfig.contact.registeredAddress.city,
      addressRegion: siteConfig.contact.registeredAddress.state,
      postalCode: siteConfig.contact.registeredAddress.pincode,
      addressCountry: "IN",
    },
    potentialAction: {
      "@type": "DonateAction",
      target: `${siteConfig.meta.siteUrl}/#donate`,
      recipient: {
        "@type": "Organization",
        name: siteConfig.meta.legalName,
      },
    },
  };

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${cormorant.variable} ${manrope.variable} ${notoDevanagari.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        suppressHydrationWarning
        className="antialiased min-h-screen flex flex-col bg-cream text-ink paper-texture selection:bg-gold-light selection:text-maroon-deep"
      >
        {/* Skip to Content for Keyboard Accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-maroon focus:text-cream focus:rounded-md focus:shadow-lg focus:outline-none"
        >
          Skip to main content
        </a>

        <PublicLayout>
          {children}
        </PublicLayout>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
