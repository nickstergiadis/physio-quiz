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
- Local dev/admin screen for drafting questions in browser storage
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

## Environment and configuration requirements

The app currently requires **no runtime environment variables**.

Configuration lives in source code:

- app shell/router/state: `src/app/`
- question schema/constants: `src/data/schema/quizSchema.js`
- question content: `src/data/questions/`
- build pipeline: `scripts/build.mjs`

### Browser storage keys

- `physio_quiz_session`
- `physio_quiz_progress_v1`
- `physio_quiz_dev_questions_v1`

Clear these keys if you need a clean local test state.

## How to add new questions

Use either method below.

### Method A: via dev/admin page (quickest)

1. Open `#/admin-dev`.
2. Complete all fields (category, difficulty, mode, question, options, explanation, tags).
3. Click **Preview question**.
4. Click **Save question**.

Saved questions persist in localStorage on that browser only.

### Method B: commit to source-controlled question bank

1. Add question objects to:
   - `src/data/questions/normalQuestions.js` (normal mode), or
   - `src/data/questions/clinicalReasoningQuestions.js` (case-based mode)
2. Ensure each object satisfies `isValidQuestion` in `src/data/schema/quizSchema.js`.
3. Ensure each `id` is unique.
4. Run `npm run check && npm test && npm run build`.

## Accessibility basics (current baseline)

- Proper label/input associations in setup/admin forms
- Visible keyboard focus styles via `:focus-visible`
- Live regions for setup availability and error feedback
- Active navigation state announced with `aria-current`
- Answer options expose pressed state with `aria-pressed`

## Performance basics (current baseline)

- Fully static bundle (no runtime API calls)
- Small module graph and direct DOM rendering
- Graceful localStorage guards for restricted-storage environments
- Built output is plain static assets for CDN caching

## Future roadmap

- Authentication + role-based admin controls
- Import/export for question banks
- Timed quiz mode and adaptive selection
- Keyboard shortcuts and richer accessibility support
- Optional analytics hooks (privacy-conscious)
- Expanded automated tests (UI and integration)
- Optional TypeScript migration for stricter safety
