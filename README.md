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

### New Supabase project

Run `supabase/mvp.sql` once in the Supabase SQL Editor.

### Existing Supabase project (migrations)

Run migrations in order:

1. `supabase/migrations/20250613100000_initial_schema.sql`
2. `supabase/migrations/20250613110000_add_profile_fields.sql`
3. `supabase/migrations/20250613120000_add_match_batting_fields.sql`
4. `supabase/migrations/20250613130000_add_training_session_fields.sql`
5. `supabase/migrations/20250613140000_update_goals_schema.sql`
6. `supabase/migrations/20250613145000_ensure_profile_columns.sql`
7. `supabase/migrations/20250613150000_ensure_auth_profile_trigger.sql`

**Production auth/dashboard errors** usually mean steps 2, 5, or 7 were not applied to the same Supabase project as your Vercel `NEXT_PUBLIC_SUPABASE_URL`.

### App env

1. Copy `.env.example` → `.env.local` and add Supabase keys
2. Set auth redirect: `https://your-domain/auth/callback`
3. `npm install && npm run dev`

No coaches, academies, parents, payments, or AI features.
