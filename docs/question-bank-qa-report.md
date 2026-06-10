# Question Bank QA Report

## Summary
- Total validated questions: **699**.
- Runtime schema compatibility preserved (no schema shape changes required by app runtime).
- Bank expanded using evidence-oriented templates and case-based reasoning prompts across all existing app categories.

## Where the bank lives
- `src/data/questions/normalQuestions.js`
- `src/data/questions/clinicalReasoningQuestions.js`
- `src/data/questions/expertQuestions.js`
- Aggregated via `src/data/questionBank.js`

## Category distribution
- shoulder: 91
- knee: 91
- low back: 91
- ankle: 91
- cervical spine: 91
- exercise prescription: 84
- clinical reasoning: 160

## Difficulty distribution
- easy: 184 (26.3%)
- medium: 315 (45.1%)
- hard: 91 (13.0%)
- expert: 109 (15.6%)

## QA checks performed
Validation script (`scripts/validateQuestionBank.mjs`) currently checks:
- schema conformity via runtime guard
- minimum 500 question count
- unique IDs
- non-empty required fields (tags, category, stem, explanation)
- minimum stem length (20 chars) and explanation length (30 chars)
- duplicate stem detection (normalized)
- potential duplicate explanation detection (warnings, all IDs)
- duplicate option text within a question
- answer-key index validity
- category presence (all 7 categories required)
- difficulty band targets: easy 25–40%, medium 35–55%, hard 10–30%, expert 5–20%
- answer-position bias warning (max–min spread ≤ 20% of total)

## Duplicates and integrity outcomes
- Duplicate IDs: none detected.
- Duplicate normalized stems: none detected.
- Duplicate options within single questions: none detected.
- Answer key distribution: balanced (175 / 175 / 175 / 174 across indices 0–3).

## Assumptions and editorial notes
- Existing app category taxonomy (7 categories) was preserved to avoid UI/schema breaking changes.
- Additional topic breadth (e.g., hip, thoracic, elbow/wrist/hand, neuro rehab, red flags) was integrated through question content, tags, and reasoning scenarios within existing categories.
- Special tests are not framed as definitive standalone diagnostics; explanations emphasise clustering and broader clinical reasoning.

## Borderline items revised
- Correct-answer positional bias was corrected by distributing answer positions algorithmically.
- Difficulty proportions were tuned toward a foundational/intermediate-heavy educational profile while retaining hard and expert subsets for advanced reasoning.
