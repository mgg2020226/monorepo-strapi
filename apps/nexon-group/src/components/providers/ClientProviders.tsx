"use client"

import { useTranslatedZod } from "@repo/design-system/hooks/useTranslatedZod"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import type React from "react"
import { z } from "zod"

import { setupLibraries } from "@/lib/general-helpers"

// Setup libraries in client environment
setupLibraries()

const queryClient = new QueryClient()

export function ClientProviders({
  children,
}: {
  readonly children: React.ReactNode
}) {
  useTranslatedZod(z)

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
