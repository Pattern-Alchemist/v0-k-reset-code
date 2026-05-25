"use client"

import { createContext, useContext, useEffect, type ReactNode } from "react"
import posthog from "posthog-js"

interface AnalyticsContextType {
  track: (event: string, properties?: Record<string, any>) => void
  identify: (userId: string, properties?: Record<string, any>) => void
  reset: () => void
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined)

interface AnalyticsProviderProps {
  children: ReactNode
  config: {
    POSTHOG_KEY?: string
    NODE_ENV?: string
  }
}

export function AnalyticsProvider({ children, config }: AnalyticsProviderProps) {
  useEffect(() => {
    if (config.POSTHOG_KEY && typeof window !== "undefined") {
      posthog.init(config.POSTHOG_KEY, {
        api_host: "https://app.posthog.com",
        disable_session_recording: config.NODE_ENV !== "production",
        capture_pageview: true,
        capture_pageleave: true,
      })
    }
  }, [config])

  const track = (event: string, properties?: Record<string, any>) => {
    if (typeof window !== "undefined" && posthog) {
      posthog.capture(event, properties)
    }
  }

  const identify = (userId: string, properties?: Record<string, any>) => {
    if (typeof window !== "undefined" && posthog) {
      posthog.identify(userId, properties)
    }
  }

  const reset = () => {
    if (typeof window !== "undefined" && posthog) {
      posthog.reset()
    }
  }

  const value: AnalyticsContextType = {
    track,
    identify,
    reset,
  }

  return <AnalyticsContext.Provider value={value}>{children}</AnalyticsContext.Provider>
}

export function useAnalytics() {
  const context = useContext(AnalyticsContext)
  if (context === undefined) {
    throw new Error("useAnalytics must be used within an AnalyticsProvider")
  }
  return context
}
