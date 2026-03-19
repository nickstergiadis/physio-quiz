import { card } from '../components/ui/card.js';
import { titleCase } from '../utils/format/titleCase.js';

export function progressPage({ history }) {
  const body = document.createElement('div');
  body.className = 'stack';

  if (!history.length) {
    const empty = document.createElement('p');
    empty.textContent = 'No quiz attempts yet. Complete a quiz to build your progress history.';
    body.appendChild(empty);
    return card({ title: 'Progress', body });
  }

  history.forEach((entry) => {
    const row = document.createElement('article');
    row.className = 'history-item';
    row.innerHTML = `
      <p><strong>${new Date(entry.completedAt).toLocaleString()}</strong></p>
      <p>Category: ${entry.filters.category === 'all' ? 'All Categories' : titleCase(entry.filters.category)}</p>
      <p>Difficulty: ${entry.filters.difficulty === 'all' ? 'All Difficulty Levels' : titleCase(entry.filters.difficulty)}</p>
      <p>Score: ${entry.score.correct}/${entry.score.total} (${entry.score.percent}%)</p>
    `;
    body.appendChild(row);
  });

  return card({ title: 'Progress History', body });
}
