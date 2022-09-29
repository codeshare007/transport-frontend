import React, { useState, MouseEvent } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { useAppDispatch } from '../../../redux/store';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Menu, MenuItem, Divider } from '@mui/material';
import { ReactComponent as ChevronDown } from '../../common/Sidebar/icons/arrow-down.svg';
import { ProfileHolder, MainAvatar, ProfileButton } from './Profile.styled';
import { useSnackBar } from '../../../context/SnackContext';
import { logoutUser } from '../../../redux/slices/user-slice';

const profilenav = [
  {
    name: 'Korisnički Profil',
    url: '/profil',
  },
  {
    name: 'Notifikacije',
    url: '/notifikacije',
  },
  {
    name: 'Odjavi Se',
    url: '',
  },
]

const Profile = () => {
  const user = useSelector((store: RootState) => store?.user?.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { showSnackBar } = useSnackBar();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <ProfileHolder>
      <MainAvatar>{user?.name?.includes(" ") ? user?.name?.split(" ")[0].charAt(0).toUpperCase() + user?.name?.split(" ")[1].charAt(0).toUpperCase() : user?.name?.split(" ")[0].charAt(0).toUpperCase()}</MainAvatar>
      <Box>
        <ProfileButton
          id={'profile-dropdown'}
          aria-controls={open ? 'profile-menu' : undefined}
          aria-haspopup={'true'}
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
        >
          <Typography>{user?.name} <ChevronDown style={{ transform: `${open ? 'rotate(180deg)' : 'rotate(0deg)'}` }} /></Typography>
          <Typography>{user?.company?.name}</Typography>
        </ProfileButton>
        <Menu
          id={'profile-menu'}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'profile-dropdown',
            sx: { padding: 0, minWidth: '177px' }
          }}
        >
          {
            profilenav.map((nav) => (
              <Box onClick={() => {
                if (nav.url === '')   {
                  showSnackBar('Odjavili ste se!', 'success');
                  dispatch(logoutUser());
                  navigate('/')
                }
                navigate(nav.url)
              }} key={nav.name}>
                <MenuItem sx={{ fontSize: '14px', padding: '8px 13px' }}>
                  {nav.name}
                </MenuItem>
                <Divider light sx={{ margin: '0px!important' }} />
              </Box>
            ))
          }
        </Menu>
      </Box>
    </ProfileHolder>
  );
};

export default Profile;
