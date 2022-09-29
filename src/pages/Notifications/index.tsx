import React, { useState, SyntheticEvent, useEffect } from 'react';
import { RootState, useAppDispatch } from '../../redux/store';
import AppContainer from '../../components/common/AppContainer';
import Header from '../../components/Header';
import Sidebar from '../../components/common/Sidebar';
import MainContainer from '../../components/common/MainContainer';
import PageHeader from '../../components/PageHeader';


import { Tabs, Tab, Box, Typography, useMediaQuery } from '@mui/material';
import { TabPanel } from '../../components/common/PageTab';
import { Notification } from '../../components/SingleNotification';
import { useSelector } from 'react-redux';

const NotificationsPage = () => {
  const matches = useMediaQuery("(max-width:767px)");
  const [tab, setTab] = useState<number>(0);
  const notifications = useSelector((store: RootState) => store?.user?.notifications);
  const dispatch = useAppDispatch();

  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  const a11yProps = (index: number) => {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  };
  


  return (
    <AppContainer>
      {
        matches ? null
        :
        <Sidebar />
      }
      <MainContainer>
        <Header />
        <PageHeader name={'Notifikacije'}/>
        <Box sx={{ width: '100%', flex: '1' }}>
          <Box sx={{ padding:{xs:"0", md:'0 35px'}, width:{xs:'100%'}, margin:{xs:'0'}, justifyContent:{xs:'center'} }}>
            <Tabs value={tab} onChange={handleChange}>
              <Tab sx={{ fontSize: '16px' }} label='Sve' {...a11yProps(0)} />
              <Tab sx={{ fontSize: '16px' }} label='Nepročitane' {...a11yProps(1)} />
            </Tabs>
          </Box>
          <TabPanel value={tab} index={0}>
            <Box sx={{
              padding: {xs:"0px", md:'61px'},
              height: '100%',
              backgroundColor: '#fafafa',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '10px'
            }}>
              {notifications?.content?.length > 0 ? notifications?.content?.map((notification: any, i: number) => {
                return <Notification key={i} active={!notification.read} id={notification.id} name={notification.text} cargoId={notification.values.cargoId} companyId={notification.values.companyId} time={notification.timestamp} />
              })
                : <Typography>
                  Trenutno nema novih notifikacija
                </Typography>
              }
            </Box>
          </TabPanel>
          <TabPanel value={tab} index={1}>
            <Box sx={{
              padding: {xs:"0px", md:'61px'},
              height: '100%',
              backgroundColor: '#fafafa',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '10px'
            }}>
              {notifications?.content?.length > 0 ? notifications?.content?.map((notification: any, i: number) => {
                if (!notification.read) return <Notification key={i} id={notification.id} active={!notification.read} companyId={notification.values.companyId} cargoId={notification.values.cargoId} name={notification.text} time={notification.timestamp} />
                return null;
              })
                : <Typography>
                  Trenutno nema novih notifikacija
                </Typography>
              }
            </Box>
          </TabPanel>
        </Box>
      </MainContainer>
    </AppContainer>
  );
}


export default NotificationsPage;
