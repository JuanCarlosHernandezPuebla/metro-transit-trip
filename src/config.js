const setupConfig = () => {
  switch (process.env.NODE_ENV) {
    case 'development':
      return {
        base: 'http://localhost:3000/',
        metroTransitEntry: 'https://svc.metrotransit.org/',
        endpoints: {
          routes: 'nextripv2/routes',
          directions: 'nextripv2/directions/{route}',
          stops: 'nextripv2/stops/{route}/{direction}',
          routeDepartures: 'nextripv2/{route}/{direction}/{stop}',
          stopDepartures: 'nextripv2/{stopId}'
        }
      };
    case 'production':
      return {
        base: '',
        metroTransitEntry: 'https://svc.metrotransit.org/',
        endpoints: {
          routes: 'nextripv2/routes',
          directions: 'nextripv2/directions/{route}',
          stops: 'nextripv2/stops/{route}/{direction}',
          routeDepartures: 'nextripv2/{route}/{direction}/{stop}',
          stopDepartures: 'nextripv2/{stopId}'
        }
      };
    default:
      return {
        base: 'http://localhost:3000/',
        metroTransitEntry: 'https://svc.metrotransit.org/',
        endpoints: {
          routes: 'nextripv2/routes',
          directions: 'nextripv2/directions/{route}',
          stops: 'nextripv2/stops/{route}/{direction}',
          routeDepartures: 'nextripv2/{route}/{direction}/{stop}',
          stopDepartures: 'nextripv2/{stopId}'
        }
      };
  }
};
export const config = setupConfig();
