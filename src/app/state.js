import {
  isQuizCompleted,
  loadDevQuestions,
  loadHistory,
  loadQuizResult,
  loadSession,
  loadLinkedResumeCode,
  loadProfileStatus,
  setQuizCompleted
} from '../utils/storage.js';
import { ROUTES, resolveRoute } from './router.js';
import { isValidQuestion } from '../data/schema/quizSchema.js';

function isRecord(value) {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

function sanitizeAnswers(value) {
  if (!isRecord(value)) return {};
  return Object.fromEntries(
    Object.entries(value).filter(([, answer]) => Number.isInteger(answer) && answer >= 0 && answer < 4)
  );
}

export function createInitialState() {
  const routeState = resolveRoute();
  const state = {
    route: routeState.route,
    filters: { mode: 'normal', category: 'all', difficulty: 'all', length: 10, order: 'shuffled' },
    questions: [],
    currentIndex: 0,
    answers: {},
    quizCompleted: isQuizCompleted(),
    latestResult: loadQuizResult(),
    history: loadHistory(),
    devQuestions: loadDevQuestions().filter(isValidQuestion),
    profile: {
      resumeCode: loadLinkedResumeCode(),
      status: loadProfileStatus()
    },
    startError: routeState.unknownHash ? 'That page wasn’t found; you were redirected to Home.' : ''
  };

  const restored = loadSession();
  if (restored && isRecord(restored)) {
    state.filters = isRecord(restored.filters)
      ? {
          mode: restored.filters.mode === 'clinical-reasoning' ? 'clinical-reasoning' : 'normal',
          category: typeof restored.filters.category === 'string' ? restored.filters.category : 'all',
          difficulty: typeof restored.filters.difficulty === 'string' ? restored.filters.difficulty : 'all',
          length:
            Number.isInteger(restored.filters.length) && restored.filters.length > 0 ? restored.filters.length : 10,
          order: restored.filters.order === 'fixed' ? 'fixed' : 'shuffled'
        }
      : state.filters;

    state.questions = Array.isArray(restored.questions) ? restored.questions.filter(isValidQuestion) : [];

    const restoredIndex = Number.isInteger(restored.currentIndex) ? restored.currentIndex : 0;
    state.currentIndex = Math.max(0, Math.min(restoredIndex, Math.max(state.questions.length - 1, 0)));

    state.answers = sanitizeAnswers(restored.answers);
    if (state.questions.length) {
      state.quizCompleted = false;
      state.latestResult = null;
      setQuizCompleted(false);
    }

    if (state.route === ROUTES.home && state.questions.length) {
      state.route = ROUTES.quiz;
    }
  }

  return state;
}
