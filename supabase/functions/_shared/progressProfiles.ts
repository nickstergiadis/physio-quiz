import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';

const RESUME_CODE_PREFIX = 'PQ';
const RESUME_CODE_GROUPS = 5;
const RESUME_CODE_GROUP_SIZE = 4;
const MAX_PAYLOAD_BYTES = 128 * 1024;
const APP_DATA_VERSION = 2;

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, apikey, content-type'
};

function response(payload: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      ...CORS_HEADERS,
      'Content-Type': 'application/json'
    }
  });
}

export function optionsResponse() {
  return new Response('ok', { headers: CORS_HEADERS });
}

export function ok(payload: Record<string, unknown>) {
  return response(payload, 200);
}

export function fail(error: string, status = 400) {
  return response({ success: false, error }, status);
}

export function normalizeResumeCode(input: unknown): string {
  if (typeof input !== 'string') return '';
  return input.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
}

function formatResumeCode(normalized: string): string {
  const grouped = normalized.match(new RegExp(`.{1,${RESUME_CODE_GROUP_SIZE}}`, 'g')) || [normalized];
  return grouped.join('-');
}

function codeLast4(normalized: string): string {
  return normalized.slice(-4);
}

function randomCodeChars(length: number): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const bytes = crypto.getRandomValues(new Uint8Array(length));
  let out = '';

  for (let i = 0; i < length; i += 1) {
    out += alphabet[bytes[i] % alphabet.length];
  }

  return out;
}

export function generateResumeCode() {
  const body = randomCodeChars(RESUME_CODE_GROUPS * RESUME_CODE_GROUP_SIZE);
  const grouped = body.match(new RegExp(`.{1,${RESUME_CODE_GROUP_SIZE}}`, 'g')) || [body];
  const formatted = `${RESUME_CODE_PREFIX}-${grouped.join('-')}`;
  const normalized = normalizeResumeCode(formatted);
  return {
    formatted,
    normalized,
    last4: codeLast4(normalized)
  };
}

export async function sha256Hex(value: string): Promise<string> {
  const data = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

export function parsePayload(input: unknown): Record<string, unknown> {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return {};
  }
  return input as Record<string, unknown>;
}

export function validatePayloadSize(payload: Record<string, unknown>) {
  const bytes = new TextEncoder().encode(JSON.stringify(payload)).byteLength;
  if (bytes > MAX_PAYLOAD_BYTES) {
    throw new Error('Payload too large.');
  }
}

export function getServiceClient() {
  const url = Deno.env.get('SUPABASE_URL') || '';
  const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
  if (!url || !key) {
    throw new Error('Missing Supabase service configuration.');
  }

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false }
  });
}

export function buildProfileResponse(record: Record<string, unknown>, resumeCode: string) {
  const normalized = normalizeResumeCode(resumeCode);
  return {
    success: true,
    resumeCode: formatResumeCode(normalized),
    codeLast4: typeof record.code_last4 === 'string' ? record.code_last4 : codeLast4(normalized),
    payload_json: parsePayload(record.payload_json),
    createdAt: typeof record.created_at === 'string' ? record.created_at : '',
    updatedAt: typeof record.updated_at === 'string' ? record.updated_at : '',
    appDataVersion: typeof record.app_data_version === 'number' ? record.app_data_version : APP_DATA_VERSION
  };
}

export { APP_DATA_VERSION };
