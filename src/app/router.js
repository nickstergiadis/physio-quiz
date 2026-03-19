export const ROUTES = {
  home: '/',
  quiz: '/quiz',
  results: '/results',
  progress: '/progress',
  admin: '/admin-dev'
};

export function readRoute() {
  return location.hash.replace('#', '') || ROUTES.home;
}

export function writeRoute(route) {
  location.hash = route;
}
