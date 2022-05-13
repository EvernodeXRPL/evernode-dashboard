import React, { Fragment } from 'react';

import clsx from 'clsx';
import { Link } from 'react-router-dom';

import { IconButton, Box } from '@material-ui/core';

import projectLogo from '../../assets/images/logo-white.png';

const HeaderLogo = props => {
  return (
    <Fragment>
      <div className={clsx('app-header-logo', {})}>
        <Box
          className="header-logo-wrapper"
          title="Evernod Host Dashboard">
          <Link to="/" className="header-logo-wrapper-link">
            <IconButton
              color="primary"
              size="medium">
              <img
                className="app-header-logo-img"
                alt="Evernod Host Dashboard"
                src={projectLogo}
              />
            </IconButton>
          </Link>
        </Box>
      </div>
    </Fragment>
  );
};

export default HeaderLogo;
