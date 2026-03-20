# Physio Quiz Question Bank Expansion Plan (Target: 500 Questions)

## Repository Audit Snapshot

### 1) Current question schema
Question objects are validated at runtime via `isValidQuestion` and must include:
- `id` (string)
- `category` (one of `QUIZ_CATEGORIES`)
- `difficulty` (`easy | medium | hard`)
- `question` (non-empty string)
- `options` (exactly 4 non-empty strings)
- `correctAnswer` (integer 0-3)
- `explanation` (non-empty string)
- `tags` (optional string array)

### 2) Current question count
Current validated bank size is **49** total:
- Normal-mode pool: 30
- Clinical-reasoning pool: 19

Category totals in the validated bank:
- shoulder: 9
- knee: 9
- low back: 9
- ankle: 8
- cervical spine: 5
- exercise prescription: 5
- clinical reasoning: 4

Difficulty totals:
- easy: 10
- medium: 20
- hard: 19

### 3) Category structure
The app currently exposes these selectable categories:
- shoulder
- knee
- low back
- ankle
- cervical spine
- exercise prescription
- clinical reasoning

Question content is split into two source files:
- `src/data/questions/normalQuestions.js`
- `src/data/questions/clinicalReasoningQuestions.js`

At load time, both sets are flattened, deduplicated by `id`, then schema-validated.

### 4) App assumptions and rendering logic relevant to scaling
- Mode handling:
  - `normal` mode excludes questions tagged `clinical-reasoning` and category `clinical reasoning`.
  - `clinical-reasoning` mode includes either category `clinical reasoning` OR questions with `clinical-reasoning` tag.
- Length options are fixed to `[5, 10, 15, 20]` in setup UI and state/session sanitization.
- Filter flow builds a full pool from all validated questions, then applies mode/category/difficulty filtering.
- If available questions < requested length, app uses all available questions.
- Questions are rendered one at a time with tags shown.
- Current dedupe logic only guards duplicate IDs (not semantic duplicates).

### 5) Existing tests and validation coverage
Current automated checks verify:
- Quiz engine pool filtering, dedupe-by-id, score computations.
- Integration path (home -> quiz -> results -> progress).
- No-questions state for a known filter combination.
- Storage/session sanitization and malformed localStorage resilience.

Current project scripts:
- `npm run check`: syntax checks on core source files.
- `npm test`: Node test suite.
- `npm run build`: static bundle generation.

---

## Implementation Plan for 500 Questions (High-Quality, Safe Rollout)

## 1. Exact files to edit

### Core content and schema/logic files
1. `src/data/questions/normalQuestions.js`
2. `src/data/questions/clinicalReasoningQuestions.js`
3. `src/data/schema/quizSchema.js` (tighten validator rules)
4. `src/utils/questionBankUtils.js` (add deeper validation helpers)
5. `src/data/questionBank.js` (wire stronger validation/reporting)

### Test and tooling files
6. `tests/quizEngine.test.js` (extend for larger pools and distribution assertions)
7. `tests/createApp.integration.test.js` (verify UI behavior with expanded bank)
8. `tests/questionBank.validation.test.js` (new: schema + quality guardrails)
9. `package.json` (add question-bank validation script)
10. `scripts/validateQuestionBank.mjs` (new: CI-grade content checks)

### Documentation files
11. `docs/question-bank-guide.md` (authoring standards + process)
12. `README.md` (update question count and validation workflow)

## 2. Recommended category blueprint with target counts (total = 500)

Use the requested domain-weighted distribution as the source of truth, then map it into the app's current 7 selectable categories.

### Requested domain distribution (reference)
- Shoulder: **40**
- Knee: **40**
- Hip: **30**
- Ankle/Foot: **30**
- Cervical spine: **30**
- Lumbar spine: **35**
- Elbow/Wrist/Hand: **25**
- Thoracic/rib/posture: **15**
- Neuro rehab fundamentals: **30**
- Gait/function: **20**
- Pain science / tissue healing: **25**
- Exercise prescription / loading: **35**
- Red flags / screening / precautions: **30**
- Biomechanics / anatomy: **45**
- General clinical reasoning / differential diagnosis: **70**

Total: **500**

### Mapped targets for current app categories
Because the current UI exposes only 7 categories, fold the domain counts into those buckets while preserving the overall balance:

- shoulder: **65**
  - shoulder (40) + portion of biomechanics/anatomy (25)
- knee: **65**
  - knee (40) + portion of biomechanics/anatomy (25)
- low back: **80**
  - lumbar spine (35) + thoracic/rib/posture (15) + hip transfer (30)
- ankle: **50**
  - ankle/foot (30) + gait/function transfer (20)
- cervical spine: **55**
  - cervical spine (30) + elbow/wrist/hand transfer (25)
- exercise prescription: **60**
  - exercise prescription/loading (35) + pain science/tissue healing (25)
- clinical reasoning: **125**
  - general clinical reasoning/differential (70) + neuro rehab fundamentals (30) + red flags/screening/precautions (30)

Target total: **500**

> Note: keep a lightweight internal tracker (spreadsheet or validation script config) for the original 15-domain mix so content stays balanced even though the UI category set remains unchanged.

### Mode split recommendation
Because clinical mode is tag/category-driven (not file-driven only), keep explicit mode coverage targets:
- Normal-mode eligible questions: **~320**
- Clinical-reasoning-mode eligible questions: **~180**

Practical authoring split:
- `normalQuestions.js`: ~320 questions
- `clinicalReasoningQuestions.js`: ~180 questions

(Ensure clinical-mode questions consistently include `clinical-reasoning` tagging or `clinical reasoning` category.)

## 3. Recommended difficulty distribution

To preserve learner progression and avoid over-hardening:
- easy: **30%** -> **150**
- medium: **45%** -> **225**
- hard: **25%** -> **125**

### Per-category guidance
Aim each category to stay within +/-5% of the global ratio unless clinically justified.
This prevents categories becoming unintentionally "all hard" or "all easy".

## 4. Proposed validation rules (beyond current schema)

Add CI-enforced checks in `scripts/validateQuestionBank.mjs`:

**Quality-first principle:** hitting the numeric target must never override educational quality. Any question that is uncertain, weakly supported, repetitive, too niche, or low pedagogical value should be rewritten or removed.

1. **Unique ID rule**
   - hard fail on duplicate IDs.

2. **ID naming convention**
   - enforce predictable IDs per category + sequence (e.g., `shoulder-001`, `reasoning-101`).

3. **Option quality rules**
   - no duplicate option strings within a question (case-insensitive).
   - min option length (e.g., >= 2 visible chars).

4. **Stem/explanation quality rules**
   - minimum question stem length (e.g., >= 20 chars).
   - minimum explanation length (e.g., >= 30 chars).

5. **Tag rules**
   - require >=1 tag on all questions.
   - clinical-mode items must include `clinical-reasoning` tag unless category is `clinical reasoning`.

6. **Distribution rules**
   - enforce total count target (500 at completion milestone).
   - enforce per-category and per-difficulty targets with configurable tolerance.

7. **Near-duplicate detection (warning -> fail later)**
   - normalize text and flag high-similarity stems in same category.
   - start as warning during growth phase; switch to fail before final release.

8. **Evidence/support confidence rule**
   - flag stems/explanations with speculative wording or weakly supported claims for reviewer rewrite/removal.
   - fail CI for unresolved `confidence-low` content labels at merge time.

9. **Renderable constraints**
   - ensure exactly 4 options and valid `correctAnswer` index (already present in runtime guard, but make it CI-failing early).

## 5. Key risks and mitigations

### A) Clinical accuracy drift
**Risk:** Rapid expansion introduces outdated or overgeneralized clinical claims.
**Mitigation:** Add reviewer checklist per question: guideline consistency, contraindications, and wording precision.

### B) Semantic duplication
**Risk:** Different wording but same testing point reduces educational breadth.
**Mitigation:** Add duplicate-topic tracker (tags + pattern checks) and near-duplicate script warnings.

### C) Mode leakage
**Risk:** Clinical questions unintentionally appear in normal mode (or vice versa).
**Mitigation:** Enforce explicit mode tags and test fixtures for inclusion/exclusion behavior.

### D) Category imbalance
**Risk:** Some filters show weak depth or repetitive items.
**Mitigation:** Category quota tracking in validation script and progress dashboard checks.

### E) App performance at 500
**Risk:** Larger in-memory arrays may affect startup/filtering latency on low-end devices.
**Mitigation:**
- Continue one-time flatten/validate at load.
- Keep question objects lean (no heavy metadata blobs).
- Optional: precompute mode/category/difficulty indexes if profiling shows lag.

### F) Test fragility
**Risk:** Hardcoded assumptions in tests break as bank shape changes.
**Mitigation:** Keep behavior assertions deterministic with fixed local fixtures, and use non-brittle aggregate checks for full bank.

## 6. Step-by-step implementation plan

### Phase 0 — Guardrails first
1. Implement `scripts/validateQuestionBank.mjs` and add `npm run validate:questions`.
2. Add new `tests/questionBank.validation.test.js` to assert baseline rules.
3. Update docs (`docs/question-bank-guide.md`) with strict authoring rules.

### Phase 1 — Structural consistency
4. Normalize all existing IDs/tags to match new conventions.
5. Backfill missing tags and ensure clinical-mode tagging consistency.
6. Add distribution snapshot output in validation script (counts by category/difficulty/mode).

### Phase 2 — Controlled content expansion
7. Expand in batches (recommended 50 questions per batch x 9 batches).
8. For each batch:
   - add questions in target categories/difficulties,
   - run `npm run check`, `npm test`, `npm run validate:questions`, `npm run build`,
   - resolve duplication/quality warnings before merge.

### Phase 3 — Quality hardening
9. Switch near-duplicate warnings to CI failures once count >= 400.
10. Add reviewer sign-off requirement for red-flag/urgent-referral items.
11. Perform manual content sampling per category/difficulty before final 500 lock.

### Phase 4 — Finalization at 500
12. Enforce exact 500 total and target distribution tolerances.
13. Update README and release notes with final distribution table.
14. Run final full checks and smoke-test all filter combinations in app UI.

---

## Operational recommendation
Do **not** land 451 new questions in one pull request. Use incremental PRs with validation gating to maintain clinical quality and avoid large-scale regressions.

Treat **question quality as a hard gate**: do not keep weak questions simply to reach the 500 total.
