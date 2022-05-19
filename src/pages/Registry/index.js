import React, { Fragment, useEffect } from 'react';

import PageTitle from '../../layout-components/PageTitle';
import RegularTable from '../../components/RegularTable';

import {
  Grid,
  Card,
  CardContent,
  Typography
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
          key: 'EVR Issuer',
          value: config.evrIssuerAddress
        },
        {
          key: 'Foundation',
          value: config.foundationAddress
        },
        {
          key: 'Heartbeat Freq',
          value: config.hostHeartbeatFreq
        },
        {
          key: 'Reg Fee',
          value: config.hostRegFee
        },
        {
          key: 'Lease Acquire Window',
          value: config.leaseAcquireWindow
        },
        {
          key: 'Moment Base Idx',
          value: config.momentBaseIdx
        },
        {
          key: 'Moment Size',
          value: config.momentSize
        },
        {
          key: 'Purchaser Taget Price',
          value: config.purchaserTargetPrice
        }
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
