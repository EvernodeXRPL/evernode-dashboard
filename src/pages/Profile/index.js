import React, { Fragment, useEffect } from 'react';
import PageTitle from '../../layout-components/PageTitle';

import PublicIcon from '@material-ui/icons/Public';
import PermIdentityIcon from '@material-ui/icons/PermIdentity';
import StorageIcon from '@material-ui/icons/Storage';
import SettingsIcon from '@material-ui/icons/Settings';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import HowToRegIcon from '@material-ui/icons/HowToReg';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import HistoryIcon from '@material-ui/icons/History';

import {
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText
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
    const fetchHostInfo = async () => {
      const hostInfo = await evernode.getHostInfo(address);
      const evrBalance = await evernode.getEVRBalance(address);
      setInfo({ evrBalance: evrBalance, ...hostInfo });
    }

    const fetchConfigs = async () => {
      const config = await evernode.getConfigs();
      setConfigs(config);
    }

    if (!info)
      fetchHostInfo();

    if (!configs)
      fetchConfigs();
  }, [address, evernode, info, configs]);

  return (
    <Fragment>
      <PageTitle
        titleHeading="Profile"
        titleDescription={address}
      />
      <Grid container spacing={4} className="profile">
        <Grid item xs={12} sm={12} md={5}>
          <Card className="card-box mb-4 bg-neutral-info text-dark">
            <CardContent className="p-3">
              <h5 className="card-title font-weight-bold font-size-lg">
                Registration Info
              </h5>
              {(info && <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                <ListItem>
                  <ListItemAvatar><Avatar><PermIdentityIcon /></Avatar></ListItemAvatar>
                  <ListItemText primary={info.nfTokenId} />
                </ListItem>
                <ListItem>
                  <ListItemAvatar><Avatar><PublicIcon /></Avatar></ListItemAvatar>
                  <ListItemText primary={info.countryCode} />
                </ListItem>
                <ListItem>
                  <ListItemAvatar><Avatar><StorageIcon /></Avatar></ListItemAvatar>
                  <ListItemText primary={info.noOfActiveInstances + " out of " + info.noOfTotalInstances} />
                </ListItem>
                <ListItem>
                  <ListItemAvatar><Avatar><SettingsIcon /></Avatar></ListItemAvatar>
                  <ListItemText primary={info.cpuMicrosec + "us " + info.ramMb + "MB " + info.diskMb + "MB"} />
                </ListItem>
                <ListItem>
                  <ListItemAvatar><Avatar><FavoriteBorderIcon /></Avatar></ListItemAvatar>
                  <ListItemText primary={info.lastHeartbeatLedger} />
                </ListItem>
                <ListItem>
                  <ListItemAvatar><Avatar><HowToRegIcon /></Avatar></ListItemAvatar>
                  <ListItemText primary={info.registrationLedger} />
                </ListItem>
                <ListItem>
                  <ListItemAvatar><Avatar><AttachMoneyIcon /></Avatar></ListItemAvatar>
                  <ListItemText primary={info.registrationFee} />
                </ListItem>
                <ListItem>
                  <ListItemAvatar><Avatar><HistoryIcon /></Avatar></ListItemAvatar>
                  <ListItemText primary={info.version} />
                </ListItem>
              </List>) || <Loader />}
            </CardContent>
          </Card>
          <Card className="card-box mb-4 bg-neutral-info text-dark">
            <CardContent className="p-3">
              <h5 className="card-title font-weight-bold font-size-lg">
                Configurations
              </h5>
              {(configs && <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                <ListItem>
                  <ListItemAvatar><Avatar><PermIdentityIcon /></Avatar></ListItemAvatar>
                  <ListItemText primary={configs.evrIssuerAddress} />
                </ListItem>
                <ListItem>
                  <ListItemAvatar><Avatar><PermIdentityIcon /></Avatar></ListItemAvatar>
                  <ListItemText primary={configs.foundationAddress} />
                </ListItem>
                <ListItem>
                  <ListItemAvatar><Avatar><PermIdentityIcon /></Avatar></ListItemAvatar>
                  <ListItemText primary={configs.hostHeartbeatFreq} />
                </ListItem>
                <ListItem>
                  <ListItemAvatar><Avatar><PermIdentityIcon /></Avatar></ListItemAvatar>
                  <ListItemText primary={configs.hostRegFee} />
                </ListItem>
                <ListItem>
                  <ListItemAvatar><Avatar><PermIdentityIcon /></Avatar></ListItemAvatar>
                  <ListItemText primary={configs.leaseAcquireWindow} />
                </ListItem>
                <ListItem>
                  <ListItemAvatar><Avatar><PermIdentityIcon /></Avatar></ListItemAvatar>
                  <ListItemText primary={configs.momentBaseIdx} />
                </ListItem>
                <ListItem>
                  <ListItemAvatar><Avatar><PermIdentityIcon /></Avatar></ListItemAvatar>
                  <ListItemText primary={configs.momentSize} />
                </ListItem>
                <ListItem>
                  <ListItemAvatar><Avatar><PermIdentityIcon /></Avatar></ListItemAvatar>
                  <ListItemText primary={configs.purchaserTargetPrice} />
                </ListItem>
              </List>) || <Loader />}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={5}>
          <Leases address={address} />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Card className="card-box mb-4 bg-premium-dark border-0 text-light">
            {(info && <CardContent className="p-3 text-center wallet-balance">
              <span className="font-weight-bold amount">
                {info.evrBalance}
              </span>
              <span className="font-weight-normal ml-1 evr">
                EVR
              </span>
            </CardContent>) || <Loader />}
          </Card>
        </Grid>
      </Grid>
    </Fragment>
  );
}
