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
import Leases from './Leases';

import { useEvernode } from '../../services/Evernode';
import Loader from '../../components/Loader';
import { StorageKeys } from '../../common/constants';
import ReactCountryFlag from 'react-country-flag';

function round(n) {
  return Math.round(n * 100) / 100;
}

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
      const tableValues = [
        {
          key: 'Registration Token Id',
          value: hostInfo.nfTokenId
        },
        {
          key: 'Instances',
          value: `${hostInfo.activeInstances} out of ${hostInfo.maxInstances}`
        },
        {
          key: 'Specifications',
          value: `${round(hostInfo.cpuMicrosec / 10000)}% CPU, 
          ${round(hostInfo.ramMb / 1000)}GB RAM, 
          ${round(hostInfo.diskMb / 1000)}GB Disk`
        },
        {
          key: 'CPU Model',
          value: `${hostInfo.cpuModelName}, ${hostInfo.cpuCount}, ${hostInfo.cpuMHz}`
        },
        {
          key: 'Instance Size',
          value: `${round(hostInfo.cpuMicrosec / 10000 / hostInfo.maxInstances)}% CPU, 
          ${round(hostInfo.ramMb / 1000 / hostInfo.maxInstances)}GB RAM, 
          ${round(hostInfo.diskMb / 1000 / hostInfo.maxInstances)}GB Disk`
        },
        {
          key: 'Last Heartbeat Ledger',
          value: hostInfo.lastHeartbeatLedger
        },
        {
          key: 'Registered on XRPL Ledger',
          value: hostInfo.registrationLedger
        },
        {
          key: 'Registration Fee',
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

    if (redirect)
      history.push(redirect);
    else if (address) { }
    fetchInfo();
  }, [evernode, history, address, redirect]);

  return (
    <Fragment>
      <PageTitle
        titleHeading={
          <Typography component={'span'} className="d-inline-flex">
            <span className="mr-2">
              {info && <Tooltip title={info.hostInfo.countryCode}>
                <span>
                  <ReactCountryFlag
                    countryCode={info.hostInfo.countryCode}
                    style={{
                      fontSize: '1.8em',
                      cursor: 'pointer'
                    }}
                    aria-label={info.hostInfo.countryCode} /></span>
              </Tooltip>}
            </span>
            {address}
            {address === selfAddress &&
              <Tooltip title="Change address">
                <EditIcon className="mt-auto mb-auto edit-btn" onClick={changeAddress} />
              </Tooltip>}
            {<div className="ml-1 mt-auto mb-auto">
              {(info &&
                <div className={`rounded-circle ${info.hostInfo.active ? 'online' : 'offline'}`}></div>)
                || <Loader className="p-0" size="0.8rem" />}
            </div>}
          </Typography>
        }
        titleDescription={(info && <Typography type="p">{info.hostInfo.description}</Typography>) ||
          <Loader className="p-0" size="1rem" />}>
        <Card className="mt-1 bg-unicorn border-0 text-light">
          {(info && <CardContent className="pt-1 pb-1 text-center wallet-balance">
            <span className="font-weight-bold amount">
              {info.evrBalance}
            </span>
            <span className="font-weight-normal ml-1 evr">
              EVR
            </span>
          </CardContent>) || <Loader className="mt-1 p-2" size="1.5rem" />}
        </Card>
      </PageTitle>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
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
