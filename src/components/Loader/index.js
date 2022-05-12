import * as React from 'react';

import {
  CircularProgress,
  Grid
} from '@material-ui/core';

export default function Loader(props) {
  const {
    className,
    size } = props;

  return (
    <Grid
      container
      item
      spacing={0}
      direction="column"
      alignItems="center"
      justifycontent="center"
      xs={12}
      sx={{ display: 'flex' }}
      className={className}>
      <CircularProgress size={size} />
    </Grid>
  );
}
