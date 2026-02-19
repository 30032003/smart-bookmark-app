# Smart Bookmark App

## Live Demo
https://smart-bookmark-app-five-gold.vercel.app

## Tech Stack
- Next.js (App Router)
- Supabase (Auth + PostgreSQL + Realtime)
- Tailwind CSS
- Vercel (Deployment)

## Features
- Google OAuth Authentication
- Secure user-specific bookmarks
- Add & Delete bookmarks
- Real-time updates across multiple tabs
- Row Level Security (RLS) enforced at database level

## Architecture
Frontend: Next.js (Client Components)

Backend:
- Supabase Auth for authentication
- PostgreSQL for database
- Supabase Realtime for live updates

## Security Implementation
Row Level Security policies ensure:
- Users can only view their own bookmarks
- Users can only insert their own bookmarks
- Users can only delete their own bookmarks

All database-level access is protected using `auth.uid()`.

## Realtime Implementation
Enabled logical replication on the `bookmarks` table and subscribed to `postgres_changes` events to automatically refresh UI when database changes occur.

## Local Setup

1. Clone repository
2. Install dependencies:
   npm install
3. Create `.env.local`:
   NEXT_PUBLIC_SUPABASE_URL=
   NEXT_PUBLIC_SUPABASE_ANON_KEY=
4. Run:
   npm run dev
