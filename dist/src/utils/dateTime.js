function partsToObject(parts) {
  return Object.fromEntries(parts.filter((part) => part.type !== 'literal').map((part) => [part.type, part.value]));
}

function resolveTimeZone(timeZone) {
  if (typeof timeZone === 'string' && timeZone) return timeZone;
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return 'UTC';
  }
}

function getDateTimeParts(date, timeZone) {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: resolveTimeZone(timeZone),
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23'
  });

  return partsToObject(formatter.formatToParts(date));
}

function getTimeZoneOffsetMinutes(date, timeZone) {
  const parts = getDateTimeParts(date, timeZone);
  const asUtcTimestamp = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour),
    Number(parts.minute),
    Number(parts.second)
  );

  return Math.round((asUtcTimestamp - date.getTime()) / 60000);
}

function formatOffset(offsetMinutes) {
  const sign = offsetMinutes >= 0 ? '+' : '-';
  const absolute = Math.abs(offsetMinutes);
  const hours = String(Math.floor(absolute / 60)).padStart(2, '0');
  const minutes = String(absolute % 60).padStart(2, '0');
  return `${sign}${hours}:${minutes}`;
}

export function createZonedTimestamp(dateValue = new Date(), timeZone) {
  const date = dateValue instanceof Date ? dateValue : new Date(dateValue);
  if (Number.isNaN(date.getTime())) return new Date().toISOString();

  const parts = getDateTimeParts(date, timeZone);
  const offset = getTimeZoneOffsetMinutes(date, timeZone);

  return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}:${parts.second}${formatOffset(
    offset
  )}`;
}

export function getLocalDateKey(dateValue, timeZone) {
  const date = dateValue instanceof Date ? dateValue : new Date(dateValue);
  if (Number.isNaN(date.getTime())) return null;

  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: resolveTimeZone(timeZone),
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).formatToParts(date);

  const values = partsToObject(parts);
  return `${values.year}-${values.month}-${values.day}`;
}
export { resolveTimeZone };
