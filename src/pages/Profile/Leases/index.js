import React, { Fragment, useEffect } from 'react';

import { Grid } from '@material-ui/core';

import Lease from '../Lease';
import { useEvernode } from '../../../services/evernode';
import Loader from '../../../components/Loader';

export default function Leases(props) {
  const address = props.address;

  const [leases, setLeases] = React.useState(null);

  const evernode = useEvernode();

  useEffect(() => {
    const fetchLeases = async () => {
      const leaseData = await evernode.getLeases(address);
      setLeases(leaseData);
    }

    if (!leases)
      fetchLeases();
  }, [address, evernode, leases]);

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
