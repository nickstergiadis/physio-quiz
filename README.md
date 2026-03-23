# Physio Quiz

Physio Quiz is a lightweight vanilla JavaScript SPA for physiotherapy MCQ practice. Users can start immediately (no signup), and can optionally create an **anonymous saved progress profile** using a generated resume code.

## Anonymous saved progress (Supabase + Edge Functions)

This implementation uses:

- **Supabase Postgres** for `progress_profiles`
- **Supabase Edge Functions** as the only browser-facing API for profile create/get/save
- localStorage as local cache/fallback

The browser does **not** query `progress_profiles` directly by resume code.

## Feature summary

- Start quiz instantly with no account
- Create a saved profile at any point
- Server generates a high-entropy resume code once
- Resume on any device with the code
- Debounced autosave after key quiz/progress changes
- Local storage fallback retained
- Remote profile is preferred once linked

## Quick start

### Requirements

- Node.js 18+
- npm 9+

### Install

```bash
npm install
```

### Validate + test + build

```bash
npm run check
npm test
npm run build
```

## Supabase setup

### 1) Database schema and RLS

Run `supabase/anonymous_progress_profiles.sql` in Supabase SQL Editor.

It creates:

- `public.progress_profiles`
  - `id uuid`
  - `code_hash text unique`
  - `code_last4 text`
  - `payload_json jsonb`
  - `app_data_version integer`
  - `created_at`, `updated_at`, `last_active_at`
- indexes on `updated_at` + `last_active_at`
- `updated_at` trigger
- RLS enabled
- revoked anon/authenticated table privileges

No permissive anon RLS policies are created for by-code reads/writes.

### 2) Edge Functions

Deploy these functions:

- `create-progress-profile`
- `get-progress-profile`
- `save-progress-profile`

They live in `supabase/functions/` and use `SUPABASE_SERVICE_ROLE_KEY` server-side.

Example deployment commands:

```bash
supabase functions deploy create-progress-profile
supabase functions deploy get-progress-profile
supabase functions deploy save-progress-profile
```

### 3) Required function env vars

For Edge Functions:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

### 4) Frontend runtime config

Set public runtime config in `index.html` (or inject at deploy):

```html
<meta name="physio-quiz-supabase-url" content="https://YOUR_PROJECT.supabase.co" />
<meta name="physio-quiz-supabase-anon-key" content="YOUR_ANON_KEY" />
```

Optional explicit function base URL override:

```html
<meta name="physio-quiz-supabase-functions-url" content="https://YOUR_PROJECT.supabase.co/functions/v1" />
```

Or:

```html
<script>
  window.__PHYSIO_QUIZ_CONFIG__ = {
    supabaseUrl: 'https://YOUR_PROJECT.supabase.co',
    supabaseAnonKey: 'YOUR_ANON_KEY',
    supabaseFunctionsBaseUrl: 'https://YOUR_PROJECT.supabase.co/functions/v1'
  };
</script>
```

> Never expose service-role keys in the browser.

## How resume codes work

- User clicks **Save progress**
- Edge Function generates a code (format like `PQ-XXXX-XXXX-XXXX-XXXX-XXXX`)
- Function normalizes and hashes the code (SHA-256)
- DB stores only `code_hash` + `code_last4`, not raw code
- Raw code is returned once to the client
- User can resume via form input or URL `?resume=...` / `#/?resume=...`

## Autosave and reconciliation

Autosave (debounced) runs when linked profile exists after:

- start quiz
- answer change
- prev/next navigation
- submit quiz
- restart/new quiz transitions

Reconciliation strategy (MVP):

- On linked-profile bootstrap, compare local snapshot `updatedAt` with remote
- If local is clearly newer, push local snapshot to remote
- Otherwise restore remote snapshot and cache locally

## Security notes and limitations

Implemented controls:

- cryptographically random server-generated codes
- DB stores only hash, not raw resume code
- input normalization + validation
- payload size limits in frontend and Edge Functions
- no direct anon table access
- basic failure responses and limited detail
- lightweight client-side retry throttling

Remaining brute-force limitations (MVP):

- no distributed IP rate limit at edge yet
- no CAPTCHA/challenge step
- no code rotation endpoint

For stronger abuse resistance, add WAF/rate limiting and optionally a rotate-code flow.

## Static deployment notes (GitHub Pages)

- App uses hash routes (`#/quiz`, `#/progress`)
- Inject runtime Supabase config during deployment
- Keep function URL reachable from static host origin/CORS policy

## Local development notes

- Frontend can run without Supabase config (local-only mode)
- When config is missing or network fails, app keeps local progress intact
- To test Edge Functions locally, use Supabase CLI with local env vars and function serve
