import { Box, styled } from '@mui/material';


export const HeaderContainer = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'flex-end',
  padding: '10px 31px',
  borderBottom: 'solid 1px #EAEAEA',
}));

export const Notifications = styled(Box)(({theme}) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  maxHeight: '280px',
  overflow: 'scroll',
  [theme.breakpoints.down('md')]: {
    maxHeight: '50%',
    paddingRight: '6px'
  }
}));

export const SingleNotification = styled(Box)<{active: boolean}>(({ active }) => ({
  padding: '20px 20px',
  borderRadius: '4px',
  backgroundColor: active ? 'rgb(56, 204, 134, .1)' : '#fff',
  p: {
    fontWeight: '500',
    fontSize: '14px',
    lineHeight: '22px',
    '&:last-of-type': {
      color: '#999'
    }
  }
}));

