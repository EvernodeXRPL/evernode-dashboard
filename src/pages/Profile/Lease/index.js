import { Grid } from '@material-ui/core';
import React from 'react';

import AccordionsCollapse from '../../../components/AccordionsCollapse';
import RegularTable from '../../../components/RegularTable';

export default function Lease(props) {
  const lease = props.lease;
  const tableHeadings = {
    key: 'Key',
    value: 'Value'
  };
  const tableValues = [
    {
      key: 'NFToken Id',
      value: lease.NFTokenID
    },
    {
      key: 'Offer Index',
      value: lease.index
    }
  ];

  return (
    <Grid item xs={12} className="pb-2">
      <AccordionsCollapse
        id={lease.NFTokenID}
        summary={`${lease.NFTokenID.substring(0, 20)}...`}
        expanded="true"
        panelClassName="bg-premium-dark text-light"
        panelSummaryClassName="text-light"
        panelDetailClassName="text-light overflow-auto">
        <RegularTable
          className="bg-transparent rounded-0"
          cellClassName="text-light"
          headings={tableHeadings}
          values={tableValues}
          highlight={['value']}
          hideHeadings />
      </AccordionsCollapse>
    </Grid>
  );
}
