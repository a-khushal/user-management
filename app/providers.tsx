"use client"
import React from "react"
import { SessionProvider } from "next-auth/react"
import { ThemeProvider } from "@/components/ui/ThemeProvider"

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return <SessionProvider>
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  </SessionProvider>
}
