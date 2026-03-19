import test from 'node:test';
import assert from 'node:assert/strict';

import {
  buildQuizSession,
  calculateCategoryScore,
  calculateScore,
  getQuestionPool
} from '../src/utils/quizEngine.js';

const SAMPLE_QUESTIONS = [
  {
    id: 'q1',
    category: 'knee',
    difficulty: 'easy',
    question: 'Q1',
    options: ['A', 'B', 'C', 'D'],
    correctAnswer: 1,
    explanation: 'E1'
  },
  {
    id: 'q2',
    category: 'knee',
    difficulty: 'hard',
    question: 'Q2',
    options: ['A', 'B', 'C', 'D'],
    correctAnswer: 3,
    explanation: 'E2',
    tags: ['clinical-reasoning']
  },
  {
    id: 'q3',
    category: 'ankle',
    difficulty: 'medium',
    question: 'Q3',
    options: ['A', 'B', 'C', 'D'],
    correctAnswer: 0,
    explanation: 'E3'
  }
];

test('buildQuizSession reduces quiz length to available pool size', () => {
  const session = buildQuizSession({
    mode: 'normal',
    category: 'knee',
    difficulty: 'easy',
    length: 20,
    order: 'fixed',
    questionSource: SAMPLE_QUESTIONS
  });

  assert.equal(session.availableCount, 1);
  assert.equal(session.effectiveLength, 1);
  assert.equal(session.questions.length, 1);
  assert.equal(session.questions[0].id, 'q1');
});

test('getQuestionPool filters out clinical-reasoning items in normal mode', () => {
  const normalPool = getQuestionPool({ mode: 'normal', questionSource: SAMPLE_QUESTIONS });
  assert.deepEqual(normalPool.map((q) => q.id).sort(), ['q1', 'q3']);

  const clinicalPool = getQuestionPool({ mode: 'clinical-reasoning', questionSource: SAMPLE_QUESTIONS });
  assert.deepEqual(clinicalPool.map((q) => q.id), ['q2']);
});

test('calculateScore and category breakdown are correct', () => {
  const questions = [SAMPLE_QUESTIONS[0], SAMPLE_QUESTIONS[2]];
  const answers = { q1: 1, q3: 2 };

  assert.deepEqual(calculateScore(answers, questions), {
    correct: 1,
    total: 2,
    percent: 50
  });

  assert.deepEqual(calculateCategoryScore(answers, questions), {
    knee: { correct: 1, total: 1, percent: 100 },
    ankle: { correct: 0, total: 1, percent: 0 }
  });
});
