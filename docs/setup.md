# K-RESET Platform Setup Guide

This guide will help you set up the K-RESET platform for local development, testing, and production deployment.

## Prerequisites

- Node.js 18+ and npm/pnpm
- PostgreSQL database (local or cloud)
- Git

## Quick Start

### 1. Clone and Install

\`\`\`bash
git clone <repository-url>
cd k-reset-platform
npm install
\`\`\`

### 2. Environment Setup

Copy the environment template:

\`\`\`bash
cp .env.example .env.local
\`\`\`

Update `.env.local` with your configuration:

\`\`\`env
DATABASE_URL="postgresql://username:password@localhost:5432/k_reset_db"
NEXTAUTH_SECRET="your-secret-key-here"
\`\`\`

### 3. Database Setup

Create your PostgreSQL database, then run migrations:

\`\`\`bash
# Generate migration files (if schema changes)
npm run db:generate

# Apply migrations to database
npm run db:migrate

# Seed with sample data
npm run db:seed
\`\`\`

### 4. Start Development Server

\`\`\`bash
npm run dev
\`\`\`

Visit `http://localhost:3000` to see your application.

## Database Configuration

### Local PostgreSQL Setup

1. Install PostgreSQL locally
2. Create a database:
   \`\`\`sql
   CREATE DATABASE k_reset_db;
   CREATE USER k_reset_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE k_reset_db TO k_reset_user;
   \`\`\`

### Cloud Database Options

#### Vercel Postgres
\`\`\`bash
# Install Vercel CLI
npm i -g vercel

# Create Postgres database
vercel postgres create k-reset-db

# Get connection string
vercel env pull .env.local
\`\`\`

#### Supabase
1. Create project at [supabase.com](https://supabase.com)
2. Get connection string from Settings > Database
3. Update `DATABASE_URL` in `.env.local`

#### Neon
1. Create project at [neon.tech](https://neon.tech)
2. Copy connection string
3. Update `DATABASE_URL` in `.env.local`

## Migration Commands

\`\`\`bash
# Generate new migration from schema changes
npm run db:generate

# Apply migrations to database
npm run db:migrate

# Open Drizzle Studio (database GUI)
npm run db:studio

# Reset database (migrate + seed)
npm run db:reset

# Seed database with sample data
npm run db:seed
\`\`\`

## Development Workflow

### 1. Making Schema Changes

1. Edit `lib/db/schema.ts`
2. Generate migration: `npm run db:generate`
3. Review generated SQL in `migrations/`
4. Apply migration: `npm run db:migrate`

### 2. Adding Sample Data

1. Edit `scripts/seed.ts`
2. Run seeding: `npm run db:seed`

### 3. Database Inspection

Use Drizzle Studio for visual database management:

\`\`\`bash
npm run db:studio
\`\`\`

## Production Deployment

### Vercel Deployment

1. **Connect Repository**
   \`\`\`bash
   vercel --prod
   \`\`\`

2. **Set Environment Variables**
   \`\`\`bash
   vercel env add DATABASE_URL
   vercel env add NEXTAUTH_SECRET
   \`\`\`

3. **Deploy**
   \`\`\`bash
   vercel --prod
   \`\`\`

### Environment Variables for Production

Required variables:
- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_SECRET` - Authentication secret
- `NEXTAUTH_URL` - Your domain URL

Optional variables:
- `OPENAI_API_KEY` - For AI features
- `VERCEL_BLOB_READ_WRITE_TOKEN` - For file uploads
- `RESEND_API_KEY` - For email notifications

### Database Migration in Production

Migrations run automatically on Vercel deployment. For manual migration:

\`\`\`bash
# Set production DATABASE_URL
export DATABASE_URL="your-production-db-url"

# Run migrations
npm run db:migrate
\`\`\`

## Troubleshooting

### Common Issues

**Database Connection Failed**
- Verify `DATABASE_URL` format
- Check database server is running
- Ensure user has proper permissions

**Migration Errors**
- Check for syntax errors in schema
- Ensure database is accessible
- Review migration SQL files

**Seeding Fails**
- Ensure migrations are applied first
- Check for unique constraint violations
- Verify foreign key references exist

### Getting Help

1. Check the [API Documentation](./api.md)
2. Review [Database Schema](./db-schema.md)
3. See [Admin Guide](./admin-guide.md)
4. Open an issue in the repository

## Development Tips

### Code Quality

\`\`\`bash
# Type checking
npm run type-check

# Linting
npm run lint

# Formatting
npm run format
\`\`\`

### Database Best Practices

1. Always generate migrations for schema changes
2. Test migrations on development data first
3. Backup production data before major changes
4. Use transactions for complex data operations
5. Index frequently queried columns

### Performance Optimization

1. Use database indexes appropriately
2. Implement proper caching strategies
3. Optimize API queries with Drizzle relations
4. Monitor database performance in production

## Next Steps

- Read the [API Documentation](./api.md)
- Explore the [Database Schema](./db-schema.md)
- Learn about [Admin Features](./admin-guide.md)
- Customize the platform for your needs
\`\`\`
