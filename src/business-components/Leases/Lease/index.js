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
      key: 'TOS',
      value: <Tooltip title="Show Terms of Service">
        <Button className="tos-button" size="small" variant="outlined" onClick={() => setShowTos(true)}>
          {lease.halfTos}...
        </Button>
      </Tooltip>
    }
  ];

  if (lease.outboundIP)
    tableValues.push({
      key: 'Outbound IP',
      value: <Tooltip title="IP address for the instance's outbound connections"><span>{lease.outboundIP.address}</span></Tooltip>
    });

  return (
    <Grid item xs={12} className="pb-2">
      <AccordionsCollapse
        id={lease.uriTokenId}
        summary={<Typography className="text-truncate pl-2" component={'span'}>
          {lease.uriTokenId}</Typography>}
        expanded="true"
        panelClassName="bg-unicorn text-light"
        panelSummaryClassName="text-light"
        panelDetailClassName="text-light overflow-auto"
        headerTooltip="URI Token Id">
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
        <div className="license">
          <object data={lease.tos} type="application/pdf"
            aria-label="EVERNODE HOSTING PRINCIPLES"
            style={{ width: '500px', height: '700px', display: 'block' }}
            ></object>
        </div>
      </ModalDialog>
    </Grid>
  );
}
