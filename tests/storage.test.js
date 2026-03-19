import test from 'node:test';
import assert from 'node:assert/strict';

import { loadHistory, loadSession, pushHistory, saveSession } from '../src/utils/storage.js';

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
