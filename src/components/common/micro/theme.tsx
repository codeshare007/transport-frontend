import React from 'react';
import {
  BoxProps,
  Box,
  Container,
  ContainerProps,
  IconButton,
  Typography,
  styled,
} from '@mui/material';


const StyledContainer = styled(Container)<ContainerProps>(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  backgroundRepeat: 'no-repeat',
  gap: 24,
}));

export interface DialogTitleProps {
  children?: React.ReactNode;
  onClose: () => void;
}


export const PageContainer = ({ children, ...rest }: ContainerProps) => {
  return (
    <StyledContainer maxWidth={false} disableGutters {...rest}>
      {children}
    </StyledContainer>
  );
};


export const PageContent = ({ children, ...rest }: BoxProps) => {
  return (
    <Box sx={{ flex: '1 1 66%', padding: '0 24px' }} {...rest}>
      {children}
    </Box>
  );
};

export const PaperContent = ({ children, ...rest }: BoxProps) => {
  return (
    <Box display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'} bgcolor={'white'} px={5} {...rest}>
      {children}
    </Box>
  );
};


export const PreveziTitle = (props: DialogTitleProps) => {
  const { children, onClose, ...rest } = props;
  return (
    <Box p={'24px'} display={'flex'} justifyContent={'space-between'} alignItems={'center'} {...rest}>
      <Typography variant={'h3'}>
        {children}
      </Typography>
      {onClose ? (
        <IconButton
          aria-label={'close'}
          onClick={onClose}
          sx={{ marginLeft: 'auto' }}
        >
        </IconButton>
      ) : null}
    </Box>
  )
}