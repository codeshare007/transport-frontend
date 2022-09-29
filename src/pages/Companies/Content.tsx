import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../redux/store';
import { approveCompany, deleteCompany } from '../../redux/slices/transport-slice';

import { Box, Typography, styled, Button, Popover, Divider, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { ReactComponent as ErrorIcon } from './icons/error.svg';
import { ReactComponent as SortIcon } from '../Drivers/icons/import_export.svg';
import { ReactComponent as DownloadIcon } from './icons/download.svg';

import { MainModal } from '../../components/common/Modal';
import api from '../../api/base';
import { apiv1 } from '../../api/paths';
import { useDialog } from '../../context/ModalContext';
import { AxiosResponse } from 'axios';
import { useNavigate } from 'react-router-dom';




const Container = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '10px',
  width: '100%',
  marginTop: '26px',
  [theme.breakpoints.down('md')]: {
    padding: '0px 0px',
    gridTemplateColumns: '1fr',
  },
}));

const Item = styled(Box)(({ theme }) => ({
  display: 'flex',
  backgroundColor: 'white',
  flexDirection: 'column',
  padding: '33px 24px',
  gap: '26px',
  h3: {
    fontWeight: '800',
    fontSize: '21px',
    lineHeight: '28px',
  },
  svg: {
    marginRight: '10px'
  }
}));

const StyledProps = styled(Box)(() => ({
  display: 'flex',
  gap: '25px',
  flexDirection: 'column',
  span: {
    display: 'inline-block',
    fontSize: '16px',
    '&:first-of-type': {
      width: '160px',
    },
    '&:last-of-type': {
      fontWeight: '700',
    }
  }
}));

const ModalContent = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  h3: {
    alignSelf: 'center',
    marginTop: '38px',
    fontWeight: '800',
    fontSize: '21px',
    lineHeight: '28px',
    marginBottom: '18px',
  },
}));


export const CompaniesContent = (props: any) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const companies = useSelector((store: RootState) => store?.companies?.result);
  const totalElements = useSelector((store: RootState) => store?.companies?.totalElements);
  const userRole = useSelector((store: RootState) => store?.user?.user?.role);
  const { showDialog } = useDialog();
  const { searchFilters, setSearchFilters } = props;

  const [removeModal, setRemoveModal] = useState<{ id: string; open: boolean }>({
    id: '',
    open: false,
  });
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const approve = async (id: string) => {
    const response = await api.put(apiv1 + `companies/${id}/approve`)
    response.status === 200 && dispatch(approveCompany(id));
    response.status !== 200 && showDialog(
      `${response.status}: ${response.statusText}`,
      response.data.message)
  };

  const deleteComp = async (id: string) => {
    const response = await api.put(apiv1 + `companies/${id}/decline`)
    if (response.status === 200) {
      dispatch(deleteCompany(id));
      setRemoveModal({ id: '', open: false });
    }
    response.status !== 200 && showDialog(
      `${response.status}: ${response.statusText}`,
      response.data.message)
  };

  const handleSelect = (event: SelectChangeEvent) => {
    setSearchFilters({ ...searchFilters, status: event.target.value as string });
  };

  return (
    <Box sx={{ padding: '29px 36px', minHeight: '50vh' }}>
      <MainModal otherProps={{ PaperProps: { sx: { width: '444px', padding: '30px' } } }} onClose={() => setRemoveModal({ id: '', open: false })} open={removeModal.open} title={''}>
        <ModalContent>
          <Box sx={{ padding: '35px', backgroundColor: '#FBF8DD', borderRadius: '50%', alignSelf: 'center' }}>
            <ErrorIcon />
          </Box>
          <Typography variant={'h3'}>
            Ukloni Prevoznika?
          </Typography>
          <Typography sx={{ maxWidth: '320px', margin: 'auto', textAlign: 'center' }} variant={'body1'}>
            Da li ste sigurni da hocete da uklonite prevoznika sa liste?
          </Typography>
          <Button onClick={() => deleteComp(removeModal.id)} sx={{ marginBottom: '10px', marginTop: '35px' }} variant={'contained'}>
            Da, Ukloni!
          </Button>
          <Button onClick={() => setRemoveModal({
            id: '',
            open: false,
          })} variant={'secondary'}>
            Zatvori
          </Button>
        </ModalContent>
      </MainModal>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography sx={{ fontSize: '14px', color: 'rgba(153, 153, 153, 1)' }} >
          {`Ukupno ${totalElements} prevoznika`}
        </Typography>
        <Box display={'flex'} gap={'10px'}>
          {searchFilters.status && (
            <Select sx={{ backgroundColor: '#fff' }} onChange={handleSelect} value={searchFilters?.status}>
              <MenuItem value={'PENDING'}>
                Na čekanju
              </MenuItem>
              <MenuItem value={'VERIFIED'}>
                Verifikovani
              </MenuItem>
              <MenuItem value={'DECLINED'}>
                Odbijeni
              </MenuItem>
            </Select>
          )}
          <Popover
            id={'sorting'}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            elevation={0}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
          >
            <Box sx={{ border: '1px solid #E7E7E7', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.05)' }} display={'flex'} gap={'0px'} mb={'5px'} minWidth={'177px'} flexDirection={'column'}>
              <Button
                sx={{ color: 'text.primary', justifyContent: 'flex-start' }}
                onClick={() => setSearchFilters({ ...searchFilters, sortDirection: 'ASC' })}
                variant='text'
                size={'large'}
              >
                Uzlazno
              </Button>
              <Divider />
              <Button
                sx={{ color: 'text.primary', justifyContent: 'flex-start' }}
                onClick={() => setSearchFilters({ ...searchFilters, sortDirection: 'DESC' })}
                variant='text'
                size={'large'}
              >
                Silazno
              </Button>
            </Box>
          </Popover>
          <Button onClick={handleClick} aria-describedby={'sort'} startIcon={<SortIcon />} variant={'secondary'}>
            Sortiranje
          </Button>
        </Box>
      </Box>
      {companies?.length > 0 ? (<Container>
        {companies.map((item: any, i: number) => {
          return (
            <Item key={item.id}>
              <Typography variant={'h3'}>{item.name}</Typography>
              <StyledProps>
                <Typography variant={'body1'}>
                  <span>Adresa:</span><span>{item.addressDetails.address || 'Nepoznato'}</span>
                </Typography>
                <Typography variant={'body1'}>
                  <span>Grad:</span><span>{item.addressDetails.city || 'Nepoznato'}</span>
                </Typography>
                <Typography variant={'body1'}>
                  <span>Država:</span><span>{item.addressDetails.country || 'Nepoznato'}</span>
                </Typography>
                <Typography variant={'body1'}>
                  <span>Matični Broj:</span><span>{item.registrationNumber || 'Nepoznato'}</span>
                </Typography>
                <Typography variant={'body1'}>
                  <span>PIB:</span><span>{item.taxpayerRegisterNumber || 'Nepoznato'}</span>
                </Typography>
                <Typography variant={'body1'}>
                  <span>Telefon:</span><span>{item.phoneNumber || 'Nepoznato'}</span>
                </Typography>
                <Typography variant={'body1'}>
                  <span>Fax:</span><span>{item.faxNumber || 'Nepoznato'}</span>
                </Typography>
                <Typography variant={'body1'}>
                  <span>E-Mail:</span><span>{item.email || 'Nepoznato'}</span>
                </Typography>
                <Typography variant={'body1'}>
                  <span>Website:</span><span>{item.website || 'Nepoznato'}</span>
                </Typography>
              </StyledProps>
              <Box sx={{ display: 'flex', gap: '16px', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                <Button variant={'text'} startIcon={<DownloadIcon />}>Rešenje iz APR-a</Button>
                <Button variant={'text'} startIcon={<DownloadIcon />}>Potvrda o Izvršenoj Registraciji</Button>
                <Button variant={'text'} startIcon={<DownloadIcon />}>Izvod iz PDV-a</Button>
              </Box>
              <Box sx={{ display: 'flex', gap: '11px', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                {searchFilters.status !== 'VERIFIED' && (
                  <Button onClick={() => approve(item.id)} sx={{ minWidth: '128px' }} variant={'contained'}>Odobri</Button>
                )}
                {userRole === 'ADMINISTRATOR' && (
                  <Button
                    onClick={() => setRemoveModal({
                      id: item.id,
                      open: true,
                    })}
                    sx={{ minWidth: '128px' }} variant={'secondary'}>
                    Ukloni
                  </Button>
                )}
               {/*
        
          <Button onClick={async () => await navigate('/korisnici', {
          state: {
            id: item.id,
            name: item.name
          }
        })} variant={'contained'}>Korisnici</Button>
      */}
              </Box>
            </Item>
          )
        })}
      </Container>) : (<Typography textAlign={'center'} mt={4} variant={'h3'}>Nema podataka</Typography>)}
    </Box>
  );
};