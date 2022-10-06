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
import { Formik, Field, FormikProps, Form } from 'formik';
import { TextField } from 'formik-mui';
import { Autocomplete, InputAdornment } from '@mui/material';
import { TextField as AutoCompleteTextField } from '@mui/material';
import { GroupsContent } from "./Content";
import { Box, Button, Typography, Menu, MenuItem, InputLabel, useMediaQuery } from "@mui/material";
import { DefaultInput } from "../../components/common/micro/forms";

import { RootState } from "../../redux/store";
import { ReactComponent as SearchIcon } from "../../assets/icons/search.svg";
import { ReactComponent as PlusIcon } from "../../assets/icons/plus-icon.svg";
import { ReactComponent as SortIcon } from "../../assets/icons/import_export.svg";
import { ReactComponent as CloseIcon } from "../../assets/icons/cancel.svg";
import { ReactComponent as XIcon } from "../../assets/icons/add.svg";
import { ReactComponent as s } from "../../assets/icons/add.svg";
import {
  getAllGroups,
  getGroup,
  addGroupAction,
  editGroupAction
} from "../../redux/slices/group-slice";
import { searchCompanies } from "../../redux/slices/transport-slice";
import { AddGroupSchema } from '../../schema/loginSchema';
import { GlobalSort } from "../../components/GlobalSort";
import GroupMobileDrawer from "./GroupMobileDrawer";

export const GroupsPage = () => {
  const matches = useMediaQuery("(max-width:767px)");
  const dispatch = useAppDispatch();
  const companyId = useSelector((state: RootState) => state?.user?.user?.company?.id);
  const totalElements = useSelector(
    (store: RootState) => store?.groups?.totalElements
  );
  const userRole = useSelector((state: RootState) => state?.user?.user?.role);
  const [openAdd, setOpenAdd] = React.useState(false);
  const [groupOpen, setGroupOpen] = React.useState(false);
  const [companyDrawerOpen, setCompanyDrawerOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [sortEl, setSortEl] = React.useState<null | HTMLElement>(null);
  const [selectedGroupData, setSelectedGroupData] = useState<any>({
    id: "",
    name: "",
  });
  const companies = useSelector((store: RootState) => store?.companies?.result);
  const [companiesData, setCompaniesData] = useState<any[]>([]);
  const [adminCompanyId, setAdminCompanyId] = useState(null);

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

  const [companySearch, setCompanySearch] = useState<any>({
    name: "",
    status: "",
    sortDirection: "DESC",
    pageNo: 0,
    pageSize: 100,
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
    if (userRole != 'ADMINISTRATOR' && companyId) {
      dispatch(getAllGroups({ params: { ...sort }, companyId: companyId }));
    }
  }, [sort, companyId]);

  useEffect(() => {
    if (userRole == 'ADMINISTRATOR' && adminCompanyId) {
      dispatch(getAllGroups({ params: { ...sort }, companyId: adminCompanyId }));
    }
  }, [sort, adminCompanyId]);

  useEffect(() => {
    if (companies) {
      setCompaniesData(companies.map((c: any) => { return { label: c.name, id: c.id } }));
    }
  }, [companies]);

  useEffect(() => {
    dispatch(searchCompanies(companySearch));
  }, [companySearch])

  const onChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const onChangeCompanySearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCompanySearch({ ...companySearch, name: e.target.value });
  };

  const onSelectCompany = (company: any) => {
    if (company) {
      setAdminCompanyId(company.id);
      setSort({ ...sort, nameCriteria: "" });
    } else {
      setAdminCompanyId(null);
      setCompanySearch({ ...companySearch, name: "" });
      setCompaniesData([]);
    }
  }

  const searchHandler = () => {
    if (sort.nameCriteria != search) {
      setSort({ ...sort, nameCriteria: search });
    }
  };

  const handleSort = (event: React.MouseEvent<HTMLButtonElement>) => {
    setSortEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSortEl(null);
  };

  const MobileDescriptionField = (params: any) => {
    return (
      <Box sx={{ height: '183px', width: '100%' }} className="MuiOutlinedInput-root MuiInputBase-root MuiInputBase-colorPrimary MuiInputBase-formControl css-rr9ywn-MuiInputBase-root-MuiOutlinedInput-root">
        <Box sx={{ padding: '10px', height: '100%', width: '100%' }}>
          <textarea aria-invalid="false" name="name" type="text" rows="8" class="MuiOutlinedInput-input MuiInputBase-input css-1ir7r9x-MuiInputBase-input-MuiOutlinedInput-input" {...params.field} {...params.props} />
        </Box>
        <fieldset aria-hidden="true" className="MuiOutlinedInput-notchedOutline css-1d3z3hw-MuiOutlinedInput-notchedOutline"><legend className="css-hdw1oc"><span className="notranslate">​</span></legend></fieldset>
      </Box>
    )
  };

  return (
    <Box sx={{ width: '100%' }}>
      {
        matches
          ?
          (
            <Box sx={{ width: '100%', height: '100vh', display: 'flex', flexDirection:'column', justifyContent: 'space-between' }}>
              <Box>
                <RightDrawer open={openAdd} setOpen={() => drawerHandler()}>
                  <Box sx={{ pt: "20px" }}>
                    <Typography fontSize={"18px"} fontWeight={"700"}>Saradnici</Typography>
                    <Typography color={"#999999"}>
                      {editGroup.name !== '' ? 'Izmeni Grupu' : 'Dodaj Grupu'}
                    </Typography>
                  </Box>
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
                      {(props: FormikProps<any>) => (
                        <Form style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', gap: 10 }} onSubmit={props.submitForm}>
                          <InputLabel>Ime Grupe *</InputLabel>
                          <Field
                            name={'name'}
                            type={'text'}
                            component={TextField}
                          />
                          <Box mb={{ xs: 'auto', md: 'auto' }} gap={3} >
                            <InputLabel>Opis *</InputLabel>
                            <Field
                              name={'description'}
                              type={'text'}
                              component={MobileDescriptionField}
                            />
                          </Box>
                          <Button variant='contained' fullWidth size={'large'} onClick={props.submitForm}>
                            {editGroup.name !== '' ? 'Izmeni Grupu Saradnika' : 'Dodaj Grupu Saradnika'}
                          </Button>
                          <Button onClick={() => drawerHandler()} variant='secondary' fullWidth size={'large'}>
                            Zatvori
                          </Button>
                        </Form>
                      )}
                    </Formik>
                  </Box>
                </RightDrawer>
                <GroupMobileDrawer
                  open={groupOpen}
                  setGroupOpen={setGroupOpen}
                  selectedGroupData={selectedGroupData}
                />
                <Header />
                <PageHeader name={"Saradnici"} />
                <Box sx={{ width: "100%", marginBottom: "20px" }}>
                  {
                    userRole == 'ADMINISTRATOR' ? (
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: { xs: "column", md: "row" },
                          gap: { xs: 0, md: "10px" },
                          flexWrap: "wrap",
                          padding: { xs: "0 15px", md: "0 35px" },
                          width: '100%',
                          mb: '20px'
                        }}
                      >
                        <Autocomplete
                          disablePortal
                          id="combo-box-demo"
                          options={companiesData}
                          sx={{ width: "100%", height: "42px" }}
                          renderInput={(params) =>
                            <AutoCompleteTextField
                              {...params}
                              label=""
                              placeholder="Odaberi kompaniju"
                              InputProps={{
                                ...params.InputProps,
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <Box sx={{ paddingLeft: "5px", width: "18px", height: "18px" }}><SearchIcon /></Box>
                                  </InputAdornment>
                                ),
                              }}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => { onChangeCompanySearch(e); }}
                            />
                          }
                          onChange={(event, value) => onSelectCompany(value)}
                        />
                      </Box>
                    ) : null
                  }
                  {
                    userRole == "ADMINISTRATOR" && !adminCompanyId ? null : (
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
                      </Box>
                    )
                  }

                </Box>
                <Box
                  bgcolor={"#fafafa"}
                  sx={{ py: { xs: 2, md: 4 }, px: { xs: 2, md: 4 } }}
                  display={"flex"}
                  justifyContent={"end"}
                >
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
                <GroupsContent
                  sort={sort}
                  setSort={setSort}
                  setEditGroup={setEditGroup}
                  open={groupOpen}
                  setSelectedGroupData={setSelectedGroupData}
                  setGroupOpen={setGroupOpen}
                  adminCompanyId={adminCompanyId}
                />
              </Box>
              <Box sx={{ padding: "0px 15px" }}>
                <Button
                  sx={{
                    marginLeft: { xs: 0, md: "auto" },
                    mt: { xs: "20px", md: 0 },
                    width: { xs: "100%", md: "auto" },
                  }}
                  onClick={() => setOpenAdd(true)}
                  variant={"contained"}
                  disabled={userRole == "ADMINISTRATOR" && !adminCompanyId}
                >
                  Dodaj Grupu
                </Button>
              </Box>

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
                            dispatch(editGroupAction({ ...values, companyId: (adminCompanyId ? adminCompanyId : companyId) }))
                          } else {
                            dispatch(addGroupAction({ ...values, companyId: (adminCompanyId ? adminCompanyId : companyId) }))
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
                  {
                    userRole == 'ADMINISTRATOR' ? (
                      <Box>
                        <Autocomplete
                          disablePortal
                          id="combo-box-demo"
                          options={companiesData}
                          sx={{ width: "280px", height: "42px" }}
                          renderInput={(params) =>
                            <AutoCompleteTextField
                              {...params}
                              label=""
                              placeholder="Odaberi kompaniju"
                              InputProps={{
                                ...params.InputProps,
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <Box sx={{ paddingLeft: "5px", width: "18px", height: "18px" }}><SearchIcon /></Box>
                                  </InputAdornment>
                                ),
                              }}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => { onChangeCompanySearch(e); }}
                            />
                          }
                          onChange={(event, value) => onSelectCompany(value)}
                        />
                      </Box>
                    ) : (
                      <Box>
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
                        </Button></Box>
                    )
                  }
                  <Button
                    sx={{
                      marginLeft: { xs: 0, md: "auto" },
                      mt: { xs: "20px", md: 0 },
                      width: { xs: "100%", md: "auto" },
                    }}
                    startIcon={<PlusIcon />}
                    onClick={() => setOpenAdd(true)}
                    disabled={userRole == 'ADMINISTRATOR' && !adminCompanyId}
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
                    {userRole == 'ADMINISTRATOR' ? `Odaberi Kompaniju` : `Ukupno ${totalElements} vozila`}
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
                <Box sx={{ padding: "10px" }}>
                  <GlobalSort
                    rowsPerPageOptions={[10, 15, 20]}
                    count={totalElements ? totalElements : 0}
                    page={sort.pageNo}
                    rowsPerPage={sort.pageSize}
                    setPage={(page: number) => setSort({ ...sort, pageNo: page })}
                    setRowsPerPage={(rowsPerPage: number) => setSort({ ...sort, pageSize: rowsPerPage })}
                  />
                </Box>
              </MainContainer>
            </AppContainer>
          )
      }
    </Box>
  );
}

export default GroupsPage;