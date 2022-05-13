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
      value: lease.nfTokenId
    },
    {
      key: 'URI',
      value: lease.uri
    },
    {
      key: 'Offer Index',
      value: lease.offerIndex
    }
  ];

  return (
    <Grid item xs={12} className="pb-2">
      <AccordionsCollapse
        id={lease.nfTokenId}
        summary={`${lease.nfTokenId.substring(0, 26)}......${lease.nfTokenId.substring(lease.nfTokenId.length - 8)}`}
        expanded="true"
        panelClassName="bg-unicorn text-light"
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