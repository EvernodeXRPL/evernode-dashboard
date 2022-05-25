import React, { Fragment } from 'react';

import { Paper } from '@material-ui/core';

function PageTitle(props) {
  return (
    <Fragment>
      <Paper elevation={2} className="app-page-title"
        style={{ width: '100%', margin: '0 0 2rem 0', padding: '1rem' }}
      >
        <div>
          <div className="app-page-title--first">
            <div className="app-page-title--heading">
              <h1 className={ props.responsive ?  'font-size-responsive' : '' }>{props.titleHeading}</h1>
              {props.titleDescription && <div className="app-page-title--description">
                {props.titleDescription}
              </div>}
            </div>
          </div>
        </div>
        {props.children}
      </Paper>
    </Fragment>
  );
}

export default PageTitle;
