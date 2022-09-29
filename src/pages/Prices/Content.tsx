import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../redux/store';
import { approveCompany, deleteCompany } from '../../redux/slices/transport-slice';

import { Box, Typography, styled, Button, Popover, Divider, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { ReactComponent as ErrorIcon } from './icons/cancel.svg';
import { ReactComponent as SuccessIcon } from './icons/check_circle.svg';
import { ReactComponent as SortIcon } from '../Drivers/icons/import_export.svg';

import { MainModal } from '../../components/common/Modal';
import api from '../../api/base';
import { apiv1 } from '../../api/paths';
import { useDialog } from '../../context/ModalContext';


const Container = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '10px',
  width: '100%',
  marginTop: '26px',
}));

const Item = styled(Box)(({ theme }) => ({
  display: 'flex',
  backgroundColor: 'white',
  flexDirection: 'column',
  padding: '33px 24px',
  gap: '12px',
  textTransfrom: 'uppercase',
  h3: {
    fontWeight: '800',
    fontSize: '21px',
    lineHeight: '28px',
    textTransfrom: 'uppercase',
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


export const PriceListContent = (props: any) => {
  const [PriceListType, setPriceListType] = useState([]);
  const { showDialog } = useDialog();


  const getAllPriceLists = async () => {
    try {
      const response = await api.get(apiv1 + 'price-list');
      setPriceListType(response.data);
    }
    catch (error) {
      console.log(error);
    }
  }

  const enablePriceList = async (id: string) => {
    const response = await api.put(apiv1 + `price-list/${id}/admin/enable`)
    response.status !== 200 && showDialog(
      `${response.status}: ${response.statusText}`,
      response.data.message,);
      getAllPriceLists();
  };

  const disablePriceList = async (id: string) => {
    const response = await api.put(apiv1 + `price-list/${id}/admin/disable`)
    response.status !== 200 && showDialog(
      `${response.status}: ${response.statusText}`,
      response.data.message,)
      getAllPriceLists();
  };

  /* const handleSelect = (event: SelectChangeEvent) => {
    setSearchFilters({ ...searchFilters, status: event.target.value as string });
  }; */

  useEffect(() => {
    getAllPriceLists();
  }, [])


  return (
    <Box sx={{ padding: '29px 36px', minHeight: '50vh' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography sx={{ fontSize: '14px', color: 'rgba(153, 153, 153, 1)' }} >
          {`Ukupno ${PriceListType.length} cenovnika`}
        </Typography>
      </Box>
      {PriceListType?.length > 0 ? (<Container>
        {PriceListType.map((item: any, i: number) => {
          return (
            <Item key={item.id}>
              <Typography sx={{ textTransform: 'capitalize' }} variant={'h3'}>{item.id}</Typography>
              {item.enabled && (<Typography color={'#36CB83'} alignItems={'center'} display={'flex'} variant={'subtitle1'}><SuccessIcon /> {'Omogućeno'}</Typography>)}
              {!item.enabled && (<Typography color={'#F1404B'} alignItems={'center'} display={'flex'} variant={'subtitle1'}><ErrorIcon />{'Onemogućeno'}</Typography>)}
              <Box sx={{ display: 'flex', gap: '11px', flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-start' }}>
                <Button
                  onClick={() => enablePriceList(item.id)}
                  sx={{ minWidth: '128px' }}
                  variant={'contained'}
                >
                  Omogući
                </Button>
                <Button
                  onClick={() => disablePriceList(item.id)}
                  sx={{ minWidth: '128px' }}
                  variant={'secondary'}
                >
                  Onemogući
                </Button>
              </Box>
            </Item>
          )
        })}
      </Container>) : (<Typography textAlign={'center'} mt={4} variant={'h3'}>Nema podataka</Typography>)}
    </Box>
  );
};