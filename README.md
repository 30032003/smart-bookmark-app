# Smart Bookmark App

## Tech Stack
- Next.js (App Router)
- Supabase (Auth, Postgres, Realtime)
- Tailwind CSS
- Vercel (Deployment)

## Features
- Google OAuth Login
- Private user bookmarks
- Add/Delete bookmarks
- Real-time updates across tabs
- Row Level Security enforced

## Architecture
Frontend: Next.js
Backend: Supabase (Auth + DB + Realtime)

## Security
Row Level Security policies ensure users can only access their own bookmarks.

## Setup Locally

npm install
npm run dev

Add .env.local with:
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

## Live Demo:
https://smart-bookmark-app-five-gold.vercel.app