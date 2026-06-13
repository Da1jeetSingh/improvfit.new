# IMPROV

Player-only cricket MVP built with Next.js and Supabase.

## MVP scope

1. **Player profile** — name, role, styles, skill level, goals
2. **Training sessions** — log practice with date, duration, focus, notes
3. **Dashboard** — profile summary and training activity

No coaches, payments, or AI features.

## Setup

### 1. Database (Supabase)

New project: run **`supabase/mvp.sql`** once in the Supabase SQL Editor.

Existing project with prior migrations: keep using `supabase/migrations/` in order.

### 2. Environment

```bash
cp .env.example .env.local
```

Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` from Supabase → Settings → API.

Set auth redirect URL: `http://localhost:3000/auth/callback`

### 3. Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Routes

| Route | Purpose |
|-------|---------|
| `/profile` | View and edit player profile |
| `/training` | Log and list training sessions |
| `/dashboard` | Profile summary + training stats |

Protected routes require sign-in.
