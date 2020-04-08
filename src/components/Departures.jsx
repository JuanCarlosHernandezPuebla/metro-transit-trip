import React, { useState } from 'react';
import { isEmpty } from 'lodash';
import DepartureTabs from './DepartureTabs';
import DeparturesInformation from './DeparturesInformation';

const _ = {
  isEmpty
};

export default function Departures() {
  const [stop, setStop] = useState({});
  const [departures, setDepartures] = useState([]);

  return (
    <div className='container departures-main-content'>
      <div className='row'>
        <div className='col-sm-12'>
          <h1>Metro Transit Departures</h1>
          <div className='col-sm-12 col-md-6'>
            <DepartureTabs setStop={setStop} setDepartures={setDepartures} />
          </div>
          {!_.isEmpty(stop) && (
            <DeparturesInformation stop={stop} departures={departures} />
          )}
        </div>
      </div>
    </div>
  );
}
