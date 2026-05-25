import { pgTable, text, integer, boolean, timestamp, uuid, varchar, jsonb, index, unique } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"

export const organizations = pgTable(
  "organizations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    description: text("description"),
    logo: text("logo"),
    website: text("website"),
    settings: jsonb("settings").default({}),
    plan: varchar("plan", { length: 50 }).notNull().default("free"),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    slugIdx: index("organizations_slug_idx").on(table.slug),
    planIdx: index("organizations_plan_idx").on(table.plan),
  }),
)

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizationId: uuid("organization_id").references(() => organizations.id),
    email: varchar("email", { length: 255 }).notNull().unique(),
    username: varchar("username", { length: 100 }).unique(),
    name: varchar("name", { length: 255 }).notNull(),
    avatar: text("avatar"),
    bio: text("bio"),
    role: varchar("role", { length: 50 }).notNull().default("student"),
    permissions: jsonb("permissions").default([]),
    level: integer("level").notNull().default(1),
    currentXP: integer("current_xp").notNull().default(0),
    totalXP: integer("total_xp").notNull().default(0),
    currentStreak: integer("current_streak").notNull().default(0),
    longestStreak: integer("longest_streak").notNull().default(0),
    lastActiveAt: timestamp("last_active_at").defaultNow(),
    timezone: varchar("timezone", { length: 50 }).default("UTC"),
    locale: varchar("locale", { length: 10 }).default("en"),
    isActive: boolean("is_active").notNull().default(true),
    isVerified: boolean("is_verified").notNull().default(false),
    isBanned: boolean("is_banned").notNull().default(false),
    preferences: jsonb("preferences").default({}),
    notificationSettings: jsonb("notification_settings").default({}),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
    deletedAt: timestamp("deleted_at"),
  },
  (table) => ({
    emailIdx: index("users_email_idx").on(table.email),
    usernameIdx: index("users_username_idx").on(table.username),
    roleIdx: index("users_role_idx").on(table.role),
    levelIdx: index("users_level_idx").on(table.level),
    orgIdx: index("users_organization_idx").on(table.organizationId),
    activeIdx: index("users_active_idx").on(table.isActive),
  }),
)

export const curriculumCategories = pgTable(
  "curriculum_categories",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizationId: uuid("organization_id").references(() => organizations.id),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    slug: varchar("slug", { length: 255 }).notNull(),
    color: varchar("color", { length: 7 }).default("#3B82F6"),
    icon: varchar("icon", { length: 100 }),
    sortOrder: integer("sort_order").notNull().default(0),
    isActive: boolean("is_active").notNull().default(true),
    metadata: jsonb("metadata").default({}),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
    createdBy: uuid("created_by")
      .references(() => users.id)
      .notNull(),
  },
  (table) => ({
    slugIdx: index("categories_slug_idx").on(table.slug),
    orgSlugIdx: unique("categories_org_slug_unique").on(table.organizationId, table.slug),
    activeIdx: index("categories_active_idx").on(table.isActive),
    sortIdx: index("categories_sort_idx").on(table.sortOrder),
  }),
)

export const curriculumModules = pgTable(
  "curriculum_modules",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizationId: uuid("organization_id").references(() => organizations.id),
    categoryId: uuid("category_id")
      .references(() => curriculumCategories.id)
      .notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description").notNull(),
    content: text("content").notNull(),
    summary: text("summary"),
    difficulty: varchar("difficulty", { length: 50 }).notNull(),
    estimatedTime: integer("estimated_time_minutes").notNull(),
    tags: jsonb("tags").default([]),
    prerequisites: jsonb("prerequisites").default([]),
    xpReward: integer("xp_reward").notNull().default(100),
    status: varchar("status", { length: 50 }).notNull().default("draft"),
    version: integer("version").notNull().default(1),
    publishedAt: timestamp("published_at"),
    resources: jsonb("resources").default([]),
    attachments: jsonb("attachments").default([]),
    viewCount: integer("view_count").notNull().default(0),
    completionCount: integer("completion_count").notNull().default(0),
    averageRating: integer("average_rating").default(0),
    ratingCount: integer("rating_count").notNull().default(0),
    sortOrder: integer("sort_order").notNull().default(0),
    aiSummary: text("ai_summary"),
    aiTags: jsonb("ai_tags").default([]),
    aiDifficulty: varchar("ai_difficulty", { length: 50 }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
    createdBy: uuid("created_by")
      .references(() => users.id)
      .notNull(),
    updatedBy: uuid("updated_by").references(() => users.id),
  },
  (table) => ({
    categoryIdx: index("modules_category_idx").on(table.categoryId),
    statusIdx: index("modules_status_idx").on(table.status),
    difficultyIdx: index("modules_difficulty_idx").on(table.difficulty),
    publishedIdx: index("modules_published_idx").on(table.publishedAt),
    createdByIdx: index("modules_created_by_idx").on(table.createdBy),
    orgIdx: index("modules_organization_idx").on(table.organizationId),
    tagsIdx: index("modules_tags_idx").using("gin", table.tags),
  }),
)

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
    progress: integer("progress").notNull().default(0),
    completedAt: timestamp("completed_at"),
    timeSpent: integer("time_spent_minutes").notNull().default(0),
    sessionCount: integer("session_count").notNull().default(0),
    lastSessionAt: timestamp("last_session_at"),
    xpEarned: integer("xp_earned").notNull().default(0),
    rating: integer("rating"),
    journalEntry: text("journal_entry"),
    notes: text("notes"),
    aiInsights: jsonb("ai_insights").default({}),
    strugglingAreas: jsonb("struggling_areas").default([]),
    strengths: jsonb("strengths").default([]),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    userModuleIdx: unique("progress_user_module_unique").on(table.userId, table.moduleId),
    userIdx: index("progress_user_idx").on(table.userId),
    moduleIdx: index("progress_module_idx").on(table.moduleId),
    completedIdx: index("progress_completed_idx").on(table.completedAt),
    progressIdx: index("progress_progress_idx").on(table.progress),
  }),
)

export const achievements = pgTable(
  "achievements",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizationId: uuid("organization_id").references(() => organizations.id),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description").notNull(),
    category: varchar("category", { length: 50 }).notNull(),
    icon: varchar("icon", { length: 100 }),
    color: varchar("color", { length: 7 }).default("#FFD700"),
    rarity: varchar("rarity", { length: 50 }).default("common"),
    xpReward: integer("xp_reward").notNull().default(0),
    badgeUrl: text("badge_url"),
    criteria: jsonb("criteria").notNull(),
    isSecret: boolean("is_secret").notNull().default(false),
    isActive: boolean("is_active").notNull().default(true),
    sortOrder: integer("sort_order").notNull().default(0),
    unlockedCount: integer("unlocked_count").notNull().default(0),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
    createdBy: uuid("created_by").references(() => users.id),
  },
  (table) => ({
    categoryIdx: index("achievements_category_idx").on(table.category),
    rarityIdx: index("achievements_rarity_idx").on(table.rarity),
    activeIdx: index("achievements_active_idx").on(table.isActive),
    orgIdx: index("achievements_organization_idx").on(table.organizationId),
  }),
)

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
    progress: integer("progress").notNull().default(0),
    unlockedAt: timestamp("unlocked_at"),
    notifiedAt: timestamp("notified_at"),
    metadata: jsonb("metadata").default({}),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => ({
    userAchievementIdx: unique("user_achievements_user_achievement_unique").on(table.userId, table.achievementId),
    userIdx: index("user_achievements_user_idx").on(table.userId),
    unlockedIdx: index("user_achievements_unlocked_idx").on(table.unlockedAt),
  }),
)

export const pods = pgTable(
  "pods",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizationId: uuid("organization_id").references(() => organizations.id),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    avatar: text("avatar"),
    inviteCode: varchar("invite_code", { length: 50 }).notNull().unique(),
    isPublic: boolean("is_public").notNull().default(false),
    requiresApproval: boolean("requires_approval").notNull().default(false),
    maxMembers: integer("max_members").notNull().default(10),
    isActive: boolean("is_active").notNull().default(true),
    settings: jsonb("settings").default({}),
    memberCount: integer("member_count").notNull().default(0),
    messageCount: integer("message_count").notNull().default(0),
    lastActivityAt: timestamp("last_activity_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
    createdBy: uuid("created_by")
      .references(() => users.id)
      .notNull(),
  },
  (table) => ({
    inviteCodeIdx: index("pods_invite_code_idx").on(table.inviteCode),
    publicIdx: index("pods_public_idx").on(table.isPublic),
    activeIdx: index("pods_active_idx").on(table.isActive),
    orgIdx: index("pods_organization_idx").on(table.organizationId),
    activityIdx: index("pods_activity_idx").on(table.lastActivityAt),
  }),
)

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
    role: varchar("role", { length: 50 }).notNull().default("member"),
    status: varchar("status", { length: 50 }).notNull().default("active"),
    permissions: jsonb("permissions").default([]),
    messageCount: integer("message_count").notNull().default(0),
    lastActiveAt: timestamp("last_active_at"),
    joinedAt: timestamp("joined_at").notNull().defaultNow(),
    leftAt: timestamp("left_at"),
    invitedBy: uuid("invited_by").references(() => users.id),
  },
  (table) => ({
    podUserIdx: unique("pod_members_pod_user_unique").on(table.podId, table.userId),
    podIdx: index("pod_members_pod_idx").on(table.podId),
    userIdx: index("pod_members_user_idx").on(table.userId),
    statusIdx: index("pod_members_status_idx").on(table.status),
    roleIdx: index("pod_members_role_idx").on(table.role),
  }),
)

export const missions = pgTable(
  "missions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizationId: uuid("organization_id").references(() => organizations.id),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description").notNull(),
    instructions: text("instructions"),
    type: varchar("type", { length: 50 }).notNull().default("challenge"),
    difficulty: varchar("difficulty", { length: 50 }).notNull(),
    category: varchar("category", { length: 100 }),
    xpReward: integer("xp_reward").notNull().default(200),
    badgeReward: uuid("badge_reward").references(() => achievements.id),
    customRewards: jsonb("custom_rewards").default([]),
    maxParticipants: integer("max_participants").notNull().default(50),
    minParticipants: integer("min_participants").notNull().default(1),
    isTeamBased: boolean("is_team_based").notNull().default(false),
    status: varchar("status", { length: 50 }).notNull().default("draft"),
    startDate: timestamp("start_date").notNull(),
    endDate: timestamp("end_date").notNull(),
    registrationDeadline: timestamp("registration_deadline"),
    requirements: jsonb("requirements").default({}),
    eligibilityCriteria: jsonb("eligibility_criteria").default({}),
    podId: uuid("pod_id").references(() => pods.id),
    targetAudience: jsonb("target_audience").default({}),
    isAiGenerated: boolean("is_ai_generated").notNull().default(false),
    aiPrompt: text("ai_prompt"),
    aiMetadata: jsonb("ai_metadata").default({}),
    participantCount: integer("participant_count").notNull().default(0),
    completionCount: integer("completion_count").notNull().default(0),
    averageCompletionTime: integer("average_completion_time_minutes"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
    createdBy: uuid("created_by")
      .references(() => users.id)
      .notNull(),
  },
  (table) => ({
    statusIdx: index("missions_status_idx").on(table.status),
    startDateIdx: index("missions_start_date_idx").on(table.startDate),
    endDateIdx: index("missions_end_date_idx").on(table.endDate),
    difficultyIdx: index("missions_difficulty_idx").on(table.difficulty),
    podIdx: index("missions_pod_idx").on(table.podId),
    orgIdx: index("missions_organization_idx").on(table.organizationId),
    aiGeneratedIdx: index("missions_ai_generated_idx").on(table.isAiGenerated),
  }),
)

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
    teamId: uuid("team_id"),
    status: varchar("status", { length: 50 }).notNull().default("registered"),
    progress: integer("progress").notNull().default(0),
    score: integer("score").default(0),
    completedAt: timestamp("completed_at"),
    xpEarned: integer("xp_earned").notNull().default(0),
    submission: jsonb("submission").default({}),
    submittedAt: timestamp("submitted_at"),
    feedback: text("feedback"),
    rating: integer("rating"),
    registeredAt: timestamp("registered_at").notNull().defaultNow(),
    startedAt: timestamp("started_at"),
  },
  (table) => ({
    missionUserIdx: unique("mission_participation_mission_user_unique").on(table.missionId, table.userId),
    missionIdx: index("mission_participation_mission_idx").on(table.missionId),
    userIdx: index("mission_participation_user_idx").on(table.userId),
    statusIdx: index("mission_participation_status_idx").on(table.status),
    completedIdx: index("mission_participation_completed_idx").on(table.completedAt),
    teamIdx: index("mission_participation_team_idx").on(table.teamId),
  }),
)

export const chatChannels = pgTable(
  "chat_channels",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    podId: uuid("pod_id")
      .references(() => pods.id)
      .notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    type: varchar("type", { length: 50 }).notNull().default("general"),
    isPrivate: boolean("is_private").notNull().default(false),
    settings: jsonb("settings").default({}),
    messageCount: integer("message_count").notNull().default(0),
    lastMessageAt: timestamp("last_message_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    createdBy: uuid("created_by")
      .references(() => users.id)
      .notNull(),
  },
  (table) => ({
    podIdx: index("chat_channels_pod_idx").on(table.podId),
    typeIdx: index("chat_channels_type_idx").on(table.type),
    lastMessageIdx: index("chat_channels_last_message_idx").on(table.lastMessageAt),
  }),
)

export const chatMessages = pgTable(
  "chat_messages",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    channelId: uuid("channel_id")
      .references(() => chatChannels.id)
      .notNull(),
    userId: uuid("user_id")
      .references(() => users.id)
      .notNull(),
    content: text("content").notNull(),
    messageType: varchar("message_type", { length: 50 }).notNull().default("text"),
    attachments: jsonb("attachments").default([]),
    mentions: jsonb("mentions").default([]),
    reactions: jsonb("reactions").default({}),
    parentId: uuid("parent_id").references(() => chatMessages.id),
    threadCount: integer("thread_count").notNull().default(0),
    isEdited: boolean("is_edited").notNull().default(false),
    isDeleted: boolean("is_deleted").notNull().default(false),
    editedAt: timestamp("edited_at"),
    deletedAt: timestamp("deleted_at"),
    metadata: jsonb("metadata").default({}),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => ({
    channelIdx: index("chat_messages_channel_idx").on(table.channelId),
    userIdx: index("chat_messages_user_idx").on(table.userId),
    createdAtIdx: index("chat_messages_created_at_idx").on(table.createdAt),
    parentIdx: index("chat_messages_parent_idx").on(table.parentId),
    typeIdx: index("chat_messages_type_idx").on(table.messageType),
  }),
)

export const notifications = pgTable(
  "notifications",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .references(() => users.id)
      .notNull(),
    type: varchar("type", { length: 100 }).notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    message: text("message").notNull(),
    icon: varchar("icon", { length: 100 }),
    image: text("image"),
    actionUrl: text("action_url"),
    actionText: varchar("action_text", { length: 100 }),
    isRead: boolean("is_read").notNull().default(false),
    readAt: timestamp("read_at"),
    channels: jsonb("channels").default(["in_app"]),
    deliveryStatus: jsonb("delivery_status").default({}),
    metadata: jsonb("metadata").default({}),
    relatedId: uuid("related_id"),
    relatedType: varchar("related_type", { length: 100 }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    scheduledFor: timestamp("scheduled_for"),
  },
  (table) => ({
    userIdx: index("notifications_user_idx").on(table.userId),
    typeIdx: index("notifications_type_idx").on(table.type),
    readIdx: index("notifications_read_idx").on(table.isRead),
    createdAtIdx: index("notifications_created_at_idx").on(table.createdAt),
    scheduledIdx: index("notifications_scheduled_idx").on(table.scheduledFor),
  }),
)

export const analyticsEvents = pgTable(
  "analytics_events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizationId: uuid("organization_id").references(() => organizations.id),
    userId: uuid("user_id").references(() => users.id),
    event: varchar("event", { length: 100 }).notNull(),
    category: varchar("category", { length: 100 }),
    action: varchar("action", { length: 100 }),
    label: varchar("label", { length: 255 }),
    value: integer("value"),
    properties: jsonb("properties").default({}),
    userAgent: text("user_agent"),
    ipAddress: varchar("ip_address", { length: 45 }),
    referrer: text("referrer"),
    sessionId: varchar("session_id", { length: 255 }),
    timestamp: timestamp("timestamp").notNull().defaultNow(),
  },
  (table) => ({
    eventIdx: index("analytics_events_event_idx").on(table.event),
    userIdx: index("analytics_events_user_idx").on(table.userId),
    orgIdx: index("analytics_events_organization_idx").on(table.organizationId),
    timestampIdx: index("analytics_events_timestamp_idx").on(table.timestamp),
    sessionIdx: index("analytics_events_session_idx").on(table.sessionId),
  }),
)

export const webhooks = pgTable(
  "webhooks",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizationId: uuid("organization_id")
      .references(() => organizations.id)
      .notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    url: text("url").notNull(),
    events: jsonb("events").notNull(),
    secret: varchar("secret", { length: 255 }),
    isActive: boolean("is_active").notNull().default(true),
    lastTriggeredAt: timestamp("last_triggered_at"),
    successCount: integer("success_count").notNull().default(0),
    failureCount: integer("failure_count").notNull().default(0),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
    createdBy: uuid("created_by")
      .references(() => users.id)
      .notNull(),
  },
  (table) => ({
    orgIdx: index("webhooks_organization_idx").on(table.organizationId),
    activeIdx: index("webhooks_active_idx").on(table.isActive),
    eventsIdx: index("webhooks_events_idx").using("gin", table.events),
  }),
)

export const webhookDeliveries = pgTable(
  "webhook_deliveries",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    webhookId: uuid("webhook_id")
      .references(() => webhooks.id)
      .notNull(),
    event: varchar("event", { length: 100 }).notNull(),
    payload: jsonb("payload").notNull(),
    status: varchar("status", { length: 50 }).notNull(),
    httpStatus: integer("http_status"),
    response: text("response"),
    error: text("error"),
    attemptCount: integer("attempt_count").notNull().default(1),
    nextRetryAt: timestamp("next_retry_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    deliveredAt: timestamp("delivered_at"),
  },
  (table) => ({
    webhookIdx: index("webhook_deliveries_webhook_idx").on(table.webhookId),
    statusIdx: index("webhook_deliveries_status_idx").on(table.status),
    eventIdx: index("webhook_deliveries_event_idx").on(table.event),
    createdAtIdx: index("webhook_deliveries_created_at_idx").on(table.createdAt),
    retryIdx: index("webhook_deliveries_retry_idx").on(table.nextRetryAt),
  }),
)

export const apiKeys = pgTable(
  "api_keys",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizationId: uuid("organization_id")
      .references(() => organizations.id)
      .notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    keyHash: varchar("key_hash", { length: 255 }).notNull().unique(),
    keyPrefix: varchar("key_prefix", { length: 20 }).notNull(),
    scopes: jsonb("scopes").notNull(),
    rateLimit: integer("rate_limit").default(1000),
    usageCount: integer("usage_count").notNull().default(0),
    isActive: boolean("is_active").notNull().default(true),
    expiresAt: timestamp("expires_at"),
    lastUsedAt: timestamp("last_used_at"),
    lastUsedIp: varchar("last_used_ip", { length: 45 }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    createdBy: uuid("created_by")
      .references(() => users.id)
      .notNull(),
  },
  (table) => ({
    keyHashIdx: index("api_keys_key_hash_idx").on(table.keyHash),
    orgIdx: index("api_keys_organization_idx").on(table.organizationId),
    activeIdx: index("api_keys_active_idx").on(table.isActive),
    expiresIdx: index("api_keys_expires_idx").on(table.expiresAt),
  }),
)

export const moderationReports = pgTable(
  "moderation_reports",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizationId: uuid("organization_id").references(() => organizations.id),
    type: varchar("type", { length: 50 }).notNull(),
    reason: varchar("reason", { length: 100 }).notNull(),
    description: text("description"),
    reportedId: uuid("reported_id").notNull(),
    reportedType: varchar("reported_type", { length: 50 }).notNull(),
    reportedUserId: uuid("reported_user_id").references(() => users.id),
    reporterId: uuid("reporter_id")
      .references(() => users.id)
      .notNull(),
    status: varchar("status", { length: 50 }).notNull().default("pending"),
    priority: varchar("priority", { length: 50 }).notNull().default("medium"),
    resolvedAt: timestamp("resolved_at"),
    resolvedBy: uuid("resolved_by").references(() => users.id),
    resolution: text("resolution"),
    action: varchar("action", { length: 100 }),
    metadata: jsonb("metadata").default({}),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    typeIdx: index("moderation_reports_type_idx").on(table.type),
    statusIdx: index("moderation_reports_status_idx").on(table.status),
    priorityIdx: index("moderation_reports_priority_idx").on(table.priority),
    reportedIdx: index("moderation_reports_reported_idx").on(table.reportedId, table.reportedType),
    reporterIdx: index("moderation_reports_reporter_idx").on(table.reporterId),
    orgIdx: index("moderation_reports_organization_idx").on(table.organizationId),
  }),
)

export const aiInsights = pgTable(
  "ai_insights",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .references(() => users.id)
      .notNull(),
    type: varchar("type", { length: 100 }).notNull(),
    insights: jsonb("insights").notNull(),
    confidence: integer("confidence").notNull(),
    contextType: varchar("context_type", { length: 50 }),
    contextId: uuid("context_id"),
    model: varchar("model", { length: 100 }),
    version: varchar("version", { length: 50 }),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    expiresAt: timestamp("expires_at"),
  },
  (table) => ({
    userIdx: index("ai_insights_user_idx").on(table.userId),
    typeIdx: index("ai_insights_type_idx").on(table.type),
    contextIdx: index("ai_insights_context_idx").on(table.contextType, table.contextId),
    activeIdx: index("ai_insights_active_idx").on(table.isActive),
    expiresIdx: index("ai_insights_expires_idx").on(table.expiresAt),
  }),
)

export const referrals = pgTable(
  "referrals",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizationId: uuid("organization_id").references(() => organizations.id),
    referrerId: uuid("referrer_id")
      .references(() => users.id)
      .notNull(),
    referredId: uuid("referred_id").references(() => users.id),
    referralCode: varchar("referral_code", { length: 50 }).notNull().unique(),
    status: varchar("status", { length: 50 }).notNull().default("pending"),
    referrerReward: integer("referrer_reward").notNull().default(500),
    referredReward: integer("referred_reward").notNull().default(250),
    completedAt: timestamp("completed_at"),
    expiresAt: timestamp("expires_at"),
    metadata: jsonb("metadata").default({}),
    source: varchar("source", { length: 100 }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => ({
    referrerIdx: index("referrals_referrer_idx").on(table.referrerId),
    referredIdx: index("referrals_referred_idx").on(table.referredId),
    codeIdx: index("referrals_code_idx").on(table.referralCode),
    statusIdx: index("referrals_status_idx").on(table.status),
    orgIdx: index("referrals_organization_idx").on(table.organizationId),
  }),
)

export const systemSettings = pgTable(
  "system_settings",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizationId: uuid("organization_id").references(() => organizations.id),
    key: varchar("key", { length: 255 }).notNull(),
    value: jsonb("value").notNull(),
    type: varchar("type", { length: 50 }).notNull().default("json"),
    description: text("description"),
    category: varchar("category", { length: 100 }),
    isPublic: boolean("is_public").notNull().default(false),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
    updatedBy: uuid("updated_by").references(() => users.id),
  },
  (table) => ({
    keyIdx: unique("system_settings_key_unique").on(table.organizationId, table.key),
    categoryIdx: index("system_settings_category_idx").on(table.category),
    publicIdx: index("system_settings_public_idx").on(table.isPublic),
  }),
)

export const organizationsRelations = relations(organizations, ({ many }) => ({
  users: many(users),
  categories: many(curriculumCategories),
  modules: many(curriculumModules),
  achievements: many(achievements),
  pods: many(pods),
  missions: many(missions),
  webhooks: many(webhooks),
  apiKeys: many(apiKeys),
  settings: many(systemSettings),
  reports: many(moderationReports),
  referrals: many(referrals),
  events: many(analyticsEvents),
}))

export const usersRelations = relations(users, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [users.organizationId],
    references: [organizations.id],
  }),
  progress: many(userProgress),
  achievements: many(userAchievements),
  podMemberships: many(podMembers),
  missionParticipations: many(missionParticipation),
  chatMessages: many(chatMessages),
  notifications: many(notifications),
  insights: many(aiInsights),
  referralsMade: many(referrals, { relationName: "referrer" }),
  referralsReceived: many(referrals, { relationName: "referred" }),
  createdModules: many(curriculumModules, { relationName: "creator" }),
  createdPods: many(pods, { relationName: "creator" }),
  createdMissions: many(missions, { relationName: "creator" }),
}))

export const curriculumModulesRelations = relations(curriculumModules, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [curriculumModules.organizationId],
    references: [organizations.id],
  }),
  category: one(curriculumCategories, {
    fields: [curriculumModules.categoryId],
    references: [curriculumCategories.id],
  }),
  creator: one(users, {
    fields: [curriculumModules.createdBy],
    references: [users.id],
  }),
  progress: many(userProgress),
}))

export const podsRelations = relations(pods, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [pods.organizationId],
    references: [organizations.id],
  }),
  creator: one(users, {
    fields: [pods.createdBy],
    references: [users.id],
  }),
  members: many(podMembers),
  channels: many(chatChannels),
  missions: many(missions),
}))

export const chatChannelsRelations = relations(chatChannels, ({ one, many }) => ({
  pod: one(pods, {
    fields: [chatChannels.podId],
    references: [pods.id],
  }),
  creator: one(users, {
    fields: [chatChannels.createdBy],
    references: [users.id],
  }),
  messages: many(chatMessages),
}))

export const missionsRelations = relations(missions, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [missions.organizationId],
    references: [organizations.id],
  }),
  creator: one(users, {
    fields: [missions.createdBy],
    references: [users.id],
  }),
  pod: one(pods, {
    fields: [missions.podId],
    references: [pods.id],
  }),
  participants: many(missionParticipation),
}))

export const insertUserSchema = createInsertSchema(users)
export const selectUserSchema = createSelectSchema(users)
export const insertModuleSchema = createInsertSchema(curriculumModules)
export const selectModuleSchema = createSelectSchema(curriculumModules)
export const insertPodSchema = createInsertSchema(pods)
export const selectPodSchema = createSelectSchema(pods)
export const insertMissionSchema = createInsertSchema(missions)
export const selectMissionSchema = createSelectSchema(missions)

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type Module = typeof curriculumModules.$inferSelect
export type NewModule = typeof curriculumModules.$inferInsert
export type Pod = typeof pods.$inferSelect
export type NewPod = typeof pods.$inferInsert
export type Mission = typeof missions.$inferSelect
export type NewMission = typeof missions.$inferInsert
export type Organization = typeof organizations.$inferSelect
export type NewOrganization = typeof organizations.$inferInsert
