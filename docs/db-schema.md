# K-RESET Platform Database Schema

This document provides a comprehensive overview of the database schema for the K-RESET platform.

## Overview

The K-RESET platform uses PostgreSQL with Drizzle ORM for type-safe database operations. The schema is designed to support:

- User management and gamification
- Curriculum content and progress tracking
- Community features (pods, missions, chat)
- Achievement system
- Referral program
- Activity tracking

## Entity Relationship Diagram

\`\`\`
┌─────────────┐    ┌──────────────────┐    ┌─────────────────┐
│    users    │────│  user_progress   │────│ curriculum_     │
│             │    │                  │    │ modules         │
└─────────────┘    └──────────────────┘    └─────────────────┘
       │                                            │
       │           ┌──────────────────┐            │
       └───────────│ user_achievements│            │
                   │                  │            │
                   └──────────────────┘            │
                            │                      │
                   ┌──────────────────┐            │
                   │  achievements    │            │
                   └──────────────────┘            │
                                                   │
┌─────────────┐    ┌──────────────────┐            │
│    pods     │────│  pod_members     │            │
│             │    │                  │            │
└─────────────┘    └──────────────────┘            │
       │                    │                      │
       │                    │                      │
       │           ┌──────────────────┐            │
       │           │ chat_messages    │            │
       │           └──────────────────┘            │
       │                                           │
       │           ┌──────────────────┐            │
       └───────────│   missions       │            │
                   │                  │            │
                   └──────────────────┘            │
                            │                      │
                   ┌──────────────────┐            │
                   │ mission_         │            │
                   │ participation    │            │
                   └──────────────────┘            │
                                                   │
                   ┌──────────────────┐            │
                   │ curriculum_      │────────────┘
                   │ categories       │
                   └──────────────────┘
\`\`\`

## Core Tables

### users

Stores user information and gamification data.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| email | VARCHAR(255) | Unique email address |
| name | VARCHAR(255) | User's display name |
| avatar | TEXT | Avatar image URL |
| role | VARCHAR(50) | User role (admin, mentor, student) |
| level | INTEGER | Current user level |
| current_xp | INTEGER | XP in current level |
| total_xp | INTEGER | Total XP earned |
| current_streak | INTEGER | Current learning streak |
| longest_streak | INTEGER | Longest learning streak |
| last_active_at | TIMESTAMP | Last activity timestamp |
| is_active | BOOLEAN | Account status |
| preferences | JSONB | User preferences |
| created_at | TIMESTAMP | Account creation time |
| updated_at | TIMESTAMP | Last update time |

**Indexes:**
- `users_email_idx` on email
- `users_role_idx` on role
- `users_level_idx` on level

### curriculum_categories

Organizes curriculum modules into categories.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| name | VARCHAR(255) | Category name |
| description | TEXT | Category description |
| slug | VARCHAR(255) | URL-friendly identifier |
| color | VARCHAR(7) | Hex color code |
| icon_url | TEXT | Icon image URL |
| sort_order | INTEGER | Display order |
| is_active | BOOLEAN | Category status |
| created_at | TIMESTAMP | Creation time |
| updated_at | TIMESTAMP | Last update time |
| created_by | UUID | Creator user ID |

**Indexes:**
- `categories_slug_idx` on slug
- `categories_active_idx` on is_active

### curriculum_modules

Stores learning content and metadata.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| title | VARCHAR(255) | Module title |
| description | TEXT | Module description |
| content | TEXT | HTML content |
| category_id | UUID | Foreign key to categories |
| difficulty | VARCHAR(50) | Difficulty level |
| estimated_time | VARCHAR(50) | Estimated completion time |
| xp_reward | INTEGER | XP awarded on completion |
| status | VARCHAR(50) | Publication status |
| tags | JSONB | Array of tags |
| prerequisites | JSONB | Required module IDs |
| resources | JSONB | Additional resources |
| sort_order | INTEGER | Display order |
| view_count | INTEGER | Number of views |
| completion_count | INTEGER | Number of completions |
| created_at | TIMESTAMP | Creation time |
| updated_at | TIMESTAMP | Last update time |
| created_by | UUID | Creator user ID |

**Indexes:**
- `modules_category_idx` on category_id
- `modules_status_idx` on status
- `modules_difficulty_idx` on difficulty
- `modules_created_by_idx` on created_by

### user_progress

Tracks individual user progress through modules.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | Foreign key to users |
| module_id | UUID | Foreign key to modules |
| progress | INTEGER | Completion percentage (0-100) |
| completed_at | TIMESTAMP | Completion timestamp |
| xp_earned | INTEGER | XP earned from this module |
| time_spent | INTEGER | Time spent in minutes |
| journal_entry | TEXT | User's reflection notes |
| created_at | TIMESTAMP | First access time |
| updated_at | TIMESTAMP | Last update time |

**Indexes:**
- `progress_user_module_idx` on (user_id, module_id)
- `progress_user_idx` on user_id
- `progress_module_idx` on module_id
- `progress_completed_idx` on completed_at

**Constraints:**
- Unique constraint on (user_id, module_id)

## Gamification Tables

### achievements

Defines available achievements and their criteria.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| name | VARCHAR(255) | Achievement name |
| description | TEXT | Achievement description |
| category | VARCHAR(50) | Achievement category |
| xp_reward | INTEGER | XP reward |
| icon_url | TEXT | Icon image URL |
| criteria | JSONB | Unlock criteria |
| is_active | BOOLEAN | Achievement status |
| sort_order | INTEGER | Display order |
| created_at | TIMESTAMP | Creation time |
| updated_at | TIMESTAMP | Last update time |

**Indexes:**
- `achievements_category_idx` on category
- `achievements_active_idx` on is_active

### user_achievements

Tracks user achievement progress and unlocks.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | Foreign key to users |
| achievement_id | UUID | Foreign key to achievements |
| progress | INTEGER | Progress percentage (0-100) |
| unlocked_at | TIMESTAMP | Unlock timestamp |
| created_at | TIMESTAMP | First progress time |

**Indexes:**
- `user_achievements_user_achievement_idx` on (user_id, achievement_id)
- `user_achievements_user_idx` on user_id
- `user_achievements_unlocked_idx` on unlocked_at

**Constraints:**
- Unique constraint on (user_id, achievement_id)

## Community Tables

### pods

Learning pods for group collaboration.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| name | VARCHAR(255) | Pod name |
| description | TEXT | Pod description |
| invite_code | VARCHAR(50) | Unique invite code |
| max_members | INTEGER | Maximum member count |
| is_active | BOOLEAN | Pod status |
| settings | JSONB | Pod configuration |
| created_at | TIMESTAMP | Creation time |
| updated_at | TIMESTAMP | Last update time |
| created_by | UUID | Creator user ID |

**Indexes:**
- `pods_invite_code_idx` on invite_code
- `pods_active_idx` on is_active
- `pods_created_by_idx` on created_by

### pod_members

Tracks pod membership and roles.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| pod_id | UUID | Foreign key to pods |
| user_id | UUID | Foreign key to users |
| role | VARCHAR(50) | Member role (leader, member) |
| joined_at | TIMESTAMP | Join timestamp |
| left_at | TIMESTAMP | Leave timestamp |
| is_active | BOOLEAN | Membership status |

**Indexes:**
- `pod_members_pod_user_idx` on (pod_id, user_id)
- `pod_members_pod_idx` on pod_id
- `pod_members_user_idx` on user_id
- `pod_members_active_idx` on is_active

**Constraints:**
- Unique constraint on (pod_id, user_id)

### missions

Group challenges and missions.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| title | VARCHAR(255) | Mission title |
| description | TEXT | Mission description |
| difficulty | VARCHAR(50) | Difficulty level |
| xp_reward | INTEGER | XP reward |
| max_participants | INTEGER | Maximum participants |
| status | VARCHAR(50) | Mission status |
| start_date | TIMESTAMP | Start time |
| end_date | TIMESTAMP | End time |
| requirements | JSONB | Completion requirements |
| pod_id | UUID | Optional pod restriction |
| created_at | TIMESTAMP | Creation time |
| updated_at | TIMESTAMP | Last update time |
| created_by | UUID | Creator user ID |

**Indexes:**
- `missions_status_idx` on status
- `missions_start_date_idx` on start_date
- `missions_pod_idx` on pod_id
- `missions_created_by_idx` on created_by

### mission_participation

Tracks user participation in missions.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| mission_id | UUID | Foreign key to missions |
| user_id | UUID | Foreign key to users |
| progress | INTEGER | Progress percentage (0-100) |
| completed_at | TIMESTAMP | Completion timestamp |
| xp_earned | INTEGER | XP earned |
| joined_at | TIMESTAMP | Join timestamp |

**Indexes:**
- `mission_participation_mission_user_idx` on (mission_id, user_id)
- `mission_participation_mission_idx` on mission_id
- `mission_participation_user_idx` on user_id
- `mission_participation_completed_idx` on completed_at

**Constraints:**
- Unique constraint on (mission_id, user_id)

### chat_messages

Pod chat messages.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| pod_id | UUID | Foreign key to pods |
| user_id | UUID | Foreign key to users |
| content | TEXT | Message content |
| message_type | VARCHAR(50) | Message type (text, image, file) |
| metadata | JSONB | Additional message data |
| is_edited | BOOLEAN | Edit status |
| edited_at | TIMESTAMP | Edit timestamp |
| created_at | TIMESTAMP | Creation time |

**Indexes:**
- `chat_messages_pod_idx` on pod_id
- `chat_messages_user_idx` on user_id
- `chat_messages_created_at_idx` on created_at

## Engagement Tables

### referrals

User referral system.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| referrer_id | UUID | Referring user ID |
| referred_id | UUID | Referred user ID |
| referral_code | VARCHAR(50) | Referral code used |
| status | VARCHAR(50) | Referral status |
| reward_xp | INTEGER | XP reward |
| completed_at | TIMESTAMP | Completion timestamp |
| created_at | TIMESTAMP | Creation time |

**Indexes:**
- `referrals_referrer_idx` on referrer_id
- `referrals_referred_idx` on referred_id
- `referrals_code_idx` on referral_code
- `referrals_status_idx` on status

### user_heartbeat

Activity tracking for analytics.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | Foreign key to users |
| activity_type | VARCHAR(50) | Activity type |
| metadata | JSONB | Activity metadata |
| timestamp | TIMESTAMP | Activity timestamp |

**Indexes:**
- `user_heartbeat_user_idx` on user_id
- `user_heartbeat_activity_idx` on activity_type
- `user_heartbeat_timestamp_idx` on timestamp

## Data Types and Constraints

### JSONB Fields

Several tables use JSONB for flexible data storage:

**curriculum_modules.tags**
\`\`\`json
["resilience", "mindset", "psychology"]
\`\`\`

**curriculum_modules.prerequisites**
\`\`\`json
["module-uuid-1", "module-uuid-2"]
\`\`\`

**achievements.criteria**
\`\`\`json
{
  "modulesCompleted": 5,
  "category": "resilience-building"
}
\`\`\`

**users.preferences**
\`\`\`json
{
  "language": "en",
  "notifications": {
    "email": true,
    "push": false
  },
  "theme": "dark"
}
\`\`\`

### Triggers

The schema includes automatic `updated_at` triggers for relevant tables:

\`\`\`sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';
\`\`\`

## Performance Considerations

### Indexing Strategy

1. **Primary Keys**: All tables use UUID primary keys
2. **Foreign Keys**: Indexed for join performance
3. **Query Patterns**: Indexes match common query patterns
4. **Composite Indexes**: Used for multi-column queries

### Query Optimization

1. Use Drizzle's query builder for type safety
2. Implement proper pagination for large datasets
3. Use database-level constraints for data integrity
4. Consider read replicas for analytics queries

## Migration Strategy

### Schema Changes

1. Always generate migrations for schema changes
2. Test migrations on development data first
3. Use transactions for complex migrations
4. Backup production data before major changes

### Data Migration

For data transformations:

\`\`\`sql
-- Example: Adding new column with default value
ALTER TABLE users ADD COLUMN new_field VARCHAR(50) DEFAULT 'default_value';

-- Update existing records if needed
UPDATE users SET new_field = 'calculated_value' WHERE condition;
\`\`\`

## Security Considerations

### Row Level Security (RLS)

Consider implementing RLS for multi-tenant scenarios:

\`\`\`sql
-- Enable RLS on sensitive tables
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY user_progress_policy ON user_progress
  FOR ALL TO authenticated_users
  USING (user_id = current_user_id());
\`\`\`

### Data Privacy

1. Hash sensitive data before storage
2. Implement proper access controls
3. Regular security audits
4. GDPR compliance for user data

## Backup and Recovery

### Backup Strategy

1. Daily automated backups
2. Point-in-time recovery capability
3. Cross-region backup replication
4. Regular restore testing

### Disaster Recovery

1. Database clustering for high availability
2. Automated failover procedures
3. Recovery time objectives (RTO) < 1 hour
4. Recovery point objectives (RPO) < 15 minutes

For more information on database operations, see the [Setup Guide](./setup.md).
\`\`\`
