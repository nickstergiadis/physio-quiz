import { isValidQuestion } from '../data/schema/quizSchema.js';

function isClinicalReasoningQuestion(question) {
  return question.tags?.includes('clinical-reasoning');
}

export function validateQuestionObjects(questions) {
  return questions.filter(isValidQuestion);
}

export function dedupeQuestionsById(questions) {
  const seen = new Set();
  return questions.filter((question) => {
    if (seen.has(question.id)) return false;
    seen.add(question.id);
    return true;
  });
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
