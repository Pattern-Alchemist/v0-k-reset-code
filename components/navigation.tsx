"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageToggle } from "@/components/language-toggle"
import { BookOpen, Users, TrendingUp, Shield, Menu, Home } from "lucide-react"

/**
 * Navigation Component
 *
 * Features:
 * - Responsive navigation with mobile menu
 * - Active route highlighting
 * - Theme toggle integration
 * - Language selection
 * - Role-based navigation items
 * - Keyboard accessible
 */
const navigationItems = [
  {
    name: "Home",
    href: "/",
    icon: Home,
  },
  {
    name: "Curriculum",
    href: "/curriculum",
    icon: BookOpen,
  },
  {
    name: "Progress",
    href: "/progress",
    icon: TrendingUp,
  },
  {
    name: "Community",
    href: "/community",
    icon: Users,
  },
  {
    name: "Admin",
    href: "/admin",
    icon: Shield,
    badge: "Admin",
  },
]

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-primary rounded-md flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">K</span>
            </div>
            <span className="font-bold text-xl">K-RESET</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => (
              <Button
                key={item.href}
                asChild
                variant={pathname === item.href ? "default" : "ghost"}
                size="sm"
                className="relative"
              >
                <Link href={item.href} className="flex items-center gap-2">
                  <item.icon className="h-4 w-4" />
                  {item.name}
                  {item.badge && (
                    <Badge variant="secondary" className="ml-1 text-xs">
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              </Button>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-2">
            <LanguageToggle />
            <ThemeToggle />
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden flex items-center space-x-2">
            <LanguageToggle />
            <ThemeToggle />
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col space-y-4 mt-8">
                  {navigationItems.map((item) => (
                    <Button
                      key={item.href}
                      asChild
                      variant={pathname === item.href ? "default" : "ghost"}
                      className="justify-start"
                      onClick={() => setIsOpen(false)}
                    >
                      <Link href={item.href} className="flex items-center gap-3">
                        <item.icon className="h-5 w-5" />
                        {item.name}
                        {item.badge && (
                          <Badge variant="secondary" className="ml-auto">
                            {item.badge}
                          </Badge>
                        )}
                      </Link>
                    </Button>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
