import test from 'node:test';
import assert from 'node:assert/strict';

import { questionBank } from '../src/data/questionBank.js';
import { isValidQuestion } from '../src/data/schema/quizSchema.js';

function normalizeStem(stem) {
  return stem.toLowerCase().replace(/\s+/g, ' ').trim();
}

test('question bank entries are schema-valid and have unique ids/stems', () => {
  const seenIds = new Set();
  const seenStems = new Set();

  for (const question of questionBank) {
    assert.equal(isValidQuestion(question), true, `Invalid schema for ${question?.id ?? 'unknown'}`);
    assert.equal(seenIds.has(question.id), false, `Duplicate id found: ${question.id}`);
    seenIds.add(question.id);

    const normalizedStem = normalizeStem(question.question);
    assert.equal(seenStems.has(normalizedStem), false, `Duplicate stem found: ${question.id}`);
    seenStems.add(normalizedStem);
  }
});

test('answer keys are not overly concentrated at one option index', () => {
  const counts = [0, 0, 0, 0];
  for (const question of questionBank) {
    counts[question.correctAnswer] += 1;
  }

  const maxCount = Math.max(...counts);
  const minCount = Math.min(...counts);
  assert.ok(maxCount - minCount <= 4, `Answer-key imbalance too high: ${counts.join(', ')}`);
});

test('explanations are substantive enough for learning feedback', () => {
  for (const question of questionBank) {
    const wordCount = question.explanation.trim().split(/\s+/).length;
    assert.ok(wordCount >= 8, `Explanation too short for ${question.id}`);
  }
});

test('explanations are populated and unique per question', () => {
  const normalizedExplanations = new Set();

  for (const question of questionBank) {
    const normalized = question.explanation.toLowerCase().replace(/\s+/g, ' ').trim();
    assert.ok(normalized.length > 0, `Missing explanation for ${question.id}`);
    assert.equal(
      normalizedExplanations.has(normalized),
      false,
      `Duplicate explanation found for ${question.id}`
    );
    normalizedExplanations.add(normalized);
  }
});
