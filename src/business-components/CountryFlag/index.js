import React from 'react';
import { Tooltip } from '@mui/material';
import ReactCountryFlag from 'react-country-flag';

export default function CountryFlag(props) {
  const { countryCode, size } = props;

  return (
    <Tooltip title={countryCode} placement='right-end'>
      <div>
        <ReactCountryFlag
          className="emojiFlag"
          countryCode={countryCode}
          style={{
            fontSize: size,
            cursor: 'pointer'
          }}
          aria-label={countryCode}
          alt={countryCode}
          svg
        />
      </div>
    </Tooltip>
  );
}
