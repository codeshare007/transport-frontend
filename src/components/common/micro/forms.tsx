import React, { ReactNode } from 'react';

import {
  Box,
  Button,
  ButtonProps,
  Select,
  SelectProps,
  FormControl,
  MenuItem,
  MenuItemProps,
  styled,
} from '@mui/material';
import { TextField, BoxProps } from '@mui/material';
import { fieldToTextField, TextFieldProps } from 'formik-mui';
import { Select as ForSelect } from 'formik-mui';
import { ReactComponent as ChevronDown } from '../../../assets/icons/expand_more.svg';


const StyledContainer = styled(Box)<BoxProps>(({ theme }) => ({
}));

export const StyledSelect = styled(Select)<SelectProps>(({ theme }) => ({
  color: theme.palette.text.primary,
  '.MuiSelect-icon': {
    right: '8px',
    top: 'unset'
  },
}));

export const FormikSelect = styled(ForSelect)<SelectProps>(({ theme }) => ({
  background: theme.palette.background.paper,
  color: theme.palette.text.primary,
  ':hover': {
    border: 'none',
    '.MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.primary.main,
    }
  },
  '.MuiSelect-icon': {
    right: '8px',
    top: 'unset'
  },
}));

export const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  display: 'flex',
  fontSize: '16px',
  svg: {
    fontSize: '20px',
  },
}));

export const SubmitButton = (props: ButtonProps) => {
  const { children, ...rest } = props
  return (
    <Button
      sx={{ lineHeight: 'unset' }}
      {...rest}
    >
      {children}
    </Button>
  )
};

export const FormContainer = ({ children, ...rest }: BoxProps) => {
  return (
    <StyledContainer {...rest}>
      {children}
    </StyledContainer>
  )
};

export const Input = (props: TextFieldProps) => {
  return (
    <TextField {...fieldToTextField(props)} />
  );
};

export const DefaultInput = ({ ...rest }: any) => {
  return (
    <TextField variant={'outlined'} {...rest} />
  );
};


export const SelectWrapper = (props: any) => {
  const { children, formProps, ...rest } = props;

  return (
    <StyledSelect
      MenuProps={{
        disableScrollLock: true,
      }}
      IconComponent={ChevronDown}
      {...rest}
    >
      {children}
    </StyledSelect>
  );
};

export const ControlledSelect = (props: any) => {
  const { children, ...rest } = props;
  return (
    <FormikSelect
      MenuProps={{
        disableScrollLock: true,
      }}
      IconComponent={ChevronDown}
      {...rest}
    >
      {children}
    </FormikSelect>
  );
}


export const InputItem = (props: MenuItemProps) => {
  const { children, ...rest } = props;

  return (
    <StyledMenuItem {...rest}>
      {children}
    </StyledMenuItem>
  );
};


export const TableHolder = styled(Box)<BoxProps>(({ theme }) => ({
  flex: 1,
  width: '100%',
  backgroundColor: 'transparent',
  display: 'flex',
  justifyContent: 'flex-start',
  flexDirection: 'column',
  overflow: 'hidden',
  height: 'calc(100vh - 420px)',
  borderRadius: '8px',
  gap: '30px',
}));



