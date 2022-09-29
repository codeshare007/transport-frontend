import React, { useEffect } from 'react';
import { useSnackBar } from '../../context/SnackContext';
import { useDispatch, useSelector } from 'react-redux';
import { userData } from '../../redux/slices/user-slice';
import { RootState, useAppDispatch } from '../../redux/store';
import AppContainer from '../../components/common/AppContainer';
import Header from '../../components/Header';
import Sidebar from '../../components/common/Sidebar';
import MainContainer from '../../components/common/MainContainer';
import { Box, styled, Typography, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions, useMediaQuery } from '@mui/material';

import { ReactComponent as EditIcon } from '../../assets/icons/mode.svg';
import { DefaultInput } from '../../components/common/micro/forms';
import api from '../../api/base';
import { apiv1 } from '../../api/paths';


const StyledProps = styled(Box)(() => ({
  display: 'flex',
  gap: '25px',
  flexDirection: 'column',
  span: {
    display: 'inline-block',
    '&:first-of-type': {
      width: '150px',
    },
    '&:last-of-type': {
      fontWeight: '700',
    }
  }
}));

const ProfilePage = () => {
  const matches = useMediaQuery("(max-width:767px)");
  const user = useSelector((store: RootState) => store?.user?.user);
  const dispatch = useAppDispatch();
  const { showSnackBar } = useSnackBar();

  const [open, setOpen] = React.useState(false);
  const [editUser, setEditUser] = React.useState({
    name: '',
    email: '',
    phone: '',
  });

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditUser({
      ...editUser,
      [e.target.name]: e.target.value,
    });
  };

  const closeHandler = () => {
    setOpen(false);
    setEditUser({
      name: '',
      email: '',
      phone: '',
    })
  };


  const onSubmitHandler = async () => {
    try {
      const response = await api.put(apiv1 + '/users/' + user.id + '/update', editUser);
      if (response.status === 200) {
        dispatch(userData());
        setOpen(false);
        showSnackBar('Profil uspesno izmenjen', 'success');
      }
    }
    catch (e) {
      setOpen(false);
      showSnackBar('Ups, desila se greška', 'error');
    };
  };


  useEffect(() => {
    setEditUser({
      name: user.name,
      email: user.email,
      phone: user.phone,
    });
  }, []);

  return (
    <Box>
    
    {

      matches ? (
        <Box>
      <Dialog maxWidth={'sm'} fullWidth open={open} onClose={() => closeHandler()}>
        <DialogTitle>Izmena Profila</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <DefaultInput name={'name'} placeholder={'Ime'} onChange={onChangeHandler} value={editUser.name}  />
          <DefaultInput name={'email'} placeholder={'Email'} onChange={onChangeHandler} value={editUser.email}  />
          <DefaultInput name={'phone'} placeholder={'Telefon'} onChange={onChangeHandler} value={editUser.phone}  />
        </DialogContent>
        <DialogActions>
          <Button variant='secondary' onClick={() => closeHandler()}>Otkaži</Button>
          <Button onClick={() => onSubmitHandler()} variant={'contained'}>
            Izmeni
          </Button>
        </DialogActions>
      </Dialog>
        <Header />
        <Box sx={{ backgroundColor: '#fafafa', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
          <Box sx={{ padding: '50px 40px', width: '464px', backgroundColor: '#fff' }}>
            <Paper sx={{ backgroundColor: '#fff', }} elevation={0}>
              <Typography sx={{ mb: 3, display: 'flex' }} variant={'h2'}>
                Profil
                <Button onClick={() => setOpen(true)} startIcon={<EditIcon />} sx={{ ml: 'auto' }} variant={'text'}>Izmeni</Button>
              </Typography>
              <StyledProps>
                <Typography variant={'body1'}>
                  <span>Adresa:</span><span>{user?.company?.addressDetails?.address}</span>
                </Typography>
                <Typography variant={'body1'}>
                  <span>Grad:</span> <span>{user?.company?.addressDetails?.city}</span>
                </Typography>
                <Typography variant={'body1'}>
                  <span>Država:</span> <span>{user?.company?.addressDetails?.country}</span>
                </Typography>
                <Typography variant={'body1'}>
                  <span>Matični Broj: </span><span>{user?.company?.registrationNumber}</span>
                </Typography>
                <Typography variant={'body1'}>
                  <span>PIB:</span> <span>{user?.company?.taxpayerRegisterNumber}</span>
                </Typography>
                <Typography variant={'body1'}>
                  <span>Telefon:</span> <span>{user?.company?.phoneNumber}</span>
                </Typography>
                <Typography variant={'body1'}>
                  <span>Fax:</span> <span>{user?.company?.faxNumber}</span>
                </Typography>
                <Typography variant={'body1'}>
                  <span> E-Mail: </span> <span>{user?.company?.email}</span>
                </Typography>
                <Typography variant={'body1'}>
                  <span> Website: </span> <span>{user?.company?.website}</span>
                </Typography>
              </StyledProps>
            </Paper>
          </Box>
        </Box>


        </Box>
      )
      :
      (
<AppContainer>
      <Dialog maxWidth={'sm'} fullWidth open={open} onClose={() => closeHandler()}>
        <DialogTitle>Izmena Profila</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <DefaultInput name={'name'} placeholder={'Ime'} onChange={onChangeHandler} value={editUser.name}  />
          <DefaultInput name={'email'} placeholder={'Email'} onChange={onChangeHandler} value={editUser.email}  />
          <DefaultInput name={'phone'} placeholder={'Telefon'} onChange={onChangeHandler} value={editUser.phone}  />
        </DialogContent>
        <DialogActions>
          <Button variant='secondary' onClick={() => closeHandler()}>Otkaži</Button>
          <Button onClick={() => onSubmitHandler()} variant={'contained'}>
            Izmeni
          </Button>
        </DialogActions>
      </Dialog>
      {
        matches ? null
        :
        <Sidebar />
      }
      <MainContainer>
        <Header />
        <Box sx={{ backgroundColor: '#fafafa', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
          <Box sx={{ padding: '50px 40px', width: '464px', backgroundColor: '#fff' }}>
            <Paper sx={{ backgroundColor: '#fff', }} elevation={0}>
              <Typography sx={{ mb: 3, display: 'flex' }} variant={'h2'}>
                Profil
                <Button onClick={() => setOpen(true)} startIcon={<EditIcon />} sx={{ ml: 'auto' }} variant={'text'}>Izmeni</Button>
              </Typography>
              <StyledProps>
                <Typography variant={'body1'}>
                  <span>Adresa:</span><span>{user?.company?.addressDetails?.address}</span>
                </Typography>
                <Typography variant={'body1'}>
                  <span>Grad:</span> <span>{user?.company?.addressDetails?.city}</span>
                </Typography>
                <Typography variant={'body1'}>
                  <span>Država:</span> <span>{user?.company?.addressDetails?.country}</span>
                </Typography>
                <Typography variant={'body1'}>
                  <span>Matični Broj: </span><span>{user?.company?.registrationNumber}</span>
                </Typography>
                <Typography variant={'body1'}>
                  <span>PIB:</span> <span>{user?.company?.taxpayerRegisterNumber}</span>
                </Typography>
                <Typography variant={'body1'}>
                  <span>Telefon:</span> <span>{user?.company?.phoneNumber}</span>
                </Typography>
                <Typography variant={'body1'}>
                  <span>Fax:</span> <span>{user?.company?.faxNumber}</span>
                </Typography>
                <Typography variant={'body1'}>
                  <span> E-Mail: </span> <span>{user?.company?.email}</span>
                </Typography>
                <Typography variant={'body1'}>
                  <span> Website: </span> <span>{user?.company?.website}</span>
                </Typography>
              </StyledProps>
            </Paper>
          </Box>
        </Box>
      </MainContainer>
    </AppContainer>
      )

    }

    </Box>

    
  );
}


export default ProfilePage;