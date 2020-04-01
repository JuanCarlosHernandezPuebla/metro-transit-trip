import React from 'react';
import { Switch, Route } from 'react-router-dom';
import RouteInformation from './RouteInformation';

export default function Main() {
  return (
    <main>
      <Switch>
        <Route exact={true} path='/' component={RouteInformation} />
      </Switch>
    </main>
  );
}
