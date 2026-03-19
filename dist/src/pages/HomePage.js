import { card } from '../components/ui/card.js';
import { categorySelector } from '../components/CategorySelector.js';

export function homePage({ onStart }) {
  const content = document.createElement('div');
  content.className = 'stack';

  const intro = document.createElement('p');
  intro.textContent =
    'Strengthen musculoskeletal assessment, diagnosis, treatment planning, and exercise prescription through focused quiz sessions.';

  const selector = categorySelector({ onStart });

  content.append(intro, selector);

  return card({ title: 'Physio Quiz', body: content });
}
