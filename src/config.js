const setupConfig = () => {
  switch (process.env.NODE_ENV) {
    case 'development':
      return {
        base: 'http://localhost:3000/',
        metroTransitEntry: 'https://svc.metrotransit.org/',
        endpoints: {
          routes: 'nextripv2/routes',
          directions: 'nextripv2/directions/{route}'
        }
      }
    case 'production':
      return {
        base: '',
        metroTransitEntry: 'https://svc.metrotransit.org/',
        endpoints: {
          routes: 'nextripv2/routes',
          directions: 'nextripv2/directions/{route}'
        }
      }
    default:
      return {
        base: 'http://localhost:3000/',
        metroTransitEntry: 'https://svc.metrotransit.org/',
        endpoints: {
          routes: 'nextripv2/routes',
          directions: 'nextripv2/directions/{route}'
        }
      }
  }
};
export const config = setupConfig();