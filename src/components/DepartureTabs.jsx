import React, { useState, useEffect } from 'react';
import Form from 'react-jsonschema-form';
import DeparturesForm from '../forms/Departures.json';
import PropTypes from 'prop-types';
import { Tabs, Tab, Typography, Box, makeStyles } from '@material-ui/core';
import { config } from '../config';
import { cloneDeep, isNil, set } from 'lodash';

const _ = {
  cloneDeep,
  isNil,
  set
};

const metroTransitEntry = config['metroTransitEntry'];

const routesEndPoint = `${metroTransitEntry}${config['endpoints']['routes']}`;

const directionsEndPoint = `${metroTransitEntry}${config['endpoints']['directions']}`;

const stopsEndPoint = `${metroTransitEntry}${config['endpoints']['stops']}`;

const departuresEndPoint = `${metroTransitEntry}${config['endpoints']['departures']}`;

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper
  }
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component='div'
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}>
      {value === index && <Box p={2}>{children}</Box>}
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
};

function a11yProps(index) {
  return {
    id: `departure-tab-${index}`,
    'aria-controls': `departure-tabpanel-${index}`
  };
}

export default function DepartureTabs(props) {
  const classes = useStyles();

  const [value, setValue] = useState(0);

  const [form, setForm] = useState({
    schema: DeparturesForm.schema,
    uiSchema: DeparturesForm.uiSchema
  });

  const [formData, setFormData] = useState({});

  const [routes, setRoutes] = useState([]);

  const [directions, setDirections] = useState([]);

  const [stops, setStops] = useState([]);

  useEffect(() => loadRoutes(), []);

  useEffect(() => {
    const newForm = _.cloneDeep(form);
    setRouteEnums(newForm, 'schema.properties.route');
    setForm(newForm);
  }, [routes]);

  useEffect(() => {
    const newForm = _.cloneDeep(form);
    setDirectionEnums(newForm, 'schema.properties.direction');
    setForm(newForm);
  }, [directions]);

  useEffect(() => {
    const newForm = _.cloneDeep(form);
    setStopEnums(newForm, 'schema.properties.stop');
    setForm(newForm);
  }, [stops]);

  useEffect(() => {
    const { route } = formData;
    if (!_.isNil(route)) {
      loadDirections(route);
    }
  }, [formData.route]);

  useEffect(() => {
    const { route, direction } = formData;
    if (!_.isNil(route) && !_.isNil(direction)) {
      loadStops(route, direction);
    }
  }, [formData.direction]);

  useEffect(() => {
    const { route, direction, stop } = formData;
    if (!_.isNil(route) && !_.isNil(direction) && !_.isNil(stop)) {
      loadDepartures(route, direction, stop);
    }
  }, [formData.stop]);

  const loadRoutes = () => {
    fetch(routesEndPoint, {
      method: 'GET'
    })
      .then(response => response.json())
      .then(data => setRoutes(data))
      .catch(error => console.error('Error: ', error));
  };

  const loadDirections = route => {
    fetch(directionsEndPoint.replace('{route}', route), {
      method: 'GET'
    })
      .then(response => response.json())
      .then(data => setDirections(data))
      .catch(error => console.error('Error: ', error));
  };

  const loadStops = (route, direction) => {
    fetch(
      stopsEndPoint.replace('{route}', route).replace('{direction}', direction),
      {
        method: 'GET'
      }
    )
      .then(response => response.json())
      .then(data => setStops(data))
      .catch(error => console.error('Error: ', error));
  };

  const loadDepartures = (route, direction, stop) => {
    const { setStop, setDepartures } = props;
    fetch(
      departuresEndPoint
        .replace('{route}', route)
        .replace('{direction}', direction)
        .replace('{stop}', stop),
      {
        method: 'GET'
      }
    )
      .then(response => response.json())
      .then(data => {
        setStop(data.Stop);
        setDepartures(data.Departures);
      })
      .catch(error => console.error('Error: ', error));
  };

  const setRouteEnums = (form, path) => {
    _.set(
      form,
      path + '.enum',
      (routes || []).map(route => route.RouteId)
    );
    _.set(
      form,
      path + '.enumNames',
      (routes || []).map(route => route.Description)
    );
  };

  const setDirectionEnums = (form, path) => {
    _.set(
      form,
      path + '.enum',
      (directions || []).map(direction => direction.DirectionId)
    );
    _.set(
      form,
      path + '.enumNames',
      (directions || []).map(direction => direction.DirectionName)
    );
  };

  const setStopEnums = (form, path) => {
    _.set(
      form,
      path + '.enum',
      (stops || []).map(stop => stop.PlaceCode)
    );
    _.set(
      form,
      path + '.enumNames',
      (stops || []).map(stop => stop.Description)
    );
  };

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleFormDataChange = formData => {
    setFormData(formData);
  };

  return (
    <div className={classes.root}>
      <Tabs
        value={value}
        onChange={handleTabChange}
        variant='fullWidth'
        aria-label='full width departure tabs'>
        <Tab label='By route' {...a11yProps(0)} />
        <Tab label='By stop #' {...a11yProps(1)} />
      </Tabs>
      <TabPanel value={value} index={0}>
        <Form
          id={'route_info_form'}
          schema={form.schema}
          uiSchema={form.uiSchema}
          formData={formData}
          onChange={({ formData }) => handleFormDataChange(formData)}>
          <button type='submit' className='d-none'></button>
        </Form>
      </TabPanel>
      <TabPanel value={value} index={1}>
        {
          // TODO:
        }
      </TabPanel>
    </div>
  );
}
