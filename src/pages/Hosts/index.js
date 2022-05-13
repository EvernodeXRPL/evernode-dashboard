import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";

import PageTitle from '../../layout-components/PageTitle';
import Table from '../../components/Table';
import { useEvernode } from '../../services/evernode';
import Loader from '../../components/Loader';

export default function Hosts() {
  const history = useHistory();
  const evernode = useEvernode();

  const [hosts, setHosts] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    async function getData() {
      const data = await evernode.getHosts();
      setIsLoaded(true)
      setHosts(data);
    };
    getData();
  }, [evernode]);

  const handleRowClick = useCallback((e) => {
    history.push(`/host/${e.address}`);
  }, [history]);

  return (
    <Fragment>
      <PageTitle
        titleHeading="Hosts"
      />
      {(isLoaded && <Table hosts={hosts} onRowClick={handleRowClick} />) ||
        <Loader className="p-4" />}
    </Fragment>
  );
}
