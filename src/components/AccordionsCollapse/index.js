import React, { Fragment } from 'react';

import { Typography } from '@material-ui/core';

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

export default function AccordionsCollapse(props) {
  const id = props.id;

  const [expanded, setExpanded] = React.useState(props.expanded ? id : false);

  const handleChange = panel => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Fragment>
      <ExpansionPanel
        expanded={expanded === id}
        onChange={handleChange(id)}
        className="bg-midnight-bloom text-light">
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header">
          <Typography>{props.summary}</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails
          className="bg-happy-fisher text-light">
          <Typography component={'span'}>
            {props.children}
          </Typography>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </Fragment>
  );
}
