import { titleCase } from './format/titleCase.js';
import { USER_TIME_ZONE, getLocalDateKey } from './dateTime.js';

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

function toDayIndex(dayKey) {
  const [year, month, day] = dayKey.split('-').map(Number);
  return Math.floor(Date.UTC(year, month - 1, day) / (24 * 60 * 60 * 1000));
}

function calculateStreak(history, now, timeZone) {
  if (!history.length) {
    return { current: 0, activeToday: false, lastAttemptDate: null };
  }

  const toIsoDayKey = (value) => getLocalDateKey(value, timeZone);

  const uniqueDays = [
    ...new Set(
      history
        .map((attempt) => attempt.completedAt)
        .filter(Boolean)
        .map((value) => toIsoDayKey(value))
        .filter(Boolean)
    )
  ].sort((a, b) => b.localeCompare(a));

  if (!uniqueDays.length) {
    return { current: 0, activeToday: false, lastAttemptDate: null };
  }

  const todayKey = getLocalDateKey(now, timeZone);
  const todayIndex = todayKey ? toDayIndex(todayKey) : null;
  const yesterday = todayIndex === null ? null : new Date((todayIndex - 1) * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

  let streak = 0;
  let expectedDayIndex = toDayIndex(uniqueDays[0]);

  for (const day of uniqueDays) {
    const dayIndex = toDayIndex(day);
    if (dayIndex != expectedDayIndex) {
      break;
    }

    streak += 1;
    expectedDayIndex -= 1;
  }

  const activeToday = todayKey !== null && uniqueDays[0] === todayKey;
  const current = uniqueDays[0] === todayKey || uniqueDays[0] === yesterday ? streak : 0;

  return {
    current,
    activeToday,
    lastAttemptDate: uniqueDays[0]
  };
}

function calculateRecentActivity(history) {
  const now = Date.now();
  const sevenDayCutoff = now - 7 * 24 * 60 * 60 * 1000;
  const thirtyDayCutoff = now - 30 * 24 * 60 * 60 * 1000;

  return history.reduce(
    (totals, attempt) => {
      const completedAt = new Date(attempt.completedAt).getTime();
      if (!Number.isFinite(completedAt)) return totals;
      if (completedAt >= sevenDayCutoff) totals.last7Days += 1;
      if (completedAt >= thirtyDayCutoff) totals.last30Days += 1;
      return totals;
    },
    { last7Days: 0, last30Days: 0 }
  );
}

export function computeProgressMetrics(history, { recentLimit = 5, now = new Date(), timeZone = USER_TIME_ZONE } = {}) {
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

  const streak = calculateStreak(history, now, timeZone);
  const recentActivity = calculateRecentActivity(history);

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
    recentActivity,
    categoryPerformance: categories,
    recentAttempts: history.slice(0, recentLimit)
  };
}
