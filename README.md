# Late Website - Complete Next.js Project

A complete Next.js application with Supabase backend, TypeScript types, and custom UI components.

## Features

- ✅ Complete SQL schema for all tables
- ✅ TypeScript types matching database schema
- ✅ Next.js API routes for all operations
- ✅ Custom UI components (tabs, tables, stats cards)
- ✅ Environment variable validation
- ✅ Full CRUD operations
- ✅ Analytics tracking
- ✅ Email queue system
- ✅ Admin dashboard

## Prerequisites

- Node.js 18+ and npm
- Supabase account with project set up
- Environment variables configured

## Installation

1. Clone the repository
2. Install dependencies:

\`\`\`bash
npm install
\`\`\`

3. Set up environment variables (copy `.env.example` to `.env.local`):

\`\`\`bash
cp .env.example .env.local
\`\`\`

4. Run the SQL schema in your Supabase SQL editor:

\`\`\`bash
# Copy contents of scripts/complete-schema.sql to Supabase SQL editor
\`\`\`

5. Run the development server:

\`\`\`bash
npm run dev
\`\`\`

6. Open [http://localhost:3000](http://localhost:3000)

## Database Setup

1. Go to your Supabase project
2. Navigate to SQL Editor
3. Execute the complete schema from `scripts/complete-schema.sql`
4. Verify all tables are created

## Environment Variables

Configure these variables for both Preview and Production environments in the same Vercel project.

### Required

- `NEXT_PUBLIC_SUPABASE_URL` – Supabase project URL (exposed to the browser)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` – Supabase anonymous key (exposed to the browser)
- `SUPABASE_SERVICE_ROLE_KEY` – Supabase service role key (server-only)
- `EMAIL_FROM` – Default From address for outbound emails
- `EMAIL_PROVIDER_API_KEY` – API key for the active email provider

### Optional

- `DIAG_ADMIN_TOKEN` – Bearer token required to access `/api/diag/env`
- `MICROSOFT_CLIENT_ID` – For Microsoft Graph email
- `MICROSOFT_CLIENT_SECRET` – For Microsoft Graph email
- `MICROSOFT_TENANT_ID` – For Microsoft Graph email
- `MICROSOFT_SENDER_EMAIL` – Sender email for Microsoft Graph
- `RESEND_API_KEY` – For Resend email service

## API Routes

- `/api/subscribers` - Manage subscribers
- `/api/posts` - Manage blog posts
- `/api/newsletters` - Manage newsletter articles
- `/api/products` - Manage products
- `/api/comments` - Manage comments
- `/api/reactions` - Manage reactions
- `/api/analytics/track-page` - Track page views
- `/api/analytics/track-event` - Track events
- `/api/analytics/stats` - Get analytics statistics
- `/api/dashboard/stats` - Get dashboard statistics
- `/api/contact` - Handle contact submissions
- `/api/creator-applications` - Handle creator applications

## Build

\`\`\`bash
npm run build
\`\`\`

## Deployment

- Production branch: `main`
- Production domain: `late.ltd`
- Merge to `main` to trigger a production deployment (see `docs/deploy.md` for quick reference)
- Pull requests build as Vercel preview deployments

## License

MIT
