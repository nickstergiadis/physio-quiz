import { card } from '../components/ui/card.js';
import { categorySelector } from '../components/CategorySelector.js';

export function homePage({ onStart, initialFilters, startError = '', questionSource }) {
  const content = document.createElement('div');
  content.className = 'stack';

  const intro = document.createElement('p');
  intro.textContent =
    'Choose quiz mode, category, and difficulty, then run through one question at a time with full answer explanations at the end.';

  const highlights = document.createElement('ul');
  highlights.className = 'feature-list';
  highlights.innerHTML = `
    <li>Categories: shoulder, knee, low back, ankle, cervical spine, exercise prescription, and clinical reasoning</li>
    <li>Modes: Normal Quiz (standard recall/application) or Clinical Reasoning (case-based scenarios)</li>
    <li>4-option multiple-choice questions with next/previous navigation</li>
    <li>Automatic scoring, answer review, and local progress history</li>
  `;

  const selector = categorySelector({ onStart, initialFilters, startError, questionSource });

  content.append(intro, highlights, selector);

  return card({ title: 'Physio Quiz', body: content });
}
