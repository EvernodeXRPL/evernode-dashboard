import React, { Fragment, useEffect } from 'react';

import PageTitle from '../../layout-components/PageTitle';
import RegularTable from '../../components/RegularTable';

import {
  Grid,
  Card,
  CardContent,
  Typography,
  Tooltip
} from '@material-ui/core';

import { useEvernode } from '../../services/Evernode';
import Loader from '../../components/Loader';

export default function Registry() {
  const evernode = useEvernode();

  const [configs, setConfigs] = React.useState(null);
  const [registryAddress, setRegistryAddress] = React.useState(null);

  useEffect(() => {
    const fetchConfigs = async () => {
      const config = await evernode.getConfigs();
      setRegistryAddress(evernode.getRegistryAddress());
      const tableHeadings = {
        key: 'Key',
        value: 'Value'
      }
      const tableValues = [
        {
          key: 'EVR Issuer XRP Address',
          value: <Tooltip title="EVR Issuer XRP account address."><span>{config.evrIssuerAddress}</span></Tooltip>
        },
        {
          key: 'Foundation XRP Address',
          value: <Tooltip title="Evernode foundation XRP account address."><span>{config.foundationAddress}</span></Tooltip>
        },
        {
          key: 'Heartbeat Frequency',
          value: <Tooltip title="The moment frequency which a host should keep on signaling to the registry contract."><span>{config.hostHeartbeatFreq}</span></Tooltip>
        },
        {
          key: 'Registration Fee',
          value: <Tooltip title="Host registration fee in EVRs."><span>{config.hostRegFee}</span></Tooltip>
        },
        {
          key: 'Lease Acquire Window',
          value: <Tooltip title="The maximum no. of XRP ledgers that an acquire-lease request should wait for instance creation."><span>{config.leaseAcquireWindow}</span></Tooltip>
        },
        {
          key: 'Moment Base Index',
          value: <Tooltip title="XRP ledger index when the 'Moment Size' last changed."><span>{config.momentBaseIdx}</span></Tooltip>
        },
        {
          key: 'Moment Size',
          value: <Tooltip title="No. of XRP ledgers per moment."><span>{config.momentSize}</span></Tooltip>
        },
        // {
        //   key: 'Purchaser Target Price',
        //   value: <Tooltip title="Per moment lease amount that is derived from the condition of the epoch."><span>{config.purchaserTargetPrice}</span></Tooltip>
        // }
      ];
      setConfigs({
        configs: config,
        tableHeadings: tableHeadings,
        tableValues: tableValues
      });
    }

    fetchConfigs();
  }, [evernode]);

  return (
    <Fragment>
      <PageTitle
        titleHeading="Configurations"
        titleDescription={(registryAddress && <Typography type="p">Registry Address: {registryAddress}</Typography>) ||
          <Loader className="p-0" size="1rem" />} />
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Card style={{ border: "none", boxShadow: "none" }} className="mb-4 bg-transparent">
            <CardContent className="p-0">
              {(configs && <RegularTable
                headings={configs.tableHeadings}
                values={configs.tableValues}
                highlight={['key']}
                hideHeadings />) ||
                <Loader className="p-4" />}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Fragment >
  );
}
