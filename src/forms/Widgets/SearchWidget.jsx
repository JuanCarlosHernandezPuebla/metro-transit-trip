import React from 'react';

export default function SearchWidget(props) {
  const { placeholder, id, onChange } = props;
  return (
    <input
      type='text'
      className='form-control'
      id={id}
      placeholder={placeholder}
      onChange={event => onChange(event.target.value)}></input>
  );
}
