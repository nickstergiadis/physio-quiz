const QUIZ_SESSION_KEY = 'physio_quiz_session';
const QUIZ_PROGRESS_KEY = 'physio_quiz_progress_v1';
const LEGACY_QUIZ_HISTORY_KEY_V2 = 'physio_quiz_history_v2';
const LEGACY_QUIZ_HISTORY_KEY = 'physio_quiz_history';
const HISTORY_LIMIT = 50;
const PROGRESS_VERSION = 1;

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

  const id = typeof entry.id === 'string' ? entry.id : `attempt-${crypto.randomUUID()}`;
  const completedAt = typeof entry.completedAt === 'string' ? entry.completedAt : new Date().toISOString();
  const filters = isRecord(entry.filters)
    ? {
        mode: entry.filters.mode === 'clinical-reasoning' ? 'clinical-reasoning' : 'normal',
        category: typeof entry.filters.category === 'string' ? entry.filters.category : 'all',
        difficulty: typeof entry.filters.difficulty === 'string' ? entry.filters.difficulty : 'all',
        length: [5, 10, 15, 20].includes(entry.filters.length) ? entry.filters.length : 10,
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
    updatedAt: new Date().toISOString(),
    attempts: history.slice(0, HISTORY_LIMIT)
  };
}

function saveHistory(history) {
  localStorage.setItem(QUIZ_PROGRESS_KEY, JSON.stringify(createProgressDocument(history)));
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
  const legacyV2Raw = localStorage.getItem(LEGACY_QUIZ_HISTORY_KEY_V2);
  if (legacyV2Raw) {
    const migrated = readLegacyHistory(legacyV2Raw);
    if (migrated) {
      saveHistory(migrated);
    }
    localStorage.removeItem(LEGACY_QUIZ_HISTORY_KEY_V2);
  }

  const legacyRaw = localStorage.getItem(LEGACY_QUIZ_HISTORY_KEY);
  if (legacyRaw) {
    const migrated = readLegacyHistory(legacyRaw);
    if (migrated) {
      saveHistory(migrated);
    }
    localStorage.removeItem(LEGACY_QUIZ_HISTORY_KEY);
  }
}

export function saveSession(session) {
  localStorage.setItem(QUIZ_SESSION_KEY, JSON.stringify(session));
}

export function loadSession() {
  const raw = localStorage.getItem(QUIZ_SESSION_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch {
    localStorage.removeItem(QUIZ_SESSION_KEY);
    return null;
  }
}

export function clearSession() {
  localStorage.removeItem(QUIZ_SESSION_KEY);
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

  const raw = localStorage.getItem(QUIZ_PROGRESS_KEY);
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
    localStorage.removeItem(QUIZ_PROGRESS_KEY);
    return [];
  }
}
