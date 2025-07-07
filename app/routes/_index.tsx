import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node"
import { json } from "@remix-run/node"
import { useLoaderData, Link } from "@remix-run/react"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Badge } from "~/components/ui/badge"
import { BookOpen, Users, Target, TrendingUp, Star, ArrowRight, Play, Award } from "lucide-react"
import { getUser } from "~/lib/auth.server"
import { db } from "~/lib/db"
import { curriculumModules, users, pods, missions } from "~/lib/db/schema"
import { count, desc, eq } from "drizzle-orm"

export const meta: MetaFunction = () => {
  return [
    { title: "K-RESET - Resilience & Leadership Curriculum" },
    {
      name: "description",
      content:
        "Transform your life through gamified learning. Build resilience, develop leadership skills, and connect with a global community.",
    },
  ]
}

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await getUser(request)

  const [totalModules, totalUsers, totalPods, activeMissions, featuredModules] = await Promise.all([
    db.select({ count: count() }).from(curriculumModules).where(eq(curriculumModules.status, "published")),
    db.select({ count: count() }).from(users).where(eq(users.isActive, true)),
    db.select({ count: count() }).from(pods).where(eq(pods.isActive, true)),
    db.select({ count: count() }).from(missions).where(eq(missions.status, "active")),
    db
      .select()
      .from(curriculumModules)
      .where(eq(curriculumModules.status, "published"))
      .orderBy(desc(curriculumModules.viewCount))
      .limit(3),
  ])

  return json({
    user,
    stats: {
      totalModules: totalModules[0]?.count || 0,
      totalUsers: totalUsers[0]?.count || 0,
      totalPods: totalPods[0]?.count || 0,
      activeMissions: activeMissions[0]?.count || 0,
    },
    featuredModules,
  })
}

export default function Index() {
  const { user, stats, featuredModules } = useLoaderData<typeof loader>()

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20 sm:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <Badge variant="outline" className="mb-4">
              🚀 Global Learning Movement
            </Badge>
            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-6xl">
              Build <span className="text-primary">Resilience</span> & <span className="text-primary">Leadership</span>
            </h1>
            <p className="mb-8 text-xl text-muted-foreground">
              Transform your life through gamified learning. Connect with peers, complete missions, and unlock your
              potential in our global community.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              {user ? (
                <Button asChild size="lg" className="text-lg">
                  <Link to="/curriculum">
                    <Play className="mr-2 h-5 w-5" />
                    Continue Learning
                  </Link>
                </Button>
              ) : (
                <Button asChild size="lg" className="text-lg">
                  <Link to="/signup">
                    <ArrowRight className="mr-2 h-5 w-5" />
                    Start Your Journey
                  </Link>
                </Button>
              )}
              <Button asChild variant="outline" size="lg" className="text-lg bg-transparent">
                <Link to="/curriculum">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Explore Curriculum
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <Card className="text-center">
              <CardContent className="p-6">
                <BookOpen className="mx-auto mb-2 h-8 w-8 text-primary" />
                <div className="text-2xl font-bold">{stats.totalModules}</div>
                <div className="text-sm text-muted-foreground">Learning Modules</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <Users className="mx-auto mb-2 h-8 w-8 text-primary" />
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
                <div className="text-sm text-muted-foreground">Active Learners</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <Target className="mx-auto mb-2 h-8 w-8 text-primary" />
                <div className="text-2xl font-bold">{stats.activeMissions}</div>
                <div className="text-sm text-muted-foreground">Active Missions</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <TrendingUp className="mx-auto mb-2 h-8 w-8 text-primary" />
                <div className="text-2xl font-bold">{stats.totalPods}</div>
                <div className="text-sm text-muted-foreground">Learning Pods</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose K-RESET?</h2>
            <p className="text-lg text-muted-foreground">
              Our platform combines cutting-edge technology with proven learning methodologies
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            <Card>
              <CardHeader>
                <Award className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Gamified Learning</CardTitle>
                <CardDescription>
                  Earn XP, unlock achievements, and level up as you progress through modules
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Users className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Peer Learning</CardTitle>
                <CardDescription>
                  Join learning pods, participate in missions, and grow with a supportive community
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Star className="h-10 w-10 text-primary mb-2" />
                <CardTitle>AI-Powered Insights</CardTitle>
                <CardDescription>
                  Get personalized recommendations and insights to optimize your learning journey
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Modules */}
      {featuredModules.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-2xl text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Featured Modules</h2>
              <p className="text-lg text-muted-foreground">Start with these popular modules chosen by our community</p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {featuredModules.map((module) => (
                <Card key={module.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">{module.difficulty}</Badge>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Star className="h-4 w-4" />
                        {module.xpReward} XP
                      </div>
                    </div>
                    <CardTitle className="line-clamp-2">{module.title}</CardTitle>
                    <CardDescription className="line-clamp-3">{module.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">{module.estimatedTime} minutes</div>
                      <Button asChild size="sm">
                        <Link to={`/curriculum/${module.id}`}>Start Module</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="text-center mt-8">
              <Button asChild variant="outline" size="lg">
                <Link to="/curriculum">
                  View All Modules
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Life?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of learners building resilience and leadership skills
          </p>
          {user ? (
            <Button asChild size="lg" variant="secondary">
              <Link to="/progress">
                View Your Progress
                <TrendingUp className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          ) : (
            <Button asChild size="lg" variant="secondary">
              <Link to="/signup">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          )}
        </div>
      </section>
    </div>
  )
}
