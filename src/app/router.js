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

export function resolveRoute(hash = location.hash) {
  const raw = hash.replace('#', '') || ROUTES.home;
  const known = isKnownRoute(raw);

  return {
    route: known ? raw : ROUTES.home,
    unknownHash: !!raw && !known
  };
}

export function readRoute() {
  return resolveRoute().route;
}

export function writeRoute(route) {
  location.hash = isKnownRoute(route) ? route : ROUTES.home;
}
