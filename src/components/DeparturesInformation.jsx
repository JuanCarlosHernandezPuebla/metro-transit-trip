import React from 'react';
import CustomTable from './CustomTable';

const moment = require('moment');

const columns = ['Route Number', 'Route Name', 'Depart Time'];

export default function DeparturesInformation(props) {
  const { stop, departures } = props;

  const rows = (departures || []).map(departure => ({
    routeNumber: departure.RouteId,
    routeName: departure.Description,
    departureTime: moment.utc(departure.DepartureTime).format('h:mm a')
  }));
  return (
    <div className='col-sm-12'>
      <h2>Departures</h2>
      <div className='mb-2'>
        <p>{stop.Description}</p>
        <p>{`Stop ${stop.StopId}`}</p>
      </div>
      {_.isEmpty(departures) ? (
        <div className='bold-text'>
          <p>No departures at this time</p>
        </div>
      ) : (
        <CustomTable columns={columns} rows={rows}></CustomTable>
      )}
    </div>
  );
}
