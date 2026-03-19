/**
 * @typedef {'easy'|'medium'|'hard'} Difficulty
 * @typedef {'musculoskeletal'|'clinical-reasoning'|'assessment'|'diagnosis'|'treatment-planning'|'exercise-prescription'} QuizCategory
 *
 * @typedef {Object} QuizOption
 * @property {string} id
 * @property {string} label
 *
 * @typedef {Object} QuizQuestion
 * @property {string} id
 * @property {QuizCategory} category
 * @property {Difficulty} difficulty
 * @property {string} stem
 * @property {QuizOption[]} options
 * @property {string} correctOptionId
 * @property {string} explanation
 * @property {string[]} tags
 */

/** @type {QuizCategory[]} */
export const QUIZ_CATEGORIES = [
  'musculoskeletal',
  'clinical-reasoning',
  'assessment',
  'diagnosis',
  'treatment-planning',
  'exercise-prescription'
];

/** @type {Difficulty[]} */
export const DIFFICULTY_LEVELS = ['easy', 'medium', 'hard'];

/**
 * Runtime guard for consistent question shape.
 * @param {unknown} question
 * @returns {boolean}
 */
export function isValidQuestion(question) {
  if (!question || typeof question !== 'object') return false;
  const q = /** @type {Record<string, unknown>} */ (question);
  return (
    typeof q.id === 'string' &&
    typeof q.category === 'string' &&
    typeof q.difficulty === 'string' &&
    typeof q.stem === 'string' &&
    Array.isArray(q.options) &&
    typeof q.correctOptionId === 'string' &&
    typeof q.explanation === 'string' &&
    Array.isArray(q.tags)
  );
}
