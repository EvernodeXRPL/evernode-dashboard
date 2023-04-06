import React, { Fragment } from "react";
import clsx from 'clsx';
const HeaderTitle = (props) => {
  return (
    <Fragment>
      <div className={clsx('header-title', {})} >
        <h3 >beta v3</h3>
      </div>
    </Fragment>
  );
};

export default HeaderTitle;