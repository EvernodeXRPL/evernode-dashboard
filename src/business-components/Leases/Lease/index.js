import { Button, Grid, Tooltip, Typography } from '@material-ui/core';
import React from 'react';

import AccordionsCollapse from '../../../components/AccordionsCollapse';
import RegularTable from '../../../components/RegularTable';
import ModalDialog from '../../../components/ModalDialog';

export default function Lease(props) {
  const { lease } = props;

  const [showTos, setShowTos] = React.useState(false);

  const tableHeadings = {
    key: 'Key',
    value: 'Value'
  };
  const tableValues = [
    {
      key: 'Lease Amount',
      value: <Tooltip title="EVRs per Moment"><span>{lease.leaseAmount}</span></Tooltip>
    },
    {
      key: 'Offer Index',
      value: lease.offerIndex
    },
    {
      key: 'TOS',
      value: <Tooltip title="Show Terms of Service">
        <Button className="tos-button" size="small" variant="outlined" onClick={() => setShowTos(true)}>
          {lease.halfTos}...
        </Button>
      </Tooltip>
    }
  ];

  return (
    <Grid item xs={12} className="pb-2">
      <AccordionsCollapse
        id={lease.nfTokenId}
        summary={<Typography className="text-truncate pl-2" component={'span'}>
          {lease.nfTokenId}</Typography>}
        expanded="true"
        panelClassName="bg-unicorn text-light"
        panelSummaryClassName="text-light"
        panelDetailClassName="text-light overflow-auto"
        headerTooltip="NFToken Id">
        <Grid item xs={12}>
          <RegularTable
            className="bg-transparent rounded-0"
            cellClassName="text-light"
            headings={tableHeadings}
            values={tableValues}
            highlight={['value']}
            hideHeadings />
        </Grid>
      </AccordionsCollapse>
      <ModalDialog open={showTos} scroll="body" onClose={() => setShowTos(false)}>
        <div className="license">{lease.tos}</div>
      </ModalDialog>
    </Grid>
  );
}
