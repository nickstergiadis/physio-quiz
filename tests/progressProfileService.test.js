import test from 'node:test';
import assert from 'node:assert/strict';

import { createProgressProfileService, normalizeResumeCode } from '../src/services/progressProfileService.js';

function installDomConfig() {
  global.document = {
    querySelector() {
      return null;
    }
  };
  global.__PHYSIO_QUIZ_CONFIG__ = {
    supabaseUrl: 'https://demo.supabase.co',
    supabaseAnonKey: 'anon-demo-key'
  };
}

test('normalizeResumeCode strips unsafe chars and uppercases', () => {
  const normalized = normalizeResumeCode(' pq-abcd 12_efgh  ');
  assert.equal(normalized, 'PQAB-CD12-EFGH');
});

test('loadProfileByCode rejects obviously invalid codes', async () => {
  installDomConfig();
  const service = createProgressProfileService();

  await assert.rejects(() => service.loadProfileByCode('short'), /valid resume code/i);
});


test('service reports missing runtime config variables in configuration errors', async () => {
  global.document = {
    querySelector() {
      return null;
    }
  };
  global.__PHYSIO_QUIZ_CONFIG__ = {};

  const service = createProgressProfileService();

  await assert.rejects(
    () => service.createProfile({ a: 1 }),
    /PHYSIO_QUIZ_SUPABASE_URL.*PHYSIO_QUIZ_SUPABASE_ANON_KEY/i
  );
});

test('service calls Supabase Edge Functions for save/load/create', async () => {
  installDomConfig();

  const seen = [];
  global.fetch = async (url) => {
    seen.push(String(url));
    return {
      ok: true,
      async json() {
        return {
          success: true,
          resumeCode: 'PQ-ABCD-EFGH-IJKL-MNOP-QRST',
          codeLast4: 'QRST',
          createdAt: '2026-03-23T00:00:00.000Z',
          updatedAt: '2026-03-23T00:00:00.000Z',
          payload_json: { ok: true }
        };
      }
    };
  };

  const service = createProgressProfileService();
  await service.createProfile({ a: 1 });
  await service.loadProfileByCode('PQ-ABCD-EFGH-IJKL-MNOP-QRST');
  await service.saveProfileByCode('PQ-ABCD-EFGH-IJKL-MNOP-QRST', { b: 2 });

  assert.ok(seen.some((url) => url.includes('/functions/v1/create-progress-profile')));
  assert.ok(seen.some((url) => url.includes('/functions/v1/get-progress-profile')));
  assert.ok(seen.some((url) => url.includes('/functions/v1/save-progress-profile')));
});

test('service rejects oversized payloads before network call', async () => {
  installDomConfig();
  let called = false;
  global.fetch = async () => {
    called = true;
    return { ok: true, async json() { return { success: true }; } };
  };

  const service = createProgressProfileService();
  const huge = { data: 'x'.repeat(140 * 1024) };

  await assert.rejects(() => service.createProfile(huge), /too large/i);
  assert.equal(called, false);
});
