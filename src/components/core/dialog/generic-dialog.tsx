import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import type { Breakpoint } from '@mui/material';

interface CustomDialogProps {
  readonly open: boolean;
  readonly title: string;
  onClose: () => void;
  readonly children?: React.ReactNode;
  readonly maxWidth?:Breakpoint;
}

export function GenericDialog ({ children,open,onClose,title,maxWidth }: CustomDialogProps) :React.JSX.Element {
  return (
    <Dialog
      open={open}
      title={title}
      onClose={onClose}
      aria-labelledby="custom-dialog-title"
      aria-describedby="custom-dialog-description"
      maxWidth={maxWidth??'lg'}
    >
      {children}
    </Dialog>
  );
};

