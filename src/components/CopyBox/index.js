import React, { Fragment, useState } from "react";
import { Button, Tooltip } from "@material-ui/core";

import { FileCopyOutlined, DoneAll } from "@material-ui/icons";

export default function CopyBox(props) {
  const { copyText, iconSize } = props;
  const [open, setOpen] = useState(false);
  const handleClick = (e) => {
    e.stopPropagation();
    setOpen(true);
    navigator.clipboard.writeText(copyText);
    setTimeout(() => { setOpen(false); }, 2000);
  };
  return (
    <Fragment>
      <div className="copy-box">
        <div>
          {props.children}
        </div>
        <Tooltip title={open? "Copied":"Copy to clipboard"} className="ml-1">
          <Button onClick={handleClick} className="copy-button">
            {open ? <DoneAll className="m-1" style={{ fontSize: iconSize || 20, color: '#2b9e19' }} /> : <FileCopyOutlined className="m-1" style={{ fontSize: iconSize || 20 }} />}

          </Button>
        </Tooltip>
      </div>
    </Fragment>
  );
}
