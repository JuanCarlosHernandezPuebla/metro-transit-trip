import React, { useState, useEffect } from 'react';
import Form from 'react-jsonschema-form';
import * as DeparturesForm from '../forms/Departures.json';
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

export default function RouteInformation() {
  const [formData, setFormData] = useState({});

  const [form, setForm] = useState({
    schema: DeparturesForm.schema,
    uiSchema: DeparturesForm.uiSchema
  });

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

  const setRouteEnums = (form, path) => {
    _.set(
      form,
      path + '.enum',
      routes.map(route => route.RouteId)
    );
    _.set(
      form,
      path + '.enumNames',
      routes.map(route => route.Description)
    );
  };

  const setDirectionEnums = (form, path) => {
    _.set(
      form,
      path + '.enum',
      directions.map(direction => direction.DirectionId)
    );
    _.set(
      form,
      path + '.enumNames',
      directions.map(direction => direction.DirectionName)
    );
  };

  const setStopEnums = (form, path) => {
    _.set(
      form,
      path + '.enum',
      stops.map(stop => stop.PlaceCode)
    );
    _.set(
      form,
      path + '.enumNames',
      stops.map(stop => stop.Description)
    );
  };

  const onChange = formData => {
    setFormData(formData);
  };

  //TODO: Add remaining inputs and apply styling.

  return (
    <div className='container'>
      <div className='col-sm-12'>
        <h1>Metro Transit Departures</h1>
        <div className='col-sm-6'>
          <Form
            id={'route_info_form'}
            schema={form.schema}
            uiSchema={form.uiSchema}
            formData={formData}
            onChange={({ formData }) => onChange(formData)}
            onSubmit={() => {}}
            onError={() => {}}>
            <button type='submit' className='d-none'></button>
          </Form>
        </div>
      </div>
    </div>
  );
}
