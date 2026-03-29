import { homePage } from '../pages/HomePage.js';
import { quizPage } from '../pages/QuizPage.js';
import { resultsPage } from '../pages/ResultsPage.js';
import { progressPage } from '../pages/ProgressPage.js';
import { adminPage } from '../pages/AdminPage.js';
import { createAttemptId } from '../utils/id.js';
import { buildQuizSession, calculateScore, buildQuestionReview, calculateCategoryScore } from '../utils/quizEngine.js';
import {
  saveSession,
  clearSession,
  pushHistory,
  loadHistory,
  saveDevQuestions,
  setQuizCompleted,
  saveQuizResult,
  clearQuizResult,
  saveAttemptDetails,
  loadAttemptDetails
} from '../utils/storage.js';
import { createInitialState } from './state.js';
import { ROUTES, parseRouteFromHash, readRoute, writeRoute } from './router.js';
import { questionBank } from '../data/questionBank.js';
import { createZonedTimestamp } from '../utils/dateTime.js';
import { initializeTheme } from '../utils/theme.js';

function navLink(path, label) {
  const link = document.createElement('a');
  link.href = `#${path}`;
  link.dataset.route = path;
  link.textContent = label;
  link.className = 'nav-link';
  return link;
}

function combinedQuestionBank(devQuestions) {
  return [...questionBank, ...devQuestions];
}

const ADMIN_NAV_FLAG_KEY = 'physio_quiz_admin_nav_enabled';


function buildThemeControl(themeManager) {
  const wrap = document.createElement('div');
  wrap.className = 'theme-control stack';

  const label = document.createElement('label');
  label.className = 'field-label';
  label.setAttribute('for', 'theme-mode');
  label.textContent = 'Theme';

  const select = document.createElement('select');
  select.id = 'theme-mode';
  select.className = 'input theme-select';
  select.setAttribute('aria-label', 'Theme mode');

  [
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
    { value: 'system', label: 'System' }
  ].forEach((optionDef) => {
    const option = document.createElement('option');
    option.value = optionDef.value;
    option.textContent = optionDef.label;
    select.appendChild(option);
  });

  select.value = themeManager.getMode();
  select.addEventListener('change', (event) => {
    themeManager.setMode(event.target.value);
  });

  wrap.append(label, select);
  return wrap;
}


function shouldShowAdminNavLink() {
  const hashQuery = location.hash.split('?')[1];
  const searchParams = new URLSearchParams(hashQuery || '');
  const devFlag = searchParams.get('dev');

  if (devFlag === '1') {
    try {
      localStorage.setItem(ADMIN_NAV_FLAG_KEY, '1');
    } catch {
      // Ignore storage write failures (e.g. private mode / storage disabled).
    }
    return true;
  }

  if (devFlag === '0') {
    try {
      localStorage.removeItem(ADMIN_NAV_FLAG_KEY);
    } catch {
      // Ignore storage removal failures (e.g. private mode / storage disabled).
    }
    return false;
  }

  try {
    return localStorage.getItem(ADMIN_NAV_FLAG_KEY) === '1';
  } catch {
    return false;
  }
}

export function createApp(root) {
  if (!root) {
    console.error('App root element not found.');
    return;
  }

  const state = createInitialState();
  const themeManager = initializeTheme();

  const appShell = document.createElement('div');
  appShell.className = 'app-shell';

  const header = document.createElement('header');
  header.className = 'topbar';
  const title = document.createElement('h1');
  title.textContent = 'Physio Quiz';

  const nav = document.createElement('nav');
  nav.className = 'nav';
  nav.setAttribute('aria-label', 'Primary');
  const primaryNavLinks = [
    navLink(ROUTES.home, 'Home'),
    navLink(ROUTES.quiz, 'Quiz'),
    navLink(ROUTES.progress, 'Progress')
  ];
  nav.append(...primaryNavLinks);

  const themeControl = buildThemeControl(themeManager);

  header.append(title, nav, themeControl);

  const main = document.createElement('main');
  main.className = 'main';

  appShell.append(header, main);
  root.appendChild(appShell);

  function setRoute(route) {
    state.route = route;
    writeRoute(route);
    render();
  }

  function persistSession() {
    saveSession({
      filters: state.filters,
      questions: state.questions,
      currentIndex: state.currentIndex,
      answers: state.answers
    });
  }

  function startQuiz(filters) {
    const session = buildQuizSession({ ...filters, questionSource: combinedQuestionBank(state.devQuestions) });
    if (!session.questions.length) {
      state.startError = 'No questions match this setup. Try broader filters or a different mode.';
      render();
      return;
    }

    state.startError = '';
    state.filters = session.filters;
    state.questions = session.questions;
    state.currentIndex = 0;
    state.answers = {};
    state.quizCompleted = false;
    state.latestResult = null;
    setQuizCompleted(false);
    clearQuizResult();
    persistSession();
    setRoute(ROUTES.quiz);
  }

  function addDevQuestion(question) {
    state.devQuestions.unshift(question);
    saveDevQuestions(state.devQuestions);
    render();
  }

  function selectAnswer(questionId, optionIndex) {
    state.answers[questionId] = optionIndex;
    persistSession();
    render();
  }

  function getUnansweredCount() {
    return state.questions.reduce((count, question) => {
      return state.answers[question.id] === undefined ? count + 1 : count;
    }, 0);
  }

  function previousQuestion() {
    if (state.currentIndex > 0) {
      state.currentIndex -= 1;
      persistSession();
      render();
    }
  }

  function submitQuiz() {
    const score = calculateScore(state.answers, state.questions);
    const categoryStats = calculateCategoryScore(state.answers, state.questions);
    const attemptId = createAttemptId();
    const completedAt = createZonedTimestamp();
    const review = buildQuestionReview(state.questions, state.answers);
    const unansweredCount = getUnansweredCount();

    pushHistory({
      id: attemptId,
      completedAt,
      filters: state.filters,
      score,
      categoryStats
    });

    saveAttemptDetails(attemptId, {
      completedAt,
      score,
      unansweredCount,
      review
    });

    state.history = loadHistory();
    state.quizCompleted = true;
    state.latestResult = {
      score,
      review,
      unansweredCount
    };
    setQuizCompleted(true);
    saveQuizResult(state.latestResult);
    clearSession();
    setRoute(ROUTES.results);
  }

  function nextQuestion() {
    if (state.currentIndex < state.questions.length - 1) {
      state.currentIndex += 1;
      persistSession();
      render();
      return;
    }

    submitQuiz();
  }

  function restart() {
    const previousMode = state.filters.mode === 'clinical-reasoning' ? 'clinical-reasoning' : 'normal';
    state.filters = { mode: previousMode, category: 'all', difficulty: 'all', length: 10, order: 'shuffled' };
    state.questions = [];
    state.currentIndex = 0;
    state.answers = {};
    state.quizCompleted = false;
    state.latestResult = null;
    setQuizCompleted(false);
    clearQuizResult();
    state.startError = '';
    clearSession();
    setRoute(ROUTES.home);
  }

  function render() {
    main.innerHTML = '';
    const route = state.route;
    nav.querySelectorAll('.nav-link').forEach((link) => {
      link.setAttribute('aria-current', link.dataset.route === route ? 'page' : 'false');
    });

    if (route === ROUTES.quiz) {
      if (!state.questions.length) {
        state.startError = 'No active quiz session. Start a new quiz to continue.';
        setRoute(ROUTES.home);
        return;
      }

      main.appendChild(
        quizPage({
          questions: state.questions,
          answers: state.answers,
          currentIndex: state.currentIndex,
          onSelectAnswer: selectAnswer,
          onNext: nextQuestion,
          onPrevious: previousQuestion
        })
      );
      return;
    }

    if (route === ROUTES.results) {
      if (!state.quizCompleted || !state.latestResult) {
        state.startError = 'No quiz results to review yet. Complete a quiz first.';
        state.quizCompleted = false;
        state.latestResult = null;
        setQuizCompleted(false);
        clearQuizResult();
        setRoute(ROUTES.home);
        return;
      }
      main.appendChild(
        resultsPage({
          score: state.latestResult.score,
          review: state.latestResult.review,
          unansweredCount: state.latestResult.unansweredCount,
          onRestart: restart
        })
      );
      return;
    }

    if (route === ROUTES.progress) {
      main.appendChild(
        progressPage({
          history: state.history,
          onViewAttemptDetails: (attemptId) => loadAttemptDetails(attemptId)
        })
      );
      return;
    }

    if (route === ROUTES.admin) {
      main.appendChild(
        adminPage({
          onSaveQuestion: addDevQuestion,
          existingQuestions: state.devQuestions
        })
      );
      return;
    }

    main.appendChild(
      homePage({
        onStart: startQuiz,
        initialFilters: state.filters,
        startError: state.startError,
        questionSource: combinedQuestionBank(state.devQuestions)
      })
    );
  }

  window.addEventListener('hashchange', () => {
    const parsed = parseRouteFromHash(location.hash);
    state.route = parsed.route;
    if (parsed.fellBack) {
      state.startError = 'That page was not found. You were redirected to Home.';
    }
    render();
  });

  const initialRoute = parseRouteFromHash(location.hash);
  if (initialRoute.fellBack) {
    state.route = initialRoute.route;
    state.startError = 'That page was not found. You were redirected to Home.';
  } else {
    state.route = readRoute();
  }

  render();
}
