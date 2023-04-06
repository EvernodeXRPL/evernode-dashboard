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
} from '@mui/material';

import { useEvernode } from '../../services/Evernode';
import Loader from '../../components/Loader';

export default function Registry() {
  const evernode = useEvernode();

  const [governorConfigs, setGovernorConfigs] = React.useState(null);
  const [governorAddress, setGovernorAddress] = React.useState(null);
  const [rewardConfigs, setRewardConfigs] = React.useState(null);
  const [governanceConfigs, setGovernanceConfigs] = React.useState(null);
  const [hookClient, setHookClient] = React.useState(null);
 
  useEffect(() => {
    const fetchConfigs = async () => {
      const config = await evernode.getConfigs();
      setGovernorAddress(evernode.getGovernorAddress());
      const tableHeadings = {
        key: 'Key',
        value: 'Value'
      }
      let registryConfigTableValues = [
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
          value: <Tooltip title="Index when the 'Moment Size' last changed"><span>{config.momentBaseInfo.baseIdx}</span></Tooltip>
        },
        {
          key: 'Transition Moment',
          value: <Tooltip title="Moment when the 'Moment Size' last changed"><span>{config.momentBaseInfo.baseTransitionMoment}</span></Tooltip>
        },
        {
          key: 'Moment Size',
          value: <Tooltip title={`Moment size in ${config.momentBaseInfo.momentType === 'ledger' ? 'ledgers' : 'seconds'}`}><span>{config.momentSize}</span></Tooltip>
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
      if (config.momentTransitInfo?.transitionIndex) {
        registryConfigTableValues = registryConfigTableValues.concat(
          [{
            key: `Next 'Moment Size' Transition Index`,
            value: <Tooltip title="Index when the 'Moment Size' is going to be changed"><span>{config.momentTransitInfo.transitionIndex}</span></Tooltip>
          },
          {
            key: 'New Moment Size',
            value: <Tooltip title={`New moment size in ${config.momentTransitInfo.momentType === 'ledger' ? 'ledgers' : 'seconds'} after the transition`}><span>{config.momentTransitInfo.momentSize}</span></Tooltip>
          }]);
      }
      setGovernorConfigs({
        configs: config,
        tableHeadings: tableHeadings,
        tableValues: registryConfigTableValues
      });

      const rewardConfigTableValues = [
        {
          key: 'Epoch Count',
          value: <Tooltip title="Total no. of epochs"><span>{config.rewardConfiguration.epochCount}</span></Tooltip>,
          cellConfigs: {
            width: '37%'
          }
        },
        {
          key: 'Epoch Reward Amount',
          value: <Tooltip title="Total amount of EVRs rewarded in one epoch"><span>{config.rewardConfiguration.epochRewardAmount}</span></Tooltip>
        },
        {
          key: 'First Epoch Reward Quota',
          value: <Tooltip title="EVRs rewarded per moment within the first epoch"><span>{config.rewardConfiguration.firstEpochRewardQuota}</span></Tooltip>
        },
        {
          key: 'Reward Start Moment',
          value: <Tooltip title="The moment EVR rewarding starts"><span>{config.rewardConfiguration.rewardStartMoment}</span></Tooltip>
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
          value: <Tooltip title="Current epoch"><span>{config.rewardInfo.epoch}</span></Tooltip>
        },
        {
          key: 'Epoch Pool',
          value: <Tooltip title="Available amount of EVRs in the current epoch's reward pool"><span>{+(+config.rewardInfo.epochPool).toFixed(3)}</span></Tooltip>
        },
        {
          key: `Active Host Count of the Moment ${config.rewardInfo.savedMoment}`,
          value: <Tooltip title={`No. of Active hosts in the moment ${config.rewardInfo.savedMoment}`}><span>{config.rewardInfo.curMomentActiveHostCount}</span></Tooltip>
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

      const hookConfigTableValues = [
        {
          key: 'Governor Hook Address',
          value: <Tooltip title="Hook that handles the governance related operations."><span>{governorAddress}</span></Tooltip>,
          cellConfigs: {
            width: '37%'
          }
        },
        {
          key: 'Heartbeat Hook Address',
          value: <Tooltip title="Hook that monitors the host's aliveness."><span>{config.heartbeatAddress}</span></Tooltip>,
          cellConfigs: {
            width: '37%'
          }
        },
        {
          key: 'Registry Hook Address',
          value: <Tooltip title="Hook that manages host registrations."><span>{config.registryAddress}</span></Tooltip>,
          cellConfigs: {
            width: '37%'
          }
        },
      ];

      setHookClient({
        configs: config,
        tableHeadings: tableHeadings,
        tableValues: hookConfigTableValues
      });

      const governanceConfigTableValues = [
        {
          key: 'Candidate Election Period',
          value: <Tooltip title="Maximum period (number of seconds) that is given for voters to vote for a candidate"><span>{config.governanceConfiguration.candidateElectionPeriod}</span></Tooltip>,
          cellConfigs: {
            width: '37%'
          }
        },
        {
          key: 'Candidate Life Period',
          value: <Tooltip title="Maximum period (number of seconds) a candidate can exist in the system actively"><span>{config.governanceConfiguration.candidateLifePeriod}</span></Tooltip>
        },
        {
          key: 'Candidate Support Average',
          value: <Tooltip title="Minimum consensus percentage to elect a candidate"><span>{config.governanceConfiguration.candidateSupportAverage}</span></Tooltip>
        },
        {
          key: 'Eligibility Period',
          value: <Tooltip title="Minimum registration period (number of seconds) required for a host to attain governance maturity"><span>{config.governanceConfiguration.eligibilityPeriod}</span></Tooltip>
        },
        {
          key: <Typography style={{ fontSize: '1.54rem', fontWeight: 'bold', color: 'black' }}>Governance Info</Typography>,
          value: <Tooltip title="Governance Info"><span>&nbsp;</span></Tooltip>,
          cellConfigs: {
            colspan: 2,
            isSubtopic: true,
            width: '37%',
            paddingTopBottom: '8px'

          }
        },
        {
          key: 'Elected Proposal Unique Id',
          value: <Tooltip title="Most recently elected candidate"><span>{config.governanceInfo.electedProposalUniqueId}</span></Tooltip>
        },
        {
          key: 'Proposal Elected Timestamp',
          value: <Tooltip title="Timestamp when the most recently elected candidate was elected"><span>{config.governanceInfo.proposalElectedTimestamp}</span></Tooltip>
        },
        {
          key: 'Foundation Last Voted Candidate Idx',
          value: <Tooltip title=""><span>{config.governanceInfo.foundationLastVotedCandidateIdx}</span></Tooltip>
        },
        // {
        //   key: 'Foundation Last Voted Timestamp',
        //   value: <Tooltip title="Timestamp when the foundation's last vote was received"><span>{config.governanceInfo.foundationLastVotedTimestamp}</span></Tooltip>
        // },
        {
          key: 'Governance Mode',
          value: <Tooltip title="Current mode of governance"><span>{config.governanceInfo.governanceMode}</span></Tooltip>
        },
        {
          key: 'Last Candidate Idx',
          value: <Tooltip title="Index of the last candidate"><span>{config.governanceInfo.lastCandidateIdx}</span></Tooltip>
        },
        // {
        //   key: 'Support Vote Sent',
        //   value: <Tooltip title=""><span>{config.governanceInfo.supportVoteSent}</span></Tooltip>
        // },
        // {
        //   key: 'Updated Hook Count',
        //   value: <Tooltip title=""><span>{config.governanceInfo.updatedHookCount}</span></Tooltip>
        // },
        {
          key: 'Vote Base Count',
          value: <Tooltip title="Number of hosts that are eligible for voting"><span>{config.governanceInfo.voteBaseCount}</span></Tooltip>
        },
        // {
        //   key: 'Vote Base Count Changed Timestamp',
        //   value: <Tooltip title=""><span>{config.governanceInfo.voteBaseCountChangedTimestamp}</span></Tooltip>
        // },
      ];

      setGovernanceConfigs({
        configs: config,
        tableHeadings: tableHeadings,
        tableValues: governanceConfigTableValues
      });
    }

    fetchConfigs();
  }, [evernode, governorAddress]);

  return (
    <Fragment>
      
      <PageTitle
        className = 'page-title'
        titleHeading="Configurations"
      />
      
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Card style={{ border: "none", boxShadow: "none" }} className="mb-4 bg-transparent">
            <CardContent className="p-0">
              {(hookClient && <RegularTable
                headings={hookClient.tableHeadings}
                values={hookClient.tableValues}
                highlight={['key']}
                hideHeadings />) ||
                <Loader className="p-4" />}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Card style={{ border: "none", boxShadow: "none" }} className="mb-4 bg-transparent">
            <CardContent className="p-0">
              {(governorConfigs && <RegularTable
                headings={governorConfigs.tableHeadings}
                values={governorConfigs.tableValues}
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
            <CardHeader className="pt-3 pb-2" title={<Typography style={{ fontSize: '1.54rem', fontWeight: 'bold' }} >Reward Configurations</Typography>} />
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
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Card style={{ border: "none", boxShadow: "none" }} className="mb-4">
            <CardHeader className="pt-3 pb-2" title={<Typography style={{ fontSize: '1.54rem', fontWeight: 'bold' }} >Governance Configurations</Typography>} />
            <CardContent className="p-0">
              {(governanceConfigs && <RegularTable
                  headings={governanceConfigs.tableHeadings}
                  values={governanceConfigs.tableValues}
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
