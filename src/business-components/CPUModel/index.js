import React from 'react';

import { Tooltip, Typography } from '@material-ui/core';

export default function CPUModel(props) {
  const { modelName, speed, count } = props;

  const cpuInfo = [];
  if (modelName)
    cpuInfo.push(modelName);
  if (speed)
    cpuInfo.push(`${speed} MHz`);
  if (count)
    cpuInfo.push(`${count} cores`);

  return (
    <Tooltip title="Host's CPU specifications">
      <Typography className="text-wrap">{cpuInfo.join(', ') || '-'}</Typography>
    </Tooltip>
  );
}
