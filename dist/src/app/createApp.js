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
  loadAttemptDetails,
  buildPersistedSnapshot,
  persistSnapshotToLocal,
  saveLinkedResumeCode,
  saveProfileStatus
} from '../utils/storage.js';
import { createInitialState } from './state.js';
import { ROUTES, parseRouteFromHash, readRoute, readResumeCodeFromLocation, writeRoute } from './router.js';
import { questionBank } from '../data/questionBank.js';
import { createZonedTimestamp } from '../utils/dateTime.js';
import { createProgressProfileService } from '../services/progressProfileService.js';
import { chooseSourceSnapshot } from '../services/progressSync.js';

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
const REMOTE_SAVE_DEBOUNCE_MS = 700;

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

function isRecord(value) {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

export function createApp(root) {
  if (!root) {
    console.error('App root element not found.');
    return;
  }

  const state = createInitialState();
  const profileService = createProgressProfileService();
  let resumeInputValue = readResumeCodeFromLocation();
  let pendingAutosaveTimer = null;
  let profileMessage = '';
  let hasBootstrappedRemoteProfile = false;

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

  header.append(title, nav);

  const main = document.createElement('main');
  main.className = 'main';

  appShell.append(header, main);
  root.appendChild(appShell);

  function collectAttemptDetailsMap() {
    const map = {};
    state.history.forEach((attempt) => {
      const details = loadAttemptDetails(attempt.id);
      if (details) {
        map[attempt.id] = details;
      }
    });
    return map;
  }

  function buildSnapshot() {
    return buildPersistedSnapshot({
      filters: state.filters,
      questions: state.questions,
      currentIndex: state.currentIndex,
      answers: state.answers,
      quizCompleted: state.quizCompleted,
      latestResult: state.latestResult,
      history: state.history,
      attemptDetails: collectAttemptDetailsMap(),
      profile: state.profile
    });
  }

  function applySnapshot(snapshot) {
    if (!isRecord(snapshot)) return;

    const profile = isRecord(snapshot.profile) ? snapshot.profile : {};
    state.profile.resumeCode = typeof profile.resumeCode === 'string' ? profile.resumeCode : state.profile.resumeCode;
    state.profile.status = typeof profile.status === 'string' ? profile.status : state.profile.status;

    if (isRecord(snapshot.filters)) {
      state.filters = {
        mode: snapshot.filters.mode === 'clinical-reasoning' ? 'clinical-reasoning' : 'normal',
        category: typeof snapshot.filters.category === 'string' ? snapshot.filters.category : 'all',
        difficulty: typeof snapshot.filters.difficulty === 'string' ? snapshot.filters.difficulty : 'all',
        length: Number.isInteger(snapshot.filters.length) && snapshot.filters.length > 0 ? snapshot.filters.length : 10,
        order: snapshot.filters.order === 'fixed' ? 'fixed' : 'shuffled'
      };
    }

    const session = isRecord(snapshot.session) ? snapshot.session : {};
    state.questions = Array.isArray(session.questions) ? session.questions : [];
    state.currentIndex = Math.max(
      0,
      Math.min(Number.isInteger(session.currentIndex) ? session.currentIndex : 0, Math.max(state.questions.length - 1, 0))
    );
    state.answers = isRecord(session.answers) ? session.answers : {};
    state.quizCompleted = Boolean(session.quizCompleted);

    state.latestResult = isRecord(snapshot.latestResult) ? snapshot.latestResult : null;
    state.history = Array.isArray(snapshot.history) ? snapshot.history : [];

    if (isRecord(snapshot.attemptDetails)) {
      Object.entries(snapshot.attemptDetails).forEach(([attemptId, details]) => {
        saveAttemptDetails(attemptId, details);
      });
    }

    persistSnapshotToLocal(snapshot);
  }

  async function runRemoteSave(reason) {
    if (!state.profile.resumeCode || !profileService.isAvailable()) return;

    const snapshot = buildSnapshot();
    snapshot.saveReason = reason;

    try {
      await profileService.saveProfileByCode(state.profile.resumeCode, snapshot);
      profileMessage = 'Saved to your profile.';
      state.profile.status = 'remote-linked';
      saveProfileStatus(state.profile.status);
    } catch (error) {
      profileMessage = `Save error: ${error.message || 'Could not save to remote profile. Local progress is still available.'}`;
    }
  }

  function queueRemoteSave(reason = 'state-change') {
    if (pendingAutosaveTimer) {
      clearTimeout(pendingAutosaveTimer);
    }
    pendingAutosaveTimer = setTimeout(() => {
      runRemoteSave(reason);
    }, REMOTE_SAVE_DEBOUNCE_MS);
  }

  function persistSession() {
    saveSession({
      filters: state.filters,
      questions: state.questions,
      currentIndex: state.currentIndex,
      answers: state.answers
    });
    queueRemoteSave('session-update');
  }

  async function createOrRefreshProfile() {
    const payload = buildSnapshot();

    if (state.profile.resumeCode) {
      try {
        await profileService.saveProfileByCode(state.profile.resumeCode, payload);
        profileMessage = 'Saved progress to your existing resume code.';
      } catch (error) {
        profileMessage = `Save error: ${error.message || 'Unable to save progress right now.'}`;
      }
      render();
      return;
    }

    try {
      const profileRecord = await profileService.createProfile(payload);
      state.profile.resumeCode = profileRecord.resumeCode;
      state.profile.status = 'remote-linked';
      saveLinkedResumeCode(profileRecord.resumeCode);
      saveProfileStatus('remote-linked');
      profileMessage = `Your resume code: ${profileRecord.resumeCode}. Save it somewhere safe.`;
      render();
    } catch (error) {
      profileMessage = `Save error: ${error.message || 'Unable to create a profile right now.'}`;
      render();
    }
  }

  async function resumeSavedProgress(resumeCodeInput) {
    const resumeCode = profileService.normalizeResumeCode(resumeCodeInput);
    resumeInputValue = resumeCode;

    try {
      const profileRecord = await profileService.loadProfileByCode(resumeCode);
      const nextSnapshot = isRecord(profileRecord.payload) ? profileRecord.payload : {};
      nextSnapshot.profile = {
        resumeCode: profileRecord.resumeCode,
        status: 'remote-linked'
      };

      applySnapshot(nextSnapshot);
      state.profile.resumeCode = profileRecord.resumeCode;
      state.profile.status = 'remote-linked';
      saveLinkedResumeCode(profileRecord.resumeCode);
      saveProfileStatus('remote-linked');
      profileMessage = 'Saved progress loaded successfully.';

      if (state.questions.length && !state.quizCompleted) {
        setRoute(ROUTES.quiz);
        return;
      }

      if (state.quizCompleted && state.latestResult) {
        setRoute(ROUTES.results);
        return;
      }

      setRoute(ROUTES.home);
    } catch (error) {
      profileMessage = `Resume error: ${error.message || 'Could not load saved progress. Please try again.'}`;
      render();
    }
  }

  async function copyResumeCode() {
    if (!state.profile.resumeCode) return;

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(state.profile.resumeCode);
        profileMessage = 'Resume code copied to clipboard.';
      } else {
        profileMessage = 'Copy not supported in this browser. Please copy the code manually.';
      }
    } catch {
      profileMessage = 'Copy failed. Please copy the code manually.';
    }
    render();
  }

  async function copyResumeLink() {
    if (!state.profile.resumeCode) return;
    const resumeUrl = `${location.origin}${location.pathname}?resume=${encodeURIComponent(state.profile.resumeCode)}`;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(resumeUrl);
        profileMessage = 'Resume link copied to clipboard.';
      } else {
        profileMessage = 'Copy not supported in this browser. Please copy the link manually.';
      }
    } catch {
      profileMessage = 'Copy failed. Please copy the link manually.';
    }
    render();
  }

  async function bootstrapRemoteProfileIfLinked() {
    if (hasBootstrappedRemoteProfile) return;
    hasBootstrappedRemoteProfile = true;
    if (!state.profile.resumeCode || !profileService.isAvailable()) return;

    try {
      const profileRecord = await profileService.loadProfileByCode(state.profile.resumeCode);
      const remoteSnapshot = isRecord(profileRecord.payload) ? profileRecord.payload : {};
      const localSnapshot = buildSnapshot();
      const decision = chooseSourceSnapshot({ localSnapshot, remoteSnapshot });

      if (decision.winner === 'local') {
        await profileService.saveProfileByCode(state.profile.resumeCode, localSnapshot);
        profileMessage = 'Local changes were newer, so they were synced to your saved profile.';
      } else {
        const restored = isRecord(decision.snapshot) ? decision.snapshot : {};
        restored.profile = {
          resumeCode: profileRecord.resumeCode,
          status: 'remote-linked'
        };
        applySnapshot(restored);
        profileMessage = decision.reason;
      }
      render();
    } catch {
      profileMessage = 'Could not refresh saved profile. Local progress is still available on this device.';
      render();
    }
  }

  function setRoute(route) {
    state.route = route;
    writeRoute(route);
    render();
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
    queueRemoteSave('quiz-completed');
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
    queueRemoteSave('restart');
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
        questionSource: combinedQuestionBank(state.devQuestions),
        profile: state.profile,
        profileMessage,
        resumeInputValue,
        onCreateProfile: createOrRefreshProfile,
        onResumeProfile: resumeSavedProgress,
        onCopyResumeCode: copyResumeCode,
        onCopyResumeLink: copyResumeLink
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

  if (shouldShowAdminNavLink() && !nav.querySelector('[data-route="/admin-dev"]')) {
    nav.appendChild(navLink(ROUTES.admin, 'Admin (Dev)'));
  }

  render();
  bootstrapRemoteProfileIfLinked();

  const resumeCodeFromLocation = readResumeCodeFromLocation();
  if (resumeCodeFromLocation) {
    resumeSavedProgress(resumeCodeFromLocation);
  }
}
