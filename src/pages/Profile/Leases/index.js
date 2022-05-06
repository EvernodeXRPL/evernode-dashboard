import React, { Fragment } from 'react';

import { Grid } from '@material-ui/core';

import Lease from '../Lease';

export default function Leases() {
  return (
    <Fragment>
      <Grid container>
        <Lease></Lease>
        <Lease></Lease>
        <Lease></Lease>
      </Grid>
    </Fragment>
  );
}
