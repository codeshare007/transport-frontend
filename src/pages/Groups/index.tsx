import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../redux/store";
import AppContainer from "../../components/common/AppContainer";
import MainContainer from "../../components/common/MainContainer";
import Header from "../../components/Header";
import Sidebar from "../../components/common/Sidebar";
import PageHeader from "../../components/PageHeader";
import { RightDrawer } from '../../components/RightDrawer';
import GroupDrawer from "./GroupDrawer";
import CompanyDrawer from "./CompanyDrawer";
import { Formik, Field } from 'formik';
import { TextField } from 'formik-mui';
import { GroupsContent } from "./Content";
import { Box, Button, Typography, Menu, MenuItem, InputLabel, useMediaQuery } from "@mui/material";
import { DefaultInput } from "../../components/common/micro/forms";

import { RootState } from "../../redux/store";
import { ReactComponent as SearchIcon } from "../../assets/icons/search.svg";
import { ReactComponent as PlusIcon } from "../../assets/icons/plus-icon.svg";
import { ReactComponent as SortIcon } from "../../assets/icons/import_export.svg";
import { ReactComponent as CloseIcon } from "../../assets/icons/cancel.svg";
import { ReactComponent as XIcon } from "../../assets/icons/add.svg";
import {
  getAllGroups,
  getGroup,
  addGroupAction,
  editGroupAction
} from "../../redux/slices/group-slice";
import { AddGroupSchema } from '../../schema/loginSchema';

export const GroupsPage = () => {
  const matches = useMediaQuery("(max-width:767px)");
  const dispatch = useAppDispatch();
  const companyId = useSelector((state: RootState) => state?.user?.user?.company?.id);
  const totalElements = useSelector(
    (store: RootState) => store?.groups?.totalElements
  );
  const [openAdd, setOpenAdd] = React.useState(false);
  const [groupOpen, setGroupOpen] = React.useState(false);
  const [companyDrawerOpen, setCompanyDrawerOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [sortEl, setSortEl] = React.useState<null | HTMLElement>(null);
  const [selectedGroupData, setSelectedGroupData] = useState<any>({
    id: "",
    name: "",
  });

  const open = Boolean(anchorEl);
  const openSort = Boolean(sortEl);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<any>({
    direction: "DESC",
    pageNo: 0,
    pageSize: 10,
    sortBy: null,
    nameCriteria: ""
  });

  const [editGroup, setEditGroup] = React.useState({
    name: '',
    description: ''
  });

  const [companyDrawerData, setCompanyDrawerData] = React.useState({
    id: '',
    name: ''
  });

  const drawerHandler = () => {
    setEditGroup({
      name: '',
      description: ''
    })
    setOpenAdd(!openAdd);
  };

  useEffect(() => {
    if (editGroup.name !== '') {
      setOpenAdd(true);
    };
  }, [editGroup]);

  useEffect(() => {
    dispatch(getAllGroups({ ...sort, companyId: companyId }));
  }, [sort, companyId]);

  const onChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const searchHandler = () => {
    if (sort.nameCriteria != search) {
      setSort({...sort, nameCriteria: search});
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

  return (
    <Box sx={{ width: '100%' }}>
      {
        matches
          ?
          (
            <Box sx={{ width: '100%' }}>
              <RightDrawer open={openAdd} setOpen={() => drawerHandler()}>
                <Typography sx={{ fontSize: '28px', fontWeight: '800', textAlign: 'center', pt: { xs: 3, md: 0 } }}>
                  {editGroup.name !== '' ? 'Izmeni Grupu Saradnika' : 'Dodaj Grupu Saradnika'}
                </Typography>
                <Box mt={4} height={'100%'} width={'100%'} display={'flex'} flexDirection={'column'}>
                  <Formik
                    validationSchema={AddGroupSchema}
                    initialValues={editGroup}
                    onSubmit={(values: any, { setSubmitting }) => {
                      setSubmitting(false);
                      if (editGroup.name !== '') {
                        dispatch(editGroupAction({ ...values, companyId: companyId }))
                      } else {
                        dispatch(addGroupAction({ ...values, companyId: companyId }))
                      }
                      drawerHandler();
                    }}
                  >
                    {({ submitForm, isSubmitting }) => (
                      <form style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', gap: 10 }} onSubmit={submitForm}>
                        <InputLabel>Ime Grupe *</InputLabel>
                        <Field
                          name={'name'}
                          type={'text'}
                          component={TextField}
                        />
                        <Box mb={{ xs: 2, md: 'auto' }} >
                          <InputLabel>Opis *</InputLabel>
                          <Field
                            name={'description'}
                            type={'text'}
                            component={TextField}
                          />
                        </Box>
                        <Button variant='contained' fullWidth size={'large'} onClick={submitForm}>
                          {editGroup.name !== '' ? 'Izmeni Grupu Saradnika' : 'Dodaj Grupu Saradnika'}
                        </Button>
                        <Button onClick={() => drawerHandler()} variant='secondary' fullWidth size={'large'}>
                          Zatvori
                        </Button>
                      </form>
                    )}
                  </Formik>
                </Box>
              </RightDrawer>
              <Header />
              <PageHeader name={"Saradnici"} />
              <Box sx={{ width: "100%", marginBottom: "20px" }}>
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
                    placeholder={"Traži"}
                    value={search}
                    name={"filter"}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => { onChangeSearch(e); searchHandler() }}
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
                    onClick={() => setOpenAdd(true)}
                    variant={"contained"}
                  >
                    Dodaj Vozilo
                  </Button>
                </Box>
              </Box>
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
                        setSort({ pageNo: 0, pageSize: 10, sortBy: "name" });
                      }}
                    >
                      Ime
                    </MenuItem>
                  </Menu>
                </Box>
              </Box>
              <GroupsContent
                sort={sort}
                setSort={setSort}
                setEditGroup={setEditGroup}
                open={groupOpen}
                setSelectedGroupData={setSelectedGroupData}
                setGroupOpen={setGroupOpen}
              />
            </Box>
          )
          :
          ////////////////////////////////////////////////////////////////////////
          (
            <AppContainer>
              <Sidebar />
              <MainContainer>
                <Header />
                <PageHeader name={"Saradnici"}>
                  <GroupDrawer
                    open={groupOpen}
                    setGroupOpen={setGroupOpen}
                    selectedGroupData={selectedGroupData}
                    setCompanyDrawerData={setCompanyDrawerData}
                    setCompanyDrawerOpen={setCompanyDrawerOpen}
                  />
                  <CompanyDrawer
                    open={companyDrawerOpen}
                    setCompanyDrawerOpen={setCompanyDrawerOpen}
                  />
                  <RightDrawer open={openAdd} setOpen={() => drawerHandler()}>
                    <Typography sx={{ fontSize: '28px', fontWeight: '800', textAlign: 'center', pt: { xs: 3, md: 0 } }}>
                      {editGroup.name !== '' ? 'Izmeni Grupu Saradnika' : 'Dodaj Grupu Saradnika'}
                    </Typography>
                    <Box mt={4} height={'100%'} width={'100%'} display={'flex'} flexDirection={'column'}>
                      <Formik
                        validationSchema={AddGroupSchema}
                        initialValues={editGroup}
                        onSubmit={(values: any, { setSubmitting }) => {
                          setSubmitting(false);
                          if (editGroup.name !== '') {
                            dispatch(editGroupAction({ ...values, companyId: companyId }))
                          } else {
                            dispatch(addGroupAction({ ...values, companyId: companyId }))
                          }
                          drawerHandler();
                        }}
                      >
                        {({ submitForm, isSubmitting }) => (
                          <form style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', gap: 10 }} onSubmit={submitForm}>
                            <InputLabel>Ime Grupe *</InputLabel>
                            <Field
                              name={'name'}
                              type={'text'}
                              component={TextField}
                            />
                            <Box mb={{ xs: 2, md: 'auto' }} gap={3} >
                              <InputLabel>Opis *</InputLabel>
                              <Field
                                name={'description'}
                                type={'text'}
                                component={TextField}
                              />
                            </Box>
                            <Button variant='contained' fullWidth size={'large'} onClick={submitForm}>
                              {editGroup.name !== '' ? 'Izmeni Grupu Saradnika' : 'Dodaj Grupu Saradnika'}
                            </Button>
                            <Button onClick={() => drawerHandler()} variant='secondary' fullWidth size={'large'}>
                              Zatvori
                            </Button>
                          </form>
                        )}
                      </Formik>
                    </Box>
                  </RightDrawer>
                </PageHeader>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    gap: { xs: 0, md: "10px" },
                    flexWrap: "wrap",
                    padding: { xs: "0 15px", md: "0 35px" },
                    marginBottom: "38px"
                  }}
                >
                  <DefaultInput
                    placeholder={"Traži"}
                    value={search}
                    name={"filter"}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChangeSearch(e)}
                    InputProps={{
                      startAdornment: <SearchIcon />,
                    }}
                    sx={{ maxWidth: { xs: 'auto', md: '280px' }, width: { xs: '100%', md: 'auto' }, paddingBottom: { xs: '16px', md: 0 } }}
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
                    onClick={() => setOpenAdd(true)}
                    variant={"contained"}
                  >
                    Dodaj grupu
                  </Button>
                </Box>
                <Box
                  bgcolor={"#fafafa"}
                  sx={{ py: { xs: 2, md: 4 }, px: { xs: 2, md: 4 } }}
                  display={"flex"}
                  justifyContent={"space-between"}
                  alignItems={"center"}
                >
                  <Typography color={"darkgray"} fontSize={"14px"} lineHeight={"22px"}>
                    {`Ukupno ${totalElements} grupa saradnika`}
                  </Typography>
                  <Box display={"flex"} gap={"10px"}>
                    {sort?.name && (
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
                      {/* <MenuItem
                        onClick={() => {
                          handleClose();
                          setSort({ pageNo: 0, pageSize: 10, sortBy: "ID" });
                        }}
                      >
                        ID
                      </MenuItem> */}
                      <MenuItem
                        onClick={() => {
                          handleClose();
                          setSort({
                            pageNo: 0,
                            pageSize: 10,
                            sortBy: "name",
                          });
                        }}
                      >
                        Ime
                      </MenuItem>
                    </Menu>
                  </Box>
                </Box>
                <GroupsContent
                  sort={sort}
                  setSort={setSort}
                  setEditGroup={setEditGroup}
                  open={groupOpen}
                  setSelectedGroupData={setSelectedGroupData}
                  setGroupOpen={setGroupOpen}
                />
              </MainContainer>
            </AppContainer>
          )
      }
    </Box>
  );
}

export default GroupsPage;