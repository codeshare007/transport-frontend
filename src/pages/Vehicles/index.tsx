import React, { useEffect, useState, SyntheticEvent } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../redux/store";
import AppContainer from "../../components/common/AppContainer";
import MainContainer from "../../components/common/MainContainer";
import Header from "../../components/Header";
import Sidebar from "../../components/common/Sidebar";
import {
  Box,
  Button,
  Typography,
  Tabs,
  Tab,
  Menu,
  MenuItem,
  useMediaQuery,
} from "@mui/material";
import PageHeader from "../../components/PageHeader";
import { DriversContent } from "./Content";
import { DefaultInput } from "../../components/common/micro/forms";
import {
  addVehicle,
  getAllVehicles,
  editSingleVehicle,
} from "../../redux/slices/vehicle-slice";
import {
  getVehicleBody,
  getVehicleType,
  getGoodsType,
} from "../../redux/slices/vehicle-slice";
import { RootState } from "../../redux/store";
import { ReactComponent as SearchIcon } from "../../assets/icons/search.svg";
import { ReactComponent as PlusIcon } from "../../assets/icons/plus-icon.svg";
import { ReactComponent as FilterIcon } from "../../assets/icons/filter_list.svg";
import { ReactComponent as SortIcon } from "../../assets/icons/import_export.svg";
import { ReactComponent as CloseIcon } from "../../assets/icons/cancel.svg";
import { ReactComponent as XIcon } from "../../assets/icons/add.svg";
import { TabPanel } from "../../components/common/PageTab";
import HereMap from "../../components/Map";
import VehicleDrawer from "./VehicleDrawer";
import { VehicleAdd } from "./Vehicle.types";
import api from "../../api/base";
import { apiv1 } from "../../api/paths";

import VehiclesMap from "./VehiclesMap";

export const VehiclesPage = () => {
  const userRole = useSelector((state: RootState) => state?.user?.user?.role);
  const matches = useMediaQuery("(max-width:767px)");
  const dispatch = useAppDispatch();
  const totalElements = useSelector(
    (store: RootState) => store?.vehicles?.vehicles?.totalElements
  );
  const vehicleType = useSelector(
    (store: RootState) => store?.vehicles?.vehicleType
  );

  const [openAdd, setOpenAdd] = useState<{ open: boolean; edit?: boolean }>({
    open: false,
  });
  const [tab, setTab] = useState<number>(0);
  const [search, setSearch] = useState("");
  const [vehicleData, setVehicleData] = useState({} as VehicleAdd);
  const [trailerData, setTrailerData] = useState({});
  const [vehiclePositions, setVehiclePositions] = useState([]);
  const [sort, setSort] = useState<any>({
    direction: "DESC",
    pageNo: 0,
    pageSize: 10,
    sortBy: null,
  });

  const [selectedMapVehicle, setSelectedMapVehicle] = useState(null);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [sortEl, setSortEl] = React.useState<null | HTMLElement>(null);
  const [selectedInput, setSelectedInput] = React.useState<any>({
    name: "",
    value: "",
  });
  const open = Boolean(anchorEl);
  const openSort = Boolean(sortEl);

  const getVehicleLocations = async () => {
    try {
      if ( userRole === 'ADMINISTRATOR'){
      const { data } = await api.get(
        apiv1 + "location/vehicle/admin-access/list"
      );
      setVehiclePositions(data);
    }; 
    if ( userRole === 'USER') {
        const { data } = await api.get(
          apiv1 + "location/vehicle/current-company/list"
        );
        setVehiclePositions(data);
      }
    } catch (err) {
      console.log(err);
    }
};

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSort = (event: React.MouseEvent<HTMLButtonElement>) => {
    setSortEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSortEl(null);
  };

  const handleTab = (event: SyntheticEvent, newValue: number) => {
    if (newValue === 0) setSelectedMapVehicle(null);
    setTab(newValue);
  };

  const a11yProps = (index: number) => {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  };

  const onChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const searchHandler = () => {
    setSort({
      pageNo: 0,
      pageSize: 10,
      filter: search,
    });
  };

  useEffect(() => {
    dispatch(getAllVehicles(sort));
  }, [sort]);

  useEffect(() => {
    dispatch(getVehicleBody());
    dispatch(getVehicleType());
    dispatch(getGoodsType());
  }, []);

  useEffect(() => {
    getVehicleLocations();
  }, [userRole]);

  useEffect(() => {
    if (!openAdd.open && vehicleData.vehicleTypeId && openAdd.edit === null) {
      if (selectedInput.name === "poluprikolica") {
        dispatch(addVehicle({ details: vehicleData, type: "trailer" }));
        dispatch(getAllVehicles(sort));
      } else if (selectedInput.name === "šleper") {
        dispatch(addVehicle({ details: trailerData, type: "trailer" }));
        dispatch(addVehicle({ details: vehicleData, type: "with-trailer" }));
        dispatch(getAllVehicles(sort));
      } else {
        dispatch(addVehicle({ details: vehicleData, type: "with-cargo" }));
        dispatch(getAllVehicles(sort));
      }
      dispatch(getAllVehicles(sort));
    }
    if (!openAdd.open && openAdd.edit) {
      if (selectedInput.name === "poluprikolica") {
        dispatch(
          editSingleVehicle({
            details: vehicleData,
            type: "trailer",
            id: vehicleData.id,
          })
        );
        dispatch(getAllVehicles(sort));
      } else if (selectedInput.name === "šleper") {
        dispatch(editSingleVehicle({ details: trailerData, type: "trailer" }));
        dispatch(
          editSingleVehicle({
            details: vehicleData,
            type: "with-trailer",
            id: vehicleData.id,
          })
        );
        dispatch(getAllVehicles(sort));
      } else
        dispatch(
          editSingleVehicle({
            details: vehicleData,
            type: "with-cargo",
            id: vehicleData.id,
          })
        );
      dispatch(getAllVehicles(sort));
    }
    if (!openAdd.open && !openAdd.edit) {
      setVehicleData({} as VehicleAdd);
      dispatch(getAllVehicles(sort));
    }
  }, [setOpenAdd, openAdd]);

  

  useEffect(() => {
    if (selectedMapVehicle) setTab(1);
  }, [selectedMapVehicle, tab]);
  
  return (
    <Box sx={{ width: '100%' }}>
      {
        matches
          ?
          (
            <Box sx={{ width: '100%' }}>
              <VehicleDrawer
                vehicleData={vehicleData}
                setVehicleData={setVehicleData}
                open={openAdd}
                setOpen={setOpenAdd}
                setSelectedInput={setSelectedInput}
                selectedInput={selectedInput}
                setTrailerData={setTrailerData}
                trailerData={trailerData}
              />

              <Header />
              <PageHeader name={"Sva Vozila"} />
              <Box sx={{ width: "100%" }}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    gap: { xs: 0, md: "10px" },
                    flexWrap: "wrap",
                    padding: { xs: "0 15px", md: "0 35px" },
                    width: '100%'
                  }}
                >
                  <DefaultInput
                    placeholder={"Pretraži"}
                    value={search}
                    name={"filter"}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => { onChangeSearch(e); searchHandler() }
                    }
                    InputProps={{
                      startAdornment: <SearchIcon />,
                      endAdornment: search !== "" && (
                        <CloseIcon
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            setSearch("");
                            setSort({ pageNo: 0, pageSize: 10 });
                          }}
                        />
                      ),
                    }}
                    sx={{ flex: { xs: "0", md: "0 1 280px" } }}
                  />

                  <Button
                    sx={{
                      marginLeft: { xs: 0, md: "auto" },
                      mt: { xs: "20px", md: 0 },
                      width: { xs: "100%", md: "auto" },
                    }}
                    startIcon={<PlusIcon />}
                    onClick={() => setOpenAdd({ open: true })}
                    variant={"contained"}
                  >
                    Dodaj Vozilo
                  </Button>
                </Box>
              </Box>
              <Box sx={{ padding: "0 15px" }} mt={1}>
                <Tabs value={tab} onChange={handleTab}>
                  <Tab
                    sx={{ fontSize: "16px" }}
                    label="Vozila"
                    {...a11yProps(0)}
                  />
                  <Tab sx={{ fontSize: "16px" }} label="Mape" {...a11yProps(1)} />
                </Tabs>
              </Box>
              <TabPanel value={tab} index={0}>
                <Box
                  bgcolor={"#fafafa"}
                  sx={{ py: { xs: 2, md: 4 }, px: { xs: 2, md: 4 } }}
                  display={"flex"}
                  justifyContent={"space-between"}
                  alignItems={"center"}
                >
                  <Typography color={"darkgray"}>
                    {`Ukupno ${totalElements} vozila`}
                  </Typography>
                  <Box display={"flex"} gap={"10px"}>
                    {sort?.vehicleTypeId && (
                      <Button
                        onClick={() => setSort({ pageNo: 0, pageSize: 10 })}
                        startIcon={
                          <XIcon style={{ height: "22px", width: "22px" }} />
                        }
                        variant={"secondary"}
                      >
                        Resetuj Filter
                      </Button>
                    )}

                    <Menu
                      id="basic-menu"
                      anchorEl={anchorEl}
                      open={open}
                      onClose={handleClose}
                      MenuListProps={{
                        "aria-labelledby": "basic-button",
                      }}
                    >
                      {vehicleType?.map((type: any) => (
                        <MenuItem
                          onClick={() => {
                            handleClose();
                            setSort({
                              pageNo: 0,
                              pageSize: 10,
                              vehicleTypeId: type.id,
                            });
                          }}
                          selected={type.id === sort?.vehicleTypeId}
                          disabled={type.id === sort?.vehicleTypeId}
                          key={type.id}
                        >
                          {type.name}
                        </MenuItem>
                      ))}
                    </Menu>
                    <Button
                      disabled={totalElements === 0}
                      onClick={handleSort}
                      startIcon={<SortIcon />}
                      variant={"secondary"}
                      aria-controls={openSort ? "basic-menu" : undefined}
                      aria-haspopup="true"
                      aria-expanded={openSort ? "true" : undefined}
                    >
                      Sortiranje
                    </Button>
                    <Menu
                      id="basic-menu"
                      anchorEl={sortEl}
                      open={openSort}
                      onClose={handleClose}
                      MenuListProps={{
                        "aria-labelledby": "basic-button",
                      }}
                    >
                      <MenuItem
                        onClick={() => {
                          handleClose();
                          setSort({ pageNo: 0, pageSize: 10, sortBy: "ID" });
                        }}
                      >
                        ID
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          handleClose();
                          setSort({
                            pageNo: 0,
                            pageSize: 10,
                            sortBy: "LICENSE_PLATE",
                          });
                        }}
                      >
                        TABLICA
                      </MenuItem>
                    </Menu>
                  </Box>
                </Box>
                <DriversContent
                  sort={sort}
                  setSort={setSort}
                  setVehicleData={setVehicleData}
                  open={openAdd}
                  setOpen={setOpenAdd}
                  setSelectedMapVehicle={setSelectedMapVehicle}
                />
              </TabPanel>
              <TabPanel value={tab} index={1}>
                <Box sx={{ maxWidth: "100%", width: "100%" }}>
                  <VehiclesMap
                    data={vehiclePositions}
                    containerHeight={"calc(100vh - 265px)"}
                    selectedMapVehicle={selectedMapVehicle}
                  />
                </Box>
              </TabPanel>
            </Box>
          )
          :
          ////////////////////////////////////////////////////////////////////////
          (
            <AppContainer>
              <Sidebar />
              <VehicleDrawer
                vehicleData={vehicleData}
                setVehicleData={setVehicleData}
                open={openAdd}
                setOpen={setOpenAdd}
                setSelectedInput={setSelectedInput}
                selectedInput={selectedInput}
                setTrailerData={setTrailerData}
                trailerData={trailerData}
              />
              <MainContainer>
                <Header />
                <PageHeader name={"Sva Vozila"} />
                <Box sx={{ width: "100%" }}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: { xs: "column", md: "row" },
                      gap: { xs: 0, md: "10px" },
                      flexWrap: "wrap",
                      padding: { xs: "0 15px", md: "0 35px" },
                    }}
                  >
                    <DefaultInput
                      placeholder={"Pretraži"}
                      value={search}
                      name={"filter"}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        onChangeSearch(e)
                      }
                      InputProps={{
                        startAdornment: <SearchIcon />,
                        endAdornment: search !== "" && (
                          <CloseIcon
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              setSearch("");
                              setSort({ pageNo: 0, pageSize: 10 });
                            }}
                          />
                        ),
                      }}
                      sx={{ flex: { xs: "0", md: "0 1 280px" } }}
                    />

                    <Button
                      sx={{ py: "10px", ml: "15px" }}
                      onClick={() => searchHandler()}
                      variant={"contained"}
                    >
                      Traži
                    </Button>

                    <Button
                      sx={{
                        marginLeft: { xs: 0, md: "auto" },
                        mt: { xs: "20px", md: 0 },
                        width: { xs: "100%", md: "auto" },
                      }}
                      startIcon={<PlusIcon />}
                      onClick={() => setOpenAdd({ open: true })}
                      variant={"contained"}
                    >
                      Dodaj Vozilo
                    </Button>
                  </Box>
                  <Box sx={{ padding: "0 35px" }} mt={3}>
                    <Tabs value={tab} onChange={handleTab}>
                      <Tab
                        sx={{ fontSize: "16px" }}
                        label="Vozila"
                        {...a11yProps(0)}
                      />
                      <Tab sx={{ fontSize: "16px" }} label="Mape" {...a11yProps(1)} />
                    </Tabs>
                  </Box>
                </Box>
                <TabPanel value={tab} index={0}>
                  <Box
                    bgcolor={"#fafafa"}
                    sx={{ py: { xs: 2, md: 4 }, px: { xs: 2, md: 4 } }}
                    display={"flex"}
                    justifyContent={"space-between"}
                    alignItems={"center"}
                  >
                    <Typography color={"darkgray"}>
                      {`Ukupno ${totalElements} vozila`}
                    </Typography>
                    <Box display={"flex"} gap={"10px"}>
                      {sort?.vehicleTypeId && (
                        <Button
                          onClick={() => setSort({ pageNo: 0, pageSize: 10 })}
                          startIcon={
                            <XIcon style={{ height: "22px", width: "22px" }} />
                          }
                          variant={"secondary"}
                        >
                          Resetuj Filter
                        </Button>
                      )}

                      <Button
                        disabled={totalElements === 0}
                        onClick={handleClick}
                        startIcon={<FilterIcon />}
                        variant={"secondary"}
                      >
                        Filter
                      </Button>

                      <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        MenuListProps={{
                          "aria-labelledby": "basic-button",
                        }}
                      >
                        {vehicleType?.map((type: any) => (
                          <MenuItem
                            onClick={() => {
                              handleClose();
                              setSort({
                                pageNo: 0,
                                pageSize: 10,
                                vehicleTypeId: type.id,
                              });
                            }}
                            selected={type.id === sort?.vehicleTypeId}
                            disabled={type.id === sort?.vehicleTypeId}
                            key={type.id}
                          >
                            {type.name}
                          </MenuItem>
                        ))}
                      </Menu>
                      <Button
                        disabled={totalElements === 0}
                        onClick={handleSort}
                        startIcon={<SortIcon />}
                        variant={"secondary"}
                        aria-controls={openSort ? "basic-menu" : undefined}
                        aria-haspopup="true"
                        aria-expanded={openSort ? "true" : undefined}
                      >
                        Sortiranje
                      </Button>
                      <Menu
                        id="basic-menu"
                        anchorEl={sortEl}
                        open={openSort}
                        onClose={handleClose}
                        MenuListProps={{
                          "aria-labelledby": "basic-button",
                        }}
                      >
                        <MenuItem
                          onClick={() => {
                            handleClose();
                            setSort({ pageNo: 0, pageSize: 10, sortBy: "ID" });
                          }}
                        >
                          ID
                        </MenuItem>
                        <MenuItem
                          onClick={() => {
                            handleClose();
                            setSort({
                              pageNo: 0,
                              pageSize: 10,
                              sortBy: "LICENSE_PLATE",
                            });
                          }}
                        >
                          TABLICA
                        </MenuItem>
                      </Menu>
                    </Box>
                  </Box>
                  <DriversContent
                    sort={sort}
                    setSort={setSort}
                    setVehicleData={setVehicleData}
                    open={openAdd}
                    setOpen={setOpenAdd}
                    setSelectedMapVehicle={setSelectedMapVehicle}
                  />
                </TabPanel>
                <TabPanel value={tab} index={1}>
                  <Box sx={{ maxWidth: "100%", width: "100%" }}>
                    <VehiclesMap
                      data={vehiclePositions}
                      containerHeight={"calc(100vh - 265px)"}
                      selectedMapVehicle={selectedMapVehicle}
                    />
                  </Box>
                </TabPanel>
              </MainContainer>
            </AppContainer>)
      }
    </Box>

  );
};

export default VehiclesPage;
