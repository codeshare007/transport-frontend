import React, { useEffect, useCallback, useState } from "react";
import { useAppDispatch } from "../../redux/store";
import { DataGrid, GridColDef, gridClasses } from "@mui/x-data-grid";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { GridRowSpacingParams } from "@mui/x-data-grid";
import { DefaultInput } from "../../components/common/micro/forms";
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";
import {
  IconButton,
  Menu,
  Box,
  Button,
  InputLabel,
  Typography,
  Select,
  SelectChangeEvent,
  Slider,
  Divider,
  MenuItem,
  Chip,
  useMediaQuery,
} from "@mui/material";
import { InputItem } from "../../components/common/micro/forms";
import { ReactComponent as RightIcon } from "./icons/right-arrow.svg";
import { ReactComponent as NortheastIcon } from "./icons/north_east.svg";
import { TableHolder } from "../../components/common/micro/forms";
import {
  getCargo,
  adminGetCargo,
  getTransportCargo,
} from "../../redux/slices/cargo-slice";
import { CargoFilters } from "../../types/cargo.types";
import moment from "moment";

import { ReactComponent as FilterIcon } from "../../assets/icons/filter_list.svg";
import { ReactComponent as SortIcon } from "../../assets/icons/import_export.svg";
import { ReactComponent as ChevronDown } from "../../assets/icons/expand_more.svg";
import { ReactComponent as EditIcon } from './icons/edit-icon.svg';
import { ReactComponent as DeleteIcon } from './icons/delete-icon.svg';
import { ReactComponent as NotesIcon } from './icons/notes.svg';

export const DriversContent = (props: any) => {
  const allCargo = useSelector(
    (store: RootState) => store?.cargo?.cargoData?.content
  );
  const vehicleType = useSelector(
    (state: RootState) => state?.vehicles?.vehicleType
  );
  const globalRole: string = useSelector(
    (state: RootState) => state?.user?.user?.role
  );
  const companyRole: string = useSelector(
    (state: RootState) => state?.user?.user?.companyRoles
  );

  const { status, setAssignDriver, title } = props;

  const [cargoFilters, setCargoFilters] = useState<CargoFilters>({
    status: status,
  });
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [anchorEl2, setAnchorEl2] = React.useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);
  const open2 = Boolean(anchorEl2);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSortClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl2(event.currentTarget);
  };
  const handleSortClose = () => {
    setAnchorEl2(null);
  };
  const dispatch = useAppDispatch();
  const matches = useMediaQuery("(max-width:767px)");

  const statusTranslate = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Chip label={"SPREMAN"} color={"warning"} />;
      case "PUBLISHED":
        return <Chip label={"OBJAVLJEN"} color={"secondary"} />;
      case "ACCEPTED":
        return <Chip label={"PRIHVAĆEN"} color={"success"} />;
      case "IN_PROGRESS":
        return <Chip label={"U TOKU"} color={"info"} />;
      case "CLOSED":
        return <Chip label={"ZATVOREN"} color={"error"} />;
      case "EXPIRED":
        return <Chip label={"ISTEKAO"} color={"default"} />;
    }
  };

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'br. objave',
      flex: 70,
      sortable: false,
      renderCell: (params) => (
        <Typography textTransform={'capitalize'}>
          {params.row.registrationNumber}
        </Typography>
      )
    },
    {
      field: 'loadingDate',
      headerName: 'datum utovara',
      headerAlign: 'center',
      align: 'center',
      type: 'string',
      sortable: false,
      flex: 56,
    },
    {
      field: 'origin',
      headerName: 'utovar',
      headerAlign: 'right',
      align: 'right',
      type: 'string',
      sortable: false,
      flex: 40,
      renderCell: (params) => (
        <Typography textTransform={"capitalize"}>
          {params.row.origin.city}
        </Typography>
      ),
    },
    {
      field: "tt",
      headerName: "",
      headerAlign: "center",
      type: "string",
      sortable: false,
      align: 'center',
      flex: 15,
      renderCell: (params) => (
        <Box display={"flex"} justifyContent={"flex-end"}>
          <RightIcon />
        </Box>
      ),
    },
    {
      field: 'destination',
      headerName: matches ? '' : 'istovar',
      headerAlign: 'left',
      align: 'left',
      type: 'string',
      sortable: false,
      flex: 40,
      renderCell: (params) => (
        <Typography textTransform={"capitalize"}>
          {params.row.destination.city}
        </Typography>
      ),
    },
    {
      field: "transportDetails",
      headerName: matches ? '' : "Tip Vozila",
      headerAlign: "center",

      type: "string",
      sortable: false,
      align: "center",
      flex: 90,
      renderCell: (params) => (
        <Typography textTransform={"capitalize"}>
          {params.row.transportDetails.vehicleType.name}
        </Typography>
      ),
    },
    {
      field: "goodsDetails.goodsTypeId",
      headerName: "teret",
      headerAlign: "center",
      type: "string",
      editable: false,
      sortable: false,
      align: "center",
      flex: 70,
      renderCell: (params) => (
        <Typography textTransform={"capitalize"}>
          {params?.row?.goodsDetails?.goodsType?.name}
        </Typography>
      ),
    },
    {
      field: "goodsDetails.weight",
      headerName: "težina",
      headerAlign: "center",
      type: "string",
      sortable: false,
      align: "center",
      flex: 50,
      renderCell: (params) => (
        <Typography>{params.row.goodsDetails.weight + "t"}</Typography>
      ),
    },
    {
      field: "price",
      headerName: "Cena",
      headerAlign: "center",
      type: "string",
      sortable: false,
      align: "center",
      flex: 100,
      renderCell: (params) => (
        <Typography textTransform={'capitalize'}>
          {params.row.price.customPrice !== 0 ? params.row.price.customPrice.toFixed(2) + ' RSD po Teretu' : params.row.price.customPricePerUnit !== 0 ? params.row.price.customPricePerUnit.toFixed(2) + ' RSD po Toni' : params.row.price.pricePerUnit.toFixed(2) + ' RSD po Toni'}
        </Typography>
      ),
    },
    {
      field: "status",
      headerName: "status",
      headerAlign: "center",
      type: "string",
      sortable: false,
      align: "center",
      flex: 70,
      renderCell: (params) => statusTranslate(params.row.status),
    },
    {
      field: "",
      headerName: "",
      headerAlign: "right",
      type: "string",
      sortable: false,
      align: "right",
      flex: 50,
      renderCell: (params) => (
        <Box display={"flex"} justifyContent={"flex-end"}>
          <IconButton onClick={() => setAssignDriver(params.row)}>
            <NortheastIcon />
          </IconButton>
        </Box>
      ),
    },
  ];



  const getRowSpacing = useCallback((params: GridRowSpacingParams) => {
    return {
      top: params.isFirstVisible ? 0 : 10,
      bottom: params.isLastVisible ? 0 : 10,
    };
  }, []);

  const handleChange = (event: SelectChangeEvent) => {
    setCargoFilters({
      ...cargoFilters,
      vehicleTypeId: event.target.value,
    });
  };

  const handleSlider = (event: Event, newValue: number | number[]) => {
    setCargoFilters({
      ...cargoFilters,
      maxCalculatedPrice:
        (newValue as number) > 0 ? (newValue as number) : null,
    });
  };

  const handleWeight = (event: Event, newValue: number | number[]) => {
    setCargoFilters({
      ...cargoFilters,
      maxWeight: (newValue as number) > 0 ? (newValue as number) : null,
    });
  };

  useEffect(() => {
    if (
      typeof globalRole !== "undefined" &&
      globalRole !== "ADMINISTRATOR" &&
      !companyRole?.includes("TRANSPORT")
    )
      dispatch(getCargo(cargoFilters));
    if (
      typeof globalRole !== "undefined" &&
      globalRole === "ADMINISTRATOR" &&
      !companyRole?.includes("TRANSPORT")
    )
      dispatch(adminGetCargo(cargoFilters));
    if (
      typeof globalRole !== "undefined" &&
      globalRole !== "ADMINISTRATOR" &&
      companyRole?.includes("TRANSPORT")
    )
      dispatch(getCargo(cargoFilters));
  }, [cargoFilters, globalRole, companyRole]);

  const searchHandler = () => {
    if (globalRole !== "ADMINISTRATOR" && !companyRole?.includes("TRANSPORT"))
      dispatch(getCargo(cargoFilters));
    if (globalRole === "ADMINISTRATOR" && !companyRole?.includes("TRANSPORT"))
      dispatch(adminGetCargo(cargoFilters));
    if (companyRole?.includes("TRANSPORT"))
      dispatch(getTransportCargo(cargoFilters));
  };

  const kategorije = [
    "Br. Objave:",
    "Datum utovara:",
    "Utovar:",
    "Istovar:",
    "Tip vozila:",
    "Teret:",
    "Težina:",
    "Cena:",
    "Status:",
  ];


  return (
    <TableHolder>
      <Box display={"flex"} alignItems={"center"} justifyContent={{ xs: "space-between" }} p={{ xs: 0, md: 2 }} py={1}>
        <Typography variant={"h2"}>{title}</Typography>
        <Button
          id={"main-filter"}
          sx={{ ml: "auto", mr: 1 }}
          startIcon={<FilterIcon />}
          variant={"secondary"}
          aria-controls={open ? "filter-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
          disabled={allCargo?.length < 1}
        >
          Filter
        </Button>
        <Button
          id={"sort-filter"}
          startIcon={<SortIcon />}
          variant={"secondary"}
          aria-controls={open2 ? "sort-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open2 ? "true" : undefined}
          onClick={handleSortClick}
          disabled={allCargo?.length < 1}
        >
          Sortiranje
        </Button>
        <Menu
          id="sort-menu"
          anchorEl={anchorEl2}
          open={open2}
          onClose={handleSortClose}
          MenuListProps={{
            "aria-labelledby": "sort-filter",
            sx: {
              padding: "0px"
            },
          }}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <Box sx={{ width: { xs: '200px' } }}>
            <MenuItem>Datum Utovara</MenuItem>
            <Divider sx={{ my: "0!important" }} />
            <MenuItem>Datum Istovara</MenuItem>
            <Divider sx={{ my: "0!important" }} />
            <MenuItem>Težina Tereta</MenuItem>
            <Divider sx={{ my: "0!important" }} />
            <MenuItem>Cena</MenuItem>
          </Box>
        </Menu>
        <Menu
          id="filter-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "main-filter",
          }}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <Box py={3} px={2}>
            <InputLabel sx={{ mb: 1 }}>Datum Utovara</InputLabel>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                value={null || cargoFilters.loadingDate}
                onChange={(val) => {
                  const parsed = moment(val).format("YYYY-MM-DD");
                  setCargoFilters({ ...cargoFilters, loadingDate: parsed });
                }}
                renderInput={(params) => <DefaultInput {...params} />}
              />
            </LocalizationProvider>
            <InputLabel sx={{ mb: 1, mt: 1 }}>Tip Karoserije</InputLabel>
            <Select
              value={cargoFilters?.vehicleTypeId || ""}
              onChange={handleChange}
              sx={{
                width: "100%",
                ".MuiSelect-icon": {
                  right: "8px",
                  top: "unset",
                },
              }}
              IconComponent={ChevronDown}
              displayEmpty
            >
              <InputItem value={""} key={""} disabled>
                Odaberi
              </InputItem>
              {vehicleType?.map((item: any) => (
                <InputItem
                  key={item.id}
                  value={item.id}
                  disabled={!item.available}
                >
                  {item.name}
                </InputItem>
              ))}
            </Select>
            <InputLabel
              sx={{
                mb: 1,
                mt: 2,
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              Cena
              <Typography>
                0-{cargoFilters?.maxCalculatedPrice?.toLocaleString()} RSD
              </Typography>
            </InputLabel>
            <Slider
              aria-label="price"
              max={100000}
              value={cargoFilters?.maxCalculatedPrice || 0}
              onChange={handleSlider}
            />
            <InputLabel
              sx={{
                mb: 1,
                mt: 2,
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              Težina Tereta
              <Typography>
                0-{cargoFilters?.maxWeight?.toLocaleString()} Kg
              </Typography>
            </InputLabel>
            <Slider
              aria-label="weight"
              max={2000}
              value={cargoFilters?.maxWeight || 0}
              onChange={handleWeight}
            />
            <Box mt={1} justifyContent={"flex-end"} display={"flex"} gap={1}>
              <Button
                onClick={() => {
                  setCargoFilters({ status });
                  handleClose();
                }}
                variant={"secondary"}
              >
                Poništi
              </Button>
              <Button onClick={() => searchHandler()} variant={"contained"}>
                Sačuvaj
              </Button>
            </Box>
          </Box>
        </Menu>
      </Box>
      {!matches && allCargo?.length > 0 &&
        (<DataGrid
          initialState={{
            pagination: {
              pageSize: 5,
            },
          }}
          getRowSpacing={getRowSpacing}
          headerHeight={44}
          rows={allCargo}
          columns={columns}
          rowHeight={matches ? 500 : 75}
          disableColumnSelector
          disableColumnFilter
          disableColumnMenu
          disableSelectionOnClick
          disableVirtualization
          componentsProps={{
            pagination: {
              labelRowsPerPage: "Po strani",
            },
          }}
          paginationMode={"client"}
          onPageSizeChange={(val) =>
            dispatch(getCargo({ ...cargoFilters, pageSize: val }))
          }
          rowsPerPageOptions={[5, 10, 20, 50]}
          sx={{
            [`& .${gridClasses.row}`]: {
              bgcolor: "#fff",
            },
          }}
        />)}
      {matches && allCargo?.length > 0 && (
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-start', flexDirection: 'column', overflowX: 'scroll', '::-webkit-scrollbar': { display: 'none' } }}>
          {allCargo?.map((row: any) => (
            <Box key={row.id}>
              <Box sx={{ display: 'flex', padding: '10px 0', flexDirection: 'row', justifyContent: 'flex-start' }}>
                <Typography sx={{ width: '150px', }}>{kategorije[0]}</Typography>
                <Box sx={{ maxWidth: '200px', pl: '40px', fontWeight: 'bold' }}>{row?.registrationNumber}</Box>
              </Box>
              <Divider />
              <Box sx={{ display: 'flex', padding: '10px 0', flexDirection: 'row' }}>
                <Typography sx={{ width: '150px', }}>{kategorije[1]}</Typography>
                <Box sx={{ maxWidth: '200px', pl: '40px', fontWeight: 'bold' }}>{row?.loadingDate}</Box>
              </Box>
              <Divider />
              <Box sx={{ display: 'flex', padding: '10px 0', flexDirection: 'row' }}>
                <Typography sx={{ width: '150px', }}>{kategorije[2]}</Typography>
                <Box sx={{ maxWidth: '200px', pl: '40px', fontWeight: 'bold' }}>{row?.origin?.city}</Box>
              </Box>
              <Divider />
              <Box sx={{ display: 'flex', padding: '10px 0', flexDirection: 'row', justifyContent: 'flex-start' }}>
                <Typography sx={{ width: '150px', }}>{kategorije[3]}</Typography>
                <Box sx={{ maxWidth: '200px', pl: '40px', fontWeight: 'bold' }}>{row?.destination?.city}</Box>
              </Box>
              <Divider />
              <Box sx={{ display: 'flex', padding: '10px 0', flexDirection: 'row' }}>
                <Typography sx={{ width: '150px', }}>{kategorije[4]}</Typography>
                <Box sx={{ maxWidth: '200px', pl: '40px', fontWeight: 'bold', textTransform: 'capitalize' }}> {row?.transportDetails.vehicleType.name}</Box>
              </Box>
              <Divider />
              <Box sx={{ display: 'flex', padding: '10px 0', flexDirection: 'row' }}>
                <Typography sx={{ width: '150px', }}>{kategorije[5]}</Typography>
                <Box sx={{ maxWidth: '200px', pl: '40px', fontWeight: 'bold', textTransform: 'capitalize' }}> {row?.goodsDetails?.goodsType?.name}</Box>
              </Box>
              <Divider />
              <Box sx={{ display: 'flex', padding: '10px 0', flexDirection: 'row' }}>
                <Typography sx={{ width: '150px', }}>{kategorije[6]}</Typography>
                <Box sx={{ maxWidth: '200px', pl: '40px', fontWeight: 'bold', textTransform: 'capitalize' }}> {row?.goodsDetails?.weight}</Box>
              </Box>
              <Divider />
              <Box sx={{ display: 'flex', padding: '10px 0', flexDirection: 'row' }}>
                <Typography sx={{ width: '150px', }}>{kategorije[7]}</Typography>
                <Box sx={{ maxWidth: '200px', pl: '40px', fontWeight: 'bold', textTransform: 'capitalize' }}>
                  {row.price.customPrice !== 0 ? row.price.customPrice.toFixed(2) + ' RSD po Teretu' : row.price.customPricePerUnit !== 0 ? row.price.customPricePerUnit.toFixed(2) + ' RSD po Toni' : row.price.pricePerUnit.toFixed(2) + ' RSD po Toni'}
                </Box>
              </Box>
              <Divider />
              <Box sx={{ display: 'flex', padding: '10px 0', flexDirection: 'row' }}>
                <Typography sx={{ width: '150px', }}>{kategorije[8]}</Typography>
                <Box sx={{ maxWidth: '200px', pl: '40px', fontWeight: 'bold', textTransform: 'capitalize' }}>
                  {statusTranslate(row.status)}
                </Box>
              </Box>
              <Divider />
              <Box sx={{ display: 'flex', padding: '10px 0', flexDirection: 'row', justifyContent: 'center' }}>
                <Box sx={{ fontWeight: 'bold' }}>
                  <IconButton onClick={() => {
                    setAssignDriver(row);
                  }}>
                    <EditIcon />
                  </IconButton>
                </Box>
              </Box>
              <Divider sx={{ height: '3px', backgroundColor: '#36CB83' }} />
            </Box>
          ))}
        </Box>
      )}
    </TableHolder>
  );
};
