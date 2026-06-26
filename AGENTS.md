<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Cursor Cloud specific instructions

This is a Next.js 16 (App Router, Turbopack) + Supabase app. The app needs a running Supabase backend or it throws "Missing Supabase environment variables" on any auth/data route.

Local backend is a local Supabase stack run via the Supabase CLI + Docker (no hosted project needed). The update script installs deps but does NOT start services. Before testing, start the backend yourself:

- Start the Docker daemon if it isn't running: `sudo dockerd > /tmp/dockerd.log 2>&1 &` then `sudo chmod 666 /var/run/docker.sock` (Docker uses the `fuse-overlayfs` storage driver and `iptables-legacy` in this VM).
- Start Supabase: `supabase start` (from repo root). It auto-applies everything in `supabase/migrations/`. Get keys with `supabase status`.
- `.env.local` (gitignored) must contain `NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321` and `NEXT_PUBLIC_SUPABASE_ANON_KEY=<ANON_KEY from supabase status>`. Use the legacy JWT `ANON_KEY`, not the new `PUBLISHABLE_KEY`.
- Run the app: `npm run dev` (port 3000). Build: `npm run build`. Lint: `npm run lint` (note: 2 pre-existing `react-hooks/set-state-in-effect` errors in `components/ui/modal.tsx` are unrelated to env).

`supabase/config.toml` sets `auto_expose_new_tables = true`. The migrations contain no explicit `GRANT`s and rely on the legacy Supabase behavior of auto-exposing `public` tables to the `anon`/`authenticated` roles. Without this, you get `permission denied for table profiles` during onboarding. If you ever recreate the schema, use `supabase db reset` (grants are applied at table-creation time, so a plain restart on an existing volume will not fix missing grants).

Email confirmation is disabled in `supabase/config.toml` (`[auth.email] enable_confirmations = false`), so sign-up returns a session immediately and redirects to `/onboarding`. New users must finish onboarding before protected routes (`/dashboard`, `/training`, etc.) are accessible. Local emails (if any) are viewable in Mailpit at http://127.0.0.1:54324.
