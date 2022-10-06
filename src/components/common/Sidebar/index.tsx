import { RootState } from '../../../redux/store';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { useAppDispatch } from '../../../redux/store';
import { SidebarContainer, Title, SmallText } from './Sidebar.styled';
import { MenuButton, TransparentMenuButton } from './MenuButton.styled';
import { ReactComponent as PaperIcon } from './icons/paper.svg';
import { ReactComponent as InboxIcon } from './icons/inbox.svg';
import { ReactComponent as TruckIcon } from './icons/truck.svg';
import { ReactComponent as PeopleIcon } from './icons/people.svg';
import { ReactComponent as LogoutIcon } from './icons/logout.svg';
import { ReactComponent as HandIcon } from './icons/hand.svg';
import { ReactComponent as PlusIcon } from './icons/plus-icon.svg';
import { ReactComponent as ArrowDownIcon } from './icons/arrow-down.svg';
import { ReactComponent as CompanyIcon } from './icons/company.svg';
import { ReactComponent as UserIcon } from './icons/user.svg';
import { ReactComponent as CategoryIcon } from './icons/category.svg';
import { ReactComponent as PriceIcon } from './icons/price.svg';
import { Box, Button, Typography } from '@mui/material';
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
        {((userRole === 'USER')) && (
          <Box sx={{ display: 'flex', flexDirection: 'row', padding: "13px", justifyContent: "space-between", alignItems: "center" }}>
            <Typography sx={{ color: "#fff", opacity: 0.7, fontSize: '13px', fontWeight: '700', lineHeight: '19px', paddingTop: '7px', textTransform: 'uppercase' }}>MENI</Typography>
            <Box sx={{ display: 'flex' }}>
              <ArrowDownIcon />
            </Box>
          </Box>
        )}
        {((userRole === 'ADMINISTRATOR')) && (
          <Box sx={{ display: 'flex', flexDirection: 'row', padding: "13px", justifyContent: "space-between", alignItems: "center" }}>
            <Typography sx={{ color: "#fff", opacity: 0.7, fontSize: '13px', fontWeight: '700', lineHeight: '19px', paddingTop: '7px', textTransform: 'uppercase' }}>Administrator meni</Typography>
            <Box sx={{ display: 'flex' }}>
              <ArrowDownIcon />
            </Box>
          </Box>
        )}
        { ((userCompanyRole?.includes('TRADING') || userCompanyRole?.includes('OWNER')) && (
          <Link style={{ textDecoration: 'none' }} to={'/registracija-tereta'}>
            <MenuButton onClick={() => { }} startIcon={<PlusIcon />}>
              Novi Teret
            </MenuButton>
          </Link>
        ))}
        <Link style={{ textDecoration: 'none' }} to={'/objave'}>
          <Button size='large' sx={{ color: '#fff', opacity: pathname === '/objave' ? 1 : 0.7, '& span': {width: '20px'} }} variant={'text'} startIcon={<PaperIcon />}>
            Sve Objave
          </Button>
        </Link>
        <Link style={{ textDecoration: 'none' }} to={'/notifikacije'}>
          <Button size='large' sx={{ color: '#fff', opacity: pathname === '/notifikacije' ? 1 : 0.7, '& span': {width: '20px'} }} variant={'text'} startIcon={<InboxIcon />}>
            Sanduče
          </Button>
        </Link>
        {userRole === 'ADMINISTRATOR' && (
          <Link style={{ textDecoration: 'none' }} to={'/kompanije'}>
            <Button size='large' sx={{ color: '#fff', opacity: pathname === '/kompanije' ? 1 : 0.7, '& span': {width: '20px'} }} variant={'text'} startIcon={<CompanyIcon />}>
              Kompanije
            </Button>
          </Link>
        )}
        {userRole === 'ADMINISTRATOR' && (
          <Link style={{ textDecoration: 'none' }} to={'/korisnici'}>
            <Button size='large' sx={{ color: '#fff', opacity: pathname === '/korisnici' ? 1 : 0.7, '& span': {width: '20px'} }} variant={'text'} startIcon={<UserIcon />}>
              Korisnici
            </Button>
          </Link>
        )}
        {userRole === 'ADMINISTRATOR' && (
          <Link style={{ textDecoration: 'none' }} to={'/teret'}>
            <Button size='large' sx={{ color: '#fff', opacity: pathname === '/teret' ? 1 : 0.7, '& span': {width: '20px'} }} variant={'text'} startIcon={<CategoryIcon />}>
              Vrste Tereta
            </Button>
          </Link>
        )}
        {userRole === 'ADMINISTRATOR' && (
          <Link style={{ textDecoration: 'none' }} to={'/cene'}>
            <Button size='large' sx={{ color: '#fff', opacity: pathname === '/cene' ? 1 : 0.7, '& span': {width: '20px'} }} variant={'text'} startIcon={<PriceIcon />}>
              Cene
            </Button>
          </Link>
        )}
        <Link style={{ textDecoration: 'none' }} to={'/vozaci'}>
          <Button size='large' sx={{ color: '#fff', opacity: pathname === '/vozaci' ? 1 : 0.7, '& span': {width: '20px'} }} variant={'text'} startIcon={<PeopleIcon />}>
            Vozači
          </Button>
        </Link>
        <Link style={{ textDecoration: 'none' }} to={'/vozila'}>
          <Button size='large' sx={{ color: '#fff', opacity: pathname === '/vozila' ? 1 : 0.7, '& span': {width: '20px'} }} variant={'text'} startIcon={<TruckIcon />}>
            Vozila
          </Button>
        </Link>
        {((userRole === 'USER')) && (
          <Box sx={{ display: 'flex', flexDirection: 'row', padding: "13px", justifyContent: "space-between", alignItems: "center" }}>
            <Typography sx={{ color: "#fff", opacity: 0.7, fontSize: '13px', fontWeight: '700', lineHeight: '19px', paddingTop: '7px', textTransform: 'uppercase' }}>Kontrolni MENI</Typography>
            <Box sx={{ display: 'flex' }}>
              <ArrowDownIcon />
            </Box>
          </Box>
        )}
        {(userRole === 'ADMINISTRATOR' || userCompanyRole?.includes('OWNER') || userCompanyRole?.includes('TRADER')) && (
          <Link style={{ textDecoration: 'none' }} to={'/saradnici'}>
            <Button size='large' sx={{ color: '#fff', opacity: pathname === '/saradnici' ? 1 : 0.7, '& span': {width: '20px'} }} variant={'text'} startIcon={<HandIcon />}>
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
