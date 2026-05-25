"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Globe } from "lucide-react"

/**
 * Language Toggle Component
 *
 * Features:
 * - Language selection dropdown
 * - Support for English and Hindi
 * - Extensible for additional languages
 * - Persistent language preference
 */
export function LanguageToggle() {
  const [currentLanguage, setCurrentLanguage] = useState("en")

  const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "hi", name: "हिंदी", flag: "🇮🇳" },
  ]

  const handleLanguageChange = (languageCode: string) => {
    setCurrentLanguage(languageCode)
    // TODO: Implement actual language switching logic
    localStorage.setItem("preferred-language", languageCode)
  }

  const currentLang = languages.find((lang) => lang.code === currentLanguage)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Select language">
          <Globe className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className="flex items-center gap-2"
          >
            <span>{language.flag}</span>
            <span>{language.name}</span>
            {currentLanguage === language.code && <span className="ml-auto">✓</span>}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
