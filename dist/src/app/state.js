import { loadHistory, loadSession } from '../utils/storage.js';
import { ROUTES, readRoute } from './router.js';

export function createInitialState() {
  const state = {
    route: readRoute(),
    filters: { category: 'all', difficulty: 'all' },
    questions: [],
    currentIndex: 0,
    answers: {},
    history: loadHistory()
  };

  const restored = loadSession();
  if (restored) {
    state.filters = restored.filters;
    state.questions = restored.questions;
    state.currentIndex = restored.currentIndex;
    state.answers = restored.answers;
    if (state.route === ROUTES.home) {
      state.route = ROUTES.quiz;
    }
  }

  return state;
}
