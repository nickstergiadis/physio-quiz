function readMetaContent(name) {
  const element = document.querySelector(`meta[name="${name}"]`);
  return element?.content?.trim() || '';
}

function readWindowConfig() {
  const config = globalThis.__PHYSIO_QUIZ_CONFIG__;
  return config && typeof config === 'object' ? config : {};
}

function resolveValue(key, metaName) {
  const windowConfig = readWindowConfig();
  const fromWindow = typeof windowConfig[key] === 'string' ? windowConfig[key].trim() : '';
  if (fromWindow) return fromWindow;
  return readMetaContent(metaName);
}

export function getSupabaseConfig() {
  return {
    url: resolveValue('supabaseUrl', 'physio-quiz-supabase-url'),
    anonKey: resolveValue('supabaseAnonKey', 'physio-quiz-supabase-anon-key')
  };
}

export function hasSupabaseConfig() {
  const config = getSupabaseConfig();
  return Boolean(config.url && config.anonKey);
}
