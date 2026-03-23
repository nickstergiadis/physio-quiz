import {
  buildProfileResponse,
  fail,
  getServiceClient,
  normalizeResumeCode,
  ok,
  optionsResponse,
  sha256Hex
} from '../_shared/progressProfiles.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return optionsResponse();
  if (req.method !== 'POST') return fail('Method not allowed.', 405);

  try {
    const body = await req.json().catch(() => ({}));
    const normalized = normalizeResumeCode(body?.resumeCode);

    if (normalized.length < 20 || normalized.length > 32) {
      return fail('Invalid resume code format.', 400);
    }

    const codeHash = await sha256Hex(normalized);
    const supabase = getServiceClient();

    const { data, error } = await supabase
      .from('progress_profiles')
      .update({ last_active_at: new Date().toISOString() })
      .eq('code_hash', codeHash)
      .select('code_last4, payload_json, created_at, updated_at, app_data_version')
      .single();

    if (error || !data) {
      return fail('Resume code not found.', 404);
    }

    return ok(buildProfileResponse(data, normalized));
  } catch {
    return fail('Invalid request.', 400);
  }
});
