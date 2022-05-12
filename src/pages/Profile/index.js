import React, { Fragment, useEffect } from 'react';

import PageTitle from '../../layout-components/PageTitle';
import RegularTable from '../../components/RegularTable';

import {
  Grid,
  Card,
  CardContent,
  Typography
} from '@material-ui/core';
import Leases from './Leases';

import { useEvernode } from '../../services/evernode';
import Loader from '../../components/Loader';

export default function Profile(props) {
  const address = props.match.params.address;

  const [info, setInfo] = React.useState(null);
  const [configs, setConfigs] = React.useState(null);

  const evernode = useEvernode();

  useEffect(() => {
    const fetchInfo = async () => {
      const hostInfo = await evernode.getHostInfo(address);
      const tableHeadings = {
        key: 'Key',
        value: 'Value'
      }
      const tableValues = [
        {
          key: 'Country Code',
          value: hostInfo.countryCode
        },
        {
          key: 'Instances',
          value: `${hostInfo.noOfActiveInstances} out of ${hostInfo.noOfTotalInstances}`
        },
        {
          key: 'CPU',
          value: `${hostInfo.cpuMicrosec}us`
        },
        {
          key: 'RAM',
          value: `${hostInfo.ramMb}MB`
        },
        {
          key: 'Disk',
          value: `${hostInfo.diskMb}MB`
        },
        {
          key: 'Last Heartbeat Ledger',
          value: hostInfo.lastHeartbeatLedger
        },
        {
          key: 'Reg Ledger',
          value: hostInfo.registrationLedger
        },
        {
          key: 'Reg Fee',
          value: hostInfo.registrationFee
        },
        {
          key: 'Version',
          value: hostInfo.version
        }
      ];
      const evrBalance = await evernode.getEVRBalance(address);
      setInfo({
        evrBalance: evrBalance,
        hostInfo: hostInfo,
        tableHeadings: tableHeadings,
        tableValues: tableValues
      });
    }

    const fetchConfigs = async () => {
      const config = await evernode.getConfigs();
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
        }
        ,
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

    if (!info)
      fetchInfo();

    if (!configs)
      fetchConfigs();
  }, [address, evernode, info, configs]);

  return (
    <Fragment>
      <PageTitle
        titleHeading={address}
        titleDescription={(info && <Typography type="p">{info.hostInfo.nfTokenId}</Typography>) ||
          <Loader className="p-0" size="1rem" />} />
      <Grid container spacing={4} className="profile">
        <Grid item xs={12} sm={12} md={5}>
          <Card style={{ border: "none", boxShadow: "none" }} className="mb-4 bg-transparent">
            <CardContent className="p-0">
              <h5 className="card-title font-weight-bold font-size-md">
                Registration Info
              </h5>
              {(info && <RegularTable
                headings={info.tableHeadings}
                values={info.tableValues}
                highlight={['key']}
                hideHeadings />) ||
                <Loader className="p-4" />}
            </CardContent>
          </Card>
          <Card style={{ border: "none", boxShadow: "none" }} className="mb-4 bg-transparent">
            <CardContent className="p-0">
              <h5 className="card-title font-weight-bold font-size-md">
                Configurations
              </h5>
              {(configs && <RegularTable
                headings={configs.tableHeadings}
                values={configs.tableValues}
                highlight={['key']}
                hideHeadings />) ||
                <Loader className="p-4" />}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={5}>
          <Card style={{ border: "none", boxShadow: "none" }} className="mb-4 bg-transparent">
            <CardContent className="p-0">
              <h5 className="card-title font-weight-bold font-size-md">
                Leases
              </h5>
              <Leases address={address} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <h5 className="card-title font-weight-bold font-size-md">
            Wallet
          </h5>
          <Card className="card-box mb-4 bg-midnight-bloom border-0 text-light">
            {(info && <CardContent className="p-3 text-center wallet-balance">
              <span className="font-weight-bold amount">
                {info.evrBalance}
              </span>
              <span className="font-weight-normal ml-1 evr">
                EVR
              </span>
            </CardContent>) || <Loader className="p-4" />}
          </Card>
        </Grid>
      </Grid>
    </Fragment >
  );
}
