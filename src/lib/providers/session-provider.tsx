"use client"

import { SessionProvider } from "next-auth/react"

export default function SessionProviderLayout({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>
} 