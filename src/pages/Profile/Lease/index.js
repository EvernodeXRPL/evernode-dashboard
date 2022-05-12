import { Grid, List, ListItem, ListItemText } from '@material-ui/core';
import React from 'react';

import AccordionsCollapse from '../../../components/AccordionsCollapse';

export default function Lease(props) {
  const lease = props.lease;
  return (
    <Grid item xs={12} className="pb-2">
      <AccordionsCollapse summary={lease.NFTokenID} id={lease.NFTokenID} expanded="true">
        <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
          {Object.keys(lease).filter(key => typeof lease[key] === 'string').map(key => {
            return <ListItem key={key}>
              <ListItemText primary={key} />
              <ListItemText primary={lease[key]} />
            </ListItem>
          })}
        </List>
      </AccordionsCollapse>
    </Grid>
  );
}
