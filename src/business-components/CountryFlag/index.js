import { Tooltip } from '@material-ui/core';
import React from 'react';
import ReactCountryFlag from 'react-country-flag';

export default function CountryFlag(props) {
  const { countryCode, size } = props;

  return (
    <Tooltip title={countryCode}>
      <span>
        <ReactCountryFlag
          countryCode={countryCode}
          style={{
            fontSize: size,
            cursor: 'pointer'
          }}
          aria-label={countryCode} /></span>
    </Tooltip>
  );
}
