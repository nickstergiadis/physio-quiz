# Saved-progress implementation audit (2026-03-23)

## Scope
Compared the current `work` branch history against the expected saved-progress deliverables:

- `runtime-config.js`
- `src/config/runtimeConfig.js`
- `src/services/progressProfileService.js`
- Supabase SQL schema for `progress_profiles`
- Supabase Edge Functions (`create-progress-profile`, `get-progress-profile`, `save-progress-profile`)
- README Supabase setup instructions
- GitHub Pages workflow updates for runtime config injection

## Findings

### 1) Was saved-progress only on a branch/PR and never merged?
No. In this repository clone, the saved-progress implementation is present in merged commits on the current history:

- PR #46 merge commit `e69f2d1` (feature baseline)
- PR #47 merge commit `0a5fd98` (secure edge-function flow)
- PR #48 merge commit `3c7ad14` (runtime config + deployment fix)
- PR #49 merge commit `0113554` (meta config compatibility)

### 2) Which expected files are missing from "pre-saved-progress main"?
Using commit `8a08dd0` (the commit immediately before PR #46), all expected saved-progress artifacts are absent there:

- `runtime-config.js`
- `src/config/runtimeConfig.js`
- `src/services/progressProfileService.js`
- `supabase/anonymous_progress_profiles.sql`
- `supabase/functions/create-progress-profile/index.ts`
- `supabase/functions/get-progress-profile/index.ts`
- `supabase/functions/save-progress-profile/index.ts`

### 3) Which commit(s)/PR contain the implementation?

- Initial anonymous profile implementation:
  - commit `675f1e0`
  - merged by PR #46 (`e69f2d1`)
- Secure code-hash + dedicated edge function flow:
  - commit `bdd6ff3`
  - merged by PR #47 (`0a5fd98`)
- Runtime-config build/deploy fix:
  - commit `d70adbb`
  - merged by PR #48 (`3c7ad14`)
- Meta tag support for function URL compatibility:
  - commit `468fecd`
  - merged by PR #49 (`0113554`)

### 4) Present vs missing in current branch state
All expected files are present in current HEAD (`0113554`).

### 5) Main correction strategy
Because this clone has no local `main` branch or remote configured, direct in-repo merge to upstream `main` cannot be executed here.

To correct public `main`, cherry-pick or merge these commits/PRs into upstream `main`:

1. `e69f2d1` (PR #46)
2. `0a5fd98` (PR #47)
3. `3c7ad14` (PR #48)
4. `0113554` (PR #49)

## Deployment steps after main is corrected

1. Ensure GitHub Actions secrets are set:
   - `PHYSIO_QUIZ_SUPABASE_URL`
   - `PHYSIO_QUIZ_SUPABASE_ANON_KEY`
   - optional `PHYSIO_QUIZ_SUPABASE_FUNCTIONS_URL`
2. Apply SQL schema from `supabase/anonymous_progress_profiles.sql` in Supabase SQL Editor.
3. Deploy edge functions:
   - `create-progress-profile`
   - `get-progress-profile`
   - `save-progress-profile`
4. Trigger GitHub Pages workflow (`Deploy to GitHub Pages`) after merge to `main`.
5. Verify deployed `runtime-config.js` is populated and Save/Resume flow works in production.
