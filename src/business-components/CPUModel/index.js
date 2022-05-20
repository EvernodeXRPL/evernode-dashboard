import React from 'react';

import { Typography } from '@material-ui/core';

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
    <Typography>{cpuInfo.join(', ')}</Typography>
  );
}
