# Physio Quiz

## App summary

Physio Quiz is a lightweight, static single-page physiotherapy training app built with vanilla JavaScript. Learners can run quick MCQ sessions, review explanations, and track progress locally in the browser without a backend.

## Feature list

- Quiz setup with filters for:
  - mode (`normal` or `clinical-reasoning`)
  - category
  - difficulty
  - quiz length
  - question order (`shuffled` or `fixed`)
- Guided question flow with Previous/Next navigation
- End-of-quiz scoring and per-question review with explanation text
- Progress dashboard with:
  - overall average score
  - strongest and weakest categories
  - streak and recent activity metrics
  - recent attempt history
- Local-only persistence (browser `localStorage`) for session and history; no cloud sync or resume codes
- Built-in legal pages (Privacy, Terms, Medical/Educational Disclaimer)
- Schema validation and duplicate-id filtering for question safety

## Local setup

### Requirements

- Node.js 18+
- npm 9+

### Install dependencies

```bash
npm install
```

## Run and build steps

### Static checks

```bash
npm run check
```

### Test suite

```bash
npm test
```

### Production build

```bash
npm run build
```

Build output is written to `dist/`.

### Run the built app locally

```bash
npx serve dist
```

Then open the local URL printed by `serve` (often `http://localhost:3000`).

## Deployment steps

1. Install dependencies: `npm install`
2. Run validation: `npm run check && npm test`
3. Build: `npm run build`
4. Deploy the contents of `dist/` to any static host (Netlify, Vercel static, GitHub Pages, Cloudflare Pages, S3/CloudFront, etc.)
5. Smoke test in production:
   - start a quiz
   - answer and submit
   - confirm results/progress pages render

> Routing note: the app uses hash routes (`#/quiz`, `#/progress`), so deep-link rewrite rules are not required.


### GitHub Pages (recommended for this repo)

1. Commit and push this repository to the `main` branch on GitHub.
2. Ensure the workflow `.github/workflows/deploy-pages.yml` is present (it builds from `dist/`).
3. In GitHub, open **Settings → Pages** and set **Source** to **GitHub Actions**.
4. Push to `main` (or run the workflow manually from **Actions**).
5. After the deploy job succeeds, the live URL appears in:
   - **Settings → Pages**
   - the **deploy** workflow job summary

Typical URL format is `https://<owner>.github.io/physio-quiz/`.

## Environment and configuration requirements

The app currently requires **no runtime environment variables** and **no Supabase services**.
It is intentionally a static, local-only app build that runs entirely in the browser.

Configuration lives in source code:

- app shell/router/state: `src/app/`
- question schema/constants: `src/data/schema/quizSchema.js`
- question content: `src/data/questions/`
- build pipeline: `scripts/build.mjs`

### Browser storage keys

- `physio_quiz_session`
- `physio_quiz_progress_v1`

Clear these keys if you need a clean local test state.

## How to add new questions

Physio Quiz no longer exposes any public in-app admin/editor route in production.
Add questions by committing to the source-controlled question bank:

1. Add question objects to:
   - `src/data/questions/normalQuestions.js` (normal mode), or
   - `src/data/questions/clinicalReasoningQuestions.js` (case-based mode)
2. Ensure each object satisfies `isValidQuestion` in `src/data/schema/quizSchema.js`.
3. Ensure each `id` is unique.
4. Run `npm run check && npm test && npm run build`.

## Accessibility basics (current baseline)

- Proper label/input associations in setup forms
- Visible keyboard focus styles via `:focus-visible`
- Live regions for setup availability and error feedback
- Active navigation state announced with `aria-current`
- Answer options expose pressed state with `aria-pressed`

## Performance basics (current baseline)

- Fully static bundle (no runtime API calls)
- Small module graph and direct DOM rendering
- Graceful localStorage guards for restricted-storage environments
- Built output is plain static assets for CDN caching

## Launch-ready MVP constraints (current)

- No public `#/admin-dev` route (unknown routes, including that hash, fall back to Home)
- Browser-local persistence only (no account, no cloud sync guarantee)
- Date/streak logic follows the user runtime/browser timezone by default
- Legal pages are available at `#/privacy`, `#/terms`, and `#/disclaimer`
- App remains fully static and GitHub Pages compatible (hash routing)
