import React, { Fragment, useCallback, useEffect } from 'react';
import { useHistory } from "react-router-dom";

import EditIcon from '@mui/icons-material/Edit';

import PageTitle from '../../layout-components/PageTitle';
import RegularTable from '../../components/RegularTable';

import {
  Grid,
  Card,
  CardContent,
  Typography,
  Tooltip,
  TextField,
  Button,
  Hidden
} from '@mui/material';
import { makeStyles } from "@mui/styles";
import Leases from '../../business-components/Leases';

import { useEvernode } from '../../services/Evernode';
import Loader from '../../components/Loader';
import { StorageKeys } from '../../common/constants';
import CountryFlag from '../../business-components/CountryFlag';
import EvrBalance from '../../business-components/EvrBalance';
import CPUModel from '../../business-components/CPUModel';
import InstanceSpecs from '../../business-components/InstanceSpecs';
import ModalDialog from '../../components/ModalDialog';

const useStyles = makeStyles({
  root: {
    // input label when focused
    "& label.Mui-focused": {
      color: 'rgba(0,0,0,0.54)'
    },
    "& label.Mui-error": {
      color: 'red'
    },
    // focused color for input with variant='standard'
    "& .MuiInput-underline:after": {
      borderBottomColor: 'rgba(0,0,0,0.87)'
    },
    "& .MuiInput-underline.Mui-error:after": {
      borderBottomColor: '#f83245'
    },
    "& label.MuiInputLabel-shrink": {
      transform: 'translate(0, 1.5px) scale(0.95)',
      transformOrigin: 'top left'
    }
  }
});

export default function Host(props) {
  const classes = useStyles();
  const history = useHistory();
  const evernode = useEvernode();

  const selfAddress = localStorage.getItem(StorageKeys.hostAddress);
  const pathAddress = props.match.params.address;

  const [address, setAddress] = React.useState(pathAddress || selfAddress);
  const [inputAddress, setInputAddress] = React.useState(null);
  const [info, setInfo] = React.useState(null);
  const [showChangeAddress, setShowChangeAddress] = React.useState(false);

  const inputAddressValid = useCallback(() => {
    return /^r[a-zA-Z0-9]{24,34}$/g.test(inputAddress);
  }, [inputAddress])

  const handleChangeAddress = useCallback(() => {
    if (inputAddress && inputAddressValid()) {
      localStorage.setItem(StorageKeys.hostAddress, inputAddress);
      setAddress(inputAddress);
      setInputAddress(null);
      setShowChangeAddress(false);
    }
  }, [inputAddress, inputAddressValid]);

  const handleChangeAddressClose = useCallback(() => {
    setShowChangeAddress(false);
    setInputAddress(null);
    // If the address change modal is closed without changing the address,
    // Redirect to the home page.
    if (!address)
      history.push('/')
  }, [address, history]);

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
          value: <CPUModel modelName={hostInfo.cpuModelName} speed={hostInfo.cpuMHz} count={hostInfo.cpuCount} showTooltip />
        },
        {
          key: 'Instance Size',
          value: <InstanceSpecs cpu={hostInfo.cpuMicrosec} ram={hostInfo.ramMb} disk={hostInfo.diskMb} instanceCount={hostInfo.maxInstances} showTooltip />
        },
        {
          key: 'Last Heartbeat XRP Ledger',
          value: <Tooltip title="XRP Ledger at which the last heartbeat was received"><span>{hostInfo.lastHeartbeatLedger}</span></Tooltip>
        },
        {
          key: 'Registered on XRP Ledger',
          value: <Tooltip title="XRP Ledger at which the host registered"><span>{hostInfo.registrationLedger}</span></Tooltip>
        },
        {
          key: 'Registration Fee',
          value: <Tooltip title="Registration fee (in EVRs) spent by the host"><span>{hostInfo.registrationFee}</span></Tooltip>
        },
        {
          key: 'Version',
          value: <Tooltip title="Host's Sashimono version"><span>{hostInfo.version}</span></Tooltip>
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

    // If the path address param is empty this is My Host page and no address is set in local storage.
    if (!address)
      setShowChangeAddress(true);
    else if (pathAddress === selfAddress)
      history.push('/host');
    else
      fetchInfo();
  }, [evernode, history, address, pathAddress, selfAddress]);

  return (
    <>{address &&
      <Fragment>
        <PageTitle
          responsive={true}
          titleHeading={
            <div className="d-flex align-items-center display-7">
              <Hidden mdDown>
                <span className="mr-2">
                  {info?.hostInfo && <CountryFlag countryCode={info.hostInfo.countryCode} size="1.8em" />}
                </span>
              </Hidden>
              {address}
              {address === selfAddress &&
                <Tooltip title="Change address">
                  <EditIcon className="ml-1 edit-btn" onClick={() => setShowChangeAddress(true)} />
                </Tooltip>}
              <span>{info?.hostInfo &&
                <Tooltip title={info.hostInfo.active ? 'Active' : 'Inactive'}>
                  <div className={`ml-1 rounded-circle ${info.hostInfo.active ? 'online' : 'offline'}`}></div>
                </Tooltip>}</span>
            </div>
          }
          titleDescription={info ? (info?.hostInfo && <Typography type="p">{info.hostInfo.description}</Typography>) :
            <Loader className="p-0" size="1rem" />}>
          <Hidden mdUp>
            <span>
              {info?.hostInfo && <CountryFlag countryCode={info.hostInfo.countryCode} size="2.5em" />}
            </span>
          </Hidden>
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
      </Fragment >}
      {address === selfAddress && <ModalDialog open={showChangeAddress} scroll="body" onClose={handleChangeAddressClose}>
        <div>
          <TextField autoFocus error={!!inputAddress && !inputAddressValid()} classes={classes} className="address-input" variant="standard" label="Enter the host XRP address" multiline value={inputAddress || ''} onChange={(e) => setInputAddress(e.target.value)} />
        </div>
        <div>
          <Button onClick={handleChangeAddress} variant="outlined" disabled={!inputAddress || !inputAddressValid()} className="pull-right mt-3">OK</Button>
        </div>
      </ModalDialog>}</>
  );
}
