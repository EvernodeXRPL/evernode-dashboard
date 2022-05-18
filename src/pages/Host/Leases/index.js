import React, { Fragment, useEffect } from 'react';

import { Grid } from '@material-ui/core';

import Lease from '../Lease';
import { useEvernode } from '../../../services/Evernode';
import Loader from '../../../components/Loader';

export default function Leases(props) {
  const address = props.address;

  const [leases, setLeases] = React.useState(null);

  const evernode = useEvernode();

  useEffect(() => {
    const fetchLeases = async () => {
      setLeases(null);
      const res = await evernode.getLeases(address);
      const leaseData = res.map(l => {
        const uriInfo = evernode.decodeLeaseUri(l.uri)
        return {
          ...l,
          ...uriInfo
        }
      });
      setLeases(leaseData);
    }

    fetchLeases();
  }, [address, evernode]);

  return (
    <Fragment>
      {(leases && <Grid container>
        {leases.map((lease, index) => {
          return <Lease key={index} lease={lease} />
        })}
      </Grid>) || <Loader />}
    </Fragment>
  );
}
