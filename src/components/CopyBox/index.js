import React, { Fragment, useState } from "react";
import { Button, Snackbar, Tooltip } from "@material-ui/core";

import { FileCopyOutlined } from "@material-ui/icons";

export default function CopyBox(props) {
  const { copyText, iconSize } = props;
  const [open, setOpen] = useState(false);
  const handleClick = (e) => {
    e.stopPropagation();
    setOpen(true);
    navigator.clipboard.writeText(copyText);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };
  return (
    <Fragment>
      <div className="copy-box">
        <div>
          {props.children}
        </div>
        <Tooltip title="Copy to clipboard" className="ml-1">
          <Button onClick={handleClick} className="copy-button">
            <FileCopyOutlined className="m-1" style={{ fontSize: iconSize || 20 }} />
          </Button>
        </Tooltip>
        <Snackbar
          open={open}
          onClose={handleClose}
          autoHideDuration={1000}
          anchorOrigin={{
            horizontal: 'center', vertical: 'top'
          }}
          message="Copied to clipboard"
          className="alert"
        />
      </div>
    </Fragment>
  );
}
