import { homePage } from '../pages/HomePage.js';
import { quizPage } from '../pages/QuizPage.js';
import { resultsPage } from '../pages/ResultsPage.js';
import { progressPage } from '../pages/ProgressPage.js';
import { getQuestions, calculateScore } from '../utils/quizEngine.js';
import { saveSession, clearSession, pushHistory, loadHistory } from '../utils/storage.js';
import { createInitialState } from './state.js';
import { ROUTES, readRoute, writeRoute } from './router.js';

function navLink(path, label) {
  const link = document.createElement('a');
  link.href = `#${path}`;
  link.textContent = label;
  link.className = 'nav-link';
  return link;
}

export function createApp(root) {
  const state = createInitialState();

  const appShell = document.createElement('div');
  appShell.className = 'app-shell';

  const header = document.createElement('header');
  header.className = 'topbar';
  const title = document.createElement('h1');
  title.textContent = 'Physio Quiz';

  const nav = document.createElement('nav');
  nav.className = 'nav';
  nav.append(navLink(ROUTES.home, 'Home'), navLink(ROUTES.quiz, 'Quiz'), navLink(ROUTES.progress, 'Progress'));

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
    state.filters = filters;
    state.questions = getQuestions({ ...filters, limit: 5 });
    state.currentIndex = 0;
    state.answers = {};
    persistSession();
    setRoute(ROUTES.quiz);
  }

  function selectAnswer(questionId, optionId) {
    state.answers[questionId] = optionId;
    persistSession();
    render();
  }

  function nextQuestion() {
    if (state.currentIndex < state.questions.length - 1) {
      state.currentIndex += 1;
      persistSession();
      render();
      return;
    }

    const score = calculateScore(state.answers, state.questions);
    pushHistory({
      completedAt: new Date().toISOString(),
      filters: state.filters,
      score
    });
    state.history = loadHistory();
    clearSession();
    setRoute(ROUTES.results);
  }

  function restart() {
    state.filters = { category: 'all', difficulty: 'all' };
    state.questions = [];
    state.currentIndex = 0;
    state.answers = {};
    clearSession();
    setRoute(ROUTES.home);
  }

  function render() {
    main.innerHTML = '';
    const route = readRoute();

    if (route === ROUTES.quiz) {
      main.appendChild(
        quizPage({
          questions: state.questions,
          answers: state.answers,
          currentIndex: state.currentIndex,
          onSelectAnswer: selectAnswer,
          onNext: nextQuestion
        })
      );
      return;
    }

    if (route === ROUTES.results) {
      const score = calculateScore(state.answers, state.questions);
      main.appendChild(
        resultsPage({
          score,
          questions: state.questions,
          answers: state.answers,
          onRestart: restart
        })
      );
      return;
    }

    if (route === ROUTES.progress) {
      main.appendChild(progressPage({ history: state.history }));
      return;
    }

    main.appendChild(homePage({ onStart: startQuiz }));
  }

  window.addEventListener('hashchange', () => {
    state.route = readRoute();
    render();
  });

  render();
}
