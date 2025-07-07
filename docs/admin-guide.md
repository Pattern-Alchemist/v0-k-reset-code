# K-RESET Platform Admin Guide

This comprehensive guide covers all administrative functions and management tasks for the K-RESET platform.

## Getting Started

### Admin Access

Admin users have elevated permissions to manage:
- Curriculum content (modules, categories)
- User accounts and roles
- Community moderation
- Platform analytics
- System configuration

### Admin Dashboard

Access the admin dashboard at `/admin` after logging in with admin credentials.

**Key Metrics Displayed:**
- Total active users
- Module completion rates
- Community engagement stats
- Recent platform activity

## User Management

### User Roles

The platform supports three user roles:

1. **Student** - Default role for learners
   - Access curriculum modules
   - Join learning pods
   - Participate in missions
   - Earn achievements and XP

2. **Mentor** - Elevated permissions for content creators
   - All student permissions
   - Create and edit curriculum modules
   - Moderate learning pods
   - Access basic analytics

3. **Admin** - Full platform access
   - All mentor permissions
   - User management
   - System configuration
   - Advanced analytics
   - Content moderation

### Managing User Accounts

#### Viewing Users

\`\`\`sql
-- Get all users with their stats
SELECT 
  u.id,
  u.name,
  u.email,
  u.role,
  u.level,
  u.total_xp,
  u.current_streak,
  u.created_at,
  u.last_active_at
FROM users u
ORDER BY u.created_at DESC;
\`\`\`

#### Changing User Roles

\`\`\`sql
-- Promote user to mentor
UPDATE users 
SET role = 'mentor', updated_at = NOW()
WHERE email = 'user@example.com';

-- Promote user to admin
UPDATE users 
SET role = 'admin', updated_at = NOW()
WHERE email = 'admin@example.com';
\`\`\`

#### Deactivating Users

\`\`\`sql
-- Deactivate user account
UPDATE users 
SET is_active = false, updated_at = NOW()
WHERE email = 'user@example.com';
\`\`\`

### User Analytics

Monitor user engagement through the admin dashboard:

- **Active Users**: Daily, weekly, monthly active users
- **Retention Rates**: User retention over time
- **Learning Progress**: Average completion rates
- **Community Participation**: Pod and mission engagement

## Curriculum Management

### Module Management

#### Creating Modules

1. Navigate to Admin → Modules → Create New
2. Fill in required fields:
   - Title and description
   - Category selection
   - Difficulty level
   - Estimated completion time
   - XP reward value
   - Content (HTML supported)
3. Set prerequisites if needed
4. Add relevant tags
5. Save as draft or publish immediately

#### Module Status Workflow

\`\`\`
Draft → Review → Published → Archived
\`\`\`

- **Draft**: Work in progress, not visible to users
- **Review**: Ready for review (mentor/admin only)
- **Published**: Live and accessible to users
- **Archived**: Hidden but preserved for reference

#### Bulk Operations

\`\`\`sql
-- Publish multiple modules
UPDATE curriculum_modules 
SET status = 'published', updated_at = NOW()
WHERE id IN ('uuid1', 'uuid2', 'uuid3');

-- Archive old modules
UPDATE curriculum_modules 
SET status = 'archived', updated_at = NOW()
WHERE created_at < '2023-01-01' AND status = 'draft';
\`\`\`

### Category Management

#### Creating Categories

\`\`\`sql
-- Create new category
INSERT INTO curriculum_categories (
  name, 
  description, 
  slug, 
  color, 
  sort_order, 
  created_by
) VALUES (
  'New Category',
  'Description of the category',
  'new-category',
  '#3B82F6',
  10,
  'admin-user-id'
);
\`\`\`

#### Reordering Categories

\`\`\`sql
-- Update sort order
UPDATE curriculum_categories 
SET sort_order = 5, updated_at = NOW()
WHERE slug = 'category-slug';
\`\`\`

### Content Quality Guidelines

#### Module Content Standards

1. **Structure**: Clear headings, logical flow
2. **Length**: 20-60 minutes of content
3. **Interactivity**: Include reflection questions
4. **Accessibility**: Alt text for images, clear language
5. **Mobile-Friendly**: Responsive design considerations

#### Review Checklist

- [ ] Content is accurate and up-to-date
- [ ] Learning objectives are clear
- [ ] Difficulty level is appropriate
- [ ] XP reward matches content complexity
- [ ] Prerequisites are correctly set
- [ ] Tags are relevant and consistent
- [ ] Content follows style guidelines

## Community Moderation

### Learning Pods

#### Monitoring Pod Activity

\`\`\`sql
-- Get pod activity summary
SELECT 
  p.name,
  p.invite_code,
  COUNT(pm.user_id) as member_count,
  COUNT(cm.id) as message_count,
  MAX(cm.created_at) as last_message
FROM pods p
LEFT JOIN pod_members pm ON p.id = pm.pod_id AND pm.is_active = true
LEFT JOIN chat_messages cm ON p.id = cm.pod_id
GROUP BY p.id, p.name, p.invite_code
ORDER BY last_message DESC;
\`\`\`

#### Managing Problematic Pods

1. **Warning**: Send warning to pod leaders
2. **Temporary Suspension**: Disable pod temporarily
3. **Permanent Closure**: Archive pod and notify members

\`\`\`sql
-- Suspend pod
UPDATE pods 
SET is_active = false, updated_at = NOW()
WHERE id = 'pod-uuid';

-- Notify members (implement notification system)
\`\`\`

### Content Moderation

#### Reported Content Queue

The moderation queue shows:
- User reports
- Flagged content
- Automated moderation alerts

#### Moderation Actions

1. **Approve**: Content is acceptable
2. **Edit**: Modify content to meet guidelines
3. **Remove**: Delete inappropriate content
4. **Ban User**: Suspend user account

#### Moderation Guidelines

**Immediate Removal:**
- Hate speech or discrimination
- Harassment or bullying
- Spam or promotional content
- Inappropriate images or links

**Warning First:**
- Off-topic discussions
- Minor language issues
- Repeated questions

### Mission Management

#### Creating Group Missions

1. Define clear objectives
2. Set appropriate difficulty and rewards
3. Specify participation requirements
4. Set realistic timeframes
5. Monitor progress and engagement

\`\`\`sql
-- Create new mission
INSERT INTO missions (
  title,
  description,
  difficulty,
  xp_reward,
  max_participants,
  start_date,
  end_date,
  requirements,
  created_by
) VALUES (
  'New Challenge',
  'Complete 3 modules in resilience category',
  'Medium',
  300,
  50,
  '2024-02-01',
  '2024-02-29',
  '{"modulesInCategory": "resilience-building", "count": 3}',
  'admin-user-id'
);
\`\`\`

## Analytics and Reporting

### Key Performance Indicators (KPIs)

#### User Engagement
- Daily/Weekly/Monthly Active Users
- Session duration
- Module completion rates
- Community participation rates

#### Learning Outcomes
- Average XP per user
- Module difficulty progression
- Achievement unlock rates
- Learning streak statistics

#### Community Health
- Pod creation and activity rates
- Message volume and engagement
- Mission participation rates
- User retention in communities

### Custom Reports

#### Module Performance Report

\`\`\`sql
-- Module completion and engagement stats
SELECT 
  cm.title,
  cm.difficulty,
  cm.xp_reward,
  COUNT(up.user_id) as total_attempts,
  COUNT(CASE WHEN up.progress = 100 THEN 1 END) as completions,
  ROUND(AVG(up.progress), 2) as avg_progress,
  ROUND(AVG(up.time_spent), 2) as avg_time_minutes
FROM curriculum_modules cm
LEFT JOIN user_progress up ON cm.id = up.module_id
WHERE cm.status = 'published'
GROUP BY cm.id, cm.title, cm.difficulty, cm.xp_reward
ORDER BY completions DESC;
\`\`\`

#### User Engagement Report

\`\`\`sql
-- User activity and progress summary
SELECT 
  u.name,
  u.level,
  u.total_xp,
  u.current_streak,
  COUNT(up.module_id) as modules_attempted,
  COUNT(CASE WHEN up.progress = 100 THEN 1 END) as modules_completed,
  COUNT(pm.pod_id) as pods_joined,
  u.last_active_at
FROM users u
LEFT JOIN user_progress up ON u.id = up.user_id
LEFT JOIN pod_members pm ON u.id = pm.user_id AND pm.is_active = true
WHERE u.role = 'student' AND u.is_active = true
GROUP BY u.id, u.name, u.level, u.total_xp, u.current_streak, u.last_active_at
ORDER BY u.total_xp DESC;
\`\`\`

### Data Export

#### User Data Export (GDPR Compliance)

\`\`\`sql
-- Export all user data for GDPR request
SELECT 
  u.*,
  json_agg(DISTINCT up.*) as progress_data,
  json_agg(DISTINCT ua.*) as achievement_data,
  json_agg(DISTINCT pm.*) as pod_memberships,
  json_agg(DISTINCT cm.*) as chat_messages
FROM users u
LEFT JOIN user_progress up ON u.id = up.user_id
LEFT JOIN user_achievements ua ON u.id = ua.user_id
LEFT JOIN pod_members pm ON u.id = pm.user_id
LEFT JOIN chat_messages cm ON u.id = cm.user_id
WHERE u.email = 'user@example.com'
GROUP BY u.id;
\`\`\`

## System Configuration

### Platform Settings

#### Gamification Settings

\`\`\`sql
-- Update XP requirements for levels
UPDATE system_settings 
SET value = '{"1": 0, "2": 100, "3": 250, "4": 500, "5": 1000}'
WHERE key = 'level_xp_requirements';

-- Update achievement XP multipliers
UPDATE system_settings 
SET value = '{"learning": 1.0, "streak": 1.5, "community": 1.2}'
WHERE key = 'achievement_xp_multipliers';
\`\`\`

#### Content Settings

\`\`\`sql
-- Set default module XP rewards by difficulty
UPDATE system_settings 
SET value = '{"Beginner": 100, "Intermediate": 150, "Advanced": 200}'
WHERE key = 'default_module_xp';
\`\`\`

### Feature Flags

Enable/disable platform features:

\`\`\`sql
-- Enable/disable features
UPDATE system_settings SET value = 'true' WHERE key = 'enable_ai_insights';
UPDATE system_settings SET value = 'false' WHERE key = 'enable_whatsapp_integration';
UPDATE system_settings SET value = 'true' WHERE key = 'enable_pdf_export';
\`\`\`

### Backup and Maintenance

#### Database Backup

\`\`\`bash
# Create backup
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore from backup
psql $DATABASE_URL < backup_file.sql
\`\`\`

#### Maintenance Tasks

**Weekly Tasks:**
- Review moderation queue
- Check system performance metrics
- Update featured content
- Review user feedback

**Monthly Tasks:**
- Analyze user engagement trends
- Review and update content
- Plan new features based on usage data
- Update documentation

## Troubleshooting

### Common Issues

#### Users Can't Access Modules

1. Check module status (must be 'published')
2. Verify user account is active
3. Check prerequisites are met
4. Review user role permissions

\`\`\`sql
-- Debug module access
SELECT 
  cm.title,
  cm.status,
  u.name,
  u.is_active,
  u.role
FROM curriculum_modules cm, users u
WHERE cm.id = 'module-uuid' AND u.id = 'user-uuid';
\`\`\`

#### Pod Chat Not Working

1. Verify pod is active
2. Check user is pod member
3. Review chat permissions
4. Check for technical issues

\`\`\`sql
-- Debug pod membership
SELECT 
  p.name,
  p.is_active,
  pm.role,
  pm.is_active as member_active,
  u.name as user_name
FROM pods p
JOIN pod_members pm ON p.id = pm.pod_id
JOIN users u ON pm.user_id = u.id
WHERE p.id = 'pod-uuid' AND u.id = 'user-uuid';
\`\`\`

#### Achievement Not Unlocking

1. Check achievement criteria
2. Verify user meets requirements
3. Review achievement status
4. Check for system errors

\`\`\`sql
-- Debug achievement progress
SELECT 
  a.name,
  a.criteria,
  ua.progress,
  ua.unlocked_at
FROM achievements a
LEFT JOIN user_achievements ua ON a.id = ua.achievement_id AND ua.user_id = 'user-uuid'
WHERE a.id = 'achievement-uuid';
\`\`\`

### Performance Issues

#### Slow Query Identification

\`\`\`sql
-- Find slow queries (PostgreSQL)
SELECT 
  query,
  calls,
  total_time,
  mean_time,
  rows
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;
\`\`\`

#### Database Optimization

1. **Index Analysis**: Review query plans
2. **Connection Pooling**: Optimize database connections
3. **Query Optimization**: Rewrite inefficient queries
4. **Caching**: Implement Redis for frequently accessed data

### Emergency Procedures

#### Platform Outage

1. **Immediate Response**
   - Check system status
   - Identify root cause
   - Implement temporary fixes

2. **Communication**
   - Update status page
   - Notify users via email/social media
   - Provide regular updates

3. **Resolution**
   - Apply permanent fix
   - Test thoroughly
   - Monitor for issues

#### Data Breach Response

1. **Immediate Actions**
   - Isolate affected systems
   - Preserve evidence
   - Assess scope of breach

2. **Notification**
   - Notify relevant authorities
   - Inform affected users
   - Document incident

3. **Recovery**
   - Implement security fixes
   - Monitor for further issues
   - Review and improve security measures

## Best Practices

### Content Management

1. **Regular Reviews**: Update content quarterly
2. **User Feedback**: Incorporate learner suggestions
3. **Quality Assurance**: Test all new content
4. **Version Control**: Track content changes

### Community Management

1. **Active Moderation**: Regular queue reviews
2. **Clear Guidelines**: Publish community rules
3. **Positive Reinforcement**: Recognize good behavior
4. **Escalation Procedures**: Handle serious issues promptly

### System Administration

1. **Regular Backups**: Automated daily backups
2. **Security Updates**: Keep systems current
3. **Performance Monitoring**: Track key metrics
4. **Documentation**: Maintain current procedures

For technical setup and development information, see the [Setup Guide](./
