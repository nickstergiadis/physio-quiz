import test from 'node:test';
import assert from 'node:assert/strict';

import { createApp } from '../src/app/createApp.js';
import { ROUTES } from '../src/app/router.js';
import { createMiniDom } from './helpers/miniDom.js';

function installAppDom({ hash = `#${ROUTES.home}`, storage = {}, prefersDark = false } = {}) {
  const dom = createMiniDom();
  const root = dom.document.createElement('div');
  root.id = 'app';
  dom.document.body.appendChild(root);
  dom.window.location.hash = hash;

  const storageState = new Map(Object.entries(storage));
  const localStorage = {
    getItem(key) {
      return storageState.has(key) ? storageState.get(key) : null;
    },
    setItem(key, value) {
      storageState.set(key, String(value));
    },
    removeItem(key) {
      storageState.delete(key);
    },
    clear() {
      storageState.clear();
    }
  };


  const mediaListeners = new Set();
  const mediaQuery = {
    media: '(prefers-color-scheme: dark)',
    matches: prefersDark,
    addEventListener(type, listener) {
      if (type === 'change') mediaListeners.add(listener);
    },
    removeEventListener(type, listener) {
      if (type === 'change') mediaListeners.delete(listener);
    }
  };

  dom.window.matchMedia = () => mediaQuery;

  global.window = dom.window;
  global.document = dom.document;
  global.location = dom.window.location;
  global.Event = dom.Event;
  global.localStorage = localStorage;

  const appRoot = document.querySelector('#app');
  createApp(appRoot);

  return {
    dom,
    root: appRoot,
    storageState,
    setSystemTheme(isDark) {
      mediaQuery.matches = isDark;
      mediaListeners.forEach((listener) => listener({ matches: isDark }));
    }
  };
}

function clickByText(text) {
  const button = [...document.querySelectorAll('button,a')].find((el) => el.textContent.trim() === text);
  assert.ok(button, `Expected element with text "${text}" to exist`);
  button.click();
}

test('home/setup render and default start behavior', () => {
  installAppDom();

  assert.equal(document.querySelector('h1')?.textContent, 'Physio Quiz');
  assert.ok(document.body.textContent.includes('Choose quiz mode, category, and difficulty'));
  assert.ok(document.body.textContent.includes('Start Quiz'));

  clickByText('Start Quiz');

  assert.equal(window.location.hash, ROUTES.quiz);
  assert.ok(document.body.textContent.includes('Question 1 of 10'));
});

test('answer + submit flow renders results with explanation text and attempt appears in progress', () => {
  const { storageState } = installAppDom();

  clickByText('Start Quiz');
  assert.equal(storageState.has('physio_quiz_completed'), false);

  for (let i = 0; i < 10; i += 1) {
    const firstOption = document.querySelector('.option-btn');
    assert.ok(firstOption, 'Expected at least one answer option');
    firstOption.click();
    clickByText(i === 9 ? 'Submit Quiz' : 'Next');
  }

  assert.equal(window.location.hash, ROUTES.results);
  assert.equal(storageState.get('physio_quiz_completed'), '1');
  assert.ok(document.body.textContent.includes('Quiz Results'));
  assert.ok(document.body.textContent.includes('Explanation:'));

  window.location.hash = `#${ROUTES.progress}`;
  window.dispatchEvent(new Event('hashchange'));

  assert.equal(window.location.hash, `#${ROUTES.progress}`);
  assert.ok(document.body.textContent.includes('Progress Dashboard'));
  assert.ok(document.body.textContent.includes('Quizzes completed'));
  assert.ok(document.body.textContent.includes('Recent Quiz Attempts'));
  clickByText('View details');
  assert.ok(document.body.textContent.includes('Correct answer:'));
  assert.ok(document.body.textContent.includes('Explanation:'));
});

test('results route is guarded during an active quiz and redirects home', () => {
  installAppDom({ hash: `#${ROUTES.results}` });

  clickByText('Start Quiz');
  assert.equal(window.location.hash, ROUTES.quiz);

  window.location.hash = `#${ROUTES.results}`;
  window.dispatchEvent(new Event('hashchange'));

  assert.ok([ROUTES.home, `#${ROUTES.home}`].includes(window.location.hash));
  assert.ok(document.body.textContent.includes('No quiz results to review yet. Complete a quiz first.'));
});

test('starting a new quiz clears stale result state and /results redirects home until next submit', () => {
  const { storageState } = installAppDom();

  clickByText('Start Quiz');
  for (let i = 0; i < 10; i += 1) {
    document.querySelector('.option-btn')?.click();
    clickByText(i === 9 ? 'Submit Quiz' : 'Next');
  }

  assert.equal(window.location.hash, ROUTES.results);
  assert.equal(storageState.has('physio_quiz_result_v1'), true);

  window.location.hash = `#${ROUTES.home}`;
  window.dispatchEvent(new Event('hashchange'));
  assert.ok([ROUTES.home, `#${ROUTES.home}`].includes(window.location.hash));

  clickByText('Start Quiz');
  assert.equal(storageState.has('physio_quiz_result_v1'), false);

  window.location.hash = `#${ROUTES.home}`;
  window.dispatchEvent(new Event('hashchange'));
  window.location.hash = `#${ROUTES.results}`;
  window.dispatchEvent(new Event('hashchange'));

  assert.equal(window.location.hash, ROUTES.home);
  assert.ok(document.body.textContent.includes('No quiz results to review yet. Complete a quiz first.'));
});

test('progress history only increments when quiz is submitted', () => {
  const { storageState } = installAppDom();

  clickByText('Start Quiz');
  window.location.hash = `#${ROUTES.home}`;
  window.dispatchEvent(new Event('hashchange'));

  window.location.hash = `#${ROUTES.progress}`;
  window.dispatchEvent(new Event('hashchange'));
  assert.ok(document.body.textContent.includes('No quiz attempts yet. Complete a quiz to build your progress history.'));

  window.location.hash = `#${ROUTES.home}`;
  window.dispatchEvent(new Event('hashchange'));
  clickByText('Start Quiz');
  for (let i = 0; i < 10; i += 1) {
    document.querySelector('.option-btn')?.click();
    clickByText(i === 9 ? 'Submit Quiz' : 'Next');
  }

  window.location.hash = `#${ROUTES.progress}`;
  window.dispatchEvent(new Event('hashchange'));
  assert.ok(document.body.textContent.includes('Quizzes completed'));
  assert.ok(document.body.textContent.includes('1'));
  assert.ok((storageState.get('physio_quiz_progress_v1') || '').includes('attempts'));
});

test('app recovers from malformed localStorage documents', () => {
  installAppDom({
    storage: {
      physio_quiz_session: '{bad-json',
      physio_quiz_progress_v1: '{bad-json',
      physio_quiz_dev_questions_v1: '{bad-json'
    }
  });

  assert.ok(document.body.textContent.includes('Choose quiz mode, category, and difficulty'));
  window.location.hash = `#${ROUTES.progress}`;
  window.dispatchEvent(new Event('hashchange'));
  assert.ok(document.body.textContent.includes('No quiz attempts yet. Complete a quiz to build your progress history.'));
});



test('completed flag with malformed stored result is safely cleared and redirected home', () => {
  const { storageState } = installAppDom({
    hash: `#${ROUTES.results}`,
    storage: {
      physio_quiz_completed: '1',
      physio_quiz_result_v1: JSON.stringify({ score: 'bad-score', review: 'not-an-array' })
    }
  });

  assert.ok([ROUTES.home, `#${ROUTES.home}`].includes(window.location.hash));
  assert.ok(document.body.textContent.includes('No quiz results to review yet. Complete a quiz first.'));
  assert.equal(storageState.has('physio_quiz_result_v1'), false);
  assert.equal(storageState.has('physio_quiz_completed'), false);
});

test('invalid hash route falls back to home with a user-facing notice', () => {
  installAppDom({ hash: '#/not-a-real-route' });

  assert.equal(window.location.hash, '#/not-a-real-route');
  assert.ok(document.body.textContent.includes('That page was not found. You were redirected to Home.'));
  assert.ok(document.body.textContent.includes('Choose quiz mode, category, and difficulty'));
});

test('clinical reasoning mode limits category choices and resets invalid selections', () => {
  installAppDom();

  const mode = document.querySelector('#mode');
  const category = document.querySelector('#category');
  assert.ok(mode && category, 'Expected quiz setup controls to exist');

  category.value = 'knee';
  category.dispatchEvent(new Event('change', { bubbles: true }));

  mode.value = 'clinical-reasoning';
  mode.dispatchEvent(new Event('change', { bubbles: true }));

  const categoryValues = Array.from(category.querySelectorAll('option'), (option) => option.value);
  assert.deepEqual(categoryValues, ['all', 'clinical reasoning']);
  assert.equal(category.value, 'clinical reasoning');
});

test('admin-dev hash route is blocked and uses home fallback messaging', () => {
  installAppDom({ hash: '#/admin-dev' });

  assert.equal(window.location.hash, '#/admin-dev');
  assert.ok(document.body.textContent.includes('That page was not found. You were redirected to Home.'));
  assert.ok(document.body.textContent.includes('Choose quiz mode, category, and difficulty'));
});

test('footer legal links are present and each route renders', () => {
  installAppDom();

  const footerNav = document.querySelector('.footer-nav');
  assert.ok(footerNav, 'Expected footer legal navigation');
  const footerLinks = [...footerNav.querySelectorAll('a')];
  assert.deepEqual(
    footerLinks.map((link) => link.textContent.trim()),
    ['Privacy', 'Terms', 'Disclaimer']
  );

  assert.deepEqual(
    footerLinks.map((link) => link.href),
    ['#/privacy', '#/terms', '#/disclaimer']
  );

  window.location.hash = '#/privacy';
  window.dispatchEvent(new Event('hashchange'));
  assert.equal(window.location.hash, '#/privacy');
  assert.ok(document.body.textContent.includes('Privacy Policy'));
  assert.ok(document.body.textContent.includes('saved locally in your browser storage'));

  window.location.hash = '#/terms';
  window.dispatchEvent(new Event('hashchange'));
  assert.equal(window.location.hash, '#/terms');
  assert.ok(document.body.textContent.includes('Terms of Use'));
  assert.ok(document.body.textContent.includes('provided as-is for education and self-review purposes'));

  window.location.hash = '#/disclaimer';
  window.dispatchEvent(new Event('hashchange'));
  assert.equal(window.location.hash, '#/disclaimer');
  assert.ok(document.body.textContent.includes('Medical/Educational Disclaimer'));
  assert.ok(document.body.textContent.includes('not medical advice, diagnosis, or treatment guidance'));
});

test('quiz submission works for multiple mode/category/difficulty combinations', () => {
  installAppDom();

  const scenarios = [
    { mode: 'normal', category: 'knee', difficulty: 'easy', length: '5' },
    { mode: 'clinical-reasoning', category: 'all', difficulty: 'all', length: '5' }
  ];

  scenarios.forEach((scenario, index) => {
    const mode = document.querySelector('#mode');
    const category = document.querySelector('#category');
    const difficulty = document.querySelector('#difficulty');
    const length = document.querySelector('#length');
    assert.ok(mode && category && difficulty && length, 'Expected setup fields to be present');

    mode.value = scenario.mode;
    mode.dispatchEvent(new Event('change', { bubbles: true }));
    category.value = scenario.category;
    category.dispatchEvent(new Event('change', { bubbles: true }));
    difficulty.value = scenario.difficulty;
    difficulty.dispatchEvent(new Event('change', { bubbles: true }));
    length.value = scenario.length;
    length.dispatchEvent(new Event('change', { bubbles: true }));

    clickByText('Start Quiz');
    assert.equal(window.location.hash, ROUTES.quiz);
    assert.ok(document.body.textContent.includes('Question 1 of 5'));

    for (let i = 0; i < 5; i += 1) {
      document.querySelector('.option-btn')?.click();
      clickByText(i === 4 ? 'Submit Quiz' : 'Next');
    }

    assert.equal(window.location.hash, ROUTES.results);
    assert.ok(document.body.textContent.includes('Score:'));

    if (index < scenarios.length - 1) {
      clickByText('Start New Quiz');
      assert.equal(window.location.hash, ROUTES.home);
    }
  });
});


test('theme selector defaults to system and follows system preference', () => {
  const { setSystemTheme } = installAppDom({ prefersDark: true });

  const themeSelect = document.querySelector('#theme-mode');
  assert.ok(themeSelect, 'Expected theme selector to exist');
  assert.equal(themeSelect.value, 'system');
  assert.equal(document.body.dataset.theme, 'dark');

  setSystemTheme(false);
  assert.equal(document.body.dataset.theme, 'light');
});

test('theme selector persists explicit mode and ignores system changes when overridden', () => {
  const { storageState, setSystemTheme } = installAppDom({ prefersDark: false });

  const themeSelect = document.querySelector('#theme-mode');
  assert.ok(themeSelect, 'Expected theme selector to exist');

  themeSelect.value = 'dark';
  themeSelect.dispatchEvent(new Event('change', { bubbles: true }));

  assert.equal(storageState.get('physio_quiz_theme_mode'), 'dark');
  assert.equal(document.body.dataset.theme, 'dark');

  setSystemTheme(false);
  assert.equal(document.body.dataset.theme, 'dark');
});
