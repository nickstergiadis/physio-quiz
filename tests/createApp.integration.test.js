import test from 'node:test';
import assert from 'node:assert/strict';

import { createApp } from '../src/app/createApp.js';
import { ROUTES } from '../src/app/router.js';
import { createMiniDom } from './helpers/miniDom.js';

function installAppDom({ hash = `#${ROUTES.home}`, storage = {} } = {}) {
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

  global.window = dom.window;
  global.document = dom.document;
  global.location = dom.window.location;
  global.Event = dom.Event;
  global.localStorage = localStorage;

  const appRoot = document.querySelector('#app');
  createApp(appRoot);

  return { dom, root: appRoot, storageState };
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
});

test('results route is guarded during an active quiz and redirects back to quiz', () => {
  installAppDom({ hash: `#${ROUTES.results}` });

  clickByText('Start Quiz');
  assert.equal(window.location.hash, ROUTES.quiz);

  window.location.hash = `#${ROUTES.results}`;
  window.dispatchEvent(new Event('hashchange'));

  assert.equal(window.location.hash, ROUTES.quiz);
  assert.ok(document.body.textContent.includes('Question 1 of 10'));
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

test('invalid hash route falls back to home with a user-facing notice', () => {
  installAppDom({ hash: '#/not-a-real-route' });

  assert.equal(window.location.hash, '#/not-a-real-route');
  assert.ok(document.body.textContent.includes('That page was not found. You were redirected to Home.'));
  assert.ok(document.body.textContent.includes('Choose quiz mode, category, and difficulty'));
});

test('no-questions-available state is shown in setup and blocks start', () => {
  installAppDom();

  const mode = document.querySelector('#mode');
  const category = document.querySelector('#category');
  assert.ok(mode && category, 'Expected quiz setup controls to exist');

  mode.value = 'clinical-reasoning';
  mode.dispatchEvent(new Event('change', { bubbles: true }));
  category.value = 'cervical spine';
  category.dispatchEvent(new Event('change', { bubbles: true }));

  assert.ok(document.body.textContent.includes('No matching questions. Change filters to continue.'));

  const startButton = [...document.querySelectorAll('button')].find((el) => el.textContent.trim() === 'Start Quiz');
  assert.ok(startButton?.disabled);
});

test('admin link is hidden from nav after hardening but direct route still renders admin page', () => {
  installAppDom();

  const navText = document.querySelector('nav')?.textContent ?? '';
  assert.equal(navText.includes('Admin (Dev)'), false);

  window.location.hash = `#${ROUTES.admin}`;
  window.dispatchEvent(new Event('hashchange'));

  assert.ok(document.body.textContent.includes('Dev/Admin page (local only).'));
});
