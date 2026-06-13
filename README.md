# Improv

Premium player-only cricket performance app. Next.js + Supabase.

## Design

- Black brand name + logo (top left: **Improv** then logo)
- Deep baggy green (`#1b4d3e`) — borders and accents
- Light green (`#7dd3a8`) — charts and progress bars
- White/black neutrals

## Screens

1. Login / sign up (`/login`)
2. Player profile (`/profile`)
3. Training logging (`/training`)
4. Match logging (`/matches`)
5. Goals (`/goals`)
6. Dashboard (`/dashboard`)

## Setup

1. Run `supabase/mvp.sql` in Supabase SQL Editor (new projects)
2. Copy `.env.example` → `.env.local` and add Supabase keys
3. Set auth redirect: `https://your-domain/auth/callback`
4. `npm install && npm run dev`

## Player-only scope

No coaches, academies, parents, payments, or AI features.
