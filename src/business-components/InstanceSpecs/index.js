import React from 'react';

import { Typography } from '@material-ui/core';

function round(n) {
  return Math.round(n * 100) / 100;
}

export default function InstanceSpecs(props) {
  const { cpu, ram, disk, instanceCount } = props;

  return (
    <Typography>{`${round(cpu / 10000 / instanceCount)}% CPU, 
    ${round(ram / 1000 / instanceCount)}GB RAM, 
    ${round(disk / 1000 / instanceCount)}GB Disk`}</Typography>
  );
}
