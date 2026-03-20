export const ROUTES = {
  home: '/',
  quiz: '/quiz',
  results: '/results',
  progress: '/progress',
  admin: '/admin-dev'
};

export function isKnownRoute(route) {
  return Object.values(ROUTES).includes(route);
}

export function readRoute() {
  return parseRouteFromHash(location.hash).route;
}

export function writeRoute(route) {
  location.hash = isKnownRoute(route) ? route : ROUTES.home;
}

export function parseRouteFromHash(hash) {
  const raw = typeof hash === 'string' ? hash.replace('#', '') || ROUTES.home : ROUTES.home;
  if (isKnownRoute(raw)) {
    return { route: raw, fellBack: false };
  }
  return { route: ROUTES.home, fellBack: raw !== ROUTES.home };
}
