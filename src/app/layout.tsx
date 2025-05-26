import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/lib/providers/query-provider";
import { Toaster } from "react-hot-toast"
import SessionProviderLayout from "@/lib/providers/session-provider";
import { Analytics } from '@vercel/analytics/next';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Kitab Mantra",
    template: "%s - Kitab Mantra"
  },
  description: "Your contribution to a better future!",
  keywords: [
    "Kitab Mantra",
    "Book Exchange platform nepal.",
    "Book buying in nepal.",
  ],
  authors: [{ name: "Kitab Mantra" }],
  openGraph: {
    title: "Kitab Mantra",
    description: "Your contribution to a better future!",
    url: "https://kitabmantra.vercel.app/",
    siteName: "Kitab Mantra",
    images: [
      {
        url: "./opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Kitab Mantra",
      },
    ],
    type: "website",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryProvider>
          <SessionProviderLayout>
            {children}
          </SessionProviderLayout>
        </QueryProvider>
        <Analytics />
        <Toaster />
      </body>
    </html>
  );
}
