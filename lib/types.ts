// Core type definitions for the K-RESET platform
export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  role: "admin" | "mentor" | "student"
  level: number
  currentXP: number
  totalXP: number
  currentStreak: number
  longestStreak: number
  joinedAt: string
  lastActiveAt: string
  isActive: boolean
}

export interface Module {
  id: string
  title: string
  description: string
  content: string
  category: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  estimatedTime: string
  xpReward: number
  progress: number
  status: "draft" | "published" | "archived"
  tags: string[]
  prerequisites: string[]
  createdAt: string
  updatedAt: string
  createdBy: string
}

export interface UserProgress {
  userId: string
  moduleId: string
  progress: number
  completedAt?: string
  xpEarned: number
  timeSpent: number
  level: number
  currentXP: number
  totalXP: number
  currentStreak: number
  modulesCompleted: number
  podRank: number
  weeklyGoals: {
    modulesCompleted: number
    podParticipation: number
  }
}

export interface Achievement {
  id: string
  name: string
  description: string
  category: "learning" | "streak" | "community" | "milestone" | "discussion"
  xpReward: number
  iconUrl?: string
  earned: boolean
  progress: number
  unlockedAt?: string
}

export interface LearningPod {
  id: string
  name: string
  description: string
  inviteCode: string
  maxMembers: number
  isActive: boolean
  createdAt: string
  lastActivity: string
  isLeader: boolean
  members: Array<{
    id: string
    name: string
    avatar?: string
    role: "leader" | "member"
    joinedAt: string
  }>
}

export interface GroupMission {
  id: string
  title: string
  description: string
  status: "upcoming" | "active" | "completed" | "expired"
  difficulty: "Easy" | "Medium" | "Hard"
  xpReward: number
  maxParticipants: number
  participants: number
  progress: number
  timeRemaining: string
  startDate: string
  endDate: string
  podName?: string
  isParticipant: boolean
}

export interface LeaderboardEntry {
  userId: string
  name: string
  avatar?: string
  level: number
  xp: number
  weeklyXP?: number
  monthlyXP?: number
  podName?: string
  isCurrentUser: boolean
}

export interface Activity {
  id: string
  type: "module_completed" | "achievement_unlocked" | "pod_joined" | "discussion_posted"
  title: string
  description: string
  timestamp: string
  xpEarned?: number
}

export interface AdminStats {
  totalUsers: number
  newUsersThisWeek: number
  totalModules: number
  publishedModules: number
  engagementRate: number
  engagementGrowth: number
  activePods: number
  totalPods: number
}

export interface ModerationItem {
  id: string
  type: "user_report" | "content_flag" | "pod_issue"
  title: string
  description: string
  priority: "low" | "medium" | "high"
  status: "pending" | "approved" | "rejected"
  createdAt: string
  reporterName: string
  reportedUser?: {
    id: string
    name: string
    avatar?: string
  }
}
