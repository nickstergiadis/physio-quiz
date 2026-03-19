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

    const heading = document.createElement('h3');
    heading.textContent = item.question;

    const userAnswer = document.createElement('p');
    userAnswer.innerHTML = `<strong>Your answer:</strong> `;
    userAnswer.append(`${getOptionLabel(item, item.selectedAnswer)} ${item.isCorrect ? '✅' : '❌'}`);

    const correctAnswer = document.createElement('p');
    correctAnswer.innerHTML = '<strong>Correct answer:</strong> ';
    correctAnswer.append(getOptionLabel(item, item.correctAnswer));

    const explanation = document.createElement('p');
    explanation.innerHTML = '<strong>Explanation:</strong> ';
    explanation.append(item.explanation);

    result.append(heading, userAnswer, correctAnswer, explanation);

    body.appendChild(result);
  });

  body.appendChild(button({ label: 'Start New Quiz', onClick: onRestart }));

  return card({ title: 'Quiz Results', body });
}
