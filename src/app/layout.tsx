import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next"
import QueryProvider from "@/lib/providers/query-provider";
import { Toaster } from "react-hot-toast"
import SessionProviderLayout from "@/lib/providers/session-provider";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kitab Mantra",
  description: "Your contribution to a better future!",
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
            <Toaster />
            <Analytics />
          </SessionProviderLayout>
        </QueryProvider>
      </body>
    </html>
  );
}
