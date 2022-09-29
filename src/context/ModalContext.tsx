import { useState, FC } from 'react';
import { Slide, SlideProps, Dialog, DialogActions, DialogContent, Typography, Box } from '@mui/material';
import React, { createContext, useContext, ReactNode } from 'react';
import { PreveziTitle } from '../components/common/micro/theme';
import { MainButton } from '../components/common/micro/buttons';
import { removeError } from '../redux/slices/user-slice';
import { useDispatch } from 'react-redux';

type DialogContextActions = {
  showDialog: (type: string, message: string) => void;
};

type DialogProps = {
  type?: string;
  message?: string;
  open: boolean;
}

const DialogContext = createContext({} as DialogContextActions);

interface DialogContextProviderProps {
  children: ReactNode;
}

type TransitionProps = Omit<SlideProps, 'direction'>;

const TransitionRight = (props: TransitionProps) => {
  return <Slide {...props} direction='down' />;
}

const DialogProvider: FC<DialogContextProviderProps> = ({
  children,
}) => {
  const [message, setMessage] = useState<DialogProps>({
    open: false,
  });
  const dispatch = useDispatch();


  const showDialog = (type: string, message: string) => {
    if (typeof type !== 'undefined' && typeof message !== 'undefined') {
      setMessage({
        type: type,
        message: message,
        open: true,
      });
    }
  };

  const handleClose = () => {
    dispatch(removeError());
    setMessage({
      open: false,
    });
  };

  return (
    <DialogContext.Provider value={{ showDialog }}>
      <Dialog onClose={handleClose} maxWidth={false} PaperProps={{ sx: { minWidth: '430px', borderRadius: '8px' } }} open={message.open}>
        <PreveziTitle onClose={handleClose}>
          {message.type}
        </PreveziTitle>
        <Box py={2} px={3}>
          <Typography variant='body1'>
            {message.message}
          </Typography>
        </Box>
        <DialogActions sx={{ justifyContent: 'center', padding: '24px' }}>
          <MainButton onClick={handleClose} variant={'contained'}>
            OK
          </MainButton>
        </DialogActions>
      </Dialog>
      {children}
    </DialogContext.Provider>
  );
};

const useDialog = (): DialogContextActions => {
  const context = useContext(DialogContext);

  if (!context) {
    throw new Error('useDialog must be used within an DialogProvider');
  }

  return context;
};

export { DialogProvider, useDialog };