import { homePage } from '../pages/HomePage.js';
import { quizPage } from '../pages/QuizPage.js';
import { resultsPage } from '../pages/ResultsPage.js';
import { progressPage } from '../pages/ProgressPage.js';
import { adminPage } from '../pages/AdminPage.js';
import { createAttemptId } from '../utils/id.js';
import { buildQuizSession, calculateScore, buildQuestionReview, calculateCategoryScore } from '../utils/quizEngine.js';
import { saveSession, clearSession, pushHistory, loadHistory, saveDevQuestions } from '../utils/storage.js';
import { createInitialState } from './state.js';
import { ROUTES, parseRouteFromHash, readRoute, writeRoute } from './router.js';
import { questionBank } from '../data/questionBank.js';

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
  );

  header.append(title, nav);

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

    pushHistory({
      id: createAttemptId(),
      completedAt: new Date().toISOString(),
      filters: state.filters,
      score,
      categoryStats
    });

    state.history = loadHistory();
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
    state.filters = { mode: 'normal', category: 'all', difficulty: 'all', length: 10, order: 'shuffled' };
    state.questions = [];
    state.currentIndex = 0;
    state.answers = {};
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
      if (!state.questions.length) {
        state.startError = 'No quiz results to review yet. Complete a quiz first.';
        setRoute(ROUTES.home);
        return;
      }

      const score = calculateScore(state.answers, state.questions);
      const review = buildQuestionReview(state.questions, state.answers);
      main.appendChild(
        resultsPage({
          score,
          review,
          onRestart: restart
        })
      );
      return;
    }

    if (route === ROUTES.progress) {
      main.appendChild(progressPage({ history: state.history }));
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
