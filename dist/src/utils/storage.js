const QUIZ_SESSION_KEY = 'physio_quiz_session';
const QUIZ_HISTORY_KEY = 'physio_quiz_history';

export function saveSession(session) {
  localStorage.setItem(QUIZ_SESSION_KEY, JSON.stringify(session));
}

export function loadSession() {
  const raw = localStorage.getItem(QUIZ_SESSION_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function clearSession() {
  localStorage.removeItem(QUIZ_SESSION_KEY);
}

export function pushHistory(entry) {
  const history = loadHistory();
  history.unshift(entry);
  localStorage.setItem(QUIZ_HISTORY_KEY, JSON.stringify(history.slice(0, 20)));
}

export function loadHistory() {
  const raw = localStorage.getItem(QUIZ_HISTORY_KEY);
  return raw ? JSON.parse(raw) : [];
}
