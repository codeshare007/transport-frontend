import React from 'react';
import AppContainer from '../../components/common/AppContainer';
import Header from '../../components/Header';
import Sidebar from '../../components/common/Sidebar';
import MainContainer from '../../components/common/MainContainer';
import PageHeader from '../../components/PageHeader';
import { Box, Paper, Typography } from '@mui/material';
import { StyledCheckbox } from '../../components/common/micro/Checkbox';


const SettingsPage = () => {
  return (
    <AppContainer>
      <Sidebar />
      <MainContainer>
        <Header />
        <Box sx={{ backgroundColor: '#fafafa', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
          <Box sx={{ padding: '50px 40px', width: '464px', backgroundColor: '#fff' }}>
            <Paper sx={{ backgroundColor: '#fff', }} elevation={0}>
              <Typography sx={{ mb: 3 }} variant={'h2'}>
                Podešavanja
              </Typography>
              <StyledCheckbox isChecked label={'Af heirloom kombucha brooklyn'} />
              <StyledCheckbox isChecked label={'Bushwick schlitz'} />
              <StyledCheckbox isChecked label={'Shaman chia vice deep'} />
              <StyledCheckbox isChecked label={'Gochujang chicharrones cronut'} />
              <StyledCheckbox isChecked label={'Shoreditch sustainable flannel'} />
              <StyledCheckbox checkProps={{ disabled: true }} isChecked={false} label={'Af heirloom kombucha brooklyn'} />
            </Paper>
          </Box>
        </Box>
      </MainContainer>
    </AppContainer>
  );
}


export default SettingsPage;
