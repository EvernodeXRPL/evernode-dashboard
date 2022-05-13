import React, { Fragment } from 'react';

import { Typography } from '@material-ui/core';

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
  } = props;

  const [expanded, setExpanded] = React.useState(props.expanded ? id : false);

  const handleChange = panel => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Fragment>
      <ExpansionPanel
        expanded={expanded === id}
        onChange={handleChange(id)}
        className={panelClassName}>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon className={panelSummaryClassName} />}
          aria-controls="panel1bh-content"
          id="panel1bh-header">
          <Typography>{summary}</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails
          className={`${panelDetailClassName} p-0`}>
          {props.children}
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </Fragment>
  );
}
