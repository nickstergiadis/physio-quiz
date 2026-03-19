const QUIZ_SESSION_KEY = 'physio_quiz_session';
const QUIZ_HISTORY_KEY = 'physio_quiz_history_v2';
const LEGACY_QUIZ_HISTORY_KEY = 'physio_quiz_history';
const HISTORY_LIMIT = 50;

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
        category: typeof entry.filters.category === 'string' ? entry.filters.category : 'all',
        difficulty: typeof entry.filters.difficulty === 'string' ? entry.filters.difficulty : 'all'
      }
    : { category: 'all', difficulty: 'all' };

  return {
    id,
    completedAt,
    filters,
    score: sanitizeScore(entry.score),
    categoryStats: sanitizeCategoryStats(entry.categoryStats)
  };
}

function saveHistory(history) {
  localStorage.setItem(QUIZ_HISTORY_KEY, JSON.stringify(history.slice(0, HISTORY_LIMIT)));
}

function migrateLegacyHistory() {
  const raw = localStorage.getItem(LEGACY_QUIZ_HISTORY_KEY);
  if (!raw) return;

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      localStorage.removeItem(LEGACY_QUIZ_HISTORY_KEY);
      return;
    }

    const migrated = parsed.map(sanitizeHistoryEntry).filter(Boolean);
    saveHistory(migrated);
    localStorage.removeItem(LEGACY_QUIZ_HISTORY_KEY);
  } catch {
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

  const raw = localStorage.getItem(QUIZ_HISTORY_KEY);
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map(sanitizeHistoryEntry).filter(Boolean);
  } catch {
    localStorage.removeItem(QUIZ_HISTORY_KEY);
    return [];
  }
}
