import React, { useState, useEffect, ChangeEvent } from 'react';
import { useAppDispatch, RootState } from '../../redux/store';
import Header from '../../components/Header';
import Sidebar from '../../components/common/Sidebar';
import AppContainer from '../../components/common/AppContainer';
import MainContainer from '../../components/common/MainContainer';
import PageHeader from '../../components/PageHeader';
import { Box, Grid, Button, TextField, Typography, styled, InputLabel, useMediaQuery, Select, SelectChangeEvent, Menu, MenuItem } from '@mui/material';
import { Formik, Field } from 'formik';
import { InviteUserDetailsSchema } from '../../schema/loginSchema';
import { usersPerCompany, inviteUser, InviteUserDetails } from '../../redux/slices/users-slice';
import { getAllCompanies } from '../../redux/slices/transport-slice';
import { RightDrawer } from '../../components/RightDrawer';
import { ReactComponent as PlusIcon } from '../../assets/icons/plus-icon.svg';
import { UsersContent } from './Content';
import { useSelector } from 'react-redux';
import { useDialog } from '../../context/ModalContext';
import { GlobalSort } from '../../components/GlobalSort';

const UsersPage = (props: any) => {
  const matches = useMediaQuery("(max-width:767px)");
  const dispatch = useAppDispatch();
  const totalElements = useSelector((state: RootState) => state?.users?.totalElements);
  const allCompanies = useSelector((state: RootState) => state?.companies?.result);
  const companyId = useSelector((state: RootState) => state?.users?.companyId);
  const [openAdd, setOpenAdd] = React.useState(false);
  const loading = useSelector((state: RootState) => state?.users?.loading);
  const { showDialog } = useDialog();

  const [searchFilters, setSearchFilters] = useState<any>({
    companyId: '',
    pageNo: 0,
    pageSize: 5,
  });

  const initialInviteUserDetails: InviteUserDetails = {
    name: '',
    phone: '',
    email: '',
    companyId: ''
  };

  const [initialCompanysorting] = useState<any>({
    status: 'VERIFIED',
    pageNo: 0,
    pageSize: 0,
  });

  const [invitedUser, setInvitedUser] = React.useState({
    name: '',
    phone: '',
    pin: '',
  });

  const drawerHandler = () => {
    //setOpenAdd(!openAdd);
  };

  const handleSelect = (event: SelectChangeEvent) => {
    setSearchFilters({
      ...searchFilters,
      companyId: event.target.value as string,
    });
  };

  useEffect(() => {
    if (invitedUser.name !== '') {
      setOpenAdd(true);
    };
  }, [invitedUser]);

  useEffect(() => {
    if (searchFilters?.companyId !== '') {
      dispatch(usersPerCompany(searchFilters));
    }
  }, [searchFilters?.companyId, searchFilters.pageNo, searchFilters.pageSize]);

  useEffect(() => {
    dispatch(getAllCompanies(initialCompanysorting));
  }, []);

  return (
    <AppContainer>
      {
        matches ? null
          :
          <Sidebar />
      }
      <MainContainer>
        <Header />
        <Box sx={{ bgcolor: '#fafafa', flex: '1', display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, width: { xs: '100%', md: 'auto' } }}></Box>
          <PageHeader name={'Korisnici'}>
            <Box mt={{ xs: 2, md: 4 }} sx={{ display: { xs: '', md: 'flex' } }}>
              <Select
                onChange={handleSelect}
                value={companyId ? companyId : 'Odaberi Kompaniju'}
                displayEmpty
                sx={{ maxWidth: { xs: 'auto', md: '280px' }, width: { xs: '100%', md: 'auto' }, marginBottom: { xs: '16px', md: 0 } }}
              > 
                <MenuItem disabled key={'0'} value={"Odaberi Kompaniju"}>Odaberi Kompaniju</MenuItem>
                {allCompanies?.map((item: any, i: number) => (
                <MenuItem key={i + 1} value={item.id}>{item.name}</MenuItem>
                 ))}
                
              </Select>
              <Button sx={{ marginLeft: 'auto', width: { xs: '100%', md: 'auto' } }} startIcon={<PlusIcon />} onClick={() => drawerHandler()} variant={'contained'}>
                <Typography sx={{ textAlign: 'center', color: 'white' }}>
                  Dodaj Korisnika
                </Typography>
              </Button>
              <RightDrawer open={openAdd} setOpen={() => drawerHandler()}>
                <Typography sx={{ fontSize: '28px', fontWeight: '800', textAlign: 'center', pt: { xs: 3, md: 0 } }}>
                  Dodaj Korisnika
                </Typography>
                <Box mt={4} height={'100%'} width={'100%'} display={'flex'} flexDirection={'column'}>
                  <Formik
                    validationSchema={InviteUserDetailsSchema}
                    initialValues={initialInviteUserDetails}
                    onSubmit={(values: any, { setSubmitting }) => {
                      setSubmitting(false);
                      dispatch(inviteUser(values));
                      //drawerHandler();
                    }}
                  >
                    {({ submitForm, isSubmitting, errors }) => (
                      <form style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', gap: 10 }} onSubmit={submitForm}>
                        <Grid item md={6}>
                          <InputLabel>Ime i Prezime *</InputLabel>
                          <Field
                            name={'name'}
                            type={'text'}
                            component={TextField}
                            errors={errors.name}
                          />
                        </Grid>
                        <Grid item md={6}>
                          <InputLabel>Telefon *</InputLabel>
                          <Field
                            name={'phone'}
                            type={'text'}
                            component={TextField}
                            errors={errors.phone}
                          />
                        </Grid>
                        <Grid item md={6}>
                          <InputLabel>E-Mail *</InputLabel>
                          <Field
                            name={'email'}
                            type={'text'}
                            component={TextField}
                            errors={errors.email}
                          />
                        </Grid>
                        <Grid item md={6}>
                          <InputLabel>CompanyId *</InputLabel>
                          <Field
                            name={'companyId'}
                            type={'text'}
                            component={TextField}
                          />
                        </Grid>
                        <Button variant='contained' type='submit' fullWidth size={'large'} onClick={submitForm}>
                          Dodaj Korisnika
                        </Button>
                        <Button onClick={() => drawerHandler()} variant='secondary' fullWidth size={'large'}>
                          Zatvori
                        </Button>
                      </form>
                    )}
                  </Formik>
                </Box>
              </RightDrawer>
            </Box>
          </PageHeader>
          <UsersContent
            searchFilters={searchFilters}
            setSearchFilters={setSearchFilters}
          />
          <Box mt={'auto'} px={3}>
            <GlobalSort
              page={searchFilters?.pageNo}
              rowsPerPage={searchFilters?.pageSize}
              setPage={(page: number) => setSearchFilters({ ...searchFilters, pageNo: page })}
              setRowsPerPage={(rowsPerPage: number) => setSearchFilters({ ...searchFilters, pageSize: rowsPerPage })}
              count={totalElements}
              rowsPerPageOptions={[5, 10, 20]}
            />
          </Box>
        </Box>
      </MainContainer>
    </AppContainer>
  );
};


export default UsersPage;
