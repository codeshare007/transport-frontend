import React from 'react';
import {
  IconButton,
  Button,
  ButtonProps,
  IconButtonProps,
  styled,
  FormControlLabel,
  Checkbox,
  Switch,
  SwitchProps
} from '@mui/material';


const StyledButton = styled(Button)(({ theme }) => ({
  minWidth: '92px',
  lineHeight: 'unset',
  fontSize: '16px',
}));

const StyledSwitch = styled((props: SwitchProps) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 44,
  height: 24,
  padding: 0,
  '.MuiSwitch-switchBase': {
    padding: 0,
    margin: 4,
    transitionDuration: '300ms',
    '.Mui-checked': {
      transform: 'translateX(16px)',
      color: '#fff',
      '.MuiSwitch-track': {
        backgroundColor: theme.palette.primary.main,
        opacity: 1,
        border: 0,
      },
      '.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.5,
      },
    },
    '.Mui-focusVisible .MuiSwitch-thumb': {
      color: '#33cf4d',
      border: '6px solid #fff',
    },
    '.Mui-disabled .MuiSwitch-thumb': {
      color:
        theme.palette.mode === 'light'
          ? theme.palette.grey[100]
          : theme.palette.grey[600],
    },
    '.Mui-disabled + .MuiSwitch-track': {
      opacity: theme.palette.mode === 'light' ? 0.7 : 0.3,
    },
  },
  '.MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: 16,
    height: 16,
    backgroundColor: '#52C3E4',
    '.Mui-checked': {
      backgroundColor: '#fff',
    }
  },
  '.MuiSwitch-track': {
    borderRadius: 12,
    backgroundColor: '#dedede',
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: 500,
    }),
  },
}));

export const MainButton = (props: ButtonProps) => {
  const { children, ...rest } = props;
  return (
    <StyledButton {...rest}>
      {children}
    </StyledButton>
  )
};

export const MainSwitch = (props: SwitchProps) => {
  const { ...rest } = props;
  return (
    <StyledSwitch defaultChecked {...rest} />
  );
}

export const MainCheckbox = (props: any) => {
  const { checked, setChecked, ...rest } = props;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  return <FormControlLabel {...rest} control={<Checkbox checked={checked} onChange={handleChange} />} />
}

export const MainIconButton = (props: IconButtonProps) => {
  const { children, ...rest } = props;
  return (
    <IconButton {...rest}>
      {children}
    </IconButton>
  )
};
