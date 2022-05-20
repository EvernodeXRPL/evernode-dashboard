import { Button, Grid, Tooltip, Typography } from '@material-ui/core';
import React, { useCallback } from 'react';

import AccordionsCollapse from '../../../components/AccordionsCollapse';
import RegularTable from '../../../components/RegularTable';
import ModalDialog from '../../../components/ModalDialog';

export default function Lease(props) {
  const { lease } = props;

  const [showTos, setShowTos] = React.useState(false);

  const handleTosClose = useCallback(() => {
    setShowTos(false);
  }, []);

  const handleTosShow = useCallback(() => {
    setShowTos(true);
  }, []);

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
        <Grid xs={12}>
          <RegularTable
            className="bg-transparent rounded-0"
            cellClassName="text-light"
            headings={tableHeadings}
            values={tableValues}
            highlight={['value']}
            hideHeadings />
          <div className="text-center">
            <Button
              className="mt-1 mb-1 p-1"
              variant="outlined"
              color="primary"
              onClick={handleTosShow}>
              Show TOS
            </Button>
          </div>
        </Grid>
      </AccordionsCollapse>
      <ModalDialog open={showTos} scroll="body" onClose={handleTosClose}>
        {lease.tos}
      </ModalDialog>
    </Grid>
  );
}
