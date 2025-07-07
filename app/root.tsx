import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useRouteError,
  isRouteErrorResponse,
} from "@remix-run/react"
import type { LinksFunction, LoaderFunctionArgs, MetaFunction } from "@remix-run/node"
import { json } from "@remix-run/node"
import { IntlProvider } from "react-intl"
import { HelmetProvider } from "react-helmet-async"
import { QueryClient, QueryClientProvider } from "react-query"
import { Toaster } from "~/components/ui/toaster"
import { ThemeProvider } from "~/components/theme-provider"
import { AuthProvider } from "~/components/auth-provider"
import { AnalyticsProvider } from "~/components/analytics-provider"
import { PWAProvider } from "~/components/pwa-provider"
import { getUser } from "~/lib/auth.server"
import { getLocale, getMessages } from "~/lib/i18n.server"
import stylesheet from "~/tailwind.css?url"

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
  { rel: "manifest", href: "/manifest.json" },
  { rel: "icon", href: "/favicon.ico" },
  { rel: "apple-touch-icon", href: "/icons/apple-touch-icon.png" },
]

export const meta: MetaFunction = () => [
  { title: "K-RESET - Resilience & Leadership Curriculum" },
  { name: "description", content: "Hybrid, gamified education platform for resilience, leadership, and peer learning" },
  { name: "viewport", content: "width=device-width,initial-scale=1" },
  { name: "theme-color", content: "#000000" },
]

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      cacheTime: 1000 * 60 * 30,
    },
  },
})

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await getUser(request)
  const locale = await getLocale(request)
  const messages = await getMessages(locale)

  return json({
    user,
    locale,
    messages,
    ENV: {
      NODE_ENV: process.env.NODE_ENV,
      POSTHOG_KEY: process.env.POSTHOG_KEY,
      SENTRY_DSN: process.env.SENTRY_DSN,
    },
  })
}

export default function App() {
  const { user, locale, messages, ENV } = useLoaderData<typeof loader>()

  return (
    <html lang={locale} className="h-full">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="h-full">
        <HelmetProvider>
          <IntlProvider locale={locale} messages={messages}>
            <QueryClientProvider client={queryClient}>
              <ThemeProvider>
                <AuthProvider user={user}>
                  <AnalyticsProvider config={ENV}>
                    <PWAProvider>
                      <div className="min-h-screen bg-background font-sans antialiased">
                        <Outlet />
                        <Toaster />
                      </div>
                    </PWAProvider>
                  </AnalyticsProvider>
                </AuthProvider>
              </ThemeProvider>
            </QueryClientProvider>
          </IntlProvider>
        </HelmetProvider>
        <ScrollRestoration />
        <Scripts />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(ENV)}`,
          }}
        />
      </body>
    </html>
  )
}

export function ErrorBoundary() {
  const error = useRouteError()

  if (isRouteErrorResponse(error)) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold">{error.status}</h1>
          <p className="text-xl text-muted-foreground">{error.statusText}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold">Something went wrong</h1>
        <p className="text-xl text-muted-foreground">{error instanceof Error ? error.message : "Unknown error"}</p>
      </div>
    </div>
  )
}
