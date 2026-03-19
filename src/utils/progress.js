import { titleCase } from './format/titleCase.js';

function formatCategoryLabel(category) {
  if (!category) return 'N/A';
  return titleCase(category);
}

function resolveCategoryStats(history) {
  const categoryMap = new Map();

  history.forEach((attempt) => {
    const categories = attempt.categoryStats || {};
    Object.entries(categories).forEach(([category, stats]) => {
      if (!stats || !Number.isFinite(stats.total) || stats.total <= 0) return;
      const next = categoryMap.get(category) || { attempts: 0, correct: 0, total: 0, averagePercent: 0 };
      next.attempts += 1;
      next.correct += Number.isFinite(stats.correct) ? stats.correct : 0;
      next.total += stats.total;
      next.averagePercent = next.total ? Math.round((next.correct / next.total) * 100) : 0;
      categoryMap.set(category, next);
    });
  });

  return Array.from(categoryMap.entries())
    .map(([category, stats]) => ({ category, ...stats }))
    .sort((a, b) => b.averagePercent - a.averagePercent || b.attempts - a.attempts);
}

function calculateStreak(history) {
  if (!history.length) {
    return { current: 0, activeToday: false, lastAttemptDate: null };
  }

  const uniqueDays = [
    ...new Set(
      history
        .map((attempt) => attempt.completedAt)
        .filter(Boolean)
        .map((value) => new Date(value).toISOString().slice(0, 10))
    )
  ].sort((a, b) => b.localeCompare(a));

  if (!uniqueDays.length) {
    return { current: 0, activeToday: false, lastAttemptDate: null };
  }

  const todayKey = new Date().toISOString().slice(0, 10);
  const dayMs = 24 * 60 * 60 * 1000;

  let streak = 0;
  let expectedDay = new Date(`${uniqueDays[0]}T00:00:00.000Z`);

  for (const day of uniqueDays) {
    const dayDate = new Date(`${day}T00:00:00.000Z`);
    if (dayDate.getTime() !== expectedDay.getTime()) {
      break;
    }

    streak += 1;
    expectedDay = new Date(expectedDay.getTime() - dayMs);
  }

  const activeToday = uniqueDays[0] === todayKey;
  const adjustedCurrent = activeToday ? streak : Math.max(streak - 1, 0);

  return {
    current: adjustedCurrent,
    activeToday,
    lastAttemptDate: uniqueDays[0]
  };
}

export function computeProgressMetrics(history, { recentLimit = 5 } = {}) {
  const totalQuizzes = history.length;
  const cumulative = history.reduce(
    (totals, attempt) => {
      const score = attempt.score || { correct: 0, total: 0 };
      totals.correct += Number.isFinite(score.correct) ? score.correct : 0;
      totals.total += Number.isFinite(score.total) ? score.total : 0;
      return totals;
    },
    { correct: 0, total: 0 }
  );

  const averageScore = cumulative.total ? Math.round((cumulative.correct / cumulative.total) * 100) : 0;

  const categories = resolveCategoryStats(history);
  const strongestCategory = categories[0] || null;
  const weakestCategory = categories.length ? categories[categories.length - 1] : null;

  const streak = calculateStreak(history);

  return {
    totalQuizzes,
    averageScore,
    strongestCategory: strongestCategory
      ? `${formatCategoryLabel(strongestCategory.category)} (${strongestCategory.averagePercent}%)`
      : 'N/A',
    weakestCategory: weakestCategory
      ? `${formatCategoryLabel(weakestCategory.category)} (${weakestCategory.averagePercent}%)`
      : 'N/A',
    streak,
    categoryPerformance: categories,
    recentAttempts: history.slice(0, recentLimit)
  };
}
