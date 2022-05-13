import React, { Fragment, useCallback } from 'react';
import { useHistory } from "react-router-dom";

import PageTitle from '../../layout-components/PageTitle';
import Table from '../../components/Table';

export default function Hosts() {
  const history = useHistory();

  // This is a dummy data array.
  const hosts = [
    {
      address: "r9T3aBfZemZfWrbdmCzdVS2tp4pAg4XMDt"
    },
    {
      address: "r9T3aBfZemZfWrbdmCzdVS2tp4pAg4XMDt"
    }
  ];

  const handleRowClick = useCallback((e) => {
    history.push(`/profile/${e.address}`);
  }, [history]);

  return (
    <Fragment>
      <PageTitle
        titleHeading="Hosts"
      />
      <Table values={hosts} onRowClick={handleRowClick} />
    </Fragment>
  );
}
