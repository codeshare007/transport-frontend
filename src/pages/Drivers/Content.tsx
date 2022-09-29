import React from "react";
import { RootState } from "../../redux/store";
import {
  Avatar,
  Box,
  Typography,
  styled,
  Button,
  Menu,
  MenuItem,
  Divider,
  Select,
  SelectChangeEvent,
  useMediaQuery,
} from "@mui/material";
import { ReactComponent as EditIcon } from "./icons/edit-icon.svg";
import { ReactComponent as DeleteIcon } from "./icons/delete-icon.svg";
import { ReactComponent as SortIcon } from "./icons/import_export.svg";
import { useSelector } from "react-redux";
import { Content } from "../../redux/slices/driver-slice";
//import vozaci from '../../dummy/vozaci.json';

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
  display: "flex",
  backgroundColor: "white",
  padding: "20px",
  gap: "22px",
  p: {
    "&:first-of-type": {
      fontSize: "21px",
      fontWeight: "bold",
    },
    "&:last-of-type": {
      fontSize: "16px",
      marginBottom: "22px",
    },
  },
  svg: {
    marginRight: "10px",
  },
}));

export const DriversContent = (props: any) => {
  const drivers = useSelector((store: RootState) => store?.drivers?.content);
  const totalElements = useSelector(
    (store: RootState) => store?.drivers?.totalElements
  );
  const { setEditDriver, removeHandler, searchFilters, setSearchFilters } =
    props;
  const matches = useMediaQuery("(max-width:767px)");

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (event: SelectChangeEvent) => {
    setSearchFilters({
      ...searchFilters,
      sortBy: event.target.value as string,
    });
  };

  console.log(drivers);

  return (
    <Box>
      <Box sx={{ padding: { xs: '20px', md: "29px 35px" }}}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography
            sx={{ fontSize: "14px", color: "rgba(153, 153, 153, 1)", lineHeight: 'normal' }}
          >
            {`Ukupno ${totalElements} vozaca`}
          </Typography>
          <Box display={"flex"} gap={"10px"}>
            <Select
              onChange={handleSelect}
              value={searchFilters.sortBy}
              displayEmpty
              renderValue={(selected) => {
                console.log(selected);
                if (selected === null) {
                  return <Typography>Sortiraj po</Typography>;
                }
    
                return selected;
              }}
            >
              <MenuItem disabled key={''} value={""}>
                Sortiraj po
              </MenuItem>
              <MenuItem value={"ID"}>Id</MenuItem>
              <MenuItem value={"PHONE"}>Telefon</MenuItem>
              <MenuItem value={"NAME"}>Ime</MenuItem>
            </Select>
            <Button
              id={"main-filter"}
              sx={{ ml: "auto", mr: 1 }}
              startIcon={<SortIcon />}
              variant={"secondary"}
              aria-controls={open ? "filter-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={handleClick}
            >
              Sortiranje
            </Button>
            <Menu
              id="filter-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                "aria-labelledby": "main-filter",
                sx: {
                  padding: "0px",
                },
              }}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "center",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
            >
              <Box>
                <MenuItem
                  onClick={() =>
                    setSearchFilters({ ...searchFilters, direction: "ASC" })
                  }
                >
                  Uzlazno
                </MenuItem>
                <Divider sx={{ my: "0!important" }} />
                <MenuItem
                  onClick={() =>
                    setSearchFilters({ ...searchFilters, direction: "DESC" })
                  }
                >
                  Silazno
                </MenuItem>
              </Box>
            </Menu>
          </Box>
        </Box>
        <Container>
          {drivers?.map((item: any) => (
            <Item key={item.id}>
              <Avatar
                sx={{
                  height: "64px",
                  width: "64px",
                  fontSize: "21px",
                  fontWeight: "bold",
                  textTransform: "uppercase",
                }}
              >
                {item.name[0] + item.name[1]}
              </Avatar>
              <Box>
                <Typography sx={{ lineHeight: "28px" }}>
                  {item.name}
                </Typography>
                <Typography sx={{ lineHeight: "24px" }}>
                  {item.phone}
                </Typography>
                <Box sx={{ display: { xs: 'grid', md: 'unset' }, gridTemplateColumns: { xs: '1fr 1fr', md: 'unset' }  }}>
                  <Button
                    onClick={() => setEditDriver(item)}
                    variant={"text"}
                  >
                    <EditIcon />
                    Izmeni
                  </Button>
                  <Button
                    onClick={() => removeHandler(item.id)}
                    variant={"text"}
                  >
                    <DeleteIcon />
                    Ukloni
                  </Button>
                </Box>
              </Box>
            </Item>
          ))}
        </Container>
      </Box>
    </Box>
  );
};
