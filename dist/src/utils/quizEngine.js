import { questionBank } from '../data/questionBank.js';
import {
  filterQuestionsByCategory,
  filterQuestionsByDifficulty,
  filterQuestionsByMode,
  randomizeQuestionOrder,
  sortQuestionsById,
  selectQuizLength,
  validateQuestionObjects
} from './questionBankUtils.js';

function resolveQuestionOrder(questions, order = 'shuffled') {
  return order === 'fixed' ? sortQuestionsById(questions) : randomizeQuestionOrder(questions);
}

export function getQuestionPool({ mode = 'normal', category, difficulty, questionSource = questionBank }) {
  const validQuestions = validateQuestionObjects(Array.isArray(questionSource) ? questionSource : []);
  return filterQuestionsByDifficulty(
    filterQuestionsByCategory(filterQuestionsByMode(validQuestions, mode), category),
    difficulty
  );
}

export function getQuestions({ mode = 'normal', category, difficulty, order = 'shuffled', limit = 10, questionSource }) {
  const pool = getQuestionPool({ mode, category, difficulty, questionSource });
  return selectQuizLength(resolveQuestionOrder(pool, order), limit);
}

export function buildQuizSession(config = {}) {
  const normalized = {
    mode: config.mode === 'clinical-reasoning' ? 'clinical-reasoning' : 'normal',
    category: typeof config.category === 'string' ? config.category : 'all',
    difficulty: typeof config.difficulty === 'string' ? config.difficulty : 'all',
    length: [5, 10, 15, 20].includes(config.length) ? config.length : 10,
    order: config.order === 'fixed' ? 'fixed' : 'shuffled'
  };
  const pool = getQuestionPool({
    ...normalized,
    questionSource: Array.isArray(config.questionSource) ? config.questionSource : questionBank
  });
  const effectiveLength = Math.min(normalized.length, pool.length);
  const questions = selectQuizLength(resolveQuestionOrder(pool, normalized.order), effectiveLength);

  return {
    filters: normalized,
    availableCount: pool.length,
    effectiveLength,
    questions
  };
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
