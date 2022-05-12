import * as React from 'react';

import {
  CircularProgress,
  Grid
} from '@material-ui/core';

export default function Loader() {
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
      className="p-4">
      <CircularProgress />
    </Grid>
  );
}
