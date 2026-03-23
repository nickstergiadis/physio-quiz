import {
  APP_DATA_VERSION,
  buildProfileResponse,
  fail,
  getServiceClient,
  normalizeResumeCode,
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
    const normalized = normalizeResumeCode(body?.resumeCode);
    const payload = parsePayload(body?.payload_json);

    if (normalized.length < 20 || normalized.length > 32) {
      return fail('Invalid resume code format.', 400);
    }

    validatePayloadSize(payload);

    const codeHash = await sha256Hex(normalized);
    const supabase = getServiceClient();

    const { data, error } = await supabase
      .from('progress_profiles')
      .update({
        payload_json: payload,
        app_data_version: APP_DATA_VERSION,
        last_active_at: new Date().toISOString()
      })
      .eq('code_hash', codeHash)
      .select('code_last4, payload_json, created_at, updated_at, app_data_version')
      .single();

    if (error || !data) {
      return fail('Resume code not found.', 404);
    }

    return ok(buildProfileResponse(data, normalized));
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Invalid request.';
    if (message.includes('Payload too large')) {
      return fail('Saved progress is too large to sync right now.', 413);
    }
    return fail('Invalid request.', 400);
  }
});
