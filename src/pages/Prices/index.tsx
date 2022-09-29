import React, { useState, useEffect, ChangeEvent } from 'react';
import api from '../../api/base';
import { apiv1 } from '../../api/paths';
import { useDialog } from '../../context/ModalContext';
import AppContainer from '../../components/common/AppContainer';
import MainContainer from '../../components/common/MainContainer';
import Header from '../../components/Header';
import Sidebar from '../../components/common/Sidebar';
import { Box, Button, Dialog, DialogContent, DialogTitle, TextField, DialogActions, InputLabel, useMediaQuery } from '@mui/material';
import PageHeader from '../../components/PageHeader';
import { PriceListContent } from './Content';




const Prices = () => {
  const matches = useMediaQuery("(max-width:767px)");
  const [openDialog, setOpenDialog] = useState(false);
  const [goodName, setGoodName] = useState<string>('');
  const { showDialog } = useDialog();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGoodName(event.target.value);
  };


  const handleAddNew = async () => {
    try {
      const response = await api.post(apiv1 + 'goods-type', { name: goodName });
      response.status !== 200 && showDialog(
        `${response.status}: ${response.statusText}`,
        response.data.message,);
    }
    catch (error) {
      console.log(error);
    }
  }
  
  return (
    <Box>
    {matches ? (
      <Box>
        <Dialog maxWidth={'sm'} fullWidth  open={openDialog} onClose={() => {setOpenDialog(false); setGoodName('')}}>
          <DialogTitle>
            Dodaj novu vrstu tereta
          </DialogTitle>
          <DialogContent>
            <InputLabel>
              Naziv vrste tereta
            </InputLabel>
            <TextField name={'goodName'} value={goodName} onChange={handleChange} />
          </DialogContent>
          <DialogActions>
            <Button variant={'secondary'} onClick={() => setOpenDialog(false)}>Otkaži</Button>
            <Button variant={'contained'} onClick={handleAddNew}>Dodaj</Button>
          </DialogActions>
        </Dialog>
        <MainContainer>
          <Header />
          <Box sx={{ bgcolor: '#fafafa', flex: '1', display: 'flex', flexDirection: 'column' }}>
            <PageHeader name={'Cenovnik'}>
              {/*<Box sx={{ display: 'flex', gap: '13px', marginTop: '26px', alignItems: 'center', justifyContent: 'flex-end' }}>
                <Button onClick={() => setOpenDialog(true)} variant='contained'>
                  Dodaj novi teret
                </Button>
              </Box>*/}
            </PageHeader>
            <PriceListContent />
            {/* <Box px={4}>
              <GlobalSort
                page={searchFilters?.pageNo}
                rowsPerPage={searchFilters?.pageSize}
                setPage={(page: number) => setSearchFilters({ ...searchFilters, pageNo: page })}
                setRowsPerPage={(rowsPerPage: number) => setSearchFilters({ ...searchFilters, pageSize: rowsPerPage })}
                count={companyCount}
                rowsPerPageOptions={[3, 6, 9]}
              />
            </Box> */}
          </Box>
        </MainContainer>
      </Box>
    )
      :
      (<AppContainer>
        <Dialog maxWidth={'sm'} fullWidth  open={openDialog} onClose={() => {setOpenDialog(false); setGoodName('')}}>
          <DialogTitle>
            Dodaj novu vrstu tereta
          </DialogTitle>
          <DialogContent>
            <InputLabel>
              Naziv vrste tereta
            </InputLabel>
            <TextField name={'goodName'} value={goodName} onChange={handleChange} />
          </DialogContent>
          <DialogActions>
            <Button variant={'secondary'} onClick={() => setOpenDialog(false)}>Otkaži</Button>
            <Button variant={'contained'} onClick={handleAddNew}>Dodaj</Button>
          </DialogActions>
        </Dialog>
        <Sidebar />
        <MainContainer>
          <Header />
          <Box sx={{ bgcolor: '#fafafa', flex: '1', display: 'flex', flexDirection: 'column' }}>
            <PageHeader name={'Cenovnik'}>
              {/*<Box sx={{ display: 'flex', gap: '13px', marginTop: '26px', alignItems: 'center', justifyContent: 'flex-end' }}>
                <Button onClick={() => setOpenDialog(true)} variant='contained'>
                  Dodaj novi teret
                </Button>
              </Box>*/}
            </PageHeader>
            <PriceListContent />
          </Box>
        </MainContainer>
      </AppContainer>)
    }
    </Box>


    
  );
};

export default Prices;
