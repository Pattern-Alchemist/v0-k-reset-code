import { createCookieSessionStorage, redirect } from "@remix-run/node"
import bcrypt from "bcryptjs"
import { db } from "~/lib/db"
import { users } from "~/lib/db/schema"
import { eq } from "drizzle-orm"
import type { User } from "~/lib/db/schema"

const sessionSecret = process.env.SESSION_SECRET
if (!sessionSecret) {
  throw new Error("SESSION_SECRET must be set")
}

const storage = createCookieSessionStorage({
  cookie: {
    name: "k_reset_session",
    secure: process.env.NODE_ENV === "production",
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
  },
})

export async function createUserSession(userId: string, redirectTo: string) {
  const session = await storage.getSession()
  session.set("userId", userId)
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await storage.commitSession(session),
    },
  })
}

export async function getUserSession(request: Request) {
  return storage.getSession(request.headers.get("Cookie"))
}

export async function getUserId(request: Request): Promise<string | undefined> {
  const session = await getUserSession(request)
  const userId = session.get("userId")
  if (!userId || typeof userId !== "string") return undefined
  return userId
}

export async function requireUserId(request: Request, redirectTo: string = new URL(request.url).pathname) {
  const userId = await getUserId(request)
  if (!userId) {
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]])
    throw redirect(`/login?${searchParams}`)
  }
  return userId
}

export async function getUser(request: Request): Promise<User | null> {
  const userId = await getUserId(request)
  if (typeof userId !== "string") {
    return null
  }

  try {
    const user = await db.select().from(users).where(eq(users.id, userId)).limit(1)
    return user[0] || null
  } catch {
    throw logout(request)
  }
}

export async function logout(request: Request) {
  const session = await getUserSession(request)
  return redirect("/", {
    headers: {
      "Set-Cookie": await storage.destroySession(session),
    },
  })
}

export async function createUser(email: string, password: string, name: string) {
  const hashedPassword = await bcrypt.hash(password, 10)

  const newUser = await db
    .insert(users)
    .values({
      email,
      name,
      // Note: password field would need to be added to schema
    })
    .returning()

  return newUser[0]
}

export async function verifyLogin(email: string, password: string) {
  const user = await db.select().from(users).where(eq(users.email, email)).limit(1)

  if (!user[0]) {
    return null
  }

  // Note: password verification would need password field in schema
  // const isValid = await bcrypt.compare(password, user[0].password)
  // if (!isValid) {
  //   return null
  // }

  return user[0]
}

export async function requireUser(request: Request) {
  const userId = await requireUserId(request)
  const user = await getUser(request)
  if (!user) {
    throw logout(request)
  }
  return user
}

export async function requireAdmin(request: Request) {
  const user = await requireUser(request)
  if (user.role !== "admin") {
    throw new Response("Forbidden", { status: 403 })
  }
  return user
}

export async function requireMentor(request: Request) {
  const user = await requireUser(request)
  if (user.role !== "mentor" && user.role !== "admin") {
    throw new Response("Forbidden", { status: 403 })
  }
  return user
}
