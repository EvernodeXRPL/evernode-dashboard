import React, { Fragment, useEffect, useState } from 'react';
import PageTitle from '../../layout-components/PageTitle';
import Table from '../../components/Table';

export default function Hosts() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hosts, setHosts] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch('https://firestore.googleapis.com/v1/projects/evernodeindex/databases/(default)/documents/rHQQq5aJ5kxFyNJXE36rAmuhxpDvpLHcWq_hosts');
      const data = await res.json();
      setHosts(data.documents);
      setIsLoaded(true);
    }
    fetchData();
  }, []);
  return (
    <Fragment>
      <PageTitle
        titleHeading="Hosts"
      />
      <Table hosts={hosts} />
    </Fragment>
  );
}
