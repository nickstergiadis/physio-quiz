import { card } from '../components/ui/card.js';
import { button } from '../components/ui/button.js';
import { titleCase } from '../utils/format/titleCase.js';
import { computeProgressMetrics } from '../utils/progress.js';

function formatDateTime(value) {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? 'Unknown date' : parsed.toLocaleString('en-CA');
}

function formatDateOnly(dayKey) {
  if (typeof dayKey !== 'string') return 'N/A';
  const [year, month, day] = dayKey.split('-').map(Number);
  if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day)) return 'N/A';

  const parsed = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
  return Number.isNaN(parsed.getTime()) ? 'N/A' : parsed.toLocaleDateString('en-CA');
}

function metricBlock(label, value) {
  const item = document.createElement('article');
  item.className = 'metric-item';

  const heading = document.createElement('p');
  heading.className = 'metric-label';
  heading.textContent = label;

  const content = document.createElement('p');
  content.className = 'metric-value';
  content.textContent = value;

  item.append(heading, content);
  return item;
}

function getOptionLabel(question, answerIndex) {
  if (answerIndex === undefined || answerIndex === null || answerIndex < 0) {
    return 'Not answered';
  }
  return question.options[answerIndex] ?? 'Invalid answer';
}

function createAttemptDetails(details) {
  const detailsWrap = document.createElement('section');
  detailsWrap.className = 'stack';

  const summary = document.createElement('p');
  summary.className = 'question-progress';
  summary.textContent = `Score: ${details.score.correct}/${details.score.total} (${details.score.percent}%) • Unanswered: ${details.unansweredCount}`;
  detailsWrap.appendChild(summary);

  details.review.forEach((item) => {
    const result = document.createElement('article');
    result.className = 'result-item';

    const heading = document.createElement('h4');
    heading.textContent = item.question;

    const userAnswer = document.createElement('p');
    const userLabel = document.createElement('strong');
    userLabel.textContent = 'Your answer: ';
    userAnswer.appendChild(userLabel);
    userAnswer.append(`${getOptionLabel(item, item.selectedAnswer)} ${item.isCorrect ? '✅' : '❌'}`);

    const correctAnswer = document.createElement('p');
    const correctLabel = document.createElement('strong');
    correctLabel.textContent = 'Correct answer: ';
    correctAnswer.appendChild(correctLabel);
    correctAnswer.append(getOptionLabel(item, item.correctAnswer));

    const explanation = document.createElement('p');
    const explanationLabel = document.createElement('strong');
    explanationLabel.textContent = 'Explanation: ';
    explanation.append(explanationLabel, item.explanation || 'No explanation provided.');

    result.append(heading, userAnswer, correctAnswer, explanation);
    detailsWrap.appendChild(result);
  });

  return detailsWrap;
}

function createHistoryRow(entry, onViewAttemptDetails) {
  const row = document.createElement('article');
  row.className = 'history-item';

  const completed = document.createElement('p');
  const completedStrong = document.createElement('strong');
  completedStrong.textContent = formatDateTime(entry.completedAt);
  completed.appendChild(completedStrong);

  const category = document.createElement('p');
  category.textContent = `Category filter: ${
    entry.filters.category === 'all' ? 'All Categories' : titleCase(entry.filters.category)
  }`;

  const difficulty = document.createElement('p');
  difficulty.textContent = `Difficulty filter: ${
    entry.filters.difficulty === 'all' ? 'All Difficulty Levels' : titleCase(entry.filters.difficulty)
  }`;

  const score = document.createElement('p');
  score.textContent = `Score: ${entry.score.correct}/${entry.score.total} (${entry.score.percent}%)`;

  const detailsButton = button({
    label: 'View details',
    variant: 'secondary',
    className: 'history-details-btn'
  });
  const detailsContainer = document.createElement('div');
  detailsContainer.className = 'stack';
  detailsContainer.hidden = true;

  detailsButton.addEventListener('click', () => {
    if (detailsContainer.hidden) {
      if (!detailsContainer.dataset.loaded) {
        const details = onViewAttemptDetails?.(entry.id);
        if (!details) {
          const unavailable = document.createElement('p');
          unavailable.className = 'metric-label';
          unavailable.textContent = 'Detailed review is unavailable for this attempt.';
          detailsContainer.appendChild(unavailable);
        } else {
          detailsContainer.appendChild(createAttemptDetails(details));
        }
        detailsContainer.dataset.loaded = '1';
      }

      detailsContainer.hidden = false;
      detailsButton.textContent = 'Hide details';
      return;
    }

    detailsContainer.hidden = true;
    detailsButton.textContent = 'View details';
  });

  row.append(completed, category, difficulty, score, detailsButton, detailsContainer);

  return row;
}

export function progressPage({ history, onViewAttemptDetails }) {
  const body = document.createElement('div');
  body.className = 'stack';

  if (!history.length) {
    const empty = document.createElement('p');
    empty.textContent = 'No quiz attempts yet. Complete a quiz to build your progress history.';
    body.appendChild(empty);
    return card({ title: 'Progress Dashboard', body });
  }

  const metrics = computeProgressMetrics(history);

  const summaryGrid = document.createElement('section');
  summaryGrid.className = 'metrics-grid';
  summaryGrid.append(
    metricBlock('Quizzes completed', String(metrics.totalQuizzes)),
    metricBlock('Average score', `${metrics.averageScore}%`),
    metricBlock('Strongest category', metrics.strongestCategory),
    metricBlock('Weakest category', metrics.weakestCategory),
    metricBlock('Current streak', `${metrics.streak.current} day(s)`),
    metricBlock(
      'Last activity',
      metrics.streak.lastAttemptDate ? formatDateOnly(metrics.streak.lastAttemptDate) : 'N/A'
    ),
    metricBlock('Attempts in last 7 days', String(metrics.recentActivity.last7Days)),
    metricBlock('Attempts in last 30 days', String(metrics.recentActivity.last30Days))
  );

  const categorySection = document.createElement('section');
  categorySection.className = 'stack';

  const categoryTitle = document.createElement('h3');
  categoryTitle.textContent = 'Category Performance';
  categorySection.appendChild(categoryTitle);

  if (!metrics.categoryPerformance.length) {
    const noCategoryData = document.createElement('p');
    noCategoryData.className = 'metric-label';
    noCategoryData.textContent = 'No category performance data available yet.';
    categorySection.appendChild(noCategoryData);
  }

  metrics.categoryPerformance.forEach((category) => {
    const row = document.createElement('article');
    row.className = 'history-item';

    const name = document.createElement('p');
    const nameStrong = document.createElement('strong');
    nameStrong.textContent = titleCase(category.category);
    name.appendChild(nameStrong);

    const average = document.createElement('p');
    average.textContent = `Average score: ${category.averagePercent}%`;

    const correct = document.createElement('p');
    correct.textContent = `Questions correct: ${category.correct}/${category.total}`;

    const attempts = document.createElement('p');
    attempts.textContent = `Attempts seen: ${category.attempts}`;

    row.append(name, average, correct, attempts);
    categorySection.appendChild(row);
  });

  const recentSection = document.createElement('section');
  recentSection.className = 'stack';
  const recentTitle = document.createElement('h3');
  recentTitle.textContent = 'Recent Quiz Attempts';
  recentSection.appendChild(recentTitle);

  if (!metrics.recentAttempts.length) {
    const noAttempts = document.createElement('p');
    noAttempts.className = 'metric-label';
    noAttempts.textContent = 'No recent attempts to display.';
    recentSection.appendChild(noAttempts);
  }

  metrics.recentAttempts.forEach((entry) => {
    recentSection.appendChild(createHistoryRow(entry, onViewAttemptDetails));
  });

  body.append(summaryGrid, categorySection, recentSection);

  return card({ title: 'Progress Dashboard', body });
}
