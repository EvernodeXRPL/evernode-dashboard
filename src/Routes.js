import React, { lazy, Suspense } from 'react';
import { Switch, Route, Redirect, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

import { ThemeProvider } from '@mui/styles';

import MuiTheme from './theme';
import LeftSidebar from './layout-blueprints/LeftSidebar';

import { EvernodeProvider } from './services/Evernode';
import LoaderScreen from './pages/LoaderScreen';

const Hosts = lazy(() => import('./pages/Hosts'));
const Host = lazy(() => import('./pages/Host'));
const Registry = lazy(() => import('./pages/Registry'));

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
                  '/registry'
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
                        path="/host/:address?"
                        component={Host}
                      />
                      <Route
                        path="/registry"
                        component={Registry}
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
