# Question Bank QA Report (500 Target)

## Summary
- Total validated questions: **500**.
- Runtime schema compatibility preserved (no schema shape changes required by app runtime).
- Bank expanded using evidence-oriented templates and case-based reasoning prompts across all existing app categories.

## Where the bank lives
- `src/data/questions/normalQuestions.js`
- `src/data/questions/clinicalReasoningQuestions.js`
- Aggregated via `src/data/questionBank.js`

## Category distribution
- shoulder: 66
- knee: 66
- low back: 66
- ankle: 66
- cervical spine: 66
- exercise prescription: 55
- clinical reasoning: 115

## Difficulty distribution
- easy: 155 (31.0%)
- medium: 267 (53.4%)
- hard: 78 (15.6%)

## QA checks performed
Validation script (`scripts/validateQuestionBank.mjs`) currently checks:
- schema conformity via runtime guard
- exact total count target (500)
- unique IDs
- non-empty required fields
- duplicate stem detection (normalized)
- duplicate option text within a question
- answer-key index validity
- category presence
- category/difficulty/answer-index summary output
- answer-position bias warning

## Duplicates and integrity outcomes
- Duplicate IDs: none detected.
- Duplicate normalized stems: none detected.
- Duplicate options within single questions: none detected.
- Answer key distribution: balanced (roughly even across indices).

## Assumptions and editorial notes
- Existing app category taxonomy (7 categories) was preserved to avoid UI/schema breaking changes.
- Additional topic breadth (e.g., hip, thoracic, elbow/wrist/hand, neuro rehab, red flags) was integrated through question content, tags, and reasoning scenarios within existing categories.
- Special tests are not framed as definitive standalone diagnostics; explanations emphasize clustering and broader clinical reasoning.

## Borderline items revised
- Correct-answer positional bias was corrected by distributing answer positions algorithmically.
- Difficulty proportions were tuned toward a foundational/intermediate-heavy educational profile while retaining a hard subset for advanced reasoning.
