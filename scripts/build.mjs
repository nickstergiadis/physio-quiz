import { cp, mkdir, rm, writeFile } from 'node:fs/promises';

function escapeJsString(value) {
  return String(value ?? '')
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r');
}

function resolveRuntimeConfigFromEnv() {
  return {
    supabaseUrl: process.env.PHYSIO_QUIZ_SUPABASE_URL || '',
    supabaseAnonKey: process.env.PHYSIO_QUIZ_SUPABASE_ANON_KEY || '',
    supabaseFunctionsBaseUrl: process.env.PHYSIO_QUIZ_SUPABASE_FUNCTIONS_URL || ''
  };
}

function buildRuntimeConfigScript(config) {
  return `window.__PHYSIO_QUIZ_CONFIG__ = Object.assign({}, window.__PHYSIO_QUIZ_CONFIG__, {\n  supabaseUrl: '${escapeJsString(
    config.supabaseUrl
  )}',\n  supabaseAnonKey: '${escapeJsString(config.supabaseAnonKey)}',\n  supabaseFunctionsBaseUrl: '${escapeJsString(
    config.supabaseFunctionsBaseUrl
  )}'\n});\n`;
}

await rm('dist', { recursive: true, force: true });
await mkdir('dist', { recursive: true });
await cp('index.html', 'dist/index.html');
await cp('src', 'dist/src', { recursive: true });

const runtimeConfig = resolveRuntimeConfigFromEnv();
await writeFile('dist/runtime-config.js', buildRuntimeConfigScript(runtimeConfig), 'utf8');

const missing = [];
if (!runtimeConfig.supabaseUrl) missing.push('PHYSIO_QUIZ_SUPABASE_URL');
if (!runtimeConfig.supabaseAnonKey) missing.push('PHYSIO_QUIZ_SUPABASE_ANON_KEY');

if (missing.length) {
  console.warn(`Build warning: runtime config missing ${missing.join(', ')}. Remote save will be disabled.`);
}

console.log('Build complete: dist/ generated.');
