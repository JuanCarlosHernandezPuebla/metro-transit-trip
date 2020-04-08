import React from 'react';
import GoogleMapReact from 'google-map-react';

const Marker = ({ text }) => <div className='property-marker'>{text}</div>;

// TODO: Display Stop and Bus Markers

export default function DeparturesMap(props) {
  return (
    <GoogleMapReact
      bootstrapURLKeys={{ key: '' }}
      defaultCenter={props.center}
      defaultZoom={props.zoom}>
      <Marker lat={44.9778} lng={-93.265} text='Location' />
    </GoogleMapReact>
  );
}

DeparturesMap.defaultProps = {
  center: { lat: 44.9778, lng: -93.265 },
  zoom: 11
};
