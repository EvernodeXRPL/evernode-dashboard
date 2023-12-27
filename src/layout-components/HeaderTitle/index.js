import React, { Fragment } from "react";
import clsx from 'clsx';
import { useEvernode } from "../../services/Evernode";

const HeaderTitle = () => {
  const evernode = useEvernode();
  return (
    <Fragment>
      <div className={clsx('header-title', {})} >
        <h3 >{evernode.environment[0].toUpperCase()}</h3>
      </div>
    </Fragment>
  );
};

export default HeaderTitle;
