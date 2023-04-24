import React from 'react';
import { Tooltip, withStyles } from '@material-ui/core';
import ReactCountryFlag from 'react-country-flag';
import ISO3166_1 from "iso-3166-1";

export default function CountryFlag(props) {
  const { countryCode, size } = props;

  const isValidCountryCode = (code) => {
    return ISO3166_1.whereAlpha2(code) !== undefined;
  };

  // Overriding tooltip styles to keep tooltip near the flag.
  const StyledTooltip = withStyles({
    tooltipPlacementRight: {
      marginLeft: "0",
    },
  })(Tooltip);

  if (isValidCountryCode(countryCode)) {
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
  } else {
    return (
      <span style={{fontSize: "24px", width: "42px", textAlign: "center"}}>{countryCode}</span>
    )
  }
}