import React, { Fragment } from 'react';
import PageTitle from '../../layout-components/PageTitle';

import {
  Grid,
  Card,
  CardContent
} from '@material-ui/core';
import Leases from './Leases';

export default function Profile() {
  return (
    <Fragment>
      <PageTitle
        titleHeading="Profile"
        titleDescription="XRPL Address"
      />
      <Grid container spacing={4}>
        <Grid item xs={12} sm={6} md={4}>
          <Card className="mb-4">
            <CardContent className="p-3">
              <h5 className="card-title font-weight-bold font-size-lg">
                Card title
              </h5>
              <p className="card-text">
                Some quick example text to build on the card title and make up
                the bulk of the card's content.
              </p>
            </CardContent>
          </Card>
          <Card className="mb-4">
            <CardContent className="p-3">
              <h5 className="card-title font-weight-bold font-size-lg">
                Card title
              </h5>
              <p className="card-text">
                Some quick example text to build on the card title and make up
                the bulk of the card's content.
              </p>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Leases />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card className="mb-4">
            <CardContent className="p-3">
              <h5 className="card-title font-weight-bold font-size-lg">
                Card title
              </h5>
              <p className="card-text">
                Some quick example text to build on the card title and make up
                the bulk of the card's content.
              </p>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Fragment>
  );
}
