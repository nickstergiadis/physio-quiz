/**
 * @typedef {'easy'|'medium'|'hard'} Difficulty
 * @typedef {'shoulder'|'knee'|'low back'|'ankle'|'cervical spine'|'exercise prescription'|'clinical reasoning'} QuizCategory
 *
 * @typedef {Object} QuizQuestion
 * @property {string} id
 * @property {QuizCategory} category
 * @property {Difficulty} difficulty
 * @property {string} question
 * @property {string[]} options
 * @property {number} correctAnswer
 * @property {string} explanation
 * @property {string[]=} tags
 */

/** @type {QuizCategory[]} */
export const QUIZ_CATEGORIES = [
  'shoulder',
  'knee',
  'low back',
  'ankle',
  'cervical spine',
  'exercise prescription',
  'clinical reasoning'
];

/** @type {Difficulty[]} */
export const DIFFICULTY_LEVELS = ['easy', 'medium', 'hard'];

/**
 * Runtime guard for consistent question shape.
 * @param {unknown} question
 * @returns {question is QuizQuestion}
 */
export function isValidQuestion(question) {
  if (!question || typeof question !== 'object') return false;
  const q = /** @type {Record<string, unknown>} */ (question);

  const hasValidOptions =
    Array.isArray(q.options) &&
    q.options.length === 4 &&
    q.options.every((option) => typeof option === 'string' && option.trim().length > 0);

  return (
    typeof q.id === 'string' &&
    QUIZ_CATEGORIES.includes(/** @type {QuizCategory} */ (q.category)) &&
    DIFFICULTY_LEVELS.includes(/** @type {Difficulty} */ (q.difficulty)) &&
    typeof q.question === 'string' &&
    q.question.trim().length > 0 &&
    hasValidOptions &&
    typeof q.correctAnswer === 'number' &&
    Number.isInteger(q.correctAnswer) &&
    q.correctAnswer >= 0 &&
    q.correctAnswer < 4 &&
    typeof q.explanation === 'string' &&
    q.explanation.trim().length > 0 &&
    (q.tags === undefined || (Array.isArray(q.tags) && q.tags.every((tag) => typeof tag === 'string')))
  );
}
