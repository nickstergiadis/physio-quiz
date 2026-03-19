import { card } from '../components/ui/card.js';
import { button } from '../components/ui/button.js';

function getOptionLabel(question, answerIndex) {
  if (answerIndex === undefined || answerIndex === null || answerIndex < 0) {
    return 'Not answered';
  }
  return question.options[answerIndex] ?? 'Invalid answer';
}

export function resultsPage({ score, review, onRestart }) {
  const body = document.createElement('div');
  body.className = 'stack';

  const summary = document.createElement('p');
  summary.className = 'score';
  summary.textContent = `Score: ${score.correct}/${score.total} (${score.percent}%)`;

  body.appendChild(summary);

  review.forEach((item) => {
    const result = document.createElement('article');
    result.className = 'result-item';

    result.innerHTML = `
      <h3>${item.question}</h3>
      <p><strong>Your answer:</strong> ${getOptionLabel(item, item.selectedAnswer)} ${item.isCorrect ? '✅' : '❌'}</p>
      <p><strong>Correct answer:</strong> ${getOptionLabel(item, item.correctAnswer)}</p>
      <p><strong>Explanation:</strong> ${item.explanation}</p>
    `;

    body.appendChild(result);
  });

  body.appendChild(button({ label: 'Start New Quiz', onClick: onRestart }));

  return card({ title: 'Quiz Results', body });
}
