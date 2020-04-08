import React from 'react';
import CustomTable from './CustomTable';
import { isEmpty } from 'lodash';
import {
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Typography,
  Box,
  makeStyles
} from '@material-ui/core';
import {
  ExpandMore as ExpandMoreIcon,
  DirectionsBus as DirectionsBusIcon
} from '@material-ui/icons';
import DeparturesMap from './DeparturesMap';

const _ = {
  isEmpty
};

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%'
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular
  },
  departuresIcon: {
    marginRight: theme.spacing(1)
  }
}));

const moment = require('moment');

const columns = ['Route Number', 'Route Name', 'Depart Time'];

export default function DeparturesInformation(props) {
  const classes = useStyles();

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
        <>
          <CustomTable columns={columns} rows={rows}></CustomTable>
          <Box mt={2}>
            <ExpansionPanel>
              <ExpansionPanelSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls='panel1a-content'
                id='panel1a-header'>
                <Typography className={classes.heading}>
                  <DirectionsBusIcon className={classes.departuresIcon} />
                  Show my train
                </Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <div className='departures-map'>
                  <DeparturesMap />
                </div>
              </ExpansionPanelDetails>
            </ExpansionPanel>
          </Box>
        </>
      )}
    </div>
  );
}
