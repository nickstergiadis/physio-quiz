import { getSupabaseConfig } from '../config/runtimeConfig.js';

const CODE_LENGTH_BYTES = 18;
const CODE_CHUNK = 4;
const MAX_CODE_LENGTH = 64;
const RESUME_CODE_PATTERN = /^[A-Z0-9-]+$/;
const MIN_INTERVAL_MS = 1200;
const MAX_REQUESTS_PER_MINUTE = 30;

function now() {
  return Date.now();
}

function toBase32(bytes) {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  let value = 0;
  let bits = 0;
  let output = '';

  bytes.forEach((byte) => {
    value = (value << 8) | byte;
    bits += 8;
    while (bits >= 5) {
      output += alphabet[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  });

  if (bits > 0) {
    output += alphabet[(value << (5 - bits)) & 31];
  }

  return output;
}

export function generateResumeCode() {
  const bytes = crypto.getRandomValues(new Uint8Array(CODE_LENGTH_BYTES));
  const raw = toBase32(Array.from(bytes));
  const groups = raw.match(new RegExp(`.{1,${CODE_CHUNK}}`, 'g')) || [raw];
  return groups.join('-');
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
  return Boolean(config.url && config.anonKey);
}

async function callRpc(functionName, body) {
  const config = getSupabaseConfig();
  if (!isConfigured(config)) {
    throw new Error('Remote save is not configured in this environment.');
  }

  const response = await fetch(`${config.url}/rest/v1/rpc/${functionName}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: config.anonKey,
      Authorization: `Bearer ${config.anonKey}`
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    let details = '';
    try {
      const payload = await response.json();
      details = payload?.message || payload?.error || '';
    } catch {
      details = '';
    }

    if (response.status === 404 || response.status === 406) {
      throw new Error('That resume code was not found. Check the code and try again.');
    }

    throw new Error(details || `Remote request failed (${response.status}).`);
  }

  return response.json();
}

function parsePayloadRecord(record) {
  if (!record || typeof record !== 'object') {
    throw new Error('Invalid remote profile payload.');
  }

  return {
    resumeCode: normalizeResumeCode(record.resume_code || ''),
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
      const generatedCode = generateResumeCode();
      const data = await callRpc('create_progress_profile', {
        p_resume_code: generatedCode,
        p_payload_json: payload
      });
      return parsePayloadRecord(data);
    },
    async loadProfileByCode(resumeCode) {
      guardResumeAttempt();
      const normalized = normalizeResumeCode(resumeCode);
      if (!isValidResumeCode(normalized)) {
        throw new Error('Enter a valid resume code.');
      }

      const data = await callRpc('get_progress_profile_by_code', {
        p_resume_code: normalized
      });
      return parsePayloadRecord(data);
    },
    async saveProfileByCode(resumeCode, payload) {
      const normalized = normalizeResumeCode(resumeCode);
      if (!isValidResumeCode(normalized)) {
        throw new Error('Cannot save because the resume code is invalid.');
      }

      const data = await callRpc('save_progress_profile_by_code', {
        p_resume_code: normalized,
        p_payload_json: payload
      });
      return parsePayloadRecord(data);
    }
  };
}
