import { createAttemptId } from './id.js';
import { createZonedTimestamp } from './dateTime.js';

const QUIZ_SESSION_KEY = 'physio_quiz_session';
const QUIZ_COMPLETED_KEY = 'physio_quiz_completed';
const QUIZ_PROGRESS_KEY = 'physio_quiz_progress_v1';
const QUIZ_RESULT_KEY = 'physio_quiz_result_v1';
const DEV_QUESTION_DRAFTS_KEY = 'physio_quiz_dev_questions_v1';
const LEGACY_QUIZ_HISTORY_KEY_V2 = 'physio_quiz_history_v2';
const LEGACY_QUIZ_HISTORY_KEY = 'physio_quiz_history';
const HISTORY_LIMIT = 50;
const PROGRESS_VERSION = 1;

function safeGetItem(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSetItem(key, value) {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

function safeRemoveItem(key) {
  try {
    localStorage.removeItem(key);
  } catch {
    // Ignore storage removal failures (e.g. storage disabled).
  }
}

function isRecord(value) {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

function sanitizeScore(value) {
  const score = isRecord(value) ? value : {};
  const correct = Number.isFinite(score.correct) ? score.correct : 0;
  const total = Number.isFinite(score.total) ? score.total : 0;
  const percent = total ? Math.round((correct / total) * 100) : 0;
  return { correct, total, percent };
}

function sanitizeCategoryStats(value) {
  if (!isRecord(value)) return {};
  return Object.fromEntries(
    Object.entries(value)
      .filter(([, stats]) => isRecord(stats))
      .map(([category, stats]) => {
        const correct = Number.isFinite(stats.correct) ? stats.correct : 0;
        const total = Number.isFinite(stats.total) ? stats.total : 0;
        return [category, { correct, total, percent: total ? Math.round((correct / total) * 100) : 0 }];
      })
  );
}

function sanitizeHistoryEntry(entry) {
  if (!isRecord(entry)) return null;

  const id = typeof entry.id === 'string' ? entry.id : createAttemptId();
  const completedAt = (() => {
    if (typeof entry.completedAt !== 'string') return createZonedTimestamp();
    const parsed = new Date(entry.completedAt);
    return Number.isNaN(parsed.getTime()) ? createZonedTimestamp() : createZonedTimestamp(parsed);
  })();
  const filters = isRecord(entry.filters)
    ? {
        mode: entry.filters.mode === 'clinical-reasoning' ? 'clinical-reasoning' : 'normal',
        category: typeof entry.filters.category === 'string' ? entry.filters.category : 'all',
        difficulty: typeof entry.filters.difficulty === 'string' ? entry.filters.difficulty : 'all',
        length: Number.isInteger(entry.filters.length) && entry.filters.length > 0 ? entry.filters.length : 10,
        order: entry.filters.order === 'fixed' ? 'fixed' : 'shuffled'
      }
    : { mode: 'normal', category: 'all', difficulty: 'all', length: 10, order: 'shuffled' };

  return {
    id,
    completedAt,
    filters,
    score: sanitizeScore(entry.score),
    categoryStats: sanitizeCategoryStats(entry.categoryStats)
  };
}

function createProgressDocument(history) {
  return {
    version: PROGRESS_VERSION,
    updatedAt: createZonedTimestamp(),
    attempts: history.slice(0, HISTORY_LIMIT)
  };
}

function saveHistory(history) {
  safeSetItem(QUIZ_PROGRESS_KEY, JSON.stringify(createProgressDocument(history)));
}

function readLegacyHistory(raw) {
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    return parsed.map(sanitizeHistoryEntry).filter(Boolean);
  } catch {
    return null;
  }
}

function migrateLegacyHistory() {
  const legacyV2Raw = safeGetItem(LEGACY_QUIZ_HISTORY_KEY_V2);
  if (legacyV2Raw) {
    const migrated = readLegacyHistory(legacyV2Raw);
    if (migrated) {
      saveHistory(migrated);
    }
    safeRemoveItem(LEGACY_QUIZ_HISTORY_KEY_V2);
  }

  const legacyRaw = safeGetItem(LEGACY_QUIZ_HISTORY_KEY);
  if (legacyRaw) {
    const migrated = readLegacyHistory(legacyRaw);
    if (migrated) {
      saveHistory(migrated);
    }
    safeRemoveItem(LEGACY_QUIZ_HISTORY_KEY);
  }
}

export function saveSession(session) {
  safeSetItem(QUIZ_SESSION_KEY, JSON.stringify(session));
}

export function loadSession() {
  const raw = safeGetItem(QUIZ_SESSION_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch {
    safeRemoveItem(QUIZ_SESSION_KEY);
    return null;
  }
}

export function clearSession() {
  safeRemoveItem(QUIZ_SESSION_KEY);
}

export function setQuizCompleted(isCompleted) {
  if (isCompleted) {
    safeSetItem(QUIZ_COMPLETED_KEY, '1');
    return;
  }
  safeRemoveItem(QUIZ_COMPLETED_KEY);
}

export function isQuizCompleted() {
  return safeGetItem(QUIZ_COMPLETED_KEY) === '1';
}

export function saveQuizResult(result) {
  safeSetItem(QUIZ_RESULT_KEY, JSON.stringify(result));
}

export function loadQuizResult() {
  const raw = safeGetItem(QUIZ_RESULT_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch {
    safeRemoveItem(QUIZ_RESULT_KEY);
    return null;
  }
}

export function clearQuizResult() {
  safeRemoveItem(QUIZ_RESULT_KEY);
}

export function pushHistory(entry) {
  const history = loadHistory();
  const normalized = sanitizeHistoryEntry(entry);
  if (!normalized) return;
  history.unshift(normalized);
  saveHistory(history);
}

export function loadHistory() {
  migrateLegacyHistory();

  const raw = safeGetItem(QUIZ_PROGRESS_KEY);
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);

    if (Array.isArray(parsed)) {
      return parsed.map(sanitizeHistoryEntry).filter(Boolean);
    }

    if (!isRecord(parsed) || !Array.isArray(parsed.attempts)) {
      return [];
    }

    return parsed.attempts.map(sanitizeHistoryEntry).filter(Boolean);
  } catch {
    safeRemoveItem(QUIZ_PROGRESS_KEY);
    return [];
  }
}

export function saveDevQuestions(questions) {
  safeSetItem(DEV_QUESTION_DRAFTS_KEY, JSON.stringify(questions));
}

export function loadDevQuestions() {
  const raw = safeGetItem(DEV_QUESTION_DRAFTS_KEY);
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    safeRemoveItem(DEV_QUESTION_DRAFTS_KEY);
    return [];
  }
}
