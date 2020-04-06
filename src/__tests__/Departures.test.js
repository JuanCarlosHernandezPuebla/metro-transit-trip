import React from 'react';
import Departures from '../components/Departures';
import routesResponse from './__mocks__/routes.json';
import directionsResponse from './__mocks__/directions.json';
import stopsResponse from './__mocks__/stops.json';
import departuresResponse from './__mocks__/departures.json';

const waitForExpect = require('wait-for-expect');

beforeEach(() => {
  jest.useFakeTimers();
  fetch.resetMocks();
});

async function waitForMockCalls(numberOfCalls) {
  await waitForExpect(() => {
    expect(fetch.mock.calls.length).toEqual(numberOfCalls);
  });
}

async function updateComponent(component) {
  jest.runOnlyPendingTimers();
  await Promise.resolve().then(() => {
    jest.runOnlyPendingTimers();
  });
  component.update();
}

test('Departures render test', () => {
  const component = shallow(<Departures />);
  expect(component).toMatchSnapshot();
});

test('Departures by route test', async done => {
  fetch.mockResponses(
    [JSON.stringify(routesResponse), { status: 200 }],
    [JSON.stringify(directionsResponse), { status: 200 }],
    [JSON.stringify(stopsResponse), { status: 200 }],
    [JSON.stringify(departuresResponse), { status: 200 }]
  );

  const component = mount(<Departures />);
  await updateComponent(component);
  await waitForMockCalls(1);
  await updateComponent(component);
  expect(component).toMatchSnapshot();
  const route = component.find('select#root_route');
  route.simulate('change', { target: { value: '901' } });
  await updateComponent(component);
  await waitForMockCalls(2);
  await updateComponent(component);
  const direction = component.find('select#root_direction');
  direction.simulate('change', { target: { value: '1' } });
  await updateComponent(component);
  await waitForMockCalls(3);
  await updateComponent(component);
  const stop = component.find('select#root_stop');
  stop.simulate('change', { target: { value: 'TF12' } });
  await updateComponent(component);
  await waitForMockCalls(4);
  await updateComponent(component);
  expect(component).toMatchSnapshot();
  done();
});
