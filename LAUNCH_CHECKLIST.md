# Launch Checklist

## 1) Local validation commands (run in this exact order)

1. Install dependencies:
   ```bash
   npm install
   ```
2. Run static checks:
   ```bash
   npm run check
   ```
3. Run unit tests:
   ```bash
   npm test
   ```
4. Build production assets:
   ```bash
   npm run build
   ```
5. Smoke-test the built app locally:
   ```bash
   npx serve dist
   ```

## 2) Expected outputs/artifacts

After `npm run build`, confirm `dist/` exists and includes at minimum:

- `dist/index.html`
- `dist/src/main.js`
- `dist/src/app/` (router/app shell modules)
- `dist/src/pages/` (home/quiz/results/progress/admin pages)
- `dist/src/data/` (question bank + schema)
- `dist/src/utils/` (storage/progress/engine helpers)
- `dist/src/styles/global.css`

## 3) GitHub Pages settings

1. Push the target branch to GitHub.
2. Open repository **Settings → Pages**.
3. Set **Source** to **GitHub Actions**.
4. Confirm the Pages workflow succeeds and the published URL appears in:
   - **Settings → Pages**, and
   - the workflow run summary.

## 4) Post-deploy smoke checks

Run these checks on the live URL:

### Hash-route checks

- Open `#/` (home).
- Open `#/quiz` with no active session: verify redirect/error behavior is graceful.
- Open `#/progress`: verify page renders with empty or existing history.
- Open an unknown route (example `#/does-not-exist`): verify fallback to home route.

### Quiz flow checks

- Start a quiz from home.
- Answer at least one question.
- Verify Previous/Next navigation works.
- Complete quiz and confirm results page renders with score + review.

### Progress persistence checks

- After submitting, open `#/progress` and confirm the attempt appears.
- Refresh the browser and confirm progress remains.
- Start a new quiz and verify active session resumes across refresh while in-progress.

## 5) Browser storage reset instructions (three keys)

Reset these localStorage keys when you need a clean browser state:

- `physio_quiz_session`
- `physio_quiz_progress_v1`
- `physio_quiz_dev_questions_v1`

### Option A: DevTools UI

1. Open browser DevTools.
2. Go to **Application** (Chrome/Edge) or **Storage** (Firefox).
3. Open **Local Storage** for the site origin.
4. Delete the three keys above.
5. Refresh the page.

### Option B: Console

```js
localStorage.removeItem('physio_quiz_session');
localStorage.removeItem('physio_quiz_progress_v1');
localStorage.removeItem('physio_quiz_dev_questions_v1');
location.reload();
```

## 6) Dev/admin access model (after nav hardening)

- The learner-facing primary nav should expose only Home, Quiz, and Progress.
- Dev/admin should be treated as a non-public utility route (`#/admin-dev`) for local/internal use.
- There is no authentication/authorization layer in this app; route obscurity is not security.
- Operational expectation: only trusted developers/testers should use `#/admin-dev`.
- Any production use requiring true admin controls must add authentication + role-based access before relying on this route.

## 7) Known limitations / risks

- No backend or user accounts: data is browser-local only (device/browser specific).
- localStorage can be cleared by users, browser policy, private mode, or quota limits.
- Dev/admin tooling is intentionally lightweight and not auth-protected.
- Hash routing is SPA-friendly but can expose route states in URL/history.
- Question content quality and schema validity still depend on review discipline and tests.
