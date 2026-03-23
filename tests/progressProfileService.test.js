import test from 'node:test';
import assert from 'node:assert/strict';

import {
  createProgressProfileService,
  generateResumeCode,
  normalizeResumeCode
} from '../src/services/progressProfileService.js';

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

test('generateResumeCode returns long random code groups', () => {
  const code = generateResumeCode();
  assert.match(code, /^[A-Z2-7]{1,4}(-[A-Z2-7]{1,4})+$/);
  assert.ok(code.length >= 28);
});

test('normalizeResumeCode strips unsafe chars and uppercases', () => {
  const normalized = normalizeResumeCode(' abcd-12_efgh  ');
  assert.equal(normalized, 'ABCD-12EF-GH');
});

test('loadProfileByCode rejects obviously invalid codes', async () => {
  installDomConfig();
  const service = createProgressProfileService();

  await assert.rejects(() => service.loadProfileByCode('short'), /valid resume code/i);
});

test('service calls Supabase RPC for save/load/create', async () => {
  installDomConfig();

  const seen = [];
  global.fetch = async (url) => {
    seen.push(String(url));
    return {
      ok: true,
      async json() {
        return { resume_code: 'ABCD-EFGH-IJKL-MNOP-QRST-UVWX', payload_json: { ok: true } };
      }
    };
  };

  const service = createProgressProfileService();
  await service.createProfile({ a: 1 });
  await service.loadProfileByCode('ABCD-EFGH-IJKL-MNOP-QRST-UVWX');
  await service.saveProfileByCode('ABCD-EFGH-IJKL-MNOP-QRST-UVWX', { b: 2 });

  assert.ok(seen.some((url) => url.includes('/create_progress_profile')));
  assert.ok(seen.some((url) => url.includes('/get_progress_profile_by_code')));
  assert.ok(seen.some((url) => url.includes('/save_progress_profile_by_code')));
});
