import { loadHistory, loadSession } from '../utils/storage.js';
import { ROUTES, readRoute } from './router.js';
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
  const state = {
    route: readRoute(),
    filters: { mode: 'normal', category: 'all', difficulty: 'all', length: 10, order: 'shuffled' },
    questions: [],
    currentIndex: 0,
    answers: {},
    history: loadHistory(),
    startError: ''
  };

  const restored = loadSession();
  if (restored && isRecord(restored)) {
    state.filters = isRecord(restored.filters)
      ? {
          mode: restored.filters.mode === 'clinical-reasoning' ? 'clinical-reasoning' : 'normal',
          category: typeof restored.filters.category === 'string' ? restored.filters.category : 'all',
          difficulty: typeof restored.filters.difficulty === 'string' ? restored.filters.difficulty : 'all',
          length: [5, 10, 15, 20].includes(restored.filters.length) ? restored.filters.length : 10,
          order: restored.filters.order === 'fixed' ? 'fixed' : 'shuffled'
        }
      : state.filters;

    state.questions = Array.isArray(restored.questions) ? restored.questions.filter(isValidQuestion) : [];

    const restoredIndex = Number.isInteger(restored.currentIndex) ? restored.currentIndex : 0;
    state.currentIndex = Math.max(0, Math.min(restoredIndex, Math.max(state.questions.length - 1, 0)));

    state.answers = sanitizeAnswers(restored.answers);

    if (state.route === ROUTES.home && state.questions.length) {
      state.route = ROUTES.quiz;
    }
  }

  return state;
}
