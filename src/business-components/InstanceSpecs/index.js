import React from 'react';

import { Tooltip, Typography } from '@material-ui/core';

function round(n) {
  return Math.round(n * 100) / 100;
}

export default function InstanceSpecs(props) {
  const { cpu, ram, disk, instanceCount } = props;

  const specs = [];
  if (instanceCount) {
    if (cpu)
      specs.push(`${round(cpu / 10000 / instanceCount)}% CPU`);
    if (ram)
      specs.push(`${round(ram / 1000 / instanceCount)}GB RAM`);
    if (disk)
      specs.push(`${round(disk / 1000 / instanceCount)}GB Disk`);
  }

  return (
    <Tooltip title="Specifications of a sashimono instance">
      <Typography className="text-wrap">{specs.join(', ') || '-'}</Typography>
    </Tooltip>
  );
}
