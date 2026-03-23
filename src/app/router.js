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

function parseHashParts(hash) {
  const raw = typeof hash === 'string' ? hash.replace('#', '') : '';
  const [pathPart, queryPart = ''] = raw.split('?');
  const path = pathPart || ROUTES.home;
  const query = new URLSearchParams(queryPart);
  return { path, query };
}

export function readResumeCodeFromLocation() {
  const hashParts = parseHashParts(location.hash);
  const hashCode = hashParts.query.get('resume') || hashParts.query.get('code');
  const queryCode = new URLSearchParams(location.search).get('resume') || new URLSearchParams(location.search).get('code');
  return hashCode || queryCode || '';
}

export function resolveRoute(hash = location.hash) {
  const { path } = parseHashParts(hash);
  const known = isKnownRoute(path);

  return {
    route: known ? path : ROUTES.home,
    unknownHash: !!path && !known
  };
}

export function readRoute() {
  return parseRouteFromHash(location.hash).route;
}

export function writeRoute(route) {
  location.hash = isKnownRoute(route) ? route : ROUTES.home;
}

export function parseRouteFromHash(hash) {
  const { path } = parseHashParts(hash);
  if (isKnownRoute(path)) {
    return { route: path, fellBack: false };
  }
  return { route: ROUTES.home, fellBack: path !== ROUTES.home };
}
