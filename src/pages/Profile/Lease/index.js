import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Grid, Card, CardContent } from '@material-ui/core';

import AddCircleTwoToneIcon from '@material-ui/icons/AddCircleTwoTone';

export default function Lease() {
  return (
    <Grid item xs={12}>
      <Card className="card-box mb-4 bg-premium-dark border-0 text-light">
        <CardContent className="p-3">
          <div className="align-box-row align-items-start">
            <div className="font-weight-bold">
              <small className="text-white-50 d-block mb-1 text-uppercase">
                New Accounts
              </small>
              <span className="font-size-xxl mt-1">586,356</span>
            </div>
            <div className="ml-auto">
              <div className="bg-white text-center text-success font-size-xl d-50 d-flex align-items-center justify-content-center rounded-circle">
                <AddCircleTwoToneIcon />
              </div>
            </div>
          </div>
          <div className="mt-3">
            <FontAwesomeIcon
              icon={['fas', 'arrow-up']}
              className="text-success"
            />
            <span className="text-success px-1">15.4%</span>
            <span className="text-white-50">increase this month</span>
          </div>
        </CardContent>
      </Card>
    </Grid>
  );
}
