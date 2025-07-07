import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Users, TrendingUp, Zap, Globe, Smartphone } from "lucide-react"
import Link from "next/link"

/**
 * Landing Page Component
 *
 * Features:
 * - Hero section with brand introduction
 * - Key features showcase
 * - Multiple access methods (web, mobile, WhatsApp, print)
 * - Call-to-action buttons for main user flows
 * - Responsive design with mobile-first approach
 */
export default function LandingPage() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-6 py-12">
        <div className="space-y-4">
          <Badge variant="secondary" className="text-sm">
            🚀 Now Available in Multiple Formats
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">K-RESET</h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
            Hybrid, gamified education platform for resilience, leadership, and peer learning
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href="/curriculum">
              <BookOpen className="mr-2 h-5 w-5" />
              Access Curriculum
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="w-full sm:w-auto bg-transparent">
            <Link href="/progress">
              <TrendingUp className="mr-2 h-5 w-5" />
              Track Progress
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="w-full sm:w-auto bg-transparent">
            <Link href="/community">
              <Users className="mr-2 h-5 w-5" />
              Join Community
            </Link>
          </Button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Gamified Learning
            </CardTitle>
            <CardDescription>Earn XP, unlock badges, maintain streaks, and level up your skills</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Experience points and levels</li>
              <li>• Achievement badges</li>
              <li>• Learning streaks</li>
              <li>• Progress tracking</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Community Learning
            </CardTitle>
            <CardDescription>Join learning pods, complete group missions, and connect with peers</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Learning pods</li>
              <li>• Group missions</li>
              <li>• Peer chat</li>
              <li>• Leaderboards</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              Multi-Channel Access
            </CardTitle>
            <CardDescription>Learn through web, mobile app, WhatsApp, or printable materials</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Web platform</li>
              <li>• Mobile PWA</li>
              <li>• WhatsApp integration</li>
              <li>• PDF downloads</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              AI-Powered Insights
            </CardTitle>
            <CardDescription>Get personalized recommendations and learning insights</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Personalized recommendations</li>
              <li>• Learning analytics</li>
              <li>• Progress insights</li>
              <li>• Adaptive content</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-primary" />
              Mobile-First Design
            </CardTitle>
            <CardDescription>Optimized for mobile devices with offline capabilities</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Responsive design</li>
              <li>• PWA support</li>
              <li>• Offline access</li>
              <li>• Touch-friendly interface</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              Multilingual Support
            </CardTitle>
            <CardDescription>Available in English and Hindi with more languages coming</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• English interface</li>
              <li>• Hindi support</li>
              <li>• Cultural adaptation</li>
              <li>• Localized content</li>
            </ul>
          </CardContent>
        </Card>
      </section>

      {/* CTA Section */}
      <section className="text-center space-y-6 py-12 bg-muted/50 rounded-lg">
        <h2 className="text-3xl font-bold">Ready to Start Your Learning Journey?</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Join thousands of learners building resilience and leadership skills through our innovative platform
        </p>
        <Button asChild size="lg">
          <Link href="/curriculum">Get Started Now</Link>
        </Button>
      </section>
    </div>
  )
}
