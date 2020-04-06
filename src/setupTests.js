import { configure, shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

const fetch = require('jest-fetch-mock');

configure({ adapter: new Adapter() });

global.shallow = shallow;
global.mount = mount;
global.fetch = fetch;

jest.setTimeout(10000); // in milliseconds
