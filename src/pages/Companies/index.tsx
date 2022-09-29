import React, { useState, useEffect, ChangeEvent } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch, RootState } from '../../redux/store';
import { searchCompanies } from '../../redux/slices/transport-slice';

import AppContainer from '../../components/common/AppContainer';
import MainContainer from '../../components/common/MainContainer';
import Header from '../../components/Header';
import Sidebar from '../../components/common/Sidebar';
import { Box, Button, useMediaQuery } from '@mui/material';
import { DefaultInput } from '../../components/common/micro/forms';
import PageHeader from '../../components/PageHeader';
import { ReactComponent as SearchIcon } from '../../components/Header/icons/search-icon.svg';
import { CompaniesContent } from './Content';
import { GlobalSort } from '../../components/GlobalSort';




const CompaniesPage = () => {
  const matches = useMediaQuery("(max-width:767px)");
  const companyCount = useSelector((state: RootState) => state?.companies?.totalElements);
  const dispatch = useAppDispatch();

  const [searchFilters, setSearchFilters] = useState<any>({
    sortDirection: 'ASC',
    status: 'PENDING',
    pageNo: 0,
    pageSize: 3,
  });

  const inputHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchFilters({
      ...searchFilters,
      [e.target.name]: e.target.value
    });
  };

  const searchHandler = () => {
    dispatch(searchCompanies(searchFilters));
  };

  useEffect(() => {
    dispatch(searchCompanies(searchFilters));
  }, [
    searchFilters.pageNo,
    searchFilters.pageSize,
    searchFilters.status,
    searchFilters.sortDirection,
  ]);

  return (
    <Box>

      {
        matches ? (
          <Box>
            <Header />
            <Box sx={{ bgcolor: '#fafafa', flex: '1', display: 'flex', flexDirection: 'column' }}>
              <PageHeader name={'Kompanije'}>
                <Box sx={{ display: 'flex', gap: '13px', marginTop: '26px' }}>
                  <Box gap={2} display={'flex'} flexWrap={'wrap'} width={'100%'}>
                    <DefaultInput
                      name={'name'}
                      placeholder={'Traži'}
                      value={searchFilters.name}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {inputHandler(e); searchHandler()}}
                      
                      InputProps={{
                        startAdornment: (<SearchIcon />)
                      }}
                    />
                  </Box>
                </Box>
              </PageHeader>
              <CompaniesContent setSearchFilters={setSearchFilters} searchFilters={searchFilters} />
              <Box px={4}>
                <GlobalSort
                  page={searchFilters?.pageNo}
                  rowsPerPage={searchFilters?.pageSize}
                  setPage={(page: number) => setSearchFilters({ ...searchFilters, pageNo: page })}
                  setRowsPerPage={(rowsPerPage: number) => setSearchFilters({ ...searchFilters, pageSize: rowsPerPage })}
                  count={companyCount}
                  rowsPerPageOptions={[3, 6, 9]}
                />
              </Box>
            </Box>
          </Box>
        )
        :
        (<AppContainer>
          <Sidebar />
          <MainContainer>
            <Header />
            <Box sx={{ bgcolor: '#fafafa', flex: '1', display: 'flex', flexDirection: 'column' }}>
              <PageHeader name={'Kompanije'}>
                <Box sx={{ display: 'flex', gap: '13px', marginTop: '26px' }}>
                  <Box gap={2} display={'flex'} flexWrap={'wrap'} width={'100%'}>
                    <DefaultInput
                      name={'name'}
                      placeholder={'Traži'}
                      value={searchFilters.name}
                      onChange={inputHandler}
                      sx={{ flex: '0 1 280px' }}
                      InputProps={{
                        startAdornment: (<SearchIcon />)
                      }}
                    />
                    <Button onClick={() => searchHandler()} variant='contained'>
                      Traži
                    </Button>
                  </Box>
                </Box>
              </PageHeader>
              <CompaniesContent setSearchFilters={setSearchFilters} searchFilters={searchFilters} />
              <Box px={4}>
                <GlobalSort
                  page={searchFilters?.pageNo}
                  rowsPerPage={searchFilters?.pageSize}
                  setPage={(page: number) => setSearchFilters({ ...searchFilters, pageNo: page })}
                  setRowsPerPage={(rowsPerPage: number) => setSearchFilters({ ...searchFilters, pageSize: rowsPerPage })}
                  count={companyCount}
                  rowsPerPageOptions={[3, 6, 9]}
                />
              </Box>
            </Box>
          </MainContainer>
        </AppContainer>)
      }

    </Box>
    
  );
};

export default CompaniesPage;
