# Smart Bookmark App

## Live Demo
https://smart-bookmark-app-five-gold.vercel.app

## Tech Stack
- Next.js (App Router)
- Supabase (Auth + PostgreSQL + Realtime)
- Tailwind CSS
- Vercel (Deployment)

---

## Features

- Google OAuth authentication (no email/password)
- Private bookmarks per user
- Add & delete bookmarks
- Real-time updates across multiple tabs
- Row Level Security (RLS) enforced at database level
- Production deployment with environment variables

---

## Architecture Overview

Frontend:
- Built with Next.js App Router
- Client-side Supabase SDK integration

Backend (Managed via Supabase):
- Supabase Auth for Google OAuth
- PostgreSQL database
- Logical replication enabled for realtime
- RLS policies to enforce user isolation

Deployment:
- GitHub → Vercel CI/CD pipeline
- Environment variables configured securely

---

## Security Implementation

Row Level Security policies were implemented on the `bookmarks` table:

- Users can SELECT only their own bookmarks
- Users can INSERT only records tied to their `auth.uid()`
- Users can DELETE only their own bookmarks

This ensures backend-level enforcement even if frontend requests are manipulated.

---

## Realtime Implementation

Realtime updates are handled using Supabase `postgres_changes` subscriptions.

- Logical replication enabled on `bookmarks` table
- Subscribed to all INSERT and DELETE events
- UI re-fetches data on change to maintain consistency across tabs

---

## Challenges Faced & Solutions

### 1. Realtime Delete Events Not Reflecting
**Problem:** Insert events worked, but delete events did not update the second tab.

**Solution:** Removed overly restrictive event filters and relied on RLS for isolation. Refetched data on all `postgres_changes` events.

---

### 2. OAuth Redirect Configuration
**Problem:** Google login initially failed due to redirect URI mismatch.

**Solution:** Correctly configured the Supabase callback URL in Google Cloud Console and added the production Vercel domain to authorized origins.

---

### 3. Tailwind Configuration Issues
**Problem:** Styling did not apply due to configuration mismatch.

**Solution:** Focused on ensuring core functionality (auth, RLS, realtime) worked correctly before optimizing UI configuration.

---

### 4. Null Rendering Crash in Dashboard
**Problem:** Attempted to access `user.email` before session loaded.

**Solution:** Implemented proper conditional rendering to prevent null access during initial render.

---

## Local Setup

1. Clone the repository
2. Install dependencies:

   npm install

3. Create `.env.local` file:

   NEXT_PUBLIC_SUPABASE_URL=
   NEXT_PUBLIC_SUPABASE_ANON_KEY=

4. Run:

   npm run dev

---

## Notes

This implementation prioritizes:

- Security correctness
- Backend enforcement via RLS
- Real-time synchronization reliability
- Clean architecture separation

UI improvements can be layered on top of the current functional foundation.
