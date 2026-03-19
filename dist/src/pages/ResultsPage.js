import { card } from '../components/ui/card.js';
import { button } from '../components/ui/button.js';

function getOptionLabel(question, optionId) {
  return question.options.find((option) => option.id === optionId)?.label ?? optionId;
}

export function resultsPage({ score, questions, answers, onRestart }) {
  const body = document.createElement('div');
  body.className = 'stack';

  const summary = document.createElement('p');
  summary.className = 'score';
  summary.textContent = `Score: ${score.correct}/${score.total} (${score.percent}%)`;

  body.appendChild(summary);

  questions.forEach((q) => {
    const item = document.createElement('article');
    item.className = 'result-item';
    const chosen = answers[q.id];
    const isCorrect = chosen === q.correctOptionId;

    item.innerHTML = `
      <h3>${q.stem}</h3>
      <p><strong>Your answer:</strong> ${chosen ? getOptionLabel(q, chosen) : 'Not answered'} ${isCorrect ? '✅' : '❌'}</p>
      <p><strong>Correct answer:</strong> ${getOptionLabel(q, q.correctOptionId)}</p>
      <p><strong>Explanation:</strong> ${q.explanation}</p>
    `;

    body.appendChild(item);
  });

  body.appendChild(button({ label: 'Start New Quiz', onClick: onRestart }));

  return card({ title: 'Quiz Results', body });
}
