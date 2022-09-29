import React, { ReactNode } from 'react';
import { Dialog, DialogTitle, styled, IconButton } from '@mui/material';
import { ReactComponent as CloseIcon } from '../../RightDrawer/icons/close.svg';


export interface MainModalProps {
  open: boolean;
  onClose: (value: boolean) => void;
  title?: string;
  children?: ReactNode;
  otherProps?: any;
}

const StyledTitle = styled(DialogTitle)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  padding: 0,
}));


export const MainModal = (props: MainModalProps) => {
  const { onClose, open, children, title, otherProps } = props;

  const handleClose = () => {
    onClose(false);
  }; 

  return (
    <Dialog {...otherProps} open={open} onClose={handleClose}>
      <StyledTitle>
        <p>{title}</p> 
        <IconButton onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </StyledTitle>
      {children}
    </Dialog>
  );
};
