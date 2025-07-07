import { pgTable, text, integer, boolean, timestamp, uuid, varchar, jsonb, index } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"

/**
 * Database Schema for K-RESET Platform
 *
 * This file defines all database tables using Drizzle ORM
 * Includes proper relationships, constraints, and indexes
 * All tables include audit columns for tracking changes
 */

// Users table - Core user information and gamification data
export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    name: varchar("name", { length: 255 }).notNull(),
    avatar: text("avatar"),
    role: varchar("role", { length: 50 }).notNull().default("student"), // admin, mentor, student
    level: integer("level").notNull().default(1),
    currentXP: integer("current_xp").notNull().default(0),
    totalXP: integer("total_xp").notNull().default(0),
    currentStreak: integer("current_streak").notNull().default(0),
    longestStreak: integer("longest_streak").notNull().default(0),
    lastActiveAt: timestamp("last_active_at").defaultNow(),
    isActive: boolean("is_active").notNull().default(true),
    preferences: jsonb("preferences").default({}),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    emailIdx: index("users_email_idx").on(table.email),
    roleIdx: index("users_role_idx").on(table.role),
    levelIdx: index("users_level_idx").on(table.level),
  }),
)

// Curriculum categories for organizing modules
export const curriculumCategories = pgTable(
  "curriculum_categories",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    color: varchar("color", { length: 7 }).default("#3B82F6"), // Hex color
    iconUrl: text("icon_url"),
    sortOrder: integer("sort_order").notNull().default(0),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
    createdBy: uuid("created_by").references(() => users.id),
  },
  (table) => ({
    slugIdx: index("categories_slug_idx").on(table.slug),
    activeIdx: index("categories_active_idx").on(table.isActive),
  }),
)

// Curriculum modules - Core learning content
export const curriculumModules = pgTable(
  "curriculum_modules",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description").notNull(),
    content: text("content").notNull(),
    categoryId: uuid("category_id")
      .references(() => curriculumCategories.id)
      .notNull(),
    difficulty: varchar("difficulty", { length: 50 }).notNull(), // Beginner, Intermediate, Advanced
    estimatedTime: varchar("estimated_time", { length: 50 }).notNull(), // e.g., "30 minutes"
    xpReward: integer("xp_reward").notNull().default(100),
    status: varchar("status", { length: 50 }).notNull().default("draft"), // draft, published, archived
    tags: jsonb("tags").default([]),
    prerequisites: jsonb("prerequisites").default([]), // Array of module IDs
    resources: jsonb("resources").default([]), // Additional resources
    sortOrder: integer("sort_order").notNull().default(0),
    viewCount: integer("view_count").notNull().default(0),
    completionCount: integer("completion_count").notNull().default(0),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
    createdBy: uuid("created_by")
      .references(() => users.id)
      .notNull(),
  },
  (table) => ({
    categoryIdx: index("modules_category_idx").on(table.categoryId),
    statusIdx: index("modules_status_idx").on(table.status),
    difficultyIdx: index("modules_difficulty_idx").on(table.difficulty),
    createdByIdx: index("modules_created_by_idx").on(table.createdBy),
  }),
)

// User progress tracking for modules
export const userProgress = pgTable(
  "user_progress",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .references(() => users.id)
      .notNull(),
    moduleId: uuid("module_id")
      .references(() => curriculumModules.id)
      .notNull(),
    progress: integer("progress").notNull().default(0), // 0-100 percentage
    completedAt: timestamp("completed_at"),
    xpEarned: integer("xp_earned").notNull().default(0),
    timeSpent: integer("time_spent").notNull().default(0), // in minutes
    journalEntry: text("journal_entry"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    userModuleIdx: index("progress_user_module_idx").on(table.userId, table.moduleId),
    userIdx: index("progress_user_idx").on(table.userId),
    moduleIdx: index("progress_module_idx").on(table.moduleId),
    completedIdx: index("progress_completed_idx").on(table.completedAt),
  }),
)

// Achievement definitions
export const achievements = pgTable(
  "achievements",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description").notNull(),
    category: varchar("category", { length: 50 }).notNull(), // learning, streak, community, milestone
    xpReward: integer("xp_reward").notNull().default(0),
    iconUrl: text("icon_url"),
    criteria: jsonb("criteria").notNull(), // Conditions for earning
    isActive: boolean("is_active").notNull().default(true),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    categoryIdx: index("achievements_category_idx").on(table.category),
    activeIdx: index("achievements_active_idx").on(table.isActive),
  }),
)

// User achievements - tracking what users have earned
export const userAchievements = pgTable(
  "user_achievements",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .references(() => users.id)
      .notNull(),
    achievementId: uuid("achievement_id")
      .references(() => achievements.id)
      .notNull(),
    progress: integer("progress").notNull().default(0), // 0-100 percentage
    unlockedAt: timestamp("unlocked_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => ({
    userAchievementIdx: index("user_achievements_user_achievement_idx").on(table.userId, table.achievementId),
    userIdx: index("user_achievements_user_idx").on(table.userId),
    unlockedIdx: index("user_achievements_unlocked_idx").on(table.unlockedAt),
  }),
)

// Learning pods for community collaboration
export const pods = pgTable(
  "pods",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    inviteCode: varchar("invite_code", { length: 50 }).notNull().unique(),
    maxMembers: integer("max_members").notNull().default(10),
    isActive: boolean("is_active").notNull().default(true),
    settings: jsonb("settings").default({}),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
    createdBy: uuid("created_by")
      .references(() => users.id)
      .notNull(),
  },
  (table) => ({
    inviteCodeIdx: index("pods_invite_code_idx").on(table.inviteCode),
    activeIdx: index("pods_active_idx").on(table.isActive),
    createdByIdx: index("pods_created_by_idx").on(table.createdBy),
  }),
)

// Pod membership tracking
export const podMembers = pgTable(
  "pod_members",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    podId: uuid("pod_id")
      .references(() => pods.id)
      .notNull(),
    userId: uuid("user_id")
      .references(() => users.id)
      .notNull(),
    role: varchar("role", { length: 50 }).notNull().default("member"), // leader, member
    joinedAt: timestamp("joined_at").notNull().defaultNow(),
    leftAt: timestamp("left_at"),
    isActive: boolean("is_active").notNull().default(true),
  },
  (table) => ({
    podUserIdx: index("pod_members_pod_user_idx").on(table.podId, table.userId),
    podIdx: index("pod_members_pod_idx").on(table.podId),
    userIdx: index("pod_members_user_idx").on(table.userId),
    activeIdx: index("pod_members_active_idx").on(table.isActive),
  }),
)

// Group missions and challenges
export const missions = pgTable(
  "missions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description").notNull(),
    difficulty: varchar("difficulty", { length: 50 }).notNull(), // Easy, Medium, Hard
    xpReward: integer("xp_reward").notNull().default(200),
    maxParticipants: integer("max_participants").notNull().default(50),
    status: varchar("status", { length: 50 }).notNull().default("upcoming"), // upcoming, active, completed, expired
    startDate: timestamp("start_date").notNull(),
    endDate: timestamp("end_date").notNull(),
    requirements: jsonb("requirements").default({}),
    podId: uuid("pod_id").references(() => pods.id), // Optional: pod-specific missions
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
    createdBy: uuid("created_by")
      .references(() => users.id)
      .notNull(),
  },
  (table) => ({
    statusIdx: index("missions_status_idx").on(table.status),
    startDateIdx: index("missions_start_date_idx").on(table.startDate),
    podIdx: index("missions_pod_idx").on(table.podId),
    createdByIdx: index("missions_created_by_idx").on(table.createdBy),
  }),
)

// Mission participation tracking
export const missionParticipation = pgTable(
  "mission_participation",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    missionId: uuid("mission_id")
      .references(() => missions.id)
      .notNull(),
    userId: uuid("user_id")
      .references(() => users.id)
      .notNull(),
    progress: integer("progress").notNull().default(0), // 0-100 percentage
    completedAt: timestamp("completed_at"),
    xpEarned: integer("xp_earned").notNull().default(0),
    joinedAt: timestamp("joined_at").notNull().defaultNow(),
  },
  (table) => ({
    missionUserIdx: index("mission_participation_mission_user_idx").on(table.missionId, table.userId),
    missionIdx: index("mission_participation_mission_idx").on(table.missionId),
    userIdx: index("mission_participation_user_idx").on(table.userId),
    completedIdx: index("mission_participation_completed_idx").on(table.completedAt),
  }),
)

// Chat messages for pod communication
export const chatMessages = pgTable(
  "chat_messages",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    podId: uuid("pod_id")
      .references(() => pods.id)
      .notNull(),
    userId: uuid("user_id")
      .references(() => users.id)
      .notNull(),
    content: text("content").notNull(),
    messageType: varchar("message_type", { length: 50 }).notNull().default("text"), // text, image, file
    metadata: jsonb("metadata").default({}),
    isEdited: boolean("is_edited").notNull().default(false),
    editedAt: timestamp("edited_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => ({
    podIdx: index("chat_messages_pod_idx").on(table.podId),
    userIdx: index("chat_messages_user_idx").on(table.userId),
    createdAtIdx: index("chat_messages_created_at_idx").on(table.createdAt),
  }),
)

// Referral system for user growth
export const referrals = pgTable(
  "referrals",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    referrerId: uuid("referrer_id")
      .references(() => users.id)
      .notNull(),
    referredId: uuid("referred_id")
      .references(() => users.id)
      .notNull(),
    referralCode: varchar("referral_code", { length: 50 }).notNull(),
    status: varchar("status", { length: 50 }).notNull().default("pending"), // pending, completed, expired
    rewardXP: integer("reward_xp").notNull().default(500),
    completedAt: timestamp("completed_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => ({
    referrerIdx: index("referrals_referrer_idx").on(table.referrerId),
    referredIdx: index("referrals_referred_idx").on(table.referredId),
    codeIdx: index("referrals_code_idx").on(table.referralCode),
    statusIdx: index("referrals_status_idx").on(table.status),
  }),
)

// User activity heartbeat for engagement tracking
export const userHeartbeat = pgTable(
  "user_heartbeat",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .references(() => users.id)
      .notNull(),
    activityType: varchar("activity_type", { length: 50 }).notNull(), // login, module_view, pod_chat, etc.
    metadata: jsonb("metadata").default({}),
    timestamp: timestamp("timestamp").notNull().defaultNow(),
  },
  (table) => ({
    userIdx: index("user_heartbeat_user_idx").on(table.userId),
    activityIdx: index("user_heartbeat_activity_idx").on(table.activityType),
    timestampIdx: index("user_heartbeat_timestamp_idx").on(table.timestamp),
  }),
)

// Define relationships
export const usersRelations = relations(users, ({ many }) => ({
  progress: many(userProgress),
  achievements: many(userAchievements),
  podMemberships: many(podMembers),
  missionParticipations: many(missionParticipation),
  chatMessages: many(chatMessages),
  referralsMade: many(referrals, { relationName: "referrer" }),
  referralsReceived: many(referrals, { relationName: "referred" }),
  heartbeats: many(userHeartbeat),
}))

export const curriculumModulesRelations = relations(curriculumModules, ({ one, many }) => ({
  category: one(curriculumCategories, {
    fields: [curriculumModules.categoryId],
    references: [curriculumCategories.id],
  }),
  progress: many(userProgress),
  creator: one(users, {
    fields: [curriculumModules.createdBy],
    references: [users.id],
  }),
}))

export const podsRelations = relations(pods, ({ one, many }) => ({
  members: many(podMembers),
  messages: many(chatMessages),
  missions: many(missions),
  creator: one(users, {
    fields: [pods.createdBy],
    references: [users.id],
  }),
}))
