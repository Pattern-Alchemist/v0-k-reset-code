import { db } from "../app/lib/db"
import {
  organizations,
  users,
  curriculumCategories,
  curriculumModules,
  achievements,
  pods,
  missions,
  userProgress,
  userAchievements,
  podMembers,
  missionParticipation,
  chatChannels,
  chatMessages,
  notifications,
  systemSettings,
  referrals,
} from "../app/lib/db/schema"
import { generateInviteCode, generateReferralCode } from "../app/lib/utils"
import { eq } from "drizzle-orm"

/**
 * Database Seeding Script for K-RESET Platform
 *
 * This script populates the database with sample data for development and testing.
 * It's designed to be idempotent - running it multiple times won't create duplicates.
 *
 * Usage: npm run db:seed
 */

async function seed() {
  console.log("🌱 Starting database seed...")

  try {
    // Get or create default organization
    let org = await db.select().from(organizations).where(eq(organizations.slug, "k-reset-global")).limit(1)

    if (org.length === 0) {
      const newOrg = await db
        .insert(organizations)
        .values({
          name: "K-RESET Global",
          slug: "k-reset-global",
          description: "Global K-RESET learning community",
          plan: "enterprise",
          settings: {
            features: {
              ai_insights: true,
              advanced_analytics: true,
              custom_branding: true,
              api_access: true,
            },
            limits: {
              max_users: 10000,
              max_modules: 1000,
              max_pods: 500,
            },
          },
        })
        .returning()
      org = newOrg
    }

    const orgId = org[0].id

    // Create admin user
    const adminUser = await db
      .insert(users)
      .values({
        organizationId: orgId,
        email: "admin@k-reset.org",
        username: "admin",
        name: "K-RESET Admin",
        role: "admin",
        level: 10,
        currentXP: 10000,
        totalXP: 10000,
        permissions: ["all"],
        isVerified: true,
        preferences: {
          theme: "dark",
          notifications: {
            email: true,
            push: true,
            in_app: true,
          },
        },
      })
      .returning()

    // Create mentor users
    const mentorUsers = await db
      .insert(users)
      .values([
        {
          organizationId: orgId,
          email: "mentor1@k-reset.org",
          username: "mentor_sarah",
          name: "Sarah Johnson",
          role: "mentor",
          level: 8,
          currentXP: 7500,
          totalXP: 7500,
          bio: "Leadership coach with 10+ years experience in resilience training",
          permissions: ["moderate_content", "manage_pods", "view_analytics"],
          isVerified: true,
        },
        {
          organizationId: orgId,
          email: "mentor2@k-reset.org",
          username: "mentor_david",
          name: "David Chen",
          role: "mentor",
          level: 7,
          currentXP: 6200,
          totalXP: 6200,
          bio: "Mental health advocate and peer learning specialist",
          permissions: ["moderate_content", "manage_pods"],
          isVerified: true,
        },
      ])
      .returning()

    // Create student users
    const studentUsers = await db
      .insert(users)
      .values([
        {
          organizationId: orgId,
          email: "student1@example.com",
          username: "alex_learner",
          name: "Alex Rivera",
          level: 3,
          currentXP: 2400,
          totalXP: 2400,
          currentStreak: 7,
          longestStreak: 12,
          isVerified: true,
        },
        {
          organizationId: orgId,
          email: "student2@example.com",
          username: "jamie_growth",
          name: "Jamie Thompson",
          level: 4,
          currentXP: 3100,
          totalXP: 3100,
          currentStreak: 3,
          longestStreak: 8,
          isVerified: true,
        },
        {
          organizationId: orgId,
          email: "student3@example.com",
          username: "sam_resilient",
          name: "Sam Patel",
          level: 2,
          currentXP: 1800,
          totalXP: 1800,
          currentStreak: 1,
          longestStreak: 5,
          isVerified: true,
        },
        {
          organizationId: orgId,
          email: "student4@example.com",
          username: "taylor_strong",
          name: "Taylor Kim",
          level: 5,
          currentXP: 4200,
          totalXP: 4200,
          currentStreak: 14,
          longestStreak: 20,
          isVerified: true,
        },
      ])
      .returning()

    // Create curriculum categories
    const categories = await db
      .insert(curriculumCategories)
      .values([
        {
          organizationId: orgId,
          name: "Resilience Fundamentals",
          description: "Core concepts and practices for building personal resilience",
          slug: "resilience-fundamentals",
          color: "#3B82F6",
          icon: "shield",
          sortOrder: 1,
          createdBy: adminUser[0].id,
        },
        {
          organizationId: orgId,
          name: "Leadership Development",
          description: "Essential leadership skills and mindsets",
          slug: "leadership-development",
          color: "#8B5CF6",
          icon: "crown",
          sortOrder: 2,
          createdBy: adminUser[0].id,
        },
        {
          organizationId: orgId,
          name: "Emotional Intelligence",
          description: "Understanding and managing emotions effectively",
          slug: "emotional-intelligence",
          color: "#10B981",
          icon: "heart",
          sortOrder: 3,
          createdBy: adminUser[0].id,
        },
        {
          organizationId: orgId,
          name: "Communication Skills",
          description: "Effective communication in various contexts",
          slug: "communication-skills",
          color: "#F59E0B",
          icon: "message-circle",
          sortOrder: 4,
          createdBy: adminUser[0].id,
        },
        {
          organizationId: orgId,
          name: "Stress Management",
          description: "Techniques for managing stress and maintaining well-being",
          slug: "stress-management",
          color: "#EF4444",
          icon: "activity",
          sortOrder: 5,
          createdBy: adminUser[0].id,
        },
      ])
      .returning()

    // Create curriculum modules
    const modules = await db
      .insert(curriculumModules)
      .values([
        // Resilience Fundamentals
        {
          organizationId: orgId,
          categoryId: categories[0].id,
          title: "Introduction to Resilience",
          description: "Learn the fundamental concepts of resilience and why it matters in today's world",
          content: `# Introduction to Resilience

## What is Resilience?

Resilience is the ability to bounce back from adversity, adapt to change, and grow stronger through challenges. It's not about avoiding difficulties, but rather developing the skills and mindset to navigate them effectively.

## Key Components of Resilience

1. **Mental Flexibility** - The ability to adapt your thinking when faced with new situations
2. **Emotional Regulation** - Managing your emotions in healthy ways
3. **Social Connection** - Building and maintaining supportive relationships
4. **Self-Efficacy** - Believing in your ability to handle challenges
5. **Meaning-Making** - Finding purpose and meaning in difficult experiences

## Why Resilience Matters

In our rapidly changing world, resilience is essential for:
- Personal well-being and mental health
- Professional success and adaptability
- Building stronger communities
- Creating positive change in the world

## Building Your Resilience

Resilience is not a fixed trait - it can be developed and strengthened through practice and intentional effort.`,
          difficulty: "beginner",
          estimatedTime: 30,
          tags: ["resilience", "fundamentals", "introduction"],
          xpReward: 100,
          status: "published",
          publishedAt: new Date(),
          createdBy: adminUser[0].id,
        },
        {
          organizationId: orgId,
          categoryId: categories[0].id,
          title: "Building Mental Toughness",
          description: "Develop the mental strength to persevere through challenges and setbacks",
          content: `# Building Mental Toughness

Mental toughness is the ability to maintain focus, determination, and confidence in the face of adversity. It's a crucial component of resilience that can be developed through specific practices and mindset shifts.

## The Four Pillars of Mental Toughness

### 1. Control
Focus on what you can control and let go of what you cannot. This includes:
- Your thoughts and reactions
- Your effort and preparation
- Your choices and decisions

### 2. Commitment
Stay dedicated to your goals and values, even when things get difficult:
- Set clear, meaningful goals
- Develop consistent habits
- Maintain your standards

### 3. Challenge
View obstacles as opportunities for growth:
- Embrace discomfort as a path to improvement
- Learn from failures and setbacks
- Seek out new challenges

### 4. Confidence
Believe in your ability to succeed:
- Build on past successes
- Develop your skills and knowledge
- Practice positive self-talk

## Practical Exercises

1. **Daily Reflection**: Each evening, identify three things you controlled well that day
2. **Challenge Reframing**: When facing a difficulty, ask "How can this help me grow?"
3. **Confidence Building**: Keep a journal of your achievements and progress`,
          difficulty: "intermediate",
          estimatedTime: 45,
          tags: ["mental-toughness", "resilience", "mindset"],
          xpReward: 150,
          status: "published",
          publishedAt: new Date(),
          createdBy: mentorUsers[0].id,
        },
        // Leadership Development
        {
          organizationId: orgId,
          categoryId: categories[1].id,
          title: "Leadership Fundamentals",
          description: "Core principles and practices of effective leadership",
          content: `# Leadership Fundamentals

Leadership is not about position or authority - it's about influence, service, and creating positive change. Every person has the potential to be a leader in their own sphere of influence.

## What Makes a Great Leader?

### Vision
- Clear sense of direction and purpose
- Ability to communicate that vision to others
- Inspiring others to work toward common goals

### Integrity
- Consistency between values and actions
- Honesty and transparency in all dealings
- Building trust through reliable behavior

### Empathy
- Understanding and caring about others
- Listening actively and attentively
- Considering different perspectives

### Adaptability
- Flexibility in approach and strategy
- Learning from mistakes and feedback
- Embracing change and innovation

## Leadership Styles

Different situations call for different leadership approaches:

1. **Servant Leadership** - Leading by serving others
2. **Transformational Leadership** - Inspiring and motivating change
3. **Situational Leadership** - Adapting style to the situation
4. **Authentic Leadership** - Leading from your true self

## Developing Your Leadership Skills

- Practice self-awareness and reflection
- Seek feedback from others
- Take on leadership opportunities
- Learn from other leaders
- Commit to continuous growth`,
          difficulty: "beginner",
          estimatedTime: 40,
          tags: ["leadership", "fundamentals", "influence"],
          xpReward: 120,
          status: "published",
          publishedAt: new Date(),
          createdBy: mentorUsers[1].id,
        },
        // Emotional Intelligence
        {
          organizationId: orgId,
          categoryId: categories[2].id,
          title: "Understanding Emotions",
          description: "Learn to recognize, understand, and manage your emotions effectively",
          content: `# Understanding Emotions

Emotional intelligence is the ability to recognize, understand, and manage our own emotions while effectively recognizing and responding to others' emotions.

## The Four Domains of Emotional Intelligence

### 1. Self-Awareness
- Recognizing your emotions as they occur
- Understanding your emotional triggers
- Knowing your strengths and limitations

### 2. Self-Management
- Managing disruptive emotions and impulses
- Adapting to change
- Maintaining optimism despite setbacks

### 3. Social Awareness
- Reading others' emotions accurately
- Understanding organizational dynamics
- Showing empathy and concern for others

### 4. Relationship Management
- Communicating clearly and persuasively
- Managing conflict effectively
- Building bonds and teamwork

## The Science of Emotions

Emotions serve important functions:
- They provide information about our environment
- They motivate action and behavior
- They help us communicate with others
- They influence our decision-making

## Practical Strategies

### Emotion Regulation Techniques
1. **Pause and Breathe** - Take a moment before reacting
2. **Name It to Tame It** - Label your emotions specifically
3. **Reframe** - Look for alternative perspectives
4. **Body Awareness** - Notice physical sensations

### Building Empathy
- Practice active listening
- Ask open-ended questions
- Observe non-verbal cues
- Suspend judgment`,
          difficulty: "intermediate",
          estimatedTime: 35,
          tags: ["emotional-intelligence", "self-awareness", "empathy"],
          xpReward: 130,
          status: "published",
          publishedAt: new Date(),
          createdBy: adminUser[0].id,
        },
        // Communication Skills
        {
          organizationId: orgId,
          categoryId: categories[3].id,
          title: "Active Listening Mastery",
          description: "Master the art of truly hearing and understanding others",
          content: `# Active Listening Mastery

Active listening is one of the most powerful communication skills you can develop. It goes beyond simply hearing words - it involves fully engaging with the speaker to understand their message, emotions, and perspective.

## What is Active Listening?

Active listening is a communication technique that requires the listener to:
- Give full attention to the speaker
- Understand the complete message
- Respond thoughtfully and appropriately
- Remember what was said

## The Benefits of Active Listening

### For Relationships
- Builds trust and rapport
- Reduces misunderstandings
- Shows respect and care
- Strengthens emotional connections

### For Learning
- Improves comprehension
- Helps retain information
- Encourages deeper thinking
- Facilitates problem-solving

### For Leadership
- Increases team engagement
- Improves decision-making
- Builds psychological safety
- Enhances collaboration

## Key Active Listening Techniques

### 1. Give Full Attention
- Put away distractions (phone, computer)
- Make appropriate eye contact
- Use open body language
- Face the speaker

### 2. Show You're Listening
- Nod and use verbal affirmations ("mm-hmm", "I see")
- Lean in slightly
- Mirror the speaker's emotions appropriately
- Avoid interrupting

### 3. Provide Feedback
- **Paraphrasing**: "What I hear you saying is..."
- **Reflecting**: "It sounds like you're feeling..."
- **Clarifying**: "Can you help me understand..."
- **Summarizing**: "Let me make sure I've got this right..."

### 4. Defer Judgment
- Avoid forming responses while listening
- Don't jump to conclusions
- Stay curious rather than critical
- Ask questions to understand, not to challenge

## Common Listening Barriers

- **Internal distractions** - Your own thoughts and concerns
- **External distractions** - Noise, interruptions, environment
- **Emotional reactions** - Strong feelings about the topic
- **Assumptions** - Thinking you know what they'll say
- **Solution focus** - Jumping to fix rather than understand

## Practice Exercises

1. **Daily Practice**: Choose one conversation each day to practice active listening
2. **Reflection Exercise**: After important conversations, reflect on how well you listened
3. **Feedback Seeking**: Ask others how they experience your listening
4. **Mindful Listening**: Practice listening to sounds in your environment without judgment`,
          difficulty: "beginner",
          estimatedTime: 25,
          tags: ["communication", "listening", "relationships"],
          xpReward: 110,
          status: "published",
          publishedAt: new Date(),
          createdBy: mentorUsers[0].id,
        },
        // Stress Management
        {
          organizationId: orgId,
          categoryId: categories[4].id,
          title: "Stress and the Body",
          description: "Understand how stress affects your body and learn techniques to manage it",
          content: `# Stress and the Body

Understanding the physiological impact of stress is crucial for developing effective management strategies. When we know how stress affects our body, we can take targeted action to protect our health and well-being.

## The Stress Response System

### Fight-or-Flight Response
When we perceive a threat, our body activates the sympathetic nervous system:
- Heart rate increases
- Breathing becomes shallow and rapid
- Muscles tense
- Stress hormones (cortisol, adrenaline) are released
- Blood flow redirects to major muscle groups

### The Problem with Chronic Stress
While the stress response is helpful in acute situations, chronic activation can lead to:
- Weakened immune system
- Digestive problems
- Sleep disturbances
- Cardiovascular issues
- Mental health challenges

## Physical Signs of Stress

### Immediate Signs
- Rapid heartbeat
- Sweating
- Muscle tension
- Shallow breathing
- Stomach upset

### Long-term Signs
- Frequent headaches
- Chronic fatigue
- Changes in appetite
- Sleep problems
- Frequent illness

## Stress Management Techniques

### 1. Breathing Exercises
**4-7-8 Breathing**:
- Inhale for 4 counts
- Hold for 7 counts
- Exhale for 8 counts
- Repeat 3-4 times

**Box Breathing**:
- Inhale for 4 counts
- Hold for 4 counts
- Exhale for 4 counts
- Hold for 4 counts

### 2. Progressive Muscle Relaxation
- Start with your toes and work up
- Tense each muscle group for 5 seconds
- Release and notice the relaxation
- Move systematically through your body

### 3. Physical Activity
- Regular exercise reduces stress hormones
- Aim for 30 minutes of moderate activity daily
- Find activities you enjoy
- Include both cardio and strength training

### 4. Mindfulness and Meditation
- Practice present-moment awareness
- Start with 5-10 minutes daily
- Use guided meditations if helpful
- Focus on breath or body sensations

## Creating Your Stress Management Plan

1. **Identify Your Stressors**: What situations trigger stress for you?
2. **Recognize Your Signs**: How does stress show up in your body?
3. **Choose Your Tools**: Which techniques work best for you?
4. **Practice Regularly**: Build stress management into your daily routine
5. **Seek Support**: Don't hesitate to reach out for help when needed`,
          difficulty: "beginner",
          estimatedTime: 30,
          tags: ["stress-management", "health", "wellness"],
          xpReward: 100,
          status: "published",
          publishedAt: new Date(),
          createdBy: mentorUsers[1].id,
        },
      ])
      .returning()

    // Create achievements
    const achievementsList = await db
      .insert(achievements)
      .values([
        {
          organizationId: orgId,
          name: "First Steps",
          description: "Complete your first learning module",
          category: "learning",
          icon: "star",
          color: "#FFD700",
          rarity: "common",
          xpReward: 50,
          criteria: { type: "modules_completed", value: 1 },
          createdBy: adminUser[0].id,
        },
        {
          organizationId: orgId,
          name: "Knowledge Seeker",
          description: "Complete 5 learning modules",
          category: "learning",
          icon: "book",
          color: "#3B82F6",
          rarity: "uncommon",
          xpReward: 100,
          criteria: { type: "modules_completed", value: 5 },
          createdBy: adminUser[0].id,
        },
        {
          organizationId: orgId,
          name: "Resilience Builder",
          description: "Complete all modules in Resilience Fundamentals",
          category: "category",
          icon: "shield",
          color: "#10B981",
          rarity: "rare",
          xpReward: 200,
          criteria: { type: "category_completed", value: categories[0].id },
          createdBy: adminUser[0].id,
        },
        {
          organizationId: orgId,
          name: "Streak Master",
          description: "Maintain a 7-day learning streak",
          category: "engagement",
          icon: "flame",
          color: "#EF4444",
          rarity: "uncommon",
          xpReward: 150,
          criteria: { type: "streak", value: 7 },
          createdBy: adminUser[0].id,
        },
        {
          organizationId: orgId,
          name: "Community Builder",
          description: "Create your first learning pod",
          category: "community",
          icon: "users",
          color: "#8B5CF6",
          rarity: "uncommon",
          xpReward: 100,
          criteria: { type: "pods_created", value: 1 },
          createdBy: adminUser[0].id,
        },
        {
          organizationId: orgId,
          name: "Mission Accomplished",
          description: "Complete your first mission",
          category: "missions",
          icon: "target",
          color: "#F59E0B",
          rarity: "common",
          xpReward: 75,
          criteria: { type: "missions_completed", value: 1 },
          createdBy: adminUser[0].id,
        },
      ])
      .returning()

    // Create learning pods
    const podsList = await db
      .insert(pods)
      .values([
        {
          organizationId: orgId,
          name: "Resilience Warriors",
          description: "A supportive community focused on building personal resilience and mental toughness",
          inviteCode: generateInviteCode(),
          isPublic: true,
          maxMembers: 15,
          memberCount: 4,
          createdBy: mentorUsers[0].id,
        },
        {
          organizationId: orgId,
          name: "Future Leaders",
          description: "Developing the next generation of ethical and effective leaders",
          inviteCode: generateInviteCode(),
          isPublic: true,
          maxMembers: 12,
          memberCount: 3,
          createdBy: mentorUsers[1].id,
        },
        {
          organizationId: orgId,
          name: "Mindful Communicators",
          description: "Practicing and improving communication skills through mindful interaction",
          inviteCode: generateInviteCode(),
          isPublic: false,
          requiresApproval: true,
          maxMembers: 8,
          memberCount: 2,
          createdBy: studentUsers[0].id,
        },
      ])
      .returning()

    // Add pod members
    await db.insert(podMembers).values([
      // Resilience Warriors
      { podId: podsList[0].id, userId: mentorUsers[0].id, role: "leader" },
      { podId: podsList[0].id, userId: studentUsers[0].id, role: "member" },
      { podId: podsList[0].id, userId: studentUsers[1].id, role: "member" },
      { podId: podsList[0].id, userId: studentUsers[2].id, role: "member" },

      // Future Leaders
      { podId: podsList[1].id, userId: mentorUsers[1].id, role: "leader" },
      { podId: podsList[1].id, userId: studentUsers[1].id, role: "moderator" },
      { podId: podsList[1].id, userId: studentUsers[3].id, role: "member" },

      // Mindful Communicators
      { podId: podsList[2].id, userId: studentUsers[0].id, role: "leader" },
      { podId: podsList[2].id, userId: studentUsers[2].id, role: "member" },
    ])

    // Create chat channels for pods
    const channels = await db
      .insert(chatChannels)
      .values([
        {
          podId: podsList[0].id,
          name: "general",
          description: "General discussion for Resilience Warriors",
          type: "general",
          createdBy: mentorUsers[0].id,
        },
        {
          podId: podsList[0].id,
          name: "resources",
          description: "Share helpful resources and tools",
          type: "resources",
          createdBy: mentorUsers[0].id,
        },
        {
          podId: podsList[1].id,
          name: "general",
          description: "General discussion for Future Leaders",
          type: "general",
          createdBy: mentorUsers[1].id,
        },
        {
          podId: podsList[2].id,
          name: "practice",
          description: "Practice communication exercises",
          type: "practice",
          createdBy: studentUsers[0].id,
        },
      ])
      .returning()

    // Create some chat messages
    await db.insert(chatMessages).values([
      {
        channelId: channels[0].id,
        userId: mentorUsers[0].id,
        content: "Welcome to Resilience Warriors! Let's support each other on this journey.",
        messageType: "text",
      },
      {
        channelId: channels[0].id,
        userId: studentUsers[0].id,
        content: "Excited to be here! Just completed the Introduction to Resilience module.",
        messageType: "text",
      },
      {
        channelId: channels[0].id,
        userId: studentUsers[1].id,
        content: "That's awesome! I found the mental toughness section really helpful.",
        messageType: "text",
      },
    ])

    // Create missions
    const missionsList = await db
      .insert(missions)
      .values([
        {
          organizationId: orgId,
          title: "7-Day Resilience Challenge",
          description: "Build your resilience through daily practices and reflection",
          instructions: `Complete one resilience-building activity each day for 7 days:

Day 1: Practice gratitude - Write down 3 things you're grateful for
Day 2: Physical challenge - Do something that pushes your comfort zone
Day 3: Mindfulness - Spend 10 minutes in meditation or deep breathing
Day 4: Connection - Reach out to someone you care about
Day 5: Learning - Read or watch something that inspires you
Day 6: Service - Do something kind for someone else
Day 7: Reflection - Journal about your week and what you learned

Share your daily progress in your pod's chat channel.`,
          type: "challenge",
          difficulty: "beginner",
          category: "resilience",
          xpReward: 300,
          maxParticipants: 50,
          minParticipants: 1,
          status: "active",
          startDate: new Date(),
          endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
          registrationDeadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
          podId: podsList[0].id,
          createdBy: mentorUsers[0].id,
        },
        {
          organizationId: orgId,
          title: "Leadership in Action",
          description: "Practice leadership skills in real-world scenarios",
          instructions: `Choose one leadership opportunity to pursue this month:

Options:
1. Organize a study group or learning session
2. Volunteer to lead a project at work or school
3. Mentor someone who is newer to the platform
4. Start a new initiative in your community
5. Lead a discussion in your pod

Document your experience and share what you learned about leadership.`,
          type: "project",
          difficulty: "intermediate",
          category: "leadership",
          xpReward: 500,
          maxParticipants: 25,
          minParticipants: 1,
          status: "active",
          startDate: new Date(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
          registrationDeadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
          podId: podsList[1].id,
          createdBy: mentorUsers[1].id,
        },
        {
          organizationId: orgId,
          title: "Communication Mastery Workshop",
          description: "Intensive workshop to improve communication skills",
          instructions: `This is a team-based mission where pods work together to:

1. Practice active listening exercises
2. Role-play difficult conversations
3. Give and receive constructive feedback
4. Present a group project on effective communication

Teams will be formed from participating pods. Each team must have 3-5 members.`,
          type: "workshop",
          difficulty: "advanced",
          category: "communication",
          xpReward: 750,
          maxParticipants: 20,
          minParticipants: 6,
          isTeamBased: true,
          status: "upcoming",
          startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
          endDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 21 days from now
          registrationDeadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
          createdBy: adminUser[0].id,
        },
      ])
      .returning()

    // Create mission participation
    await db.insert(missionParticipation).values([
      {
        missionId: missionsList[0].id,
        userId: studentUsers[0].id,
        status: "active",
        progress: 3,
        registeredAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        startedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      },
      {
        missionId: missionsList[0].id,
        userId: studentUsers[1].id,
        status: "active",
        progress: 2,
        registeredAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        startedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        missionId: missionsList[1].id,
        userId: studentUsers[1].id,
        status: "registered",
        progress: 0,
        registeredAt: new Date(),
      },
      {
        missionId: missionsList[1].id,
        userId: studentUsers[3].id,
        status: "registered",
        progress: 0,
        registeredAt: new Date(),
      },
    ])

    // Create user progress
    await db.insert(userProgress).values([
      {
        userId: studentUsers[0].id,
        moduleId: modules[0].id,
        progress: 100,
        completedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        timeSpent: 35,
        sessionCount: 2,
        xpEarned: 100,
        rating: 5,
        journalEntry:
          "This module really helped me understand what resilience means. I never realized it was something I could actively develop.",
      },
      {
        userId: studentUsers[0].id,
        moduleId: modules[1].id,
        progress: 75,
        timeSpent: 28,
        sessionCount: 2,
        xpEarned: 0,
        lastSessionAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
      {
        userId: studentUsers[1].id,
        moduleId: modules[0].id,
        progress: 100,
        completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        timeSpent: 32,
        sessionCount: 1,
        xpEarned: 100,
        rating: 4,
      },
      {
        userId: studentUsers[1].id,
        moduleId: modules[2].id,
        progress: 100,
        completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        timeSpent: 42,
        sessionCount: 2,
        xpEarned: 120,
        rating: 5,
        journalEntry:
          "Leadership isn't about being in charge - it's about taking care of those in your charge. This really resonated with me.",
      },
      {
        userId: studentUsers[2].id,
        moduleId: modules[0].id,
        progress: 100,
        completedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        timeSpent: 38,
        sessionCount: 3,
        xpEarned: 100,
        rating: 4,
      },
      {
        userId: studentUsers[3].id,
        moduleId: modules[0].id,
        progress: 100,
        completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        timeSpent: 29,
        sessionCount: 1,
        xpEarned: 100,
        rating: 5,
      },
      {
        userId: studentUsers[3].id,
        moduleId: modules[2].id,
        progress: 60,
        timeSpent: 25,
        sessionCount: 2,
        xpEarned: 0,
        lastSessionAt: new Date(),
      },
    ])

    // Create user achievements
    await db.insert(userAchievements).values([
      {
        userId: studentUsers[0].id,
        achievementId: achievementsList[0].id,
        progress: 100,
        unlockedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        notifiedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
      {
        userId: studentUsers[1].id,
        achievementId: achievementsList[0].id,
        progress: 100,
        unlockedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        notifiedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      },
      {
        userId: studentUsers[2].id,
        achievementId: achievementsList[0].id,
        progress: 100,
        unlockedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        notifiedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
      {
        userId: studentUsers[3].id,
        achievementId: achievementsList[0].id,
        progress: 100,
        unlockedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        notifiedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        userId: studentUsers[0].id,
        achievementId: achievementsList[4].id,
        progress: 100,
        unlockedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        notifiedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      },
    ])

    // Create notifications
    await db.insert(notifications).values([
      {
        userId: studentUsers[0].id,
        type: "achievement_unlocked",
        title: "Achievement Unlocked!",
        message: "Congratulations! You've earned the 'First Steps' achievement.",
        icon: "star",
        actionUrl: "/progress",
        actionText: "View Progress",
        isRead: true,
        readAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
      {
        userId: studentUsers[0].id,
        type: "mission_reminder",
        title: "Mission Update",
        message: "Don't forget to complete today's resilience challenge!",
        icon: "target",
        actionUrl: "/community/missions",
        actionText: "View Mission",
        isRead: false,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      },
      {
        userId: studentUsers[1].id,
        type: "pod_message",
        title: "New Pod Message",
        message: "Sarah Johnson posted a new message in Resilience Warriors",
        icon: "message-circle",
        actionUrl: "/community/pods",
        actionText: "View Pod",
        isRead: false,
        createdAt: new Date(Date.now() - 30 * 60 * 1000),
      },
    ])

    // Create referrals
    await db.insert(referrals).values([
      {
        organizationId: orgId,
        referrerId: studentUsers[0].id,
        referralCode: generateReferralCode(),
        status: "pending",
        referrerReward: 500,
        referredReward: 250,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        source: "direct_link",
      },
      {
        organizationId: orgId,
        referrerId: studentUsers[1].id,
        referredId: studentUsers[2].id,
        referralCode: generateReferralCode(),
        status: "completed",
        referrerReward: 500,
        referredReward: 250,
        completedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        source: "social_media",
      },
    ])

    // Create system settings
    await db.insert(systemSettings).values([
      {
        organizationId: orgId,
        key: "platform_settings",
        value: {
          maintenance_mode: false,
          registration_enabled: true,
          max_pod_size: 20,
          default_xp_rewards: {
            module_completion: 100,
            mission_completion: 200,
            daily_login: 10,
            pod_creation: 50,
          },
        },
        type: "json",
        description: "Core platform configuration settings",
        category: "platform",
        isPublic: false,
        updatedBy: adminUser[0].id,
      },
      {
        organizationId: orgId,
        key: "gamification_settings",
        value: {
          level_xp_requirement: 1000,
          streak_bonus_multiplier: 1.5,
          achievement_notifications: true,
          leaderboard_enabled: true,
        },
        type: "json",
        description: "Gamification and reward system settings",
        category: "gamification",
        isPublic: false,
        updatedBy: adminUser[0].id,
      },
      {
        organizationId: orgId,
        key: "notification_settings",
        value: {
          email_enabled: true,
          push_enabled: true,
          digest_frequency: "weekly",
          achievement_notifications: true,
          mission_reminders: true,
        },
        type: "json",
        description: "Default notification preferences",
        category: "notifications",
        isPublic: true,
        updatedBy: adminUser[0].id,
      },
    ])

    console.log("✅ Database seeded successfully!")
    console.log(`
📊 Seeded Data Summary:
- Organizations: 1
- Users: ${1 + mentorUsers.length + studentUsers.length} (1 admin, ${mentorUsers.length} mentors, ${studentUsers.length} students)
- Categories: ${categories.length}
- Modules: ${modules.length}
- Achievements: ${achievementsList.length}
- Pods: ${podsList.length}
- Missions: ${missionsList.length}
- Chat Channels: ${channels.length}
- Progress Records: 7
- User Achievements: 5
- Notifications: 3
- Referrals: 2
- System Settings: 3

🚀 Platform is ready for use!
`)
  } catch (error) {
    console.error("❌ Error seeding database:", error)
    throw error
  }
}

// Run the seed function
seed()
  .catch((error) => {
    console.error("Seed failed:", error)
    process.exit(1)
  })
  .finally(() => {
    process.exit(0)
  })
