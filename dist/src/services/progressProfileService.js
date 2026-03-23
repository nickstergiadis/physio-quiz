import { getSupabaseConfig } from '../config/runtimeConfig.js';

const CODE_CHUNK = 4;
const MAX_CODE_LENGTH = 64;
const RESUME_CODE_PATTERN = /^[A-Z0-9-]+$/;
const MIN_INTERVAL_MS = 1200;
const MAX_REQUESTS_PER_MINUTE = 30;
const MAX_PAYLOAD_BYTES = 128 * 1024;

function now() {
  return Date.now();
}

export function normalizeResumeCode(value) {
  if (typeof value !== 'string') return '';
  const normalized = value
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .slice(0, MAX_CODE_LENGTH);

  if (!normalized) return '';
  const groups = normalized.match(new RegExp(`.{1,${CODE_CHUNK}}`, 'g')) || [normalized];
  return groups.join('-');
}

function isValidResumeCode(value) {
  return typeof value === 'string' && value.length >= 20 && value.length <= MAX_CODE_LENGTH && RESUME_CODE_PATTERN.test(value);
}

function ensurePayloadWithinLimit(payload) {
  const serialized = JSON.stringify(payload ?? {});
  const bytes = new TextEncoder().encode(serialized).byteLength;
  if (bytes > MAX_PAYLOAD_BYTES) {
    throw new Error('Saved progress is too large to sync right now.');
  }
}

function createRateLimiter() {
  const requestTimestamps = [];

  return function consume() {
    const current = now();
    while (requestTimestamps.length && current - requestTimestamps[0] > 60_000) {
      requestTimestamps.shift();
    }

    const last = requestTimestamps[requestTimestamps.length - 1] || 0;
    if (current - last < MIN_INTERVAL_MS) {
      throw new Error('Please wait a moment before trying again.');
    }

    if (requestTimestamps.length >= MAX_REQUESTS_PER_MINUTE) {
      throw new Error('Too many resume attempts. Please wait about a minute and try again.');
    }

    requestTimestamps.push(current);
  };
}

function isConfigured(config) {
  return Boolean(config.url && config.anonKey && config.functionsBaseUrl);
}

async function callEdgeFunction(functionName, body) {
  const config = getSupabaseConfig();
  if (!isConfigured(config)) {
    throw new Error('Remote save is not configured in this environment.');
  }

  const response = await fetch(`${config.functionsBaseUrl}/${functionName}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: config.anonKey,
      Authorization: `Bearer ${config.anonKey}`
    },
    body: JSON.stringify(body ?? {})
  });

  let payload = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    const details = payload?.error || payload?.message || '';

    if (response.status === 404 || response.status === 401) {
      throw new Error('That resume code was not found. Check the code and try again.');
    }

    if (response.status === 413) {
      throw new Error('Saved progress is too large to sync right now.');
    }

    throw new Error(details || `Remote request failed (${response.status}).`);
  }

  return payload;
}

function parseProfileRecord(record) {
  if (!record || typeof record !== 'object' || !record.success) {
    throw new Error('Invalid remote profile payload.');
  }

  return {
    resumeCode: normalizeResumeCode(record.resumeCode || ''),
    codeLast4: typeof record.codeLast4 === 'string' ? record.codeLast4 : '',
    createdAt: typeof record.createdAt === 'string' ? record.createdAt : '',
    updatedAt: typeof record.updatedAt === 'string' ? record.updatedAt : '',
    payload: record.payload_json && typeof record.payload_json === 'object' ? record.payload_json : {}
  };
}

export function createProgressProfileService() {
  const guardResumeAttempt = createRateLimiter();

  return {
    isAvailable() {
      const config = getSupabaseConfig();
      return isConfigured(config);
    },
    normalizeResumeCode,
    async createProfile(payload) {
      ensurePayloadWithinLimit(payload);
      const data = await callEdgeFunction('create-progress-profile', {
        payload_json: payload
      });
      return parseProfileRecord(data);
    },
    async loadProfileByCode(resumeCode) {
      guardResumeAttempt();
      const normalized = normalizeResumeCode(resumeCode);
      if (!isValidResumeCode(normalized)) {
        throw new Error('Enter a valid resume code.');
      }

      const data = await callEdgeFunction('get-progress-profile', {
        resumeCode: normalized
      });
      return parseProfileRecord(data);
    },
    async saveProfileByCode(resumeCode, payload) {
      const normalized = normalizeResumeCode(resumeCode);
      if (!isValidResumeCode(normalized)) {
        throw new Error('Cannot save because the resume code is invalid.');
      }
      ensurePayloadWithinLimit(payload);

      const data = await callEdgeFunction('save-progress-profile', {
        resumeCode: normalized,
        payload_json: payload
      });
      return parseProfileRecord(data);
    }
  };
}
