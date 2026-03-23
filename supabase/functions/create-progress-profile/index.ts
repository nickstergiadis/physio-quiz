import {
  APP_DATA_VERSION,
  buildProfileResponse,
  fail,
  generateResumeCode,
  getServiceClient,
  ok,
  optionsResponse,
  parsePayload,
  sha256Hex,
  validatePayloadSize
} from '../_shared/progressProfiles.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return optionsResponse();
  if (req.method !== 'POST') return fail('Method not allowed.', 405);

  try {
    const body = await req.json().catch(() => ({}));
    const payload = parsePayload(body?.payload_json);
    validatePayloadSize(payload);

    const supabase = getServiceClient();

    for (let attempt = 0; attempt < 3; attempt += 1) {
      const { formatted, normalized, last4 } = generateResumeCode();
      const codeHash = await sha256Hex(normalized);

      const { data, error } = await supabase
        .from('progress_profiles')
        .insert({
          code_hash: codeHash,
          code_last4: last4,
          payload_json: payload,
          app_data_version: APP_DATA_VERSION
        })
        .select('code_last4, payload_json, created_at, updated_at, app_data_version')
        .single();

      if (!error && data) {
        return ok(buildProfileResponse(data, formatted));
      }

      if (error && error.code !== '23505') {
        console.error('create-progress-profile insert error', error);
        return fail('Could not create saved profile right now.', 500);
      }
    }

    return fail('Could not create saved profile right now.', 500);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Invalid request.';
    if (message.includes('Payload too large')) {
      return fail('Saved progress is too large to sync right now.', 413);
    }
    return fail('Invalid request.', 400);
  }
});
