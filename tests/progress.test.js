import test from 'node:test';
import assert from 'node:assert/strict';

import { computeProgressMetrics } from '../src/utils/progress.js';

function asIsoDayOffset(daysAgo) {
  const stamp = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
  stamp.setUTCHours(12, 0, 0, 0);
  return stamp.toISOString();
}

test('progress metrics compute average, category ranking, and streak continuity through yesterday', () => {
  const history = [
    {
      id: 'a1',
      completedAt: asIsoDayOffset(1),
      score: { correct: 4, total: 5 },
      categoryStats: {
        knee: { correct: 2, total: 2 },
        ankle: { correct: 2, total: 3 }
      }
    },
    {
      id: 'a2',
      completedAt: asIsoDayOffset(2),
      score: { correct: 3, total: 5 },
      categoryStats: {
        knee: { correct: 1, total: 2 },
        ankle: { correct: 2, total: 3 }
      }
    }
  ];

  const metrics = computeProgressMetrics(history, { recentLimit: 2 });

  assert.equal(metrics.totalQuizzes, 2);
  assert.equal(metrics.averageScore, 70);
  assert.equal(metrics.strongestCategory, 'Knee (75%)');
  assert.equal(metrics.weakestCategory, 'Ankle (67%)');
  assert.equal(metrics.streak.activeToday, false);
  assert.equal(metrics.streak.current, 2);
  assert.equal(metrics.recentAttempts.length, 2);
});

test('streak resets when the most recent attempt is older than yesterday', () => {
  const history = [
    {
      id: 'a3',
      completedAt: asIsoDayOffset(3),
      score: { correct: 1, total: 2 },
      categoryStats: {}
    }
  ];

  const metrics = computeProgressMetrics(history);
  assert.equal(metrics.streak.current, 0);
  assert.equal(metrics.streak.activeToday, false);
});

test('invalid completedAt values are ignored when computing streaks', () => {
  const history = [
    {
      id: 'bad-date',
      completedAt: 'not-a-date',
      score: { correct: 1, total: 1 },
      categoryStats: {}
    },
    {
      id: 'valid-date',
      completedAt: asIsoDayOffset(1),
      score: { correct: 1, total: 1 },
      categoryStats: {}
    }
  ];

  const metrics = computeProgressMetrics(history);
  assert.equal(metrics.streak.current, 1);
  assert.equal(metrics.streak.activeToday, false);
});
