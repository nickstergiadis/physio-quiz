import { questionBank } from '../data/questionBank.js';

function shuffle(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function getQuestions({ category, difficulty, limit = 10 }) {
  let pool = questionBank;

  if (category && category !== 'all') {
    pool = pool.filter((q) => q.category === category);
  }

  if (difficulty && difficulty !== 'all') {
    pool = pool.filter((q) => q.difficulty === difficulty);
  }

  if (!pool.length) {
    return [];
  }

  return shuffle(pool).slice(0, Math.max(1, limit));
}

export function calculateScore(answers, questions) {
  const correct = questions.reduce((count, question) => {
    return count + (answers[question.id] === question.correctAnswer ? 1 : 0);
  }, 0);

  const total = questions.length;
  return {
    correct,
    total,
    percent: total ? Math.round((correct / total) * 100) : 0
  };
}

export function buildQuestionReview(questions, answers) {
  return questions.map((question) => {
    const selectedAnswer = answers[question.id];
    return {
      ...question,
      selectedAnswer,
      isCorrect: selectedAnswer === question.correctAnswer
    };
  });
}

export function calculateCategoryScore(answers, questions) {
  const summary = {};

  questions.forEach((question) => {
    const key = question.category || 'uncategorized';
    if (!summary[key]) {
      summary[key] = { correct: 0, total: 0, percent: 0 };
    }

    summary[key].total += 1;
    if (answers[question.id] === question.correctAnswer) {
      summary[key].correct += 1;
    }
  });

  Object.values(summary).forEach((item) => {
    item.percent = item.total ? Math.round((item.correct / item.total) * 100) : 0;
  });

  return summary;
}
