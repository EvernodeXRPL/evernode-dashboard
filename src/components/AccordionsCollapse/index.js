import React, { Fragment } from 'react';

import { Tooltip } from '@mui/material';

import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function AccordionsCollapse(props) {
  const {
    id,
    summary,
    panelClassName,
    panelSummaryClassName,
    panelDetailClassName,
    headerTooltip
  } = props;

  const [expanded, setExpanded] = React.useState(props.expanded ? id : false);

  const handleChange = panel => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const panelSummary = <AccordionSummary
    expandIcon={<ExpandMoreIcon className={panelSummaryClassName} />}
    aria-controls="panel1bh-content"
    id="panel1bh-header">
    {summary}
  </AccordionSummary>

  return (
    <Fragment>
      <Accordion
        expanded={expanded === id}
        onChange={handleChange(id)}
        className={panelClassName}>
        {headerTooltip ?
          <Tooltip title={headerTooltip}>{panelSummary}</Tooltip> :
          panelSummary}
        <AccordionDetails
          className={`${panelDetailClassName} p-0`}>
          {props.children}
        </AccordionDetails>
      </Accordion>
    </Fragment>
  );
}
