import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core';
import React from 'react';

export default function ModalDialog(props) {
  const { open, scroll, title, onConfirm, onClose } = props;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      scroll={scroll}
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description">
      {title && <DialogTitle id="scroll-dialog-title">{title}</DialogTitle>}
      <DialogContent dividers={scroll === 'paper'} className="mb-2">
        {props.children}
      </DialogContent>
      {onConfirm && <DialogActions>
        <Button onClick={onConfirm} color="primary">
          Subscribe
        </Button>
      </DialogActions>}
    </Dialog>
  );
}
