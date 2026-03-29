const THEME_STORAGE_KEY = 'physio_quiz_theme_mode';
const DEFAULT_THEME_MODE = 'system';
const ALLOWED_THEME_MODES = new Set(['light', 'dark', 'system']);

function getThemeRoot() {
  return document.documentElement ?? document.body;
}

function getMediaQueryList() {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return null;
  }
  return window.matchMedia('(prefers-color-scheme: dark)');
}

function resolveSystemTheme() {
  return getMediaQueryList()?.matches ? 'dark' : 'light';
}

function normalizeThemeMode(mode) {
  return ALLOWED_THEME_MODES.has(mode) ? mode : DEFAULT_THEME_MODE;
}

function loadThemeMode() {
  try {
    return normalizeThemeMode(localStorage.getItem(THEME_STORAGE_KEY));
  } catch {
    return DEFAULT_THEME_MODE;
  }
}

function saveThemeMode(mode) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, mode);
  } catch {
    // Ignore storage write failures.
  }
}

function resolveTheme(mode) {
  return mode === 'system' ? resolveSystemTheme() : mode;
}

function applyTheme(theme, mode) {
  const root = getThemeRoot();
  if (!root) return;

  root.setAttribute('data-theme', theme);
  root.setAttribute('data-theme-mode', mode);

  if (root.style) {
    root.style.colorScheme = theme;
  }
}

export function initializeTheme() {
  let currentMode = loadThemeMode();
  applyTheme(resolveTheme(currentMode), currentMode);

  const mediaQueryList = getMediaQueryList();
  const handlePreferenceChange = () => {
    if (currentMode !== 'system') return;
    applyTheme(resolveTheme('system'), 'system');
  };

  if (mediaQueryList) {
    if (typeof mediaQueryList.addEventListener === 'function') {
      mediaQueryList.addEventListener('change', handlePreferenceChange);
    } else if (typeof mediaQueryList.addListener === 'function') {
      mediaQueryList.addListener(handlePreferenceChange);
    }
  }

  return {
    getMode() {
      return currentMode;
    },
    setMode(mode) {
      currentMode = normalizeThemeMode(mode);
      saveThemeMode(currentMode);
      applyTheme(resolveTheme(currentMode), currentMode);
    }
  };
}

export { THEME_STORAGE_KEY, DEFAULT_THEME_MODE };
