import React from 'react';

import { Tooltip, Typography } from '@mui/material';

export default function CPUModel(props) {
  const { modelName, speed, count, showTooltip } = props;

  const cpuInfo = [];
  if (modelName)
    cpuInfo.push(modelName);
  if (speed)
    cpuInfo.push(`${speed} MHz`);
  if (count)
    cpuInfo.push(`${count} cores`);

  const text = cpuInfo.join(', ');
  const content = <Typography className="text-wrap">{text}</Typography>;

  return (
    text ? (showTooltip ? <Tooltip title="Host's CPU specifications">
      {content}
    </Tooltip> : content) : '-'
  );
}
