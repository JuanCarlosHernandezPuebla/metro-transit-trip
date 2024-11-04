import React, { useState, useEffect } from 'react';
import Form from 'react-jsonschema-form';
import DeparturesForm from '../forms/Departures.json';
import SearchWidget from '../forms/Widgets/SearchWidget';
import PropTypes from 'prop-types';
import { Tabs, Tab, Typography, Box, makeStyles } from '@material-ui/core';
import { config } from '../config';
import { cloneDeep, isNil, set, isEmpty } from 'lodash';

const _ = {
  cloneDeep,
  isNil,
  set,
  isEmpty
};

const metroTransitEntry = config['metroTransitEntry'];

const routesEndPoint = `${metroTransitEntry}${config['endpoints']['routes']}`;

const directionsEndPoint = `${metroTransitEntry}${config['endpoints']['directions']}`;

const stopsEndPoint = `${metroTransitEntry}${config['endpoints']['stops']}`;

const routeDeparturesEndPoint = `${metroTransitEntry}${config['endpoints']['routeDepartures']}`;

const stopDeparturesEndPoint = `${metroTransitEntry}${config['endpoints']['stopDepartures']}`;

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
    routeSchema: DeparturesForm.routeSchema,
    routeUiSchema: DeparturesForm.routeUiSchema,
    stopSchema: DeparturesForm.stopSchema,
    stopUiSchema: DeparturesForm.stopUiSchema
  });

  const [routeFormData, setRouteFormData] = useState({});

  const [stopFormData, setStopFormData] = useState({});

  const [routes, setRoutes] = useState([]);

  const [directions, setDirections] = useState([]);

  const [stops, setStops] = useState([]);

  useEffect(() => loadRoutes(), []);

  useEffect(() => {
    const newForm = _.cloneDeep(form);
    setRouteEnums(newForm, 'routeSchema.properties.route');
    setForm(newForm);
  }, [routes]);

  useEffect(() => {
    const newForm = _.cloneDeep(form);
    setDirectionEnums(newForm, 'routeSchema.properties.direction');
    setForm(newForm);
  }, [directions]);

  useEffect(() => {
    const newForm = _.cloneDeep(form);
    setStopEnums(newForm, 'routeSchema.properties.stop');
    setForm(newForm);
  }, [stops]);

  useEffect(() => {
    const { route } = routeFormData;
    if (!_.isNil(route)) {
      loadDirections(route);
    }
  }, [routeFormData.route]);

  useEffect(() => {
    const { route, direction } = routeFormData;
    if (!_.isNil(route) && !_.isNil(direction)) {
      loadStops(route, direction);
    }
  }, [routeFormData.direction]);

  useEffect(() => {
    const { route, direction, stop } = routeFormData;
    if (!_.isNil(route) && !_.isNil(direction) && !_.isNil(stop)) {
      loadRouteDepartures(route, direction, stop);
    }
  }, [routeFormData.stop]);

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

  const loadRouteDepartures = (route, direction, stop) => {
    const { setStop, setDepartures } = props;
    fetch(
      routeDeparturesEndPoint
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

  const loadStopDepartures = stopId => {
    const { setStop, setDepartures } = props;
    fetch(stopDeparturesEndPoint.replace('{stopId}', stopId), {
      method: 'GET'
    })
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
      (routes || []).map(route => route['route_id'])
    );
    _.set(
      form,
      path + '.enumNames',
      (routes || []).map(route => route['route_label'])
    );
  };

  const setDirectionEnums = (form, path) => {
    _.set(
      form,
      path + '.enum',
      (directions || []).map(direction => direction['direction_id'])
    );
    _.set(
      form,
      path + '.enumNames',
      (directions || []).map(direction => direction['direction_name'])
    );
  };

  const setStopEnums = (form, path) => {
    _.set(
      form,
      path + '.enum',
      (stops || []).map(stop => stop['place_code'])
    );
    _.set(
      form,
      path + '.enumNames',
      (stops || []).map(stop => stop['description'])
    );
  };

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleRouteFormDataChange = formData => {
    setRouteFormData(formData);
  };

  const handleStopSubmit = formData => {
    const { stop } = formData;

    if (!_.isNil(stop) && !_.isEmpty(stop)) {
      loadStopDepartures(stop);
    }
  };

  const transformErrors = errors => {
    return errors.map(error => {
      if (error.name === 'pattern') {
        error.message = 'Only digits are allowed';
      }
      return error;
    });
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
          schema={form.routeSchema}
          uiSchema={form.routeUiSchema}
          formData={routeFormData}
          onChange={({ formData }) => handleRouteFormDataChange(formData)}>
          <button type='submit' className='d-none'></button>
        </Form>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Form
          id={'stop_info_form'}
          schema={form.stopSchema}
          transformErrors={transformErrors}
          showErrorList={false}
          uiSchema={form.stopUiSchema}
          formData={stopFormData}
          onChange={({ formData }) => setStopFormData(formData)}
          onSubmit={({ formData }) => handleStopSubmit(formData)}
          widgets={{ search: SearchWidget }}>
          <button type='submit' className='d-none'></button>
        </Form>
      </TabPanel>
    </div>
  );
}
