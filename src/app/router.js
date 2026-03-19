export const ROUTES = {
  home: '/',
  quiz: '/quiz',
  results: '/results',
  progress: '/progress'
};

export function readRoute() {
  return location.hash.replace('#', '') || ROUTES.home;
}

export function writeRoute(route) {
  location.hash = route;
}
