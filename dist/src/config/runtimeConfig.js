const SUPABASE_CONFIG_REQUIREMENTS = [
  {
    id: 'supabaseUrl',
    metaName: 'physio-quiz-supabase-url',
    windowKey: 'supabaseUrl',
    envName: 'PHYSIO_QUIZ_SUPABASE_URL',
    required: true
  },
  {
    id: 'supabaseAnonKey',
    metaName: 'physio-quiz-supabase-anon-key',
    windowKey: 'supabaseAnonKey',
    envName: 'PHYSIO_QUIZ_SUPABASE_ANON_KEY',
    required: true
  },
  {
    id: 'supabaseFunctionsBaseUrl',
    metaName: 'physio-quiz-supabase-functions-url',
    windowKey: 'supabaseFunctionsBaseUrl',
    envName: 'PHYSIO_QUIZ_SUPABASE_FUNCTIONS_URL',
    required: false
  }
];

function readMetaContent(name) {
  const element = document.querySelector(`meta[name="${name}"]`);
  return element?.content?.trim() || '';
}

function readWindowConfig() {
  const config = globalThis.__PHYSIO_QUIZ_CONFIG__;
  return config && typeof config === 'object' ? config : {};
}

function resolveValue(requirement) {
  const windowConfig = readWindowConfig();
  const fromWindow =
    typeof windowConfig[requirement.windowKey] === 'string' ? windowConfig[requirement.windowKey].trim() : '';
  if (fromWindow) return fromWindow;
  return readMetaContent(requirement.metaName);
}

export function getSupabaseConfig() {
  const resolved = Object.fromEntries(
    SUPABASE_CONFIG_REQUIREMENTS.map((requirement) => [requirement.id, resolveValue(requirement)])
  );

  const explicitFunctionsBase = resolved.supabaseFunctionsBaseUrl;

  return {
    url: resolved.supabaseUrl,
    anonKey: resolved.supabaseAnonKey,
    functionsBaseUrl: explicitFunctionsBase || (resolved.supabaseUrl ? `${resolved.supabaseUrl}/functions/v1` : '')
  };
}

export function getSupabaseConfigDiagnostics() {
  const resolved = Object.fromEntries(
    SUPABASE_CONFIG_REQUIREMENTS.map((requirement) => [requirement.id, resolveValue(requirement)])
  );

  const missingRequired = SUPABASE_CONFIG_REQUIREMENTS.filter(
    (requirement) => requirement.required && !resolved[requirement.id]
  ).map((requirement) => ({
    id: requirement.id,
    envName: requirement.envName,
    windowKey: requirement.windowKey,
    metaName: requirement.metaName
  }));

  return {
    missingRequired,
    hasRequiredValues: missingRequired.length === 0
  };
}

export function hasSupabaseConfig() {
  return getSupabaseConfigDiagnostics().hasRequiredValues;
}
