import { RootState } from '../../../redux/store';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { useAppDispatch } from '../../../redux/store';
import { SidebarContainer, Title } from './Sidebar.styled';
import { MenuButton, TransparentMenuButton } from './MenuButton.styled';
import { ReactComponent as PaperIcon } from './icons/paper.svg';
import { ReactComponent as TruckIcon } from './icons/truck.svg';
import { ReactComponent as PeopleIcon } from './icons/people.svg';
import { ReactComponent as LogoutIcon } from './icons/logout.svg';
import { ReactComponent as HandIcon } from './icons/hand.svg';
import { ReactComponent as PlusIcon } from './icons/plus-icon.svg';
import { Box, Button, useMediaQuery } from '@mui/material';
import { logoutUser } from '../../../redux/slices/user-slice';


const Sidebar = () => {
  const userCompanyRole = useSelector((state: RootState) => state?.user?.user?.companyRoles);
  const userRole = useSelector((state: RootState) => state?.user?.user?.role);
  const { pathname } = useLocation();
  const dispatch = useAppDispatch();

  return (
    
    <SidebarContainer>
      <Box sx={{ display: 'flex', flexDirection: 'column', padding: '35px', height: '100%', }}>
        <Title>
          Prevezi
        </Title>
        <Link style={{ textDecoration: 'none' }} to={'/objave'}>
          <Button size='large' sx={{ color: '#fff', opacity: pathname === '/objave' ? 1 : 0.7 }} variant={'text'} startIcon={<PaperIcon />}>
            Sve Objave
          </Button>
        </Link>
        {(userCompanyRole?.includes('TRANSPORT') || userCompanyRole?.includes('OWNER')) && (
          <Link style={{ textDecoration: 'none' }} to={'/vozaci'}>
            <Button size='large' sx={{ color: '#fff', opacity: pathname === '/vozaci' ? 1 : 0.7 }} variant={'text'} startIcon={<PeopleIcon />}>
              Vozači
            </Button>
          </Link>
        )}
        {userRole === 'ADMINISTRATOR' && (
          <Link style={{ textDecoration: 'none' }} to={'/kompanije'}>
            <Button size='large' sx={{ color: '#fff', opacity: pathname === '/kompanije' ? 1 : 0.7 }} variant={'text'} startIcon={<PeopleIcon />}>
              Kompanije
            </Button>
          </Link>
        )}
        {userRole === 'ADMINISTRATOR' && (
          <Link style={{ textDecoration: 'none' }} to={'/korisnici'}>
            <Button size='large' sx={{ color: '#fff', opacity: pathname === '/korisnici' ? 1 : 0.7 }} variant={'text'} startIcon={<PeopleIcon />}>
              Korisnici
            </Button>
          </Link>
        )}
        {userRole === 'ADMINISTRATOR' && (
          <Link style={{ textDecoration: 'none' }} to={'/teret'}>
            <Button size='large' sx={{ color: '#fff', opacity: pathname === '/teret' ? 1 : 0.7 }} variant={'text'} startIcon={<PeopleIcon />}>
              Vrste Tereta
            </Button>
          </Link>
        )}
        {userRole === 'ADMINISTRATOR' && (
          <Link style={{ textDecoration: 'none' }} to={'/cene'}>
            <Button size='large' sx={{ color: '#fff', opacity: pathname === '/cene' ? 1 : 0.7 }} variant={'text'} startIcon={<PeopleIcon />}>
              Cene
            </Button>
          </Link>
        )}
        {(userCompanyRole?.includes('TRANSPORT') || userCompanyRole?.includes('OWNER')) && (
          <Link style={{ textDecoration: 'none' }} to={'/vozila'}>
            <Button size='large' sx={{ color: '#fff', opacity: pathname === '/vozila' ? 1 : 0.7 }}  variant={'text'} startIcon={<TruckIcon />}>
              Vozila
            </Button>
          </Link>
        )}
        {(userCompanyRole?.includes('TRADING') || userCompanyRole?.includes('OWNER')) && (
          <Link style={{ marginTop: '10px', textDecoration: 'none' }} to={'/registracija-tereta'}>
            <MenuButton onClick={() => { }} startIcon={<PlusIcon />}>
              Dodaj novi teret
            </MenuButton>
          </Link>
        )}
        {(userCompanyRole === 'ADMINISTRATOR' || userCompanyRole?.includes('OWNER') || userCompanyRole?.includes('TRADER')) && (
          <Link style={{ textDecoration: 'none' }} to={'/saradnici'}>
          <Button size='large' sx={{ color: '#fff', opacity: pathname === '/saradnici' ? 1 : 0.7 }} variant={'text'} startIcon={<HandIcon />}>
            Saradnici
          </Button>
        </Link>
        )}
        <Link to={'/'} style={{ textDecoration: 'none', marginTop: 'auto' }}>
          <MenuButton onClick={() => dispatch(logoutUser())} startIcon={<LogoutIcon />}>
            Odjavi Se
          </MenuButton>
        </Link>
      </Box>
    </SidebarContainer>
  )
};

export default Sidebar;
