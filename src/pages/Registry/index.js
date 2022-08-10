import React, { Fragment, useEffect } from 'react';

import PageTitle from '../../layout-components/PageTitle';
import RegularTable from '../../components/RegularTable';

import {
  Grid,
  Card,
  CardContent,
  Typography,
  Tooltip,
  CardHeader
} from '@material-ui/core';

import { useEvernode } from '../../services/Evernode';
import Loader from '../../components/Loader';

export default function Registry() {
  const evernode = useEvernode();

  const [registryConfigs, setRegistryConfigs] = React.useState(null);
  const [registryAddress, setRegistryAddress] = React.useState(null);
  const [rewardConfigs, setRewardConfigs] = React.useState(null);


  useEffect(() => {
    const fetchConfigs = async () => {
      const config = await evernode.getConfigs();
      setRegistryAddress(evernode.getRegistryAddress());
      const tableHeadings = {
        key: 'Key',
        value: 'Value'
      }
      const registryConfigTableValues = [
        {
          key: 'EVR Issuer XRP Address',
          value: <Tooltip title="EVR Issuer XRP account address"><span>{config.evrIssuerAddress}</span></Tooltip>,
          cellConfigs: {
            width: '37%'
          }
        },
        {
          key: 'Foundation XRP Address',
          value: <Tooltip title="Evernode foundation XRP account address"><span>{config.foundationAddress}</span></Tooltip>
        },
        {
          key: 'Heartbeat Frequency',
          value: <Tooltip title="The window (in no. of Moments) that the host should indicate liveness"><span>{config.hostHeartbeatFreq}</span></Tooltip>
        },
        {
          key: 'Registration Fee',
          value: <Tooltip title="Host registration fee in EVRs"><span>{config.hostRegFee}</span></Tooltip>
        },
        {
          key: 'Lease Acquire Window',
          value: <Tooltip title="The maximum no. of XRP ledgers that an acquire-lease request should wait for instance creation"><span>{config.leaseAcquireWindow}</span></Tooltip>
        },
        {
          key: 'Moment Base Index',
          value: <Tooltip title="XRP ledger index when the 'Moment Size' last changed"><span>{config.momentBaseIdx}</span></Tooltip>
        },
        {
          key: 'Moment Size',
          value: <Tooltip title="No. of XRP ledgers per moment"><span>{config.momentSize}</span></Tooltip>
        },
        {
          key: 'Host Count',
          value: <Tooltip title="Total number of registered hosts"><span>{config.hostCount}</span></Tooltip>
        },
        // {
        //   key: 'Purchaser Target Price',
        //   value: <Tooltip title="Per moment lease amount that is derived from the condition of the epoch"><span>{config.purchaserTargetPrice}</span></Tooltip>
        // }
      ];
      setRegistryConfigs({
        configs: config,
        tableHeadings: tableHeadings,
        tableValues: registryConfigTableValues
      });

      const rewardConfigTableValues = [
        {
          key: 'Epoch Count',
          value: <Tooltip title="Total no. of epochs"><span>{config.rewardConfiguaration.epochCount}</span></Tooltip>,
          cellConfigs: {
            width: '37%'
          }
        },
        {
          key: 'Epoch Reward Amount',
          value: <Tooltip title="Total amount of EVRs rewarded in one epoch"><span>{config.rewardConfiguaration.epochRewardAmount}</span></Tooltip>
        },
        {
          key: 'First Epoch Reward Quota',
          value: <Tooltip title="EVRs rewarded per moment within the first epoch"><span>{config.rewardConfiguaration.firstEpochRewardQuota}</span></Tooltip>
        },
        {
          key: 'Reward Start Moment',
          value: <Tooltip title="The moment EVR rewarding starts"><span>{config.rewardConfiguaration.rewardStartMoment}</span></Tooltip>
        },
        {
          key: <Typography style={{ fontSize: '1.54rem', fontWeight: 'bold', color: 'black' }}>Reward Info</Typography>,
          value: <Tooltip title=""><span>&nbsp;</span></Tooltip>,
          cellConfigs: {
            colspan: 2,
            isSubtopic: true,
            width: '37%',
            paddingTopBottom: '8px'

          }
        },
        {
          key: 'Current Epoch',
          value: <Tooltip title="Current on-going epoch"><span>{config.rewardInfo.epoch}</span></Tooltip>
        },
        {
          key: 'Epoch Pool',
          value: <Tooltip title="Available amount of EVRs in the current epoch's reward pool"><span>{+(+config.rewardInfo.epochPool).toFixed(3)}</span></Tooltip>
        },
        {
          key: `Active Host Count of the Moment ${config.rewardInfo.savedMoment}`,
          value: <Tooltip title={`No. of Active hosts in the current moment ${config.rewardInfo.savedMoment}`}><span>{config.rewardInfo.curMomentActiveHostCount}</span></Tooltip>
        },
        {
          key: `Active Host Count of the Moment ${config.rewardInfo.savedMoment - 1}`,
          value: <Tooltip title={`No. of Active hosts in the moment ${config.rewardInfo.savedMoment - 1}`}><span>{config.rewardInfo.prevMomentActiveHostCount}</span></Tooltip>
        }
      ];
      setRewardConfigs({
        configs: config,
        tableHeadings: tableHeadings,
        tableValues: rewardConfigTableValues
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
              {(registryConfigs && <RegularTable
                headings={registryConfigs.tableHeadings}
                values={registryConfigs.tableValues}
                highlight={['key']}
                hideHeadings />) ||
                <Loader className="p-4" />}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Card style={{ border: "none", boxShadow: "none" }} className="mb-4">
            <CardHeader className="reward-card-header pt-3 pb-2" title={<Typography style={{ fontSize: '1.54rem', fontWeight: 'bold' }} >Reward Configurations</Typography>} />
            <CardContent className="p-0">
              {(rewardConfigs && <RegularTable
                headings={rewardConfigs.tableHeadings}
                values={rewardConfigs.tableValues}
                highlight={['key']}
                hideHeadings />) ||
                <Loader className="p-4" />}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Fragment>
  );
}
