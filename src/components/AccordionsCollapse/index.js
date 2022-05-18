import React, { Fragment } from 'react';

import { Tooltip } from '@material-ui/core';

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

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

  const panelSummary = <ExpansionPanelSummary
    expandIcon={<ExpandMoreIcon className={panelSummaryClassName} />}
    aria-controls="panel1bh-content"
    id="panel1bh-header">
    {summary}
  </ExpansionPanelSummary>

  return (
    <Fragment>
      <ExpansionPanel
        expanded={expanded === id}
        onChange={handleChange(id)}
        className={panelClassName}>
        {headerTooltip ?
          <Tooltip title={headerTooltip}>{panelSummary}</Tooltip> :
          panelSummary}
        <ExpansionPanelDetails
          className={`${panelDetailClassName} p-0`}>
          {props.children}
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </Fragment>
  );
}
