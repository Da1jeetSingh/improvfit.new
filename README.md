# IMPROV

Cricket performance SaaS MVP built with Next.js and Supabase.

## Getting started

1. Copy the environment template:

```bash
cp .env.example .env.local
```

2. Add your Supabase project URL and anon key from the [Supabase dashboard](https://supabase.com/dashboard).

3. Install dependencies and start the dev server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

In Supabase, set your site URL and redirect URLs (for example `http://localhost:3000/auth/callback`) under **Authentication → URL configuration**.

## Project structure

```
app/
  (auth)/          # Login and sign-up routes
  (protected)/     # Routes that require a signed-in user
  auth/callback/   # Supabase auth callback handler
components/        # Shared UI components
hooks/             # Custom React hooks
lib/
  auth/            # Auth helpers and server actions
  supabase/        # Supabase browser, server, and middleware clients
types/             # Shared TypeScript types
middleware.ts      # Session refresh and route protection
```

## Scripts

- `npm run dev` — start the development server
- `npm run build` — create a production build
- `npm run start` — run the production server
- `npm run lint` — run ESLint

## Auth

Protected routes: `/dashboard`, `/profile`, `/matches`, `/training`, `/goals`.

Unauthenticated users are redirected to `/login`. Signed-in users visiting `/login` or `/signup` are redirected to `/dashboard`.
