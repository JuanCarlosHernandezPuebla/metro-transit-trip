import React, { useState } from 'react';
import CustomTable from './CustomTable';
import { isEmpty } from 'lodash';
import DepartureTabs from './DepartureTabs';
const moment = require('moment');

const _ = {
  isEmpty
};

const columns = ['Route Number', 'Route Name', 'Depart Time'];

export default function Departures() {
  const [stop, setStop] = useState({});
  const [departures, setDepartures] = useState([]);

  const rows = (departures || []).map(departure => ({
    routeNumber: departure.RouteId,
    routeName: departure.Description,
    departureTime: moment.utc(departure.DepartureTime).format('h:mm a')
  }));

  return (
    <div className='container'>
      <div className='col-sm-12'>
        <h1>Metro Transit Departures</h1>
        <div className='col-sm-12 col-md-6'>
          <DepartureTabs setStop={setStop} setDepartures={setDepartures} />
        </div>
        {!_.isEmpty(stop) && (
          <div className='col-sm-12'>
            <h2>Departures</h2>
            <div className='mb-2'>
              <p>{stop.Description}</p>
              <p>{`Stop ${stop.StopId}`}</p>
            </div>
            {_.isEmpty(rows) ? (
              <div className='bold-text'>
                <p>No departures at this time</p>
              </div>
            ) : (
              <CustomTable columns={columns} rows={rows}></CustomTable>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
