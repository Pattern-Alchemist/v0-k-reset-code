# K-RESET Platform API Reference

This document provides comprehensive documentation for all API endpoints in the K-RESET platform.

## Base URL

- Development: `http://localhost:3000/api`
- Production: `https://your-domain.com/api`

## Authentication

Most endpoints require authentication. Include the session token in requests:

\`\`\`javascript
headers: {
  'Authorization': 'Bearer <session-token>',
  'Content-Type': 'application/json'
}
\`\`\`

## Modules API

### GET /api/modules

Retrieve all curriculum modules with optional filtering.

**Query Parameters:**
- `category` (string, optional) - Filter by category slug
- `difficulty` (string, optional) - Filter by difficulty level
- `status` (string, optional) - Filter by status (published, draft)
- `search` (string, optional) - Search in title and description
- `limit` (number, optional) - Limit results (default: 50)
- `offset` (number, optional) - Pagination offset (default: 0)

**Response:**
\`\`\`json
{
  "modules": [
    {
      "id": "uuid",
      "title": "Understanding Resilience",
      "description": "Learn the fundamentals of resilience...",
      "category": "resilience-building",
      "difficulty": "Beginner",
      "estimatedTime": "30 minutes",
      "xpReward": 100,
      "progress": 0,
      "status": "published",
      "tags": ["fundamentals", "mindset"],
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "total": 25,
  "hasMore": true
}
\`\`\`

### GET /api/modules/[id]

Retrieve a specific module by ID.

**Parameters:**
- `id` (string) - Module UUID

**Response:**
\`\`\`json
{
  "id": "uuid",
  "title": "Understanding Resilience",
  "description": "Learn the fundamentals of resilience...",
  "content": "<h2>What is Resilience?</h2><p>...",
  "category": "resilience-building",
  "difficulty": "Beginner",
  "estimatedTime": "30 minutes",
  "xpReward": 100,
  "progress": 75,
  "status": "published",
  "tags": ["fundamentals", "mindset"],
  "prerequisites": [],
  "resources": [],
  "createdAt": "2024-01-01T00:00:00Z"
}
\`\`\`

### GET /api/modules/[id]/related

Get modules related to the specified module.

**Parameters:**
- `id` (string) - Module UUID

**Response:**
\`\`\`json
{
  "relatedModules": [
    {
      "id": "uuid",
      "title": "Building Mental Strength",
      "description": "Develop practical strategies...",
      "category": "resilience-building",
      "difficulty": "Intermediate",
      "estimatedTime": "45 minutes",
      "xpReward": 150
    }
  ]
}
\`\`\`

### POST /api/modules/[id]/progress

Update user progress for a specific module.

**Parameters:**
- `id` (string) - Module UUID

**Request Body:**
\`\`\`json
{
  "progress": 100,
  "timeSpent": 30,
  "journalEntry": "Key insights from this module..."
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "xpEarned": 100,
  "levelUp": false,
  "newLevel": 5
}
\`\`\`

## Progress API

### GET /api/progress

Get current user's overall progress and statistics.

**Response:**
\`\`\`json
{
  "level": 5,
  "currentXP": 1800,
  "totalXP": 1800,
  "currentStreak": 7,
  "longestStreak": 12,
  "modulesCompleted": 8,
  "podRank": 3,
  "weeklyGoals": {
    "modulesCompleted": 2,
    "podParticipation": 5
  }
}
\`\`\`

### GET /api/activity

Get user's recent activity feed.

**Query Parameters:**
- `limit` (number, optional) - Limit results (default: 20)
- `type` (string, optional) - Filter by activity type

**Response:**
\`\`\`json
{
  "activities": [
    {
      "id": "uuid",
      "type": "module_completed",
      "title": "Module Completed",
      "description": "Completed 'Understanding Resilience'",
      "timestamp": "2024-01-15T10:30:00Z",
      "xpEarned": 100
    }
  ]
}
\`\`\`

## Achievements API

### GET /api/achievements

Get all achievements with user progress.

**Response:**
\`\`\`json
{
  "achievements": [
    {
      "id": "uuid",
      "name": "First Steps",
      "description": "Complete your first module",
      "category": "learning",
      "xpReward": 50,
      "iconUrl": "/icons/first-steps.svg",
      "earned": true,
      "progress": 100,
      "unlockedAt": "2024-01-10T00:00:00Z"
    }
  ]
}
\`\`\`

## Community API

### GET /api/pods

Get user's learning pods.

**Response:**
\`\`\`json
{
  "pods": [
    {
      "id": "uuid",
      "name": "Resilience Warriors",
      "description": "A supportive community...",
      "inviteCode": "RESILIENT2024",
      "maxMembers": 15,
      "isActive": true,
      "isLeader": false,
      "lastActivity": "2 hours ago",
      "members": [
        {
          "id": "uuid",
          "name": "Sarah Johnson",
          "avatar": "/avatars/sarah.jpg",
          "role": "leader",
          "joinedAt": "2024-01-01T00:00:00Z"
        }
      ]
    }
  ]
}
\`\`\`

### POST /api/pods

Create a new learning pod.

**Request Body:**
\`\`\`json
{
  "name": "New Learning Pod",
  "description": "Description of the pod",
  "maxMembers": 10
}
\`\`\`

**Response:**
\`\`\`json
{
  "id": "uuid",
  "name": "New Learning Pod",
  "inviteCode": "NEWPOD2024",
  "success": true
}
\`\`\`

### POST /api/pods/join

Join a learning pod using invite code.

**Request Body:**
\`\`\`json
{
  "inviteCode": "RESILIENT2024"
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "podId": "uuid",
  "podName": "Resilience Warriors"
}
\`\`\`

## Missions API

### GET /api/missions

Get available group missions.

**Query Parameters:**
- `status` (string, optional) - Filter by status (active, upcoming, completed)
- `podId` (string, optional) - Filter by pod

**Response:**
\`\`\`json
{
  "missions": [
    {
      "id": "uuid",
      "title": "Resilience Challenge",
      "description": "Complete 3 resilience modules...",
      "difficulty": "Medium",
      "xpReward": 300,
      "maxParticipants": 20,
      "participants": 12,
      "progress": 65,
      "status": "active",
      "timeRemaining": "15 days",
      "podName": "Resilience Warriors",
      "isParticipant": true
    }
  ]
}
\`\`\`

### POST /api/missions/[id]/join

Join a group mission.

**Parameters:**
- `id` (string) - Mission UUID

**Response:**
\`\`\`json
{
  "success": true,
  "message": "Successfully joined mission"
}
\`\`\`

## Leaderboard API

### GET /api/leaderboard/weekly

Get weekly leaderboard.

**Response:**
\`\`\`json
{
  "leaderboard": [
    {
      "userId": "uuid",
      "name": "Alex Chen",
      "avatar": "/avatars/alex.jpg",
      "level": 5,
      "xp": 1800,
      "weeklyXP": 450,
      "podName": "Resilience Warriors",
      "isCurrentUser": false
    }
  ]
}
\`\`\`

### GET /api/leaderboard/monthly

Get monthly leaderboard.

**Response:**
\`\`\`json
{
  "leaderboard": [
    {
      "userId": "uuid",
      "name": "David Kim",
      "avatar": "/avatars/david.jpg",
      "level": 6,
      "xp": 2100,
      "monthlyXP": 1200,
      "podName": "Future Leaders",
      "isCurrentUser": true
    }
  ]
}
\`\`\`

## Admin API

### GET /api/admin/stats

Get platform statistics (admin only).

**Response:**
\`\`\`json
{
  "totalUsers": 1247,
  "newUsersThisWeek": 23,
  "totalModules": 25,
  "publishedModules": 20,
  "engagementRate": 78,
  "engagementGrowth": 12,
  "activePods": 89,
  "totalPods": 95
}
\`\`\`

### GET /api/admin/modules

Get all modules for admin management.

**Response:**
\`\`\`json
{
  "modules": [
    {
      "id": "uuid",
      "title": "Understanding Resilience",
      "description": "Learn the fundamentals...",
      "category": "resilience-building",
      "difficulty": "Beginner",
      "status": "published",
      "viewCount": 156,
      "completionCount": 89,
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}
\`\`\`

### PATCH /api/admin/modules/[id]/status

Update module status (admin only).

**Parameters:**
- `id` (string) - Module UUID

**Request Body:**
\`\`\`json
{
  "status": "published"
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "message": "Module status updated"
}
\`\`\`

### DELETE /api/admin/modules/[id]

Delete a module (admin only).

**Parameters:**
- `id` (string) - Module UUID

**Response:**
\`\`\`json
{
  "success": true,
  "message": "Module deleted successfully"
}
\`\`\`

### GET /api/admin/moderation

Get moderation queue (admin only).

**Response:**
\`\`\`json
{
  "items": [
    {
      "id": "uuid",
      "type": "user_report",
      "title": "Inappropriate Content",
      "description": "User reported inappropriate message...",
      "priority": "high",
      "status": "pending",
      "createdAt": "2024-01-15T10:00:00Z",
      "reporterName": "Alex Chen",
      "reportedUser": {
        "id": "uuid",
        "name": "John Doe",
        "avatar": "/avatars/john.jpg"
      }
    }
  ]
}
\`\`\`

## Error Responses

All endpoints return consistent error responses:

\`\`\`json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": "Additional error details"
}
\`\`\`

### Common Error Codes

- `UNAUTHORIZED` (401) - Authentication required
- `FORBIDDEN` (403) - Insufficient permissions
- `NOT_FOUND` (404) - Resource not found
- `VALIDATION_ERROR` (400) - Invalid request data
- `RATE_LIMITED` (429) - Too many requests
- `INTERNAL_ERROR` (500) - Server error

## Rate Limiting

API endpoints are rate limited:
- General endpoints: 100 requests per minute
- Authentication endpoints: 10 requests per minute
- Admin endpoints: 200 requests per minute

## Webhooks

The platform supports webhooks for real-time updates:

### Mission Updates
\`\`\`json
{
  "event": "mission.completed",
  "data": {
    "missionId": "uuid",
    "userId": "uuid",
    "completedAt": "2024-01-15T10:00:00Z"
  }
}
\`\`\`

### Achievement Unlocked
\`\`\`json
{
  "event": "achievement.unlocked",
  "data": {
    "achievementId": "uuid",
    "userId": "uuid",
    "unlockedAt": "2024-01-15T10:00:00Z"
  }
}
\`\`\`

## SDK and Libraries

### JavaScript/TypeScript SDK

\`\`\`bash
npm install @k-reset/sdk
\`\`\`

\`\`\`javascript
import { KResetClient } from '@k-reset/sdk'

const client = new KResetClient({
  apiKey: 'your-api-key',
  baseUrl: 'https://api.k-reset.app'
})

// Get user progress
const progress = await client.progress.get()

// Complete module
await client.modules.updateProgress('module-id', { progress: 100 })
\`\`\`

For more examples and advanced usage, see the [SDK Documentation](./sdk.md).
\`\`\`
