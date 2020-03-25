const setupConfig = () => {
  switch (process.env.NODE_ENV) {
    case 'development':
      return {
        base: 'http://localhost:3000/',
        metroTransitEntry: 'https://svc.metrotransit.org/',
        endpoints: {
          routes: 'nextripv2/routes'
        }
      }
    case 'production':
      return {
        base: '',
        metroTransitEntry: 'https://svc.metrotransit.org/',
        endpoints: {
          routes: 'nextripv2/routes'
        }
      }
    default:
      return {
        base: 'http://localhost:3000/',
        metroTransitEntry: 'https://svc.metrotransit.org/',
        endpoints: {
          routes: 'nextripv2/routes'
        }
      }
  }
};
export const config = setupConfig();