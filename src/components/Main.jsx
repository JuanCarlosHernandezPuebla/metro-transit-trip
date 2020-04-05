import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Departures from './Departures';

export default function Main() {
  return (
    <main>
      <Switch>
        <Route exact={false} path='/' component={Departures} />
        <Route exact={true} path='/departures' component={Departures} />
      </Switch>
    </main>
  );
}
