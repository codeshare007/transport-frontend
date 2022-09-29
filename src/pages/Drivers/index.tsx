import React, { useState, useEffect, ChangeEvent } from 'react';
import AppContainer from '../../components/common/AppContainer';
import MainContainer from '../../components/common/MainContainer';
import Header from '../../components/Header';
import Sidebar from '../../components/common/Sidebar';
import { DefaultInput } from '../../components/common/micro/forms'
import { Box, Button, Typography, InputLabel, useMediaQuery } from '@mui/material';
import PageHeader from '../../components/PageHeader';
import { RightDrawer } from '../../components/RightDrawer';
import { Formik, Field } from 'formik';
import { TextField } from 'formik-mui';
import { ReactComponent as PlusIcon } from '../../assets/icons/plus-icon.svg';
import { ReactComponent as SearchIcon } from '../../assets/icons/search.svg';

import { useAppDispatch, RootState } from '../../redux/store';
import { AxiosResponse } from 'axios';
import api from '../../api/base';
import { apiv1 } from '../../api/paths';
import { driversAll, addDriver, removeDriver } from '../../redux/slices/driver-slice';
import { DriversContent } from './Content';
import { useSnackBar } from '../../context/SnackContext';
import { useDialog } from '../../context/ModalContext';
import { GlobalSort } from '../../components/GlobalSort';

import { AddDriverSchema } from '../../schema/loginSchema';
import { useSelector } from 'react-redux';

export const DriversPage = (props: any) => {
  const matches = useMediaQuery("(max-width:767px)");
  const totalElements = useSelector((state: RootState) => state?.drivers?.totalElements);
  const loading = useSelector((state: RootState) => state?.drivers?.loading);
  const userCompanyRole = useSelector((state: RootState) => state?.user?.user?.companyRoles);
  const [openAdd, setOpenAdd] = React.useState(false);
  const dispatch = useAppDispatch();
  const { showSnackBar } = useSnackBar();
  const { showDialog } = useDialog();


  const [searchFilters, setSearchFilters] = useState<any>({
    direction: 'ASC',
    sortBy: null,
    pageNo: 0,
    pageSize: 5,
  });

  const [filterParams, setFilterParams] = useState({
    nameFilter: '',
  });
  const [editDriver, setEditDriver] = React.useState({
    name: '',
    phone: '',
    pin: '',
  });

  const drawerHandler = () => {
    setEditDriver({
      name: '',
      phone: '',
      pin: '',
    })
    setOpenAdd(!openAdd);
  };

  const removeHandler = (id: string) => {
    api.delete(apiv1 + `drivers/${id}`)
      .then((res: AxiosResponse) => {
        if (res.status === 200) {
          dispatch(removeDriver({ id }));
          showSnackBar('Uspešno obrisan vozač', 'error');
        };
      })
      .catch((err) => {
        const { response } = err;
        showDialog(
          `${response.status}: ${response.statusText}`,
          response.data.message,
        );
      })
  };

  const searchHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setFilterParams({
      ...filterParams,
      nameFilter: e.target.value,
    });
  };

  const runSearch = () => {
    if (filterParams.nameFilter.length > 0) {
      dispatch(driversAll({
        ...searchFilters,
        nameFilter: filterParams.nameFilter,
      }));
    } else {
      dispatch(driversAll({
        ...searchFilters,
        nameFilter: null,
      }));
    }
  }

  useEffect(() => {
    if (editDriver.name !== '') {
      setOpenAdd(true);
    };
  }, [editDriver]);

  useEffect(() => {
    if (userCompanyRole?.length > 0 && (userCompanyRole?.includes('TRANSPORT') || userCompanyRole?.includes('OWNER'))) {
      dispatch(driversAll(searchFilters));
    }
    if (loading === 'success' && userCompanyRole?.length === 0) {
      showDialog(
        'Nemate pravo pristupa',
        'Morate biti administrator ili vozač u kompaniji da biste pristupili ovom delu',
      )
    }
  }, [
    searchFilters.pageNo,
    searchFilters.pageSize,
    searchFilters.sortBy,
    searchFilters.direction,
    userCompanyRole,
  ]);

  return (
    <AppContainer>
      {
        matches ? null
        :
        <Sidebar />
      }
      <MainContainer>
        <Header />
        <Box sx={{ bgcolor: '#fafafa', flex: '1', display: 'flex' , flexDirection:'column' }}>
          <Box sx={{display:'flex', flexDirection: {xs:'column', md:'row'}, width:{xs:'100%', md:'auto'}}}></Box>
          <PageHeader name={'Vozači Kamiona'}>
            <Box mt={{xs: 2, md:4}} sx={{ display: {xs:'', md:'flex'} }}>
              {
                matches ? (             
                  <DefaultInput
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {searchHandler(e); runSearch()}}
                  placeholder={'Traži...'}
                  value={filterParams.nameFilter}
                  sx={{ maxWidth: {xs: 'auto', md:'280px'}, width: {xs: '100%', md: 'auto'}, paddingBottom: {xs: '16px', md: 0} }}
                  InputProps={{
                    startAdornment: (<SearchIcon />)
                  }}
                />)
                : (              <DefaultInput
                  onChange={searchHandler}
                  placeholder={'Traži...'}
                  value={filterParams.nameFilter}
                  sx={{ maxWidth: {xs: 'auto', md:'280px'}, width: {xs: '100%', md: 'auto'}, paddingBottom: {xs: '16px', md: 0} }}
                  InputProps={{
                    startAdornment: (<SearchIcon />)
                  }}
                />)
              }
              {
                matches ? null
                :
                <Button onClick={() => runSearch()} sx={{ fontSize: '14px', ml: 2 }} variant='contained'>
                  Traži
                </Button>
              }
              <Button sx={{ marginLeft: 'auto', width: {xs: '100%', md: 'auto'} }} startIcon={<PlusIcon />} onClick={() => drawerHandler()} variant={'contained'}>
                Dodaj Vozača
              </Button>
              <RightDrawer open={openAdd} setOpen={() => drawerHandler()}>
                <Typography sx={{ fontSize: '28px', fontWeight: '800', textAlign: 'center', pt: {xs: 3, md: 0} }}>
                  {editDriver.name !== '' ? 'Izmeni vozača' : 'Dodaj vozača'}
                </Typography>
                <Box mt={4} height={'100%'} width={'100%'} display={'flex'} flexDirection={'column'}>
                  <Formik
                    validationSchema={AddDriverSchema}
                    initialValues={editDriver}
                    onSubmit={(values: any, { setSubmitting }) => {
                      setSubmitting(false);
                      dispatch(addDriver(values));
                      drawerHandler();
                    }}
                  >
                    {({ submitForm, isSubmitting }) => (
                      <form style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', gap: 10 }} onSubmit={submitForm}>
                        <InputLabel>Ime i Prezime *</InputLabel>
                        <Field
                          name={'name'}
                          type={'text'}
                          component={TextField}
                        />
                        <Box mb={{xs: 2, md:'auto'}} gap={3} gridTemplateColumns={{xs: '1fr', md:'1fr 1fr'}} display={'grid'}>
                          <span>
                            <InputLabel sx={{ mt: 2 }}>Pin *</InputLabel>
                            <Field
                              name={'pin'}
                              type={'number'}
                              component={TextField}
                            />
                          </span>
                          <span>
                            <InputLabel sx={{ mt: 2 }}>Telefon *</InputLabel>
                            <Field
                              name='phone'
                              type={'phone'}
                              component={TextField}
                            />
                          </span>
                        </Box>
                        <Button variant='contained' fullWidth size={'large'} onClick={submitForm}>
                          {editDriver.name !== '' ? 'Izmeni Vozača' : 'Dodaj Vozača'}
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
          <DriversContent
            searchFilters={searchFilters}
            setSearchFilters={setSearchFilters}
            removeHandler={removeHandler}
            setEditDriver={setEditDriver}
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

export default DriversPage;
