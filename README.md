# Physio Quiz

Physio Quiz is a lightweight vanilla JavaScript SPA for physiotherapy MCQ practice. Users can start immediately (no signup), and can now optionally create an **anonymous saved progress profile** backed by Supabase using a generated resume code.

## What’s new: anonymous saveable progress

- Start quizzes with no authentication.
- Click **Save progress** to create a remote anonymous profile.
- Receive a generated **resume code** (copy + store safely).
- Later, enter the code in **Resume saved progress** (or via URL) to restore:
  - in-progress quiz session
  - selected answers + current question index
  - completion state + latest result
  - attempt history + attempt review details
- Local storage remains active as fallback/cache.
- Once linked, remote profile becomes source of truth for restore across devices.

## Features

- Quiz setup filters: mode, category, difficulty, length, order
- Question-by-question flow with Previous/Next controls
- Scoring + explanation review at completion
- Progress dashboard with history and metrics
- Dev/admin draft-question page (`#/admin-dev`)
- Local-first behavior with optional Supabase remote resume profiles

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

Build output is in `dist/`.

### Run built app locally

```bash
npx serve dist
```

## Supabase setup (anonymous resume codes)

1. Create a Supabase project.
2. Open SQL Editor and run:

```sql
-- from this repo
-- supabase/anonymous_progress_profiles.sql
```

3. Copy your project values:
   - Project URL
   - anon public API key

4. Configure runtime values in `index.html` (or inject at deploy time):

```html
<meta name="physio-quiz-supabase-url" content="https://YOUR_PROJECT.supabase.co" />
<meta name="physio-quiz-supabase-anon-key" content="YOUR_ANON_KEY" />
```

Alternative runtime injection:

```html
<script>
  window.__PHYSIO_QUIZ_CONFIG__ = {
    supabaseUrl: 'https://YOUR_PROJECT.supabase.co',
    supabaseAnonKey: 'YOUR_ANON_KEY'
  };
</script>
```

> Do not hardcode service-role keys. Use only the Supabase anon key in the browser.

## Database schema + policy model

`supabase/anonymous_progress_profiles.sql` creates:

- `public.anonymous_progress_profiles`
  - `id` (UUID)
  - `resume_code_hash` (SHA-256 hash of normalized code)
  - `payload_json` (JSONB state blob)
  - `created_at`, `updated_at`, `last_active_at`
- Security-definer RPC functions:
  - `create_progress_profile`
  - `get_progress_profile_by_code`
  - `save_progress_profile_by_code`

Direct anon table access is revoked. Browser clients use RPC only.

## Resume code flow

1. User starts quiz normally.
2. User clicks **Save progress**.
3. App generates a long random code and sends payload to Supabase.
4. App shows **Your resume code** with copy button.
5. User resumes later by entering code or by URL:
   - `#/` with hash query: `#/??resume=CODE` (or `code=`)
   - page query: `?resume=CODE`
6. App loads remote payload, writes local cache, and routes user to quiz/results/home based on restored state.

## Autosave behavior

When linked to a resume code, remote autosave runs (debounced) after key state changes:

- starting a quiz
- selecting/changing answers
- moving previous/next
- completing a quiz
- restart/new quiz transition

If network fails, app keeps local progress and shows a non-destructive status message.

## Static hosting / GitHub Pages notes

- App uses hash routes (`#/quiz`, `#/progress`) so rewrite rules are not required.
- For GitHub Pages, ensure runtime Supabase config is injected into deployed `index.html`.
- CI/CD should run:

```bash
npm run check && npm test && npm run build
```

## Security limitations and notes

- Resume code is a bearer credential: anyone with it can access that profile.
- Store it like a password.
- The app normalizes + validates code input and includes lightweight client-side attempt throttling.
- Server-side hash storage is implemented (`resume_code_hash`) so raw code is not stored in table rows.
- For stronger brute-force defense, add edge rate-limiting/CAPTCHA/WAF controls at the platform layer.

## Local storage keys

- `physio_quiz_session`
- `physio_quiz_completed`
- `physio_quiz_result_v1`
- `physio_quiz_progress_v1`
- `physio_quiz_attempt_details_v1`
- `physio_quiz_resume_code_v1`
- `physio_quiz_profile_status_v1`
- `physio_quiz_dev_questions_v1`

## Follow-up improvements (recommended)

- Move code generation fully server-side in RPC for single-source security.
- Add Supabase Edge Function for stronger request throttling/IP-based controls.
- Add optional encrypted payload-at-rest model for sensitive deployments.
- Add explicit “unlink device” and “rotate resume code” controls.
