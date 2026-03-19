import { questionBank } from '../data/questionBank.js';

export function getQuestions({ category, difficulty, limit = 5 }) {
  let pool = questionBank;
  if (category && category !== 'all') {
    pool = pool.filter((q) => q.category === category);
  }
  if (difficulty && difficulty !== 'all') {
    pool = pool.filter((q) => q.difficulty === difficulty);
  }
  return pool.slice(0, limit);
}

export function calculateScore(answers, questions) {
  const correct = questions.reduce(
    (count, q) => count + (answers[q.id] === q.correctOptionId ? 1 : 0),
    0
  );
  return {
    correct,
    total: questions.length,
    percent: questions.length ? Math.round((correct / questions.length) * 100) : 0
  };
}
