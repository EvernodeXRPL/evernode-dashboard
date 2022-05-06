import React, { Fragment } from 'react';
import PageTitle from '../../layout-components/PageTitle';
import Table from '../../components/Table';

export default function Hosts() {
  return (
    <Fragment>
      <PageTitle
        titleHeading="Hosts"
      />
      <Table />
    </Fragment>
  );
}
