import React, { Fragment } from 'react';

import clsx from 'clsx';

import PerfectScrollbar from 'react-perfect-scrollbar';
import { Hidden, Drawer, Paper } from '@material-ui/core';

import { connect } from 'react-redux';

import SidebarHeader from '../../layout-components/SidebarHeader';
import SidebarMenu from '../../layout-components/SidebarMenu';

import navItems from './navItems';

import { setSidebarToggleMobile } from '../../reducers/ThemeOptions';
import { useEvernode } from '../../services/Evernode';

const Sidebar = props => {
  const {
    setSidebarToggleMobile,
    sidebarToggleMobile,
    sidebarFixed,
    sidebarShadow
  } = props;
  const evernode = useEvernode();
  const closeDrawer = () => setSidebarToggleMobile(!sidebarToggleMobile);
  let filteredNavItems = navItems;

  if (evernode.getEnvironment() === "mainnet") {
    filteredNavItems = navItems.map((item) => {
      if (item.content) {
        item.content = item.content.filter(subItem => subItem.to !== "/testnet-faucet");
      }
      return item;
    });
  }

  const sidebarMenuContent = (
    <div>
      {filteredNavItems.map((list, i) => (
        <SidebarMenu
          component="div"
          key={list.label || i}
          pages={list.content}
          title={list.label}
        />
      ))}
    </div>
  );

  return (
    <Fragment>
      <Hidden lgUp>
        <Drawer
          anchor="left"
          open={sidebarToggleMobile}
          onClose={closeDrawer}
          variant="temporary"
          elevation={4}
          className="app-sidebar-wrapper-lg">
          <SidebarHeader />
          <PerfectScrollbar>{sidebarMenuContent}</PerfectScrollbar>
        </Drawer>
      </Hidden>

      <Hidden mdDown>
        <Paper
          className={clsx('app-sidebar-wrapper', {
            'app-sidebar-wrapper-fixed': sidebarFixed
          })}
          square
          elevation={sidebarShadow ? 11 : 3}>
          <SidebarHeader />
          <div
            className={clsx({
              'app-sidebar-menu': sidebarFixed
            })}>
            <PerfectScrollbar options={{ wheelPropagation: false }}>
              {sidebarMenuContent}
            </PerfectScrollbar>
          </div>
        </Paper>
      </Hidden>
    </Fragment>
  );
};

const mapStateToProps = state => ({
  sidebarFixed: state.ThemeOptions.sidebarFixed,
  headerFixed: state.ThemeOptions.headerFixed,
  sidebarToggleMobile: state.ThemeOptions.sidebarToggleMobile
});

const mapDispatchToProps = dispatch => ({
  setSidebarToggleMobile: enable => dispatch(setSidebarToggleMobile(enable))
});

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
