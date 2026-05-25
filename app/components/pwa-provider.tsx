"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useToast } from "~/hooks/use-toast"

interface PWAContextType {
  isInstallable: boolean
  isInstalled: boolean
  isOffline: boolean
  install: () => Promise<void>
  updateAvailable: boolean
  update: () => void
}

const PWAContext = createContext<PWAContextType | undefined>(undefined)

interface PWAProviderProps {
  children: ReactNode
}

export function PWAProvider({ children }: PWAProviderProps) {
  const [isInstallable, setIsInstallable] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const [isOffline, setIsOffline] = useState(false)
  const [updateAvailable, setUpdateAvailable] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const { toast } = useToast()

  useEffect(() => {
    // Check if app is installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true)
    }

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setIsInstallable(true)
    }

    // Listen for app installed
    const handleAppInstalled = () => {
      setIsInstalled(true)
      setIsInstallable(false)
      setDeferredPrompt(null)
      toast({
        title: "App Installed",
        description: "K-RESET has been installed successfully!",
      })
    }

    // Listen for online/offline status
    const handleOnline = () => setIsOffline(false)
    const handleOffline = () => {
      setIsOffline(true)
      toast({
        title: "You're offline",
        description: "Some features may be limited while offline.",
        variant: "destructive",
      })
    }

    // Service Worker update detection
    const handleSWUpdate = () => {
      setUpdateAvailable(true)
      toast({
        title: "Update Available",
        description: "A new version of the app is available.",
        action: (
          <button
            onClick={() => update()}
            className="inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium"
          >
            Update
          </button>
        ),
      })
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    window.addEventListener("appinstalled", handleAppInstalled)
    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    // Check initial online status
    setIsOffline(!navigator.onLine)

    // Register service worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          registration.addEventListener("updatefound", handleSWUpdate)
        })
        .catch((error) => {
          console.error("Service Worker registration failed:", error)
        })
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
      window.removeEventListener("appinstalled", handleAppInstalled)
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [toast])

  const install = async () => {
    if (!deferredPrompt) return

    try {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice

      if (outcome === "accepted") {
        setIsInstallable(false)
        setDeferredPrompt(null)
      }
    } catch (error) {
      console.error("Installation failed:", error)
    }
  }

  const update = () => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.getRegistration().then((registration) => {
        if (registration?.waiting) {
          registration.waiting.postMessage({ type: "SKIP_WAITING" })
          window.location.reload()
        }
      })
    }
  }

  const value: PWAContextType = {
    isInstallable,
    isInstalled,
    isOffline,
    install,
    updateAvailable,
    update,
  }

  return <PWAContext.Provider value={value}>{children}</PWAContext.Provider>
}

export function usePWA() {
  const context = useContext(PWAContext)
  if (context === undefined) {
    throw new Error("usePWA must be used within a PWAProvider")
  }
  return context
}
