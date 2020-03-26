import React, { useState, useEffect } from 'react';
import Form from "react-jsonschema-form";
import * as RouteInformationForm from '../forms/RouteInformation.json';
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

export default function RouteInformation() {

  const [formData, setFormData] = useState({});

  const [form, setForm] = useState({
    schema: RouteInformationForm.schema,
    uiSchema: RouteInformationForm.uiSchema
  });

  const [routes, setRoutes] = useState([]);

  const [directions, setDirections] = useState([]);

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

  const loadRoutes = () => {
    fetch(routesEndPoint, {
      method: 'GET'
    })
    .then(response => response.json())
    .then(data => setRoutes(data))
    .catch(error => console.error('Error: ', error))
  };

  const loadDirections = (route) => {
    fetch(directionsEndPoint.replace('{route}', route), {
      method: 'GET'
    })
    .then(response => response.json())
    .then(data => setDirections(data))
    .catch(error => console.error('Error: ', error))
  }

  const setRouteEnums = (form, path) => {
    _.set(form, path + '.enum', routes.map(route => route.RouteId));
    _.set(form, path + '.enumNames', routes.map(route => route.Description));
  };

  const setDirectionEnums = (form, path) => {
    _.set(form, path + '.enum', directions.map(route => route.DirectionId));
    _.set(form, path + '.enumNames', directions.map(route => route.DirectionName));
  };

  const onChange = formData => {
    const { route } = formData;
    if (!_.isNil(route)) {
      loadDirections(route);
    }
    setFormData(formData);
  };

  //TODO: Add remaining inputs and apply styling.

  return (
    <div className="container">
      <div className="col-sm-12">
        <div className="col-sm-6">
          <Form
            id={"route_info_form"}
            schema={form.schema}
            uiSchema={form.uiSchema}
            formData={formData}
            onChange={({formData}) => onChange(formData)}
            onSubmit={() => { }}
            onError={() => { }}
          />
        </div>
      </div>
    </div>
  );

}