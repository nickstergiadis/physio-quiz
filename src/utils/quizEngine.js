import { questionBank } from '../data/questionBank.js';
import {
  filterQuestionsByCategory,
  filterQuestionsByDifficulty,
  filterQuestionsByMode,
  randomizeQuestionOrder,
  selectQuizLength
} from './questionBankUtils.js';

export function getQuestions({ mode = 'normal', category, difficulty, limit = 10 }) {
  const pool = selectQuizLength(
    randomizeQuestionOrder(
      filterQuestionsByDifficulty(
        filterQuestionsByCategory(filterQuestionsByMode(questionBank, mode), category),
        difficulty
      )
    ),
    limit
  );

  return pool;
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
