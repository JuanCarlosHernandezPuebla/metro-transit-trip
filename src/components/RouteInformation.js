import React, { useState, useEffect } from 'react';
import Form from "react-jsonschema-form";
import * as RouteInformationForm from '../forms/RouteInformation.json'
import { config } from '../config';
import { cloneDeep, set } from 'lodash';

const _ = {
  cloneDeep,
  set
}

const metroTransitEntry = config['metroTransitEntry'];

const routesEndPoint = `${metroTransitEntry}${config['endpoints']['routes']}`;

export default function RouteInformation() {

  const [formData, setFormData] = useState({});

  const [form, setForm] = useState({
    schema: RouteInformationForm.schema,
    uiSchema: RouteInformationForm.uiSchema
  });

  const [routes, setRoutes] = useState([]);

  useEffect(() => loadRoutes(), []);

  useEffect(() => {
    const newForm = _.cloneDeep(form);
    setRouteEnums(newForm, 'schema.properties.route');
    setForm(newForm);
  }, [routes]);

  const loadRoutes = () => {
    fetch(routesEndPoint, {
      method: 'GET'
    })
    .then(response => response.json())
    .then(data => setRoutes(data))
    .catch(error => console.error('Error: ', error))
  };

  const setRouteEnums = (form, path) => {
    _.set(form, path + '.enum', routes.map(route => route.RouteId));
    _.set(form, path + '.enumNames', routes.map(route => route.Description));
  };

  //TODO: Add remaining inputs and apply styling. 

  return (
    <div className="container">
      <div className="col-sm-12">
        <div className="col-sm-6">
          <Form
            schema={form.schema}
            uiSchema={form.uiSchema}
            formData={formData}
            onChange={({ formData }) => setFormData(formData)}
            onSubmit={() => { }}
            onError={() => { }}
          />
        </div>
      </div>
    </div>
  );

}