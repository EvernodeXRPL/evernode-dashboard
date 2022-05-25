import React from 'react';
import { Tooltip, withStyles } from '@material-ui/core';
import ReactCountryFlag from 'react-country-flag';

export default function CountryFlag(props) {
  const { countryCode, size } = props;

  // Overriding tooltip styles to keep tooltip near the flag.
  const StyledTooltip = withStyles({
    tooltipPlacementRight: {
      marginLeft: "0",
    },
  })(Tooltip);

  return (
    <StyledTooltip title={countryCode} placement='right-end'>
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
    </StyledTooltip>
  );
}
