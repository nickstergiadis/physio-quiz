import { createAttemptId } from './id.js';
import { createZonedTimestamp } from './dateTime.js';

const QUIZ_SESSION_KEY = 'physio_quiz_session';
const QUIZ_COMPLETED_KEY = 'physio_quiz_completed';
const QUIZ_PROGRESS_KEY = 'physio_quiz_progress_v1';
const QUIZ_RESULT_KEY = 'physio_quiz_result_v1';
const QUIZ_ATTEMPT_DETAILS_KEY = 'physio_quiz_attempt_details_v1';
const DEV_QUESTION_DRAFTS_KEY = 'physio_quiz_dev_questions_v1';
const LEGACY_QUIZ_HISTORY_KEY_V2 = 'physio_quiz_history_v2';
const LEGACY_QUIZ_HISTORY_KEY = 'physio_quiz_history';
const HISTORY_LIMIT = 50;
const PROGRESS_VERSION = 1;

const LINKED_RESUME_CODE_KEY = 'physio_quiz_resume_code_v1';
const PROFILE_STATUS_KEY = 'physio_quiz_profile_status_v1';
const APP_DATA_VERSION = 2;

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

function sanitizeReviewItem(item) {
  if (!isRecord(item)) return null;
  if (typeof item.question !== 'string' || !Array.isArray(item.options)) return null;

  const options = item.options.map((option) => (typeof option === 'string' ? option : String(option ?? '')));
  const correctAnswer = Number.isInteger(item.correctAnswer) ? item.correctAnswer : -1;
  const selectedAnswer = Number.isInteger(item.selectedAnswer) && item.selectedAnswer >= 0 ? item.selectedAnswer : null;

  return {
    question: item.question,
    options,
    selectedAnswer,
    correctAnswer,
    explanation: typeof item.explanation === 'string' ? item.explanation : '',
    isCorrect: selectedAnswer === correctAnswer
  };
}

function sanitizeAttemptDetails(details) {
  if (!isRecord(details) || !Array.isArray(details.review)) return null;
  const score = sanitizeScore(details.score);

  return {
    id: typeof details.id === 'string' ? details.id : createAttemptId(),
    completedAt: typeof details.completedAt === 'string' ? details.completedAt : createZonedTimestamp(),
    score,
    unansweredCount: Number.isInteger(details.unansweredCount) && details.unansweredCount >= 0 ? details.unansweredCount : 0,
    review: details.review.map(sanitizeReviewItem).filter(Boolean)
  };
}

function loadAttemptDetailsDocument() {
  const raw = safeGetItem(QUIZ_ATTEMPT_DETAILS_KEY);
  if (!raw) return {};

  try {
    const parsed = JSON.parse(raw);
    if (!isRecord(parsed)) return {};
    return parsed;
  } catch {
    safeRemoveItem(QUIZ_ATTEMPT_DETAILS_KEY);
    return {};
  }
}

function saveAttemptDetailsDocument(document) {
  safeSetItem(QUIZ_ATTEMPT_DETAILS_KEY, JSON.stringify(document));
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

  const validAttemptIds = new Set(history.map((attempt) => attempt.id));
  const detailsDocument = loadAttemptDetailsDocument();
  const pruned = Object.fromEntries(Object.entries(detailsDocument).filter(([id]) => validAttemptIds.has(id)));
  saveAttemptDetailsDocument(pruned);
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

export function saveAttemptDetails(attemptId, details) {
  if (typeof attemptId !== 'string' || !attemptId) return;
  const sanitized = sanitizeAttemptDetails({ ...details, id: attemptId });
  if (!sanitized) return;

  const document = loadAttemptDetailsDocument();
  document[attemptId] = sanitized;
  saveAttemptDetailsDocument(document);
}

export function loadAttemptDetails(attemptId) {
  if (typeof attemptId !== 'string' || !attemptId) return null;
  const document = loadAttemptDetailsDocument();
  const details = sanitizeAttemptDetails(document[attemptId]);
  return details || null;
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

export function saveLinkedResumeCode(resumeCode) {
  if (typeof resumeCode !== 'string' || !resumeCode.trim()) return;
  safeSetItem(LINKED_RESUME_CODE_KEY, resumeCode.trim());
}

export function loadLinkedResumeCode() {
  return safeGetItem(LINKED_RESUME_CODE_KEY) || '';
}

export function clearLinkedResumeCode() {
  safeRemoveItem(LINKED_RESUME_CODE_KEY);
}

export function saveProfileStatus(status) {
  if (typeof status !== 'string') return;
  safeSetItem(PROFILE_STATUS_KEY, status);
}

export function loadProfileStatus() {
  return safeGetItem(PROFILE_STATUS_KEY) || 'local-only';
}

function loadAttemptDetailsMap() {
  const rawMap = loadAttemptDetailsDocument();
  return Object.fromEntries(
    Object.entries(rawMap)
      .map(([id, details]) => [id, sanitizeAttemptDetails({ ...details, id })])
      .filter(([, details]) => !!details)
  );
}

export function buildPersistedSnapshot({
  filters,
  questions,
  currentIndex,
  answers,
  quizCompleted,
  latestResult,
  history,
  attemptDetails,
  profile
}) {
  const detailsMap = isRecord(attemptDetails) ? attemptDetails : loadAttemptDetailsMap();
  return {
    appDataVersion: APP_DATA_VERSION,
    updatedAt: createZonedTimestamp(),
    filters: isRecord(filters) ? filters : { mode: 'normal', category: 'all', difficulty: 'all', length: 10, order: 'shuffled' },
    session: {
      questions: Array.isArray(questions) ? questions : [],
      currentIndex: Number.isInteger(currentIndex) ? currentIndex : 0,
      answers: isRecord(answers) ? answers : {},
      quizCompleted: Boolean(quizCompleted)
    },
    latestResult: isRecord(latestResult) ? latestResult : null,
    history: Array.isArray(history) ? history.map(sanitizeHistoryEntry).filter(Boolean) : loadHistory(),
    attemptDetails: detailsMap,
    profile: isRecord(profile)
      ? {
          resumeCode: typeof profile.resumeCode === 'string' ? profile.resumeCode : '',
          status: typeof profile.status === 'string' ? profile.status : loadProfileStatus()
        }
      : {
          resumeCode: loadLinkedResumeCode(),
          status: loadProfileStatus()
        }
  };
}

export function persistSnapshotToLocal(snapshot) {
  if (!isRecord(snapshot)) return;

  if (isRecord(snapshot.session) && Array.isArray(snapshot.session.questions) && snapshot.session.questions.length) {
    saveSession({
      filters: isRecord(snapshot.filters) ? snapshot.filters : undefined,
      questions: snapshot.session.questions,
      currentIndex: Number.isInteger(snapshot.session.currentIndex) ? snapshot.session.currentIndex : 0,
      answers: isRecord(snapshot.session.answers) ? snapshot.session.answers : {}
    });
  } else {
    clearSession();
  }

  if (Array.isArray(snapshot.history)) {
    saveHistory(snapshot.history);
  }

  if (isRecord(snapshot.attemptDetails)) {
    saveAttemptDetailsDocument(snapshot.attemptDetails);
  }

  if (snapshot.session?.quizCompleted && snapshot.latestResult) {
    setQuizCompleted(true);
    saveQuizResult(snapshot.latestResult);
  } else {
    setQuizCompleted(false);
    clearQuizResult();
  }

  if (typeof snapshot.profile?.resumeCode === 'string' && snapshot.profile.resumeCode) {
    saveLinkedResumeCode(snapshot.profile.resumeCode);
  }

  if (typeof snapshot.profile?.status === 'string') {
    saveProfileStatus(snapshot.profile.status);
  }
}
