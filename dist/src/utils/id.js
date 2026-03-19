export function createAttemptId(prefix = 'attempt') {
  const randomSegment =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2, 10)}`;

  return `${prefix}-${randomSegment}`;
}
