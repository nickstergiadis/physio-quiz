# Question Bank Developer Guide

This project now uses a **question bank system** with data separated from app logic.

## Where question data lives

- Normal mode questions: `src/data/questions/normalQuestions.js`
- Clinical reasoning mode questions: `src/data/questions/clinicalReasoningQuestions.js`
- Aggregation + validation: `src/data/questionBank.js`
- Shared helpers (filtering, shuffle, quiz length): `src/utils/questionBankUtils.js`
- Question schema + runtime guard: `src/data/schema/quizSchema.js`

## How to add a new category

1. Add the category name to `QUIZ_CATEGORIES` in `src/data/schema/quizSchema.js`.
2. Add a new key in one of the question-set files:
   - `NORMAL_QUESTION_SETS`
   - `CLINICAL_REASONING_QUESTION_SETS`
3. Add one or more question objects under that category key.

> The category selector UI reads from `QUIZ_CATEGORIES`, so new categories appear automatically.

## How to add new questions

1. Choose the target mode file:
   - Normal mode → `src/data/questions/normalQuestions.js`
   - Clinical reasoning mode → `src/data/questions/clinicalReasoningQuestions.js`
2. Add a question object in the correct category array.
3. Ensure the `id` is unique across the entire bank.
4. Keep `options` exactly 4 items, and set `correctAnswer` to the matching zero-based index (0-3).

Questions are automatically flattened, deduped by `id`, and validated before use.

## Question quality standard (non-negotiable)

When authoring or reviewing questions, prioritize educational value over raw count targets.

- Rewrite or remove any question that is:
  - uncertain or weakly supported,
  - repetitive with existing items,
  - too niche for this quiz's learning goals,
  - or low pedagogical value.
- Do not keep low-quality items just to hit a numeric milestone (for example, a 500-question target).

## How to add explanations, tags, and difficulty

- `explanation`: required string used in answer review.
- `tags`: optional string array (e.g. `['clinical-reasoning', 'rehab']`).
- `difficulty`: must be one of `easy`, `medium`, `hard`, `expert`.

The runtime validator (`isValidQuestion`) enforces this schema. Invalid questions are discarded by `src/data/questionBank.js`.
