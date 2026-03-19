import { card } from '../components/ui/card.js';
import { categorySelector } from '../components/CategorySelector.js';

export function homePage({ onStart }) {
  const content = document.createElement('div');
  content.className = 'stack';

  const intro = document.createElement('p');
  intro.textContent =
    'Test musculoskeletal knowledge, clinical reasoning, assessment, diagnosis, treatment planning, and exercise prescription with focused quiz sessions.';

  const highlights = document.createElement('ul');
  highlights.className = 'feature-list';
  highlights.innerHTML = `
    <li>Multiple-choice questions with explanations</li>
    <li>Category and difficulty filtering</li>
    <li>Progress history stored locally</li>
  `;

  const selector = categorySelector({ onStart });

  content.append(intro, highlights, selector);

  return card({ title: 'Physio Quiz', body: content });
}
