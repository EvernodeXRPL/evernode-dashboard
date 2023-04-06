import React, { Fragment } from 'react';

import clsx from 'clsx';
import { Link } from 'react-router-dom';

import { IconButton, Box, Tooltip } from '@mui/material';

import { connect } from 'react-redux';

import projectLogo from '../../assets/images/logo-white.png';

import { setSidebarToggleMobile } from '../../reducers/ThemeOptions';

import MenuOpenRoundedIcon from '@mui/icons-material/MenuOpenRounded';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';

const SidebarHeader = props => {
  const toggleSidebarMobile = () => {
    setSidebarToggleMobile(!sidebarToggleMobile);
  };

  const { sidebarToggleMobile, setSidebarToggleMobile } = props;

  return (
    <Fragment>
      <div className={clsx('app-sidebar-header', {})}>
        <Box
          className="header-logo-wrapper"
          title="Evernod Host Dashboard">
          <Link to="/" className="header-logo-wrapper-link">
            <IconButton
              size="medium">
              <img
                className="app-sidebar-logo"
                alt="Evernode Host Dashboard"
                src={projectLogo}
              />
            </IconButton>
          </Link>
        </Box>
        <Box className="app-sidebar-header-btn-mobile">
          <Tooltip title="Toggle Sidebar" placement="right">
            <IconButton
              color="primary"
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
      </div>
    </Fragment>
  );
};
const mapStateToProps = state => ({
  sidebarToggleMobile: state.ThemeOptions.sidebarToggleMobile
});

const mapDispatchToProps = dispatch => ({
  setSidebarToggleMobile: enable => dispatch(setSidebarToggleMobile(enable))
});

export default connect(mapStateToProps, mapDispatchToProps)(SidebarHeader);
