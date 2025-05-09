import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

interface CustomDialogProps {
  readonly open: boolean;
  readonly title: string;
  readonly message: string;
  onClose: () => void;
  actions?: { label: string; onClick: () => void; autoFocus?: boolean }[];
}

export default function ConfirmActionDialog( { open, title, message, onClose, actions }: CustomDialogProps):  React.JSX.Element {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="custom-dialog-title"
      aria-describedby="custom-dialog-description"
    >
      <DialogTitle id="custom-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="custom-dialog-description">{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        {actions?.map((action) => (
          <Button key={action.label} onClick={action.onClick} >
            {action.label}
          </Button>
        ))}
      </DialogActions>
    </Dialog>
  );
};

