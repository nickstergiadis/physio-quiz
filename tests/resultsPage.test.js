import test from 'node:test';
import assert from 'node:assert/strict';

import { resultsPage } from '../src/pages/ResultsPage.js';
import { createMiniDom } from './helpers/miniDom.js';

function installDom() {
  const dom = createMiniDom();
  global.window = dom.window;
  global.document = dom.document;
  global.Event = dom.Event;
  return dom;
}

test('results explanation creates guideline paragraph breaks and bullet lists', () => {
  installDom();

  const el = resultsPage({
    score: { correct: 1, total: 1, percent: 100 },
    unansweredCount: 0,
    onRestart: () => {},
    review: [
      {
        question: 'Q1',
        options: ['A', 'B', 'C', 'D'],
        selectedAnswer: 0,
        correctAnswer: 0,
        isCorrect: true,
        explanation: 'Use graded loading. NICE Guideline 2020: Encourage activity.\n1. Screen red flags\n2. Reassure and progress load'
      }
    ]
  });

  const explanation = el.querySelector('.explanation-content');
  assert.ok(explanation, 'Expected explanation content wrapper');

  const paragraphs = explanation.querySelectorAll('p');
  assert.equal(paragraphs.length, 2);
  assert.equal(paragraphs[0].textContent, 'Use graded loading.');
  assert.equal(paragraphs[1].textContent, 'NICE Guideline 2020: Encourage activity.');

  const bullets = explanation.querySelectorAll('li');
  assert.equal(bullets.length, 2);
  assert.equal(bullets[0].textContent, 'Screen red flags');
  assert.equal(bullets[1].textContent, 'Reassure and progress load');
});

test('results explanation renders html list markup as list items', () => {
  installDom();

  const el = resultsPage({
    score: { correct: 0, total: 1, percent: 0 },
    unansweredCount: 1,
    onRestart: () => {},
    review: [
      {
        question: 'Q2',
        options: ['A', 'B', 'C', 'D'],
        selectedAnswer: null,
        correctAnswer: 1,
        isCorrect: false,
        explanation: 'Criteria:<ul><li>First criterion</li><li><strong>Second</strong> criterion</li></ul>'
      }
    ]
  });

  const explanation = el.querySelector('.explanation-content');
  const bullets = explanation.querySelectorAll('li');
  assert.equal(bullets.length, 2);
  assert.equal(bullets[0].textContent, 'First criterion');
  assert.equal(bullets[1].textContent, 'Second criterion');
});
