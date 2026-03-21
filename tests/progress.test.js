import test from 'node:test';
import assert from 'node:assert/strict';

import { computeProgressMetrics } from '../src/utils/progress.js';

const TORONTO = 'America/Toronto';

function asIsoDayOffset(daysAgo, baseNow = '2026-03-21T16:00:00.000Z') {
  const stamp = new Date(new Date(baseNow).getTime() - daysAgo * 24 * 60 * 60 * 1000);
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

  const metrics = computeProgressMetrics(history, {
    recentLimit: 2,
    now: new Date('2026-03-21T16:00:00.000Z'),
    timeZone: TORONTO
  });

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

  const metrics = computeProgressMetrics(history, {
    now: new Date('2026-03-21T16:00:00.000Z'),
    timeZone: TORONTO
  });
  assert.equal(metrics.streak.current, 0);
  assert.equal(metrics.streak.activeToday, false);
});

test('last activity uses Toronto local date around midnight boundaries', () => {
  const history = [
    {
      id: 'a4',
      // Mar 20, 2026 00:15 in Toronto (UTC-4)
      completedAt: '2026-03-20T04:15:00.000Z',
      score: { correct: 8, total: 10 },
      categoryStats: {}
    }
  ];

  const metrics = computeProgressMetrics(history, {
    now: new Date('2026-03-20T05:00:00.000Z'),
    timeZone: TORONTO
  });

  assert.equal(metrics.streak.lastAttemptDate, '2026-03-20');
  assert.equal(metrics.streak.activeToday, true);
  assert.equal(metrics.streak.current, 1);
});
