# K-RESET Curriculum Access Platform

A comprehensive, production-ready educational platform built for resilience and leadership development with gamification, AI-driven personalization, and community features.

## 🌟 Features

### Core Learning Platform
- **Curriculum Management**: Hierarchical content organization with categories and modules
- **Progress Tracking**: Detailed learning analytics and completion tracking
- **Gamification**: XP system, levels, achievements, and streaks
- **Multi-tenant Architecture**: Organization-based isolation and customization

### Community & Social Learning
- **Learning Pods**: Small group collaboration and peer learning
- **Missions System**: Challenges and group projects
- **Real-time Chat**: Pod-based messaging and discussions
- **Leaderboards**: Competitive elements and recognition

### AI-Powered Features
- **Personalized Recommendations**: AI-driven content suggestions
- **Learning Insights**: Performance analysis and improvement suggestions
- **Content Generation**: AI-assisted module and mission creation
- **Adaptive Difficulty**: Dynamic content difficulty adjustment

### Advanced Features
- **PWA Support**: Offline-first mobile experience
- **Internationalization**: Multi-language support (English, Hindi)
- **Real-time Notifications**: In-app, email, and push notifications
- **Analytics & Reporting**: Comprehensive usage and engagement metrics
- **API & Webhooks**: Extensible integration capabilities

## 🏗️ Architecture

### Technology Stack
- **Framework**: Remix (React-based full-stack framework)
- **Database**: PostgreSQL with Drizzle ORM
- **Styling**: Tailwind CSS with shadcn/ui components
- **Authentication**: Stack Auth (configurable)
- **Real-time**: WebSocket integration ready
- **AI**: OpenAI, xAI (Grok), and other AI service integrations
- **Analytics**: PostHog integration
- **Monitoring**: Sentry error tracking
- **Deployment**: Vercel-optimized

### Database Schema
The platform uses a comprehensive PostgreSQL schema with 20+ tables covering:
- User management and authentication
- Curriculum and content organization
- Progress tracking and gamification
- Community features (pods, missions, chat)
- Analytics and system administration
- AI insights and personalization data

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL 14+
- npm or yarn

### Installation

1. **Clone and Install**
   \`\`\`bash
   git clone <repository-url>
   cd k-reset-platform
   npm install
   \`\`\`

2. **Environment Setup**
   \`\`\`bash
   cp .env.example .env
   # Edit .env with your configuration
   \`\`\`

3. **Database Setup**
   \`\`\`bash
   # Run migrations
   npm run db:migrate
   
   # Seed with sample data
   npm run db:seed
   \`\`\`

4. **Development Server**
   \`\`\`bash
   npm run dev
   \`\`\`

Visit `http://localhost:3000` to see the platform.

### Production Deployment

The platform is optimized for Vercel deployment:

\`\`\`bash
# Build for production
npm run build

# Deploy to Vercel
vercel deploy
\`\`\`

## 📚 Documentation

- [Setup Guide](./setup.md) - Detailed installation and configuration
- [API Documentation](./api.md) - REST API endpoints and usage
- [Database Schema](./db-schema.md) - Complete database documentation
- [Admin Guide](./admin-guide.md) - Platform administration
- [Development Guide](./development.md) - Contributing and development workflow

## 🔧 Configuration

### Environment Variables

Key configuration options:

\`\`\`env
# Database
DATABASE_URL="postgresql://..."

# Authentication
SESSION_SECRET="your-secret-key"

# AI Services (Optional)
OPENAI_API_KEY="sk-..."
XAI_API_KEY="xai-..."

# Analytics (Optional)
POSTHOG_KEY="phc_..."
SENTRY_DSN="https://..."
\`\`\`

### Feature Flags

Control platform features via environment variables:

\`\`\`env
ENABLE_AI_FEATURES=true
ENABLE_REAL_TIME_CHAT=true
ENABLE_ANALYTICS=true
ENABLE_PWA=true
\`\`\`

## 🎯 Usage Examples

### For Learners
1. **Browse Curriculum**: Explore modules by category and difficulty
2. **Track Progress**: Monitor XP, levels, and achievements
3. **Join Pods**: Connect with peers for collaborative learning
4. **Complete Missions**: Participate in challenges and projects

### For Mentors
1. **Create Content**: Develop modules and learning materials
2. **Moderate Pods**: Guide discussions and provide support
3. **Design Missions**: Create engaging challenges for learners
4. **Monitor Progress**: Track learner engagement and success

### For Administrators
1. **Manage Users**: User roles, permissions, and organization settings
2. **Content Oversight**: Approve, edit, and organize curriculum
3. **Analytics Dashboard**: Monitor platform usage and engagement
4. **System Configuration**: Adjust platform settings and features

## 🔌 API Integration

The platform provides comprehensive REST APIs:

\`\`\`typescript
// Example: Fetch user progress
const response = await fetch('/api/users/me/progress')
const progress = await response.json()

// Example: Create a new pod
const pod = await fetch('/api/pods', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'My Learning Pod',
    description: 'A pod for collaborative learning'
  })
})
\`\`\`

## 🤝 Contributing

We welcome contributions! Please see our [Development Guide](./development.md) for:
- Code style and standards
- Testing requirements
- Pull request process
- Issue reporting guidelines

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check our comprehensive docs
- **Issues**: Report bugs via GitHub Issues
- **Discussions**: Join our community discussions
- **Email**: Contact support@k-reset.org

## 🗺️ Roadmap

### Phase 1 (Current)
- ✅ Core learning platform
- ✅ Community features
- ✅ Basic gamification
- ✅ PWA support

### Phase 2 (Next)
- 🔄 Advanced AI features
- 🔄 Mobile app (React Native)
- 🔄 Advanced analytics
- 🔄 Enterprise features

### Phase 3 (Future)
- 📋 VR/AR learning experiences
- 📋 Blockchain credentials
- 📋 Advanced AI tutoring
- 📋 Global marketplace

---

Built with ❤️ for the global learning community.
