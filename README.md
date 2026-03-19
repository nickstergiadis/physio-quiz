# Physio Quiz

A lightweight single-page physiotherapy quiz app for students and clinicians. It runs fully in the browser (no backend required), supports category/difficulty filters, and stores progress locally.

## What this app is

Physio Quiz is a vanilla JavaScript training app that delivers multiple-choice questions across common MSK and exercise-prescription topics. It includes two learning modes:

- **Standard mode** for mixed recall/application
- **Clinical reasoning mode** for case-style questions

## Features

- Filter by **mode, category, difficulty, quiz length, and question order**
- Step-by-step quiz flow with previous/next navigation
- End-of-quiz score summary and question-by-question review
- Local progress dashboard:
  - average score
  - strongest/weakest categories
  - recent activity and streak metrics
- Local dev/admin page for drafting additional questions in browser storage
- Question schema validation and duplicate-question ID protection

## Local setup

### Requirements

- Node.js 18+
- npm 9+

### Install

```bash
npm install
```

### Run locally (static)

Because this app is a static SPA, you can serve it with any static server after build.

```bash
npm run check
npm run build
npx serve dist
```

Then open the URL printed by `serve` (commonly `http://localhost:3000`).

## Environment and configuration

This app currently has **no required runtime environment variables**.

Configuration is code-based:

- Core app routes/state: `src/app/`
- Question content: `src/data/questions/`
- Question schema/allowed categories+difficulties: `src/data/schema/quizSchema.js`
- Build output behavior: `scripts/build.mjs`

### Local storage keys used

- `physio_quiz_session`
- `physio_quiz_progress_v1`
- `physio_quiz_dev_questions_v1`

If needed for a clean test run, clear these keys in browser storage.

## Build and deploy instructions

### Build

```bash
npm run check
npm run build
```

Build creates a deployable `dist/` directory containing `index.html` + `src/` assets.

### Deploy (static hosting)

Deploy the contents of `dist/` to any static host:

- Netlify
- Vercel (static)
- GitHub Pages
- Cloudflare Pages
- S3 + CloudFront

### SPA routing note

This app uses **hash routing** (`#/quiz`, `#/progress`, etc.), so no server rewrite rules are required for deep links.

## Accessibility notes

Current baseline improvements include:

- Explicit `<label for>` associations on filter controls
- Visible `:focus-visible` outlines for links, buttons, and inputs
- Live-region announcements for availability/error helper text in setup form

## Manual QA checklist (MVP readiness)

Run through this before shipping:

- Start quizzes with:
  - both modes (`normal`, `clinical-reasoning`)
  - each category + "all"
  - each difficulty + "all"
  - both order modes (`shuffled`, `fixed`)
- Confirm setup availability text updates and prevents starting when no questions match.
- Complete a full quiz and verify:
  - previous/next navigation
  - score math and per-question correctness
  - explanation text appears for every reviewed question
- Refresh during an in-progress quiz and confirm session resumes.
- Complete multiple quizzes, refresh, and verify Progress dashboard metrics still load.
- Add one malformed object to dev-question localStorage and verify app does not crash (invalid objects are ignored).

## Performance notes

- Fully static assets; no runtime API calls
- Small JS modules and simple DOM rendering
- LocalStorage access is guarded to fail gracefully when storage is unavailable

## Future roadmap

- Authentication + role-based protection for admin tooling
- Import/export question banks (JSON)
- Timed mode and adaptive quizzes
- Keyboard shortcuts for faster answering
- Basic analytics event hooks (privacy-safe)
- Unit tests for quiz engine and storage utilities
- Optional TypeScript migration for stricter safety
