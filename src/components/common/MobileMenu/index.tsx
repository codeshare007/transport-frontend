import { Button, Drawer, IconButton } from '@mui/material';
import { ReactComponent as CloseIcon } from './icons/close.svg';
import React, { Fragment, ReactNode } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import logo2 from './prevezi2.png'
import { Box } from '@mui/system';

interface MobileMenuProps {
  open: boolean;
  children: ReactNode[] | ReactNode;
  setOpen: (open: boolean) => void;
}
const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingTop: '15px',
  paddingBottom: '15px',
  paddingLeft: '10px',
  paddingRight: '10px'
}));

export const MobileMenu = ({ children, open, setOpen }: MobileMenuProps) => {
  const theme = useTheme();
  const navigate = useNavigate();
  return ( 
    <Fragment>
      <Drawer
        
        open={open}
        onClose={() => setOpen(!open)}
        sx={{width:'100%', height:'100%', mt: '5%'}}
        PaperProps={{
          sx: {
            width: '100%',
            display: 'flex',
            flexDirection:'column',
            justifyContent: 'space-between'
          }
        }}
      >
        <DrawerHeader>
          <Box/>
        <img onClick={() => navigate('/objave')} src={logo2} alt='logo2'/>
          <IconButton sx={{ alignSelf: 'flex-end' }} onClick={() => setOpen(!open)}><CloseIcon /></IconButton>
        </DrawerHeader>
        <Box sx={{width:'100%', height:'100%', backgroundColor: '#36cb83', color:'white', display: 'flex' , flexDirection:'column', padding:'13px 25px 36px 40px'}}>
        {children}
        </Box>

      </Drawer>
    </Fragment>
  );
};
