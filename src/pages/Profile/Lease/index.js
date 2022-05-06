import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Grid, Card, CardContent } from '@material-ui/core';

export default function Lease() {
  return (
    <Grid item xs={12}>
      <Card className="card-box mb-4 bg-midnight-bloom text-light">
        <CardContent className="p-3">
          <div className="align-box-row align-items-start">
            <div className="font-weight-bold">
              <small className="text-white-50 d-block mb-1 text-uppercase">
                Sales
              </small>
              <span className="font-size-xxl mt-1">23,274</span>
            </div>
            <div className="ml-auto">
              <div className="bg-white text-center text-primary font-size-xl d-50 d-flex align-items-center justify-content-center rounded-circle">
                <FontAwesomeIcon icon={['far', 'dot-circle']} />
              </div>
            </div>
          </div>
          <div className="mt-3">
            <FontAwesomeIcon
              icon={['fas', 'arrow-up']}
              className="text-warning"
            />
            <span className="text-warning px-1">5.9%</span>
            <span className="text-white-50">same as before</span>
          </div>
        </CardContent>
      </Card>
    </Grid>
  );
}
