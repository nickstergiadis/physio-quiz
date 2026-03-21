import test from 'node:test';
import assert from 'node:assert/strict';

import {
  clearQuizResult,
  isQuizCompleted,
  loadHistory,
  loadQuizResult,
  loadSession,
  pushHistory,
  saveQuizResult,
  saveSession,
  setQuizCompleted
} from '../src/utils/storage.js';

function installMemoryStorage(initial = {}) {
  const state = new Map(Object.entries(initial));
  global.localStorage = {
    getItem(key) {
      return state.has(key) ? state.get(key) : null;
    },
    setItem(key, value) {
      state.set(key, String(value));
    },
    removeItem(key) {
      state.delete(key);
    }
  };

  return state;
}

test('invalid session JSON is discarded safely', () => {
  const state = installMemoryStorage({ physio_quiz_session: '{bad json' });

  const session = loadSession();
  assert.equal(session, null);
  assert.equal(state.has('physio_quiz_session'), false);
});

test('history entries are sanitized when persisted', () => {
  installMemoryStorage();

  pushHistory({
    id: 123,
    completedAt: null,
    filters: { mode: 'bad', category: 7, difficulty: null, length: 999, order: 'bad' },
    score: { correct: 3, total: 4 },
    categoryStats: {
      knee: { correct: 2, total: 3 },
      broken: 'nope'
    }
  });

  const history = loadHistory();
  assert.equal(history.length, 1);
  assert.equal(history[0].filters.mode, 'normal');
  assert.equal(history[0].filters.category, 'all');
  assert.equal(history[0].filters.length, 10);
  assert.deepEqual(history[0].categoryStats.knee, { correct: 2, total: 3, percent: 67 });
  assert.equal(history[0].categoryStats.broken, undefined);
});

test('history entries normalize invalid completedAt strings', () => {
  installMemoryStorage();

  pushHistory({
    id: 'attempt-date-test',
    completedAt: 'not-a-date',
    filters: { mode: 'normal', category: 'all', difficulty: 'all', length: 10, order: 'shuffled' },
    score: { correct: 1, total: 1 },
    categoryStats: {}
  });

  const history = loadHistory();
  assert.equal(history.length, 1);
  assert.equal(Number.isNaN(new Date(history[0].completedAt).getTime()), false);
});


test('history timestamps are persisted with timezone offsets instead of UTC Z suffix', () => {
  installMemoryStorage();

  pushHistory({
    id: 'attempt-timezone-test',
    completedAt: '2026-03-20T04:15:00.000Z',
    filters: { mode: 'normal', category: 'all', difficulty: 'all', length: 10, order: 'shuffled' },
    score: { correct: 1, total: 1 },
    categoryStats: {}
  });

  const history = loadHistory();
  assert.equal(history.length, 1);
  assert.match(history[0].completedAt, /[+-]\d{2}:\d{2}$/);
  assert.equal(history[0].completedAt.endsWith('Z'), false);
});

test('saveSession and loadSession retain session payload', () => {
  installMemoryStorage();
  const payload = {
    filters: { mode: 'normal', category: 'all', difficulty: 'all', length: 10, order: 'shuffled' },
    questions: [],
    currentIndex: 0,
    answers: {}
  };

  saveSession(payload);
  assert.deepEqual(loadSession(), payload);
});

test('quiz completion flag can be set and cleared', () => {
  installMemoryStorage();

  assert.equal(isQuizCompleted(), false);
  setQuizCompleted(true);
  assert.equal(isQuizCompleted(), true);
  setQuizCompleted(false);
  assert.equal(isQuizCompleted(), false);
});

test('quiz result payload can be saved, loaded, and cleared', () => {
  installMemoryStorage();
  const payload = {
    score: { correct: 5, total: 10, percent: 50 },
    review: [],
    unansweredCount: 0
  };

  saveQuizResult(payload);
  assert.deepEqual(loadQuizResult(), payload);

  clearQuizResult();
  assert.equal(loadQuizResult(), null);
});
