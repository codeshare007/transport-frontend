import { useState, FC } from 'react';
import { Snackbar, AlertColor, Alert, AlertTitle, Slide, SlideProps } from '@mui/material';
import React, { createContext, useContext, ReactNode } from 'react';

type SnackBarContextActions = {
  showSnackBar: (text: string, typeColor: AlertColor, title?: string) => void;
};

const SnackBarContext = createContext({} as SnackBarContextActions);

interface SnackBarContextProviderProps {
  children: ReactNode;
}

type TransitionProps = Omit<SlideProps, 'direction'>;

const TransitionRight = (props: TransitionProps) => {
  return <Slide {...props} direction='up' />;
}

const SnackBarProvider: FC<SnackBarContextProviderProps> = ({
  children,
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [typeColor, setTypeColor] = useState<AlertColor | ''>('');


  const showSnackBar = (text: string, color: AlertColor, title?: string) => {
    setMessage(text);
    setTypeColor(color);
    if (title) setTitle(title);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <SnackBarContext.Provider value={{ showSnackBar }}>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        TransitionComponent={TransitionRight}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        onClose={handleClose}
        sx={{ minWidth: '272px', '.MuiPaper-root': { width: '100%' } }}
        >
        <Alert elevation={8} severity={typeColor || 'success'}>
          <AlertTitle>{title}</AlertTitle>
          {message}
        </Alert>
      </Snackbar>
      {children}
    </SnackBarContext.Provider>
  );
};

const useSnackBar = (): SnackBarContextActions => {
  const context = useContext(SnackBarContext);

  if (!context) {
    throw new Error('useSnackBar must be used within an SnackBarProvider');
  }

  return context;
};

export { SnackBarProvider, useSnackBar };