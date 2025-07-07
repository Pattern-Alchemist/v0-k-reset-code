"use client"

import { createContext, useContext, type ReactNode } from "react"
import type { User } from "~/lib/db/schema"

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isAdmin: boolean
  isMentor: boolean
  hasPermission: (permission: string) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
  user: User | null
}

export function AuthProvider({ children, user }: AuthProviderProps) {
  const isAuthenticated = !!user
  const isAdmin = user?.role === "admin"
  const isMentor = user?.role === "mentor" || isAdmin

  const hasPermission = (permission: string): boolean => {
    if (!user) return false
    if (isAdmin) return true
    return user.permissions?.includes(permission) || false
  }

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isAdmin,
    isMentor,
    hasPermission,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
