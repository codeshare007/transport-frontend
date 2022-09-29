import React, { SyntheticEvent, useState, useEffect } from 'react';
import api from '../../api/base';
import { apiv1 } from '../../api/paths';
import { useSelector } from 'react-redux';
import { useAppDispatch, RootState } from '../../redux/store';
import { getCargo, adminGetCargo } from '../../redux/slices/cargo-slice';
import { getVehicleBody, getVehicleType, getGoodsType } from '../../redux/slices/vehicle-slice';
import { userNotifications, userData } from '../../redux/slices/user-slice';
import { CustomDrawer } from './Drawer';
import AppContainer from '../../components/common/AppContainer';
import MainContainer from '../../components/common/MainContainer';
import Header from '../../components/Header';
import Sidebar from '../../components/common/Sidebar';
import { Box, Button, Tab, Tabs, MenuItem, SelectChangeEvent, useMediaQuery } from '@mui/material';
import { TabPanel } from '../../components/common/PageTab';
import { ReactComponent as SearchIcon } from '../../components/Header/icons/search-icon.svg';
import { ReactComponent as RightArrow } from './icons/right-arrow.svg';
import PageHeader from '../../components/PageHeader';
import { DriversContent } from './Content';
import { DefaultInput, SelectWrapper } from '../../components/common/micro/forms';
import { useLocation } from 'react-router-dom';




export const LoadsPage = () => {
  const allVehicles = useSelector(
    (state: RootState) => state?.vehicles?.vehicleType
  );
  const userRole = useSelector(
    (state: RootState) => state?.user?.user?.companyRoles[0]
  );
  const globalRole = useSelector((state: RootState) => state?.user?.user?.role);

  const matches = useMediaQuery("(max-width:767px)");

  const [tab, setTab] = useState<number>(0);
  const { state }: any = useLocation();

  const [assignDriver, setAssignDriver] = useState(null);
  const [assignVehicle, setAssignVehicle] = useState(false);

  const dispatch = useAppDispatch();

  const [vehicleType, setVehicleType] = React.useState("");

  const handleVehicleType = (event: SelectChangeEvent) => {
    setVehicleType(event.target.value);
  };

  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  const a11yProps = (index: number) => {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  };

  const closeVehicle = () => {
    setAssignVehicle(false);
  }

  const fetchNotificationData = async () => {
    const response =  await api.get(`${apiv1}cargo/${state?.id}/`);
    setAssignDriver(response.data);
  }

  useEffect(() => {
    if (state?.id) {
      fetchNotificationData();
    }
  }, []);

  useEffect(() => {
    if (assignDriver === null) {
      window.history.replaceState({}, document.title)
    }
  }, [assignDriver]);



  useEffect(() => {
    dispatch(getVehicleBody());
    dispatch(getVehicleType());
    dispatch(getGoodsType());
  }, [userRole]);

  const atoRole =
    globalRole === "ADMINISTRATOR" ||
    userRole?.includes("TRADING") ||
    userRole?.includes("OWNER");
  return (
    <Box>
      {
        matches ? (
      <MainContainer>
        <CustomDrawer
          isOpen={assignDriver !== null && true}
          close={() => setAssignDriver(null)}
          data={assignDriver}
        />
        <Header />
        <PageHeader name={"Sve Objave"} />
        <Box sx={{ width: "100%", flex: "1" }}>
          <Box
            sx={{
              display: "flex",
              gap: "10px",
              flexWrap: "wrap"
            }}
          >
            <DefaultInput
              sx={{ padding: '0 18px 0 18px' }}
              icon={<SearchIcon />}
              placeholder={"Lokacija utovara"}
              InputProps={{
                startAdornment: <SearchIcon />,
              }}
            />
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flex: "0 0 30px",
                paddingLeft: '18px'
              }}
            >
              <RightArrow />
            </Box>
            <DefaultInput
              sx={{ flex: "0 0 84%" }}
              icon={<SearchIcon />}
              placeholder={"Lokacija Istovara"}
              InputProps={{
                startAdornment: <SearchIcon />,
              }}
            />
            
          </Box>
          <Box sx={{ padding: "0 10px", width: '100%' }} mt={1}>
            <Tabs value={tab} onChange={handleChange} variant="scrollable" scrollButtons="auto" >
              {atoRole && (
                <Tab
                  sx={{ fontSize: "16px", fontWeight: 'bold' }}
                  label="Spremno"
                  {...a11yProps(0)}
                />
              )}
              <Tab
                sx={{ fontSize: "16px", fontWeight: 'bold' }}
                label="Objavljene"
                {...a11yProps(atoRole ? 1 : 0)}
              />
              <Tab
                sx={{ fontSize: "16px", fontWeight: 'bold' }}
                label="Prihvaćene"
                {...a11yProps(atoRole ? 2 : 1)}
              />
              <Tab
                sx={{ fontSize: "16px", fontWeight: 'bold' }}
                label="U Toku"
                {...a11yProps(atoRole ? 3 : 2)}
              />
              <Tab
                sx={{ fontSize: "16px", fontWeight: 'bold' }}
                label="Zatvorene"
                {...a11yProps(atoRole ? 4 : 3)}
              />
              {!userRole?.includes("TRANSPORT") && (
                <Tab
                  sx={{ fontSize: "16px", fontWeight: 'bold' }}
                  label="Istekle"
                  {...a11yProps(atoRole ? 5 : 4)}
                />
              )}
            </Tabs>
          </Box>
          {atoRole && (
            <TabPanel value={tab} index={0}>
              <Box
                sx={{
                  padding: "30px 15px 0 15px",
                  height: "calc(100vh - 280px)",
                  backgroundColor: "#fafafa",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <DriversContent
                  status={"PENDING"}
                  title={"Spremno"}
                  setAssignDriver={setAssignDriver}
                />
              </Box>
            </TabPanel>
          )}
          <TabPanel value={tab} index={atoRole ? 1 : 0}>
            <Box
              sx={{
                padding: "30px 15px 0 15px",
                height: "calc(100vh - 280px)",
                backgroundColor: "#fafafa",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <DriversContent
                status={"PUBLISHED"}
                title={"Objavljene"}
                setAssignDriver={setAssignDriver}
              />
            </Box>
          </TabPanel>
          <TabPanel value={tab} index={atoRole ? 2 : 1}>
            <Box
              sx={{
                padding: "30px 15px 0 15px",
                height: "calc(100vh - 280px)",
                backgroundColor: "#fafafa",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <DriversContent
                status={"ACCEPTED"}
                title={"Prihvaćene"}
                setAssignDriver={setAssignDriver}
              />
            </Box>
          </TabPanel>
          <TabPanel value={tab} index={atoRole ? 3 : 2}>
            <Box
              sx={{
                padding: "30px 15px 0 15px",
                height: "calc(100vh - 280px)",
                backgroundColor: "#fafafa",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <DriversContent
                status={
                  globalRole === "ADMINISTRATOR" ? "IN_PROGRESS" : "INPROGRESS"
                }
                title={"U Toku"}
                setAssignDriver={setAssignDriver}
              />
            </Box>
          </TabPanel>
          <TabPanel value={tab} index={atoRole ? 4 : 3}>
            <Box
              sx={{
                padding: "30px 15px 0 15px",
                height: "calc(100vh - 280px)",
                backgroundColor: "#fafafa",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <DriversContent
                status={"CLOSED"}
                title={"Zatvorene"}
                setAssignDriver={setAssignDriver}
              />
            </Box>
          </TabPanel>
          {!userRole?.includes("TRANSPORT") && (
            <TabPanel value={tab} index={atoRole ? 5 : 4}>
              <Box
                sx={{
                  padding: "30px 15px 0 15px",
                  height: "calc(100vh - 280px)",
                  backgroundColor: "#fafafa",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <DriversContent
                  status={"EXPIRED"}
                  title={"Istekle"}
                  setAssignDriver={setAssignDriver}
                />
              </Box>
            </TabPanel>
          )}
        </Box>
      </MainContainer>
        )
        :
        (
          <AppContainer>
          <Sidebar />
      <MainContainer>
        <CustomDrawer
          isOpen={assignDriver !== null && true}
          close={() => setAssignDriver(null)}
          data={assignDriver}
        />
        <Header />
        <PageHeader name={"Objave"} />
        <Box sx={{ width: "100%", flex: "1" }}>
          <Box
            sx={{
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
              padding: "0 35px",
            }}
          >
            <DefaultInput
              sx={{ flex: "0 0 280px" }}
              icon={<SearchIcon />}
              placeholder={"Lokacija utovara"}
              InputProps={{
                startAdornment: <SearchIcon />,
              }}
            />
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flex: "0 0 30px",
              }}
            >
              <RightArrow />
            </Box>
            <DefaultInput
              sx={{ flex: "0 0 280px" }}
              icon={<SearchIcon />}
              placeholder={"Lokacija Istovara"}
              InputProps={{
                startAdornment: <SearchIcon />,
              }}
            />
            <Button variant={"contained"}>Traži</Button>
            <Box ml={"auto"} mr={"15px"} display={"flex"}>
              <SelectWrapper
                value={vehicleType}
                displayEmpty
                onChange={handleVehicleType}
                sx={{
                  borderRadius: "4px 0px 0px 4px",
                  borderRight: "none",
                }}
              >
                <MenuItem disabled value={""}>
                  Svi Tipovi
                </MenuItem>
                {allVehicles?.map((item: any) => (
                  <MenuItem
                    key={item.id}
                    value={item.id}
                    disabled={!item.available}
                  >
                    {item.name}
                  </MenuItem>
                ))}
              </SelectWrapper>
              <DefaultInput
                sx={{ flex: "0 0 280px", mr: "10px" }}
                icon={<SearchIcon />}
                placeholder={"Traži vozilo"}
                InputProps={{
                  sx: {
                    borderRadius: "0px 4px 4px 0px",
                  },
                  startAdornment: <SearchIcon />,
                }}
              />
              <Button variant={"contained"}>Traži</Button>
            </Box>
          </Box>
          <Box sx={{ padding: "0 35px" }} mt={3}>
            <Tabs value={tab} onChange={handleChange}>
              {atoRole && (
                <Tab
                  sx={{ fontSize: "16px" }}
                  label="Spremno"
                  {...a11yProps(0)}
                />
              )}
              <Tab
                sx={{ fontSize: "16px" }}
                label="Objavljene"
                {...a11yProps(atoRole ? 1 : 0)}
              />
              <Tab
                sx={{ fontSize: "16px" }}
                label="Prihvaćene"
                {...a11yProps(atoRole ? 2 : 1)}
              />
              <Tab
                sx={{ fontSize: "16px" }}
                label="U Toku"
                {...a11yProps(atoRole ? 3 : 2)}
              />
              <Tab
                sx={{ fontSize: "16px" }}
                label="Zatvorene"
                {...a11yProps(atoRole ? 4 : 3)}
              />
              {!userRole?.includes("TRANSPORT") && (
                <Tab
                  sx={{ fontSize: "16px" }}
                  label="Istekle"
                  {...a11yProps(atoRole ? 5 : 4)}
                />
              )}
            </Tabs>
          </Box>
          {atoRole && (
            <TabPanel value={tab} index={0}>
              <Box
                sx={{
                  padding: "30px 15px 0 15px",
                  height: "calc(100vh - 280px)",
                  backgroundColor: "#fafafa",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <DriversContent
                  status={"PENDING"}
                  title={"Spremno"}
                  setAssignDriver={setAssignDriver}
                />
              </Box>
            </TabPanel>
          )}
          <TabPanel value={tab} index={atoRole ? 1 : 0}>
            <Box
              sx={{
                padding: "30px 15px 0 15px",
                height: "calc(100vh - 280px)",
                backgroundColor: "#fafafa",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <DriversContent
                status={"PUBLISHED"}
                title={"Objavljene"}
                setAssignDriver={setAssignDriver}
              />
            </Box>
          </TabPanel>
          <TabPanel value={tab} index={atoRole ? 2 : 1}>
            <Box
              sx={{
                padding: "30px 15px 0 15px",
                height: "calc(100vh - 280px)",
                backgroundColor: "#fafafa",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <DriversContent
                status={"ACCEPTED"}
                title={"Prihvaćene"}
                setAssignDriver={setAssignDriver}
              />
            </Box>
          </TabPanel>
          <TabPanel value={tab} index={atoRole ? 3 : 2}>
            <Box
              sx={{
                padding: "30px 15px 0 15px",
                height: "calc(100vh - 280px)",
                backgroundColor: "#fafafa",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <DriversContent
                status={
                  globalRole === "ADMINISTRATOR" ? "IN_PROGRESS" : "INPROGRESS"
                }
                title={"U Toku"}
                setAssignDriver={setAssignDriver}
              />
            </Box>
          </TabPanel>
          <TabPanel value={tab} index={atoRole ? 4 : 3}>
            <Box
              sx={{
                padding: "30px 15px 0 15px",
                height: "calc(100vh - 280px)",
                backgroundColor: "#fafafa",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <DriversContent
                status={"CLOSED"}
                title={"Zatvorene"}
                setAssignDriver={setAssignDriver}
              />
            </Box>
          </TabPanel>
          {!userRole?.includes("TRANSPORT") && (
            <TabPanel value={tab} index={atoRole ? 5 : 4}>
              <Box
                sx={{
                  padding: "30px 15px 0 15px",
                  height: "calc(100vh - 280px)",
                  backgroundColor: "#fafafa",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <DriversContent
                  status={"EXPIRED"}
                  title={"Istekle"}
                  setAssignDriver={setAssignDriver}
                />
              </Box>
            </TabPanel>
          )}
        </Box>
      </MainContainer>
      </AppContainer>
        )
      }
      
    </Box>

   

  );
};

export default LoadsPage;
