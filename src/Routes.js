import React, { lazy, Suspense } from 'react';
import { Switch, Route, Redirect, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

// import { ThemeProvider } from '@mui/styles';

import MuiTheme from './theme';
import LeftSidebar from './layout-blueprints/LeftSidebar';

import { EvernodeProvider } from './services/Evernode';
import LoaderScreen from './pages/LoaderScreen';
import {ThemeProvider} from "@mui/material";

const Hosts = lazy(() => import('./pages/Hosts'));
const Host = lazy(() => import('./pages/Host'));
const Registry = lazy(() => import('./pages/Registry'));
const TestnetFaucet = lazy(() => import('./pages/TestnetFaucet'));

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
            fallback={<LoaderScreen />}>
            <Switch>
              <Redirect exact from="/" to="/hosts" />
              <Route
                path={[
                  '/hosts',
                  '/host/:address?',
                  '/registry',
                  '/testnet-faucet'
                ]}>
                <LeftSidebar>
                  <Switch location={location} key={location.pathname}>
                    <Route path="/hosts">
                      <motion.div
                        initial="initial"
                        animate="in"
                        exit="out"
                        variants={pageVariants}
                        transition={pageTransition}
                      >
                        <Hosts/>
                      </motion.div>
                    </Route>
                    <Route 
                      path="/host/:address?"
                      render={(routeProps) => (
                        <motion.div
                          initial="initial"
                          animate="in"
                          exit="out"
                          variants={pageVariants}
                          transition={pageTransition}
                        >
                          <Host address={routeProps.match.params.address} />
                        </motion.div>
                      )}
                    />
                    <Route path="/registry">
                      <motion.div
                        initial="initial"
                        animate="in"
                        exit="out"
                        variants={pageVariants}
                        transition={pageTransition}
                      >
                        <Registry/>
                      </motion.div>
                    </Route>
                    <Route path="/testnet-faucet">
                      <motion.div
                        initial="initial"
                        animate="in"
                        exit="out"
                        variants={pageVariants}
                        transition={pageTransition}
                      >
                        <TestnetFaucet/>
                      </motion.div>
                    </Route>
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
