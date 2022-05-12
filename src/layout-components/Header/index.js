import React, { Fragment, useEffect } from 'react';

import clsx from 'clsx';

import {
  IconButton,
  AppBar,
  Box,
  Tooltip,
  ListItem,
  List,
  ListItemText,
  ListItemIcon,
  Typography,
} from '@material-ui/core';

import ListIcon from '@material-ui/icons/List';
import LinearScaleIcon from '@material-ui/icons/LinearScale';

import { connect } from 'react-redux';

import { setSidebarToggleMobile } from '../../reducers/ThemeOptions';

import HeaderLogo from '../../layout-components/HeaderLogo';

import MenuOpenRoundedIcon from '@material-ui/icons/MenuOpenRounded';
import MenuRoundedIcon from '@material-ui/icons/MenuRounded';
import { useEvernode } from '../../services/evernode';

const Header = props => {
  const [ledger, setLedger] = React.useState(null);

  const evernode = useEvernode();

  useEffect(() => {
    const listen = async () => {
      await evernode.onLedger((e) => {
        setLedger(e);
      })
    }

    if (!ledger)
      listen();
  }, [evernode, ledger]);

  const toggleSidebarMobile = () => {
    setSidebarToggleMobile(!sidebarToggleMobile);
  };
  const {
    headerShadow,
    headerFixed,
    sidebarToggleMobile,
    setSidebarToggleMobile
  } = props;

  return (
    <Fragment>
      <AppBar
        color="secondary"
        className={clsx('app-header', {})}
        position={headerFixed ? 'fixed' : 'absolute'}
        elevation={headerShadow ? 11 : 3}>
        {!props.isCollapsedLayout && <HeaderLogo />}
        <Box className="app-header-toolbar">
          <Box className="d-flex align-items-center">
            <Box className="toggle-sidebar-btn-mobile">
              <Tooltip title="Toggle Sidebar" placement="right">
                <IconButton
                  color="inherit"
                  onClick={toggleSidebarMobile}
                  size="medium">
                  {sidebarToggleMobile ? (
                    <MenuOpenRoundedIcon />
                  ) : (
                    <MenuRoundedIcon />
                  )}
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Box>
        {ledger &&
          <Box border={1} borderRadius="borderRadius" className="m-2 pr-1 pl-1">
            <List disablePadding>
              <ListItem className="p-0 m-0">
                <ListItemIcon style={{ minWidth: "0" }} className="mr-2">
                  <ListIcon className="text-white" fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  disableTypography
                  primary={<Typography type="body2" style={{ fontSize: "0.8rem" }}>{ledger.ledgerIndex}</Typography>}
                />
              </ListItem>
              <ListItem className="p-0 m-0">
                <ListItemIcon style={{ minWidth: "0" }} className="mr-2">
                  <LinearScaleIcon className="text-white" fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  disableTypography
                  primary={<Typography type="body2" style={{ fontSize: "0.8rem" }}>{ledger.moment}</Typography>}
                />
              </ListItem>
            </List>
          </Box>}
      </AppBar>
    </Fragment>
  );
};

const mapStateToProps = state => ({
  headerShadow: state.ThemeOptions.headerShadow,
  headerFixed: state.ThemeOptions.headerFixed,
  sidebarToggleMobile: state.ThemeOptions.sidebarToggleMobile
});

const mapDispatchToProps = dispatch => ({
  setSidebarToggleMobile: enable => dispatch(setSidebarToggleMobile(enable))
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
