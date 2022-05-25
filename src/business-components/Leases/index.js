import React, { Fragment, useEffect } from 'react';

import { Grid } from '@material-ui/core';

import Lease from './Lease';
import { useEvernode } from '../../services/Evernode';
import Loader from '../../components/Loader';

export default function Leases(props) {
  const { address } = props;

  const [leases, setLeases] = React.useState(null);

  const evernode = useEvernode();

  useEffect(() => {
    const fetchLeases = async () => {
      setLeases(null);
      const tos = await evernode.getTos();
      const res = await evernode.getLeases(address);
      const leaseData = res.map(l => {
        const uriInfo = evernode.decodeLeaseUri(l.uri)
        return {
          ...l,
          ...uriInfo,
          tos: tos
        }
      });
      setLeases(leaseData);
    }

    fetchLeases();
  }, [address, evernode]);

  return (
    <Fragment>
      {(leases && (leases.length ? <Grid container>
        {leases.map((lease, index) => {
          return <Lease key={index} lease={lease} />
        })}
      </Grid> : <span>There're no available leases!</span>)) || <Loader />}
    </Fragment>
  );
}
