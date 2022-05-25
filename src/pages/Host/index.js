import React, { Fragment, useCallback, useEffect } from 'react';
import { useHistory } from "react-router-dom";

import EditIcon from '@material-ui/icons/Edit';

import PageTitle from '../../layout-components/PageTitle';
import RegularTable from '../../components/RegularTable';

import {
  Grid,
  Card,
  CardContent,
  Typography,
  Tooltip
} from '@material-ui/core';
import Leases from '../../business-components/Leases';

import { useEvernode } from '../../services/Evernode';
import Loader from '../../components/Loader';
import { StorageKeys } from '../../common/constants';
import CountryFlag from '../../business-components/CountryFlag';
import EvrBalance from '../../business-components/EvrBalance';
import CPUModel from '../../business-components/CPUModel';
import InstanceSpecs from '../../business-components/InstanceSpecs';

export default function Host(props) {
  const history = useHistory();
  const evernode = useEvernode();

  const selfAddress = localStorage.getItem(StorageKeys.hostAddress);
  const pathAddress = props.match.params.address;

  const [address, setAddress] = React.useState(pathAddress || selfAddress);
  const [info, setInfo] = React.useState(null);

  const changeAddress = useCallback(() => {
    let input;
    while (!/^r[a-zA-Z0-9]{24,34}$/g.test(input)) {
      input = prompt("Please enter host address");
      if (!input) break;
    }

    if (input) {
      localStorage.setItem(StorageKeys.hostAddress, input);
      setAddress(input);
    }
  }, []);

  // If the path address param is empty this is My Host page and no address is set in local storage.
  if (!address)
    changeAddress();

  let redirect;
  if (!address)
    redirect = '/';
  else if (pathAddress === selfAddress)
    redirect = '/host';

  useEffect(() => {
    const fetchInfo = async () => {
      setInfo(null);
      const hostInfo = await evernode.getHostInfo(address);
      const tableHeadings = {
        key: 'Key',
        value: 'Value'
      }
      const tableValues = hostInfo ? [
        {
          key: 'Registration Token Id',
          value: <Tooltip title="Registration NFToken Id"><span>{hostInfo.nfTokenId}</span></Tooltip>
        },
        {
          key: 'Instances',
          value: <Tooltip title="Active instances out of Maximum instances">
            <span>{hostInfo.activeInstances || 0} out of {hostInfo.maxInstances || 0}</span>
          </Tooltip>
        },
        {
          key: 'CPU Model',
          value: <CPUModel modelName={hostInfo.cpuModelName} speed={hostInfo.cpuMHz} count={hostInfo.cpuCount} />
        },
        {
          key: 'Instance Size',
          value: <InstanceSpecs cpu={hostInfo.cpuMicrosec} ram={hostInfo.ramMb} disk={hostInfo.diskMb} instanceCount={hostInfo.maxInstances} />
        },
        {
          key: 'Last Heartbeat XRPL Ledger',
          value: <Tooltip title="XPR Ledger which the last heartbeat is received"><span>{hostInfo.lastHeartbeatLedger}</span></Tooltip>
        },
        {
          key: 'Registered on XRPL Ledger',
          value: <Tooltip title="XPR Ledger which the host is registered"><span>{hostInfo.registrationLedger}</span></Tooltip>
        },
        {
          key: 'Registration Fee',
          value: <Tooltip title="Registration fee spent by the host"><span>{hostInfo.registrationFee}</span></Tooltip>
        },
        {
          key: 'Version',
          value: <Tooltip title="Host's sashimono version"><span>{hostInfo.version}</span></Tooltip>
        }
      ] : [];
      const evrBalance = await evernode.getEVRBalance(address);
      setInfo({
        evrBalance: evrBalance,
        hostInfo: hostInfo,
        tableHeadings: tableHeadings,
        tableValues: tableValues
      });
    }

    if (redirect)
      history.push(redirect);
    else if (address) { }
    fetchInfo();
  }, [evernode, history, address, redirect]);

  return (
    <Fragment>
      <PageTitle
        titleHeading={
          <div className="d-flex align-items-center display-7">
            <span className="mr-2">
              {info?.hostInfo && <CountryFlag countryCode={info.hostInfo.countryCode} size="1.8em" />}
            </span>
            {address}
            {address === selfAddress &&
              <Tooltip title="Change address">
                <EditIcon className="ml-1 edit-btn" onClick={changeAddress} />
              </Tooltip>}
            <span>{info?.hostInfo &&
              <Tooltip title={info.hostInfo.active ? 'Active' : 'Inactive'}>
                <div className={`ml-1 rounded-circle ${info.hostInfo.active ? 'online' : 'offline'}`}></div>
              </Tooltip>}</span>
          </div>
        }
        titleDescription={info ? (info?.hostInfo && <Typography type="p">{info.hostInfo.description}</Typography>) :
          <Loader className="p-0" size="1rem" />}>
        <EvrBalance balance={info?.evrBalance} />
      </PageTitle>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card style={{ border: "none", boxShadow: "none" }} className="mb-4 bg-transparent">
            <CardContent className="p-0">
              <h5 className="card-title font-weight-bold font-size-md">
                Registration Info
              </h5>
              {(info && (info.hostInfo ? <RegularTable
                headings={info.tableHeadings}
                values={info.tableValues}
                highlight={['key']}
                hideHeadings /> : <span>Host is not Registered!</span>)) ||
                <Loader className="p-4" />}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card style={{ border: "none", boxShadow: "none" }} className="mb-4 bg-transparent">
            <CardContent className="p-0">
              <h5 className="card-title font-weight-bold font-size-md">
                Available Leases
              </h5>
              {address && <Leases address={address} />}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Fragment >
  );
}
