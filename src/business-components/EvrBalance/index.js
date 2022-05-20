import React from 'react';

import {
  Card,
  CardContent
} from '@material-ui/core';

import Loader from '../../components/Loader';

export default function EvrBalance(props) {
  const { balance } = props;

  return (
    <Card className="mt-1 bg-unicorn border-0 text-light">
      {(balance && <CardContent className="pt-1 pb-1 text-center wallet-balance">
        <span className="font-weight-bold amount">
          {balance}
        </span>
        <span className="font-weight-normal ml-1 evr">
          EVR
        </span>
      </CardContent>) || <Loader className="mt-1 p-2" size="1.5rem" />}
    </Card>
  );
}
