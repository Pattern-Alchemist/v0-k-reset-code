import { readFile } from "fs/promises"
import { join } from "path"

const SUPPORTED_LOCALES = ["en", "hi"] as const
type SupportedLocale = (typeof SUPPORTED_LOCALES)[number]

const DEFAULT_LOCALE: SupportedLocale = "en"

export async function getLocale(request: Request): Promise<SupportedLocale> {
  const url = new URL(request.url)
  const localeParam = url.searchParams.get("locale")

  if (localeParam && SUPPORTED_LOCALES.includes(localeParam as SupportedLocale)) {
    return localeParam as SupportedLocale
  }

  const acceptLanguage = request.headers.get("Accept-Language")
  if (acceptLanguage) {
    const preferredLocales = acceptLanguage.split(",").map((lang) => lang.split(";")[0].trim().toLowerCase())

    for (const locale of preferredLocales) {
      if (SUPPORTED_LOCALES.includes(locale as SupportedLocale)) {
        return locale as SupportedLocale
      }

      const shortLocale = locale.split("-")[0]
      if (SUPPORTED_LOCALES.includes(shortLocale as SupportedLocale)) {
        return shortLocale as SupportedLocale
      }
    }
  }

  return DEFAULT_LOCALE
}

export async function getMessages(locale: SupportedLocale): Promise<Record<string, string>> {
  try {
    const messagesPath = join(process.cwd(), "app", "locales", `${locale}.json`)
    const messagesFile = await readFile(messagesPath, "utf-8")
    return JSON.parse(messagesFile)
  } catch (error) {
    console.warn(`Failed to load messages for locale ${locale}, falling back to ${DEFAULT_LOCALE}`)

    if (locale !== DEFAULT_LOCALE) {
      return getMessages(DEFAULT_LOCALE)
    }

    return {}
  }
}

export function getSupportedLocales() {
  return SUPPORTED_LOCALES
}

export function getDefaultLocale() {
  return DEFAULT_LOCALE
}

export function isValidLocale(locale: string): locale is SupportedLocale {
  return SUPPORTED_LOCALES.includes(locale as SupportedLocale)
}
