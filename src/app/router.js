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
  const raw = location.hash.replace('#', '') || ROUTES.home;
  const [path] = raw.split('?');
  return isKnownRoute(path) ? path : ROUTES.home;
}

export function writeRoute(route) {
  location.hash = isKnownRoute(route) ? route : ROUTES.home;
}
