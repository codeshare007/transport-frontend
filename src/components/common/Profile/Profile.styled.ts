import { styled, Box, Avatar, Button } from '@mui/material';


export const ProfileHolder = styled(Box)(() => ({
  display: 'flex',
  marginLeft: '19px',
  alignItems: 'center',
}));

export const MainAvatar = styled(Avatar)(({ theme }) => ({
  fontSize: '14px',
  lineHeight: 'unset',
  backgroundColor: 'rgba(54, 203, 131, .1)',
  color: theme.palette.primary.main,
  height: '36px',
  width: '36px',
}));

export const ProfileButton = styled(Button)(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  'svg': {
    'path': {
      fill: '#222',
    },
  },
  'p': {
    lineHeight: '1',
    '&:first-of-type': {
      color: '#222'
    },
    '&:last-of-type': {
      fontSize: '12px',
      color: '#999'
    },
  }
}));

