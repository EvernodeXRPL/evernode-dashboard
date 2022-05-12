import React, { lazy, Suspense } from 'react';
import { Switch, Route, Redirect, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

import { ThemeProvider } from '@material-ui/styles';

import MuiTheme from './theme';
import LeftSidebar from './layout-blueprints/LeftSidebar';

import { EvernodeProvider } from './services/evernode';
import Loader from './components/Loader';

const Hosts = lazy(() => import('./pages/Hosts'));
const Profile = lazy(() => import('./pages/Profile'));

const Routes = () => {
  const location = useLocation();

  const pageVariants = {
    initial: {
      opacity: 0,
      scale: 0.99
    },
    in: {
      opacity: 1,
      scale: 1
    },
    out: {
      opacity: 0,
      scale: 1.01
    }
  };

  const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.4
  };

  return (
    <ThemeProvider theme={MuiTheme}>
      <EvernodeProvider>
        <AnimatePresence>
          <Suspense
            fallback={
              <div className="d-flex align-items-center vh-100 justify-content-center text-center font-weight-bold font-size-lg py-3">
                <div className="w-50 mx-auto">
                  <Loader size="5rem" />
                </div>
              </div>
            }>
            <Switch>
              <Redirect exact from="/" to="/hosts" />
              <Route
                path={[
                  '/profile/:address?',
                  '/hosts'
                ]}>
                <LeftSidebar>
                  <Switch location={location} key={location.pathname}>
                    <motion.div
                      initial="initial"
                      animate="in"
                      exit="out"
                      variants={pageVariants}
                      transition={pageTransition}>
                      <Route
                        path="/hosts"
                        component={Hosts}
                      />
                      <Route
                        path="/profile/:address?"
                        component={Profile}
                      />
                    </motion.div>
                  </Switch>
                </LeftSidebar>
              </Route>
              <Redirect exact from="*" to="/" />
            </Switch>
          </Suspense>
        </AnimatePresence>
      </EvernodeProvider>
    </ThemeProvider>
  );
};

export default Routes;
