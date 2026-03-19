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

test('getQuestionPool supports clinical category items and ignores malformed questions', () => {
  const mixedSource = [
    ...SAMPLE_QUESTIONS,
    {
      id: 'q4',
      category: 'clinical reasoning',
      difficulty: 'medium',
      question: 'Q4',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 2,
      explanation: 'E4'
    },
    null,
    { id: 'broken-1', category: 'knee' }
  ];

  const normalPool = getQuestionPool({ mode: 'normal', questionSource: mixedSource });
  assert.deepEqual(normalPool.map((q) => q.id).sort(), ['q1', 'q3']);

  const clinicalPool = getQuestionPool({ mode: 'clinical-reasoning', questionSource: mixedSource });
  assert.deepEqual(clinicalPool.map((q) => q.id).sort(), ['q2', 'q4']);
});

test('getQuestionPool deduplicates questions by id', () => {
  const duplicateSource = [
    SAMPLE_QUESTIONS[0],
    { ...SAMPLE_QUESTIONS[0], question: 'Duplicate should be removed' },
    SAMPLE_QUESTIONS[2]
  ];

  const pool = getQuestionPool({ mode: 'normal', questionSource: duplicateSource });
  assert.deepEqual(pool.map((q) => q.id).sort(), ['q1', 'q3']);
  assert.equal(pool.length, 2);
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
