import { isValidQuestion } from '../data/schema/quizSchema.js';

function isClinicalReasoningQuestion(question) {
  if (!question || typeof question !== 'object') return false;
  const tags = Array.isArray(question.tags) ? question.tags : [];
  return question.category === 'clinical reasoning' || tags.includes('clinical-reasoning');
}

export function validateQuestionObjects(questions) {
  return questions.filter(isValidQuestion);
}

export function dedupeQuestionsById(questions) {
  const seen = new Set();
  return questions.filter((question) => {
    if (!question || typeof question !== 'object' || typeof question.id !== 'string') return false;
    if (seen.has(question.id)) return false;
    seen.add(question.id);
    return true;
  });
}

function rotateOptions(options, shift) {
  const length = options.length;
  return options.map((_, index) => options[(index - shift + length) % length]);
}

function stableIdHash(id) {
  let hash = 0;
  for (let index = 0; index < id.length; index += 1) {
    hash = (hash * 31 + id.charCodeAt(index)) >>> 0;
  }
  return hash;
}

/**
 * Repositions correct answers across indices to avoid predictable answer-key patterns.
 * Rotation is deterministic per-question id so ordering remains stable between sessions.
 * @param {Array<Record<string, unknown>>} questions
 */
export function rebalanceAnswerKeyPositions(questions) {
  const balanced = [...questions];

  const eligible = questions
    .map((question, index) => ({ question, index }))
    .filter(
      ({ question }) =>
        question &&
        typeof question === 'object' &&
        typeof question.id === 'string' &&
        Array.isArray(question.options) &&
        question.options.length === 4 &&
        Number.isInteger(question.correctAnswer)
    )
    .sort((left, right) => {
      const hashDiff = stableIdHash(left.question.id) - stableIdHash(right.question.id);
      if (hashDiff !== 0) return hashDiff;
      return left.question.id.localeCompare(right.question.id);
    });

  eligible.forEach(({ question, index }, position) => {
    const targetAnswer = position % question.options.length;
    const shift = (targetAnswer - question.correctAnswer + question.options.length) % question.options.length;

    if (shift === 0) {
      balanced[index] = question;
      return;
    }

    balanced[index] = {
      ...question,
      options: rotateOptions(question.options, shift),
      correctAnswer: (question.correctAnswer + shift) % question.options.length
    };
  });

  return balanced;
}

export function filterQuestionsByMode(questions, mode = 'normal') {
  if (mode === 'clinical-reasoning') {
    return questions.filter(isClinicalReasoningQuestion);
  }

  return questions.filter((question) => !isClinicalReasoningQuestion(question));
}

export function filterQuestionsByCategory(questions, category = 'all') {
  if (!category || category === 'all') return questions;
  return questions.filter((question) => question.category === category);
}

export function filterQuestionsByDifficulty(questions, difficulty = 'all') {
  if (!difficulty || difficulty === 'all') return questions;
  return questions.filter((question) => question.difficulty === difficulty);
}

export function randomizeQuestionOrder(questions) {
  const copy = [...questions];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function sortQuestionsById(questions) {
  return [...questions].sort((left, right) => left.id.localeCompare(right.id));
}

export function selectQuizLength(questions, limit = 10) {
  return questions.slice(0, Math.max(1, limit));
}
