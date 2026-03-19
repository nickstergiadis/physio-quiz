import { card } from '../components/ui/card.js';
import { titleCase } from '../utils/format/titleCase.js';
import { computeProgressMetrics } from '../utils/progress.js';

function formatDateTime(value) {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? 'Unknown date' : parsed.toLocaleString();
}

function formatDateOnly(value) {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? 'N/A' : parsed.toLocaleDateString();
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

function createHistoryRow(entry) {
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

  row.append(completed, category, difficulty, score);

  return row;
}

export function progressPage({ history }) {
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
      metrics.streak.lastAttemptDate ? formatDateOnly(`${metrics.streak.lastAttemptDate}T00:00:00.000Z`) : 'N/A'
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
    recentSection.appendChild(createHistoryRow(entry));
  });

  body.append(summaryGrid, categorySection, recentSection);

  return card({ title: 'Progress Dashboard', body });
}
