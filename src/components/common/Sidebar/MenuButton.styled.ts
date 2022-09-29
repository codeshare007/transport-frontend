import { Button, styled } from '@mui/material';
import { Link } from 'react-router-dom';
//import LogoutIcon from './icons/logout'

export const MenuButton = styled(Button)<any>(({ isActive }: { isActive: boolean }) => ({
  width: "100%",
  boxShadow: 'none',
  color: '#FFFFFF',
  fontSize: 16,
  justifyContent: 'flex-start',
  '.MuiButton-startIcon': {
    paddingRight: 11,
  },
  '.MuiButton-endIcon': {
    marginLeft: 'auto',
  },
}));

export const TransparentMenuButton = styled(MenuButton)<any>(({ isActive }: { isActive: boolean }) => ({
  opacity: isActive ? 1 : 0.7,
}));

export const CustomLink = styled(Link)(() => ({
  textDecoration: 'none',
  '&:last-of-type': {
    marginTop: 'auto',
  }
}));


