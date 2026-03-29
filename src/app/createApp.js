import { homePage } from '../pages/HomePage.js';
import { quizPage } from '../pages/QuizPage.js';
import { resultsPage } from '../pages/ResultsPage.js';
import { progressPage } from '../pages/ProgressPage.js';
import { legalPage } from '../pages/LegalPage.js';
import { createAttemptId } from '../utils/id.js';
import { buildQuizSession, calculateScore, buildQuestionReview, calculateCategoryScore } from '../utils/quizEngine.js';
import {
  saveSession,
  clearSession,
  pushHistory,
  loadHistory,
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

const LEGAL_PAGE_CONTENT = {
  [ROUTES.privacy]: {
    title: 'Privacy Policy',
    intro: 'Physio Quiz is a static app that runs entirely in your browser.',
    sections: [
      {
        title: 'What we store',
        paragraphs: [
          'Quiz progress, attempt history, and theme preference are saved locally in your browser storage on this device.'
        ]
      },
      {
        title: 'Accounts and cloud storage',
        paragraphs: [
          'No account is required and no personal profile is created.',
          'This app does not guarantee cloud backup or cross-device sync. If local browser data is cleared, your history may be lost.'
        ]
      }
    ]
  },
  [ROUTES.terms]: {
    title: 'Terms of Use',
    intro: 'By using Physio Quiz, you agree to these basic terms.',
    sections: [
      {
        title: 'Educational use',
        paragraphs: ['Physio Quiz is provided as-is for education and self-review purposes.']
      },
      {
        title: 'Service availability',
        paragraphs: [
          'We may update, limit, or remove content at any time without notice.',
          'Use of this app is at your own discretion.'
        ]
      }
    ]
  },
  [ROUTES.disclaimer]: {
    title: 'Medical/Educational Disclaimer',
    intro: 'Physio Quiz supports learning and revision only.',
    sections: [
      {
        title: 'Not medical advice',
        paragraphs: [
          'Content in this app is not medical advice, diagnosis, or treatment guidance.',
          'It should not replace clinical judgment, formal education, supervision, or local policy requirements.'
        ]
      }
    ]
  }
};

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

  const footer = document.createElement('footer');
  footer.className = 'app-footer';
  const legalNav = document.createElement('nav');
  legalNav.className = 'footer-nav';
  legalNav.setAttribute('aria-label', 'Legal');
  legalNav.append(
    navLink(ROUTES.privacy, 'Privacy'),
    navLink(ROUTES.terms, 'Terms'),
    navLink(ROUTES.disclaimer, 'Disclaimer')
  );
  footer.appendChild(legalNav);

  appShell.append(header, main, footer);
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
    const session = buildQuizSession({ ...filters, questionSource: questionBank });
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

    if (LEGAL_PAGE_CONTENT[route]) {
      main.appendChild(legalPage(LEGAL_PAGE_CONTENT[route]));
      return;
    }

    main.appendChild(
      homePage({
        onStart: startQuiz,
        initialFilters: state.filters,
        startError: state.startError,
        questionSource: questionBank
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
