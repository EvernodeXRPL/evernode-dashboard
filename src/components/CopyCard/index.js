import React, { Fragment, useState } from "react";
import { useHistory } from "react-router-dom";
import { Card, Button, Snackbar, Tooltip } from "@material-ui/core";

import { FileCopyOutlined } from "@material-ui/icons";

export default function CopyCard(props) {
  const { address } = props;
  const [open, setOpen] = useState(false);
  const history = useHistory();
  const handleClick = () => {
    setOpen(true);
    navigator.clipboard.writeText(address);
  };
  const candidateRoute = () => {
    history.push(`/candidate/${address}`);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };
  return (
    <Fragment>
      <Card className={`row ${"copy-card"} pt-2 pb-2`}>
        <div>
          <Button onClick={candidateRoute}>{address}</Button>
          <Tooltip title="Copy to clipboard">
            <Button onClick={handleClick} className="mr-1 copy-button">
              <FileCopyOutlined style={{ fontSize: 20 }} />
            </Button>
          </Tooltip>
          <Snackbar
            open={open}
            onClose={handleClose}
            autoHideDuration={1000}
            message="Copied to clipboard"
          />
        </div>
      </Card>
    </Fragment>
  );
}