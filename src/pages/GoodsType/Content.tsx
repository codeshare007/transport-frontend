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


export const TransportsContent = (props: any) => {
  const [goodsType, setGoodsType] = useState([]);
  const { showDialog } = useDialog();


  const getAllGoods = async () => {
    try {
      const response = await api.get(apiv1 + 'goods-type');
      setGoodsType(response.data);
    }
    catch (error) {
      console.log(error);
    }
  }

  const enableGoods = async (id: string) => {
    const response = await api.put(apiv1 + `goods-type/${id}/enable`)
    response.status !== 200 && showDialog(
      `${response.status}: ${response.statusText}`,
      response.data.message,);
    getAllGoods();
  };

  const disableGoods = async (id: string) => {
    const response = await api.put(apiv1 + `goods-type/${id}/disable`)
    response.status !== 200 && showDialog(
      `${response.status}: ${response.statusText}`,
      response.data.message,)
    getAllGoods();
  };

  /* const handleSelect = (event: SelectChangeEvent) => {
    setSearchFilters({ ...searchFilters, status: event.target.value as string });
  }; */

  useEffect(() => {
    getAllGoods();
  }, [])


  return (
    <Box sx={{ padding: {xs:'0 5px', md:'29px 36px'}, minHeight: '50vh' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography sx={{ fontSize: '14px', color: 'rgba(153, 153, 153, 1)', paddingLeft: {xs: '10px', md: ''} }} >
          {`Ukupno ${goodsType.length} tipova tereta`}
        </Typography>
        {/* <Box display={'flex'} gap={'10px'}>
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
        </Box> */}
      </Box>
      {goodsType?.length > 0 ? (<Container>
        {goodsType.map((item: any, i: number) => {
          return (
            <Item key={item.id}>
              <Typography sx={{ textTransform: 'capitalize' }} variant={'h3'}>{item.name}</Typography>
              {item.available && (<Typography color={'#36CB83'} alignItems={'center'} display={'flex'} variant={'subtitle1'}><SuccessIcon /> {'Omogućeno'}</Typography>)}
              {!item.available && (<Typography color={'#F1404B'} alignItems={'center'} display={'flex'} variant={'subtitle1'}><ErrorIcon />{'Onemogućeno'}</Typography>)}
              <Box sx={{ display: 'flex', gap: '11px', flexDirection: 'row', justifyContent: {xs: 'flex-start', md:'center'}, alignItems: 'flex-start' }} >
                <Button
                  onClick={() => enableGoods(item.id)}
                  sx={{ minWidth: '128px' }}
                  variant={'contained'}
                >
                  Omogući
                </Button>
                <Button
                  onClick={() => disableGoods(item.id)}
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