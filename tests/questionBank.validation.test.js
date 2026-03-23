import test from 'node:test';
import assert from 'node:assert/strict';

import { questionBank } from '../src/data/questionBank.js';
import { QUIZ_CATEGORIES, isValidQuestion } from '../src/data/schema/quizSchema.js';

test('question bank contains at least 500 schema-valid questions', () => {
  assert.ok(questionBank.length >= 500, `expected at least 500 questions, got ${questionBank.length}`);
  questionBank.forEach((question) => assert.equal(isValidQuestion(question), true, question.id));
});

test('question bank has broad category coverage', () => {
  const counts = questionBank.reduce((acc, q) => {
    acc[q.category] = (acc[q.category] || 0) + 1;
    return acc;
  }, {});

  QUIZ_CATEGORIES.forEach((category) => {
    assert.ok(counts[category] >= 20, `expected >=20 questions for ${category}, got ${counts[category] || 0}`);
  });
});
