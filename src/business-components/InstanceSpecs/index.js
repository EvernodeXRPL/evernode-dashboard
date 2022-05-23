import React from 'react';

import { Typography } from '@material-ui/core';

function round(n) {
  return Math.round(n * 100) / 100;
}

export default function InstanceSpecs(props) {
  const { cpu, ram, disk, instanceCount } = props;

  const specs = [];
  if (cpu)
    specs.push(`${round(cpu / 10000 / instanceCount)}% CPU`);
  if (ram)
    specs.push(`${round(ram / 1000 / instanceCount)}GB RAM`);
  if (disk)
    specs.push(`${round(disk / 1000 / instanceCount)}GB Disk`);

  return (
    <Typography>{specs.join(', ')}</Typography>
  );
}
