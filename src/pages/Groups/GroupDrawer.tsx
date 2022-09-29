import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { searchCompanies } from '../../redux/slices/transport-slice';
import { getGroup } from '../../redux/slices/group-slice';
import { TargetGroupDrawer } from '../../components/TargetGroupDrawer';
import { Avatar, Typography, Box, Checkbox, Button } from '@mui/material';
import { TableContainer, TableBody, TableHead, TableRow, Table } from '@mui/material';
import { DefaultInput } from "../../components/common/micro/forms";
import { StyledTableCell, StyledTableBodyCell } from './GroupStyled';
import { ReactComponent as SearchIcon } from "../../assets/icons/search.svg";
import { ReactComponent as PlusIcon } from "./icons/plus-icon.svg";
import { ReactComponent as CloseIcon } from "./icons/close-icon-white.svg";
import api from '../../api/base';
import { apiv1 } from '../../api/paths';
import { useDialog } from '../../context/ModalContext';
export interface GroupDrawerProps {
  open: boolean;
  setGroupOpen: (oepn: boolean) => void;
  selectedGroupData: any;
  setCompanyDrawerData: (data: any) => void;
  setCompanyDrawerOpen: (oepn: boolean) => void;
}

const GroupDrawer = (props: GroupDrawerProps) => {
  const { open, setGroupOpen, selectedGroupData, setCompanyDrawerData, setCompanyDrawerOpen } = props;
  const { showDialog } = useDialog();
  const [search, setSearch] = useState("");
  const dispatch = useDispatch();
  const selectedGroup = useSelector((store: RootState) => store?.groups?.group);
  const [collaborators, setCollaborators] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [availableRemoving, setAvailableRemoving] = useState(false);
  const [searchFilters, setSearchFilters] = useState<any>({
    sortDirection: 'ASC',
    status: '',
    pageNo: 0,
    pageSize: 100,
    name: ''
  });

  useEffect(() => {
    if (selectedGroup) {
      const temp = selectedGroup.collaboratingCompanies.map((item: any) => { return { ...item, selected: false } });
      setCollaborators(temp);
    }
  }, [selectedGroup]);

  useEffect(() => {
    const selectedItems = collaborators.filter((item: any) => item.selected);
    if (selectedItems.length > 0) {
      setAvailableRemoving(true);
    } else {
      setAvailableRemoving(false);
    }
  }, [collaborators])

  const onChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const searchHandler = () => {
    if (search == '') {
      const temp = selectedGroup.collaboratingCompanies.map((item: any) => { return {...item, selected: false }});
      setCollaborators(temp);
    } else {
      const temp = selectedGroup.collaboratingCompanies.filter((item: any) => { return item.companyName.toLowerCase().includes(search.toLowerCase()) });
      setCollaborators(temp.map((item:any) => { return {...item, selected: false} }));
    }
  };

  const drawerHandler = () => {
    setGroupOpen(!open);
  };

  const onRemoveCollaborators = async () => {
    const collaboratorIds = collaborators.filter((item: any) => !item.selected).map((item: any) => item.companyId);
    const response = await api.put(apiv1 + 'target-group/' + selectedGroup.id, {
      name: selectedGroup.name,
      description: selectedGroup.description,
      collaborators: collaboratorIds
    });
    if (response.status === 200) {
      // const temp = collaborators.filter((item: any) => collaboratorIds.indexOf(item.companyId) < 0);
      // setCollaborators(temp);
      dispatch(getGroup(selectedGroup.id));
    }
    if (response.status !== 200) {
      showDialog(`Error - ${response.data.code}`, response.data.message);
    }
  }

  const onSelectHandler = (id: string) => {
    const temp = collaborators.map((item: any) => { return item.companyId == id ? { ...item, selected: !item.selected } : item; });
    setCollaborators(temp);
  }

  const getCircleName = (name: string) => {
    const strs = name.split(' ').map((str) => { return str[0] });
    return strs[0] + strs[1];
  };

  return (
    <TargetGroupDrawer setOpen={() => setGroupOpen(false)} open={open}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row", sm: 'column-reverse' },
          gap: { xs: 0, md: "10px" },
          padding: { xs: "0 22px", md: "0 22" },
          alignItems: "flex-end",
        }}
      >
        <Box
          sx={{ alignItems: 'flex-start', width: { xs: "100%", md: "50%" }, py: { xs: 2, md: 4 }, px: { xs: 2, md: 4 }, padding: { xs: "0 0", md: "0 0" } }}
          display={"flex"}
          justifyContent={"start"}
          alignItems={"center"}
          marginBottom={"10px"}

        >
          <DefaultInput
            placeholder={"Traži"}
            value={search}
            name={"filter"}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChangeSearch(e)}
            InputProps={{
              startAdornment: <SearchIcon />,
            }}
            sx={{ maxWidth: { xs: 'auto', md: '280px' }, width: { xs: '100%', md: '280px' }, paddingBottom: { xs: '16px', md: 0 }, ml: { xs: '0px', md: '20px'} }}
          />
          <Button
            sx={{ py: "10px", ml: "15px" }}
            onClick={() => searchHandler()}
            variant={"contained"}
          >
            Traži
          </Button>
        </Box>
        <Box
          sx={{
            width: { xs: "100%", md: "50%" },
            // display: "flex",
            flexDirection: { xs: "row", md: "row" },
            gap: { xs: 0, md: "10px" },
            flexWrap: "wrap",
            justifyContent: "center"
          }}
        >
          <Typography sx={{ fontSize: { xs: '28px', md: '28px' }, textAlign: { xs: 'center', md: 'center' }, padding: { xs: '0' }, fontWeight: '800', lineHeight: '35px' }}>
            Grupa Saradnika
          </Typography>
          <Typography sx={{ fontSize: { xs: '28px', md: '28px' }, textAlign: { xs: 'center', md: 'center' }, padding: { xs: '0' }, fontWeight: '800', lineHeight: '35px' }}>
            {selectedGroup?.name}
          </Typography>
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          marginTop: '50px',
          bgcolor: '#fafafa',
        }}
        justifyContent={"right"}
        alignItems={"flex-end"}
      >
        <Button
          sx={{
            margin: { xs: "10px", md: "20px" },
            display: 'flex',
            justifyContent: 'space-between',
            padding: '10px 29px 10px 15px',
            width: { xs: "128px" },
            backgroundColor: '#F1404B',
            borderColor: '#F1404B',
            fontWeight: '700',
            fontSize: '14px',
            fontFamily: 'Overpass',
            lineHeight: '22px',
            '&:disabled': {
              backgroundColor: '#F1404B',
            },
          }}
          startIcon={<CloseIcon />}
          color="error"
          onClick={() => { onRemoveCollaborators() }}
          variant={"contained"}
          disabled={!availableRemoving}
        >
          Ukloni
        </Button>
        <Button
          sx={{
            margin: { xs: "10px", md: "20px" },
            display: 'flex',
            justifyContent: 'space-between',
            padding: '10px 29px 10px 15px',
            width: { xs: "128px" },
            fontWeight: '700',
            fontSize: '14px',
            fontFamily: 'Overpass',
            lineHeight: '22px'
          }}
          startIcon={<PlusIcon />}
          onClick={() => {
            setCompanyDrawerData(selectedGroupData);
            setCompanyDrawerOpen(true);
            dispatch(searchCompanies(searchFilters));
            dispatch(getGroup(selectedGroupData.id));
          }}
          variant={"contained"}
        >
          Dodaj
        </Button>
      </Box>
      <Box sx={{ padding: '0px 32px 0px 18px', bgcolor: '#fafafa', width: { xs: '100%', md: 'auto' }, minHeight: 'calc(100vh - 420px)' }}>
        <TableContainer sx={{ bgcolor: '#fafafa', width: { xs: '100%', md: 'auto' }, maxHeight: "calc(100vh - 450px)" }} component={Box}>
          <Table sx={{ borderCollapse: 'separate', borderSpacing: '0px 10px' }} aria-label='simple table'>
            <TableHead sx={{ backgroundColor: '#fafafa', border: 'none' }}>
              <TableRow>
                <StyledTableCell>Broj</StyledTableCell>
                <StyledTableCell>Ime Kompanije</StyledTableCell>
                <StyledTableCell>Zemlja</StyledTableCell>
                <StyledTableCell>Grad</StyledTableCell>
                <StyledTableCell align='center'>Obelezi</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody sx={{ overflowY: 'scroll', '*': { textTransform: 'capitalize' } }}>
              {collaborators.map((row: any, index: number) => (
                <TableRow
                  key={row?.companyId}
                  onClick={() => { onSelectHandler(row.companyId) }}
                  sx={{
                    backgroundColor: '#fff',
                    height: '75px',
                    borderRadius: '4px',
                    '&:hover': {
                      cursor: 'pointer',
                      backgroundColor: '#f5f5f5',
                      'th': {
                        borderColor: '#36CB83',
                      },
                    },
                    border: "1px solid #E7E7E7"
                  }}
                >
                  <StyledTableBodyCell sx={{ textTransform: 'uppercase' }}>
                    {index + 1}
                  </StyledTableBodyCell>
                  <StyledTableBodyCell>
                    <Box sx={{ display: "flex" }}>
                      <Avatar
                        sx={{
                          height: "47px",
                          width: "47px",
                          fontSize: "18px",
                          fontWeight: "700",
                          lineHeight: "26px",
                          textTransform: "uppercase",
                        }}
                      >
                        {row?.companyName[0] + row?.companyName[1]}
                      </Avatar>
                      <Box
                        sx={{ display: "flex", alignItems: "center", pl: "13px" }}
                      ><Typography sx={{ verticalAlign: "center", fontSize: "16px", textAlign: { xs: 'center', md: 'center' }, fontWeight: '500', lineHeight: '24px' }}>
                          {row?.companyName}
                        </Typography></Box>
                    </Box>
                  </StyledTableBodyCell>
                  <StyledTableBodyCell>
                    {row?.country}
                  </StyledTableBodyCell>
                  <StyledTableBodyCell>
                    {row?.city}
                  </StyledTableBodyCell>
                  <StyledTableBodyCell align='center'>
                    <Checkbox disabled checked={row?.selected} />
                  </StyledTableBodyCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Box style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10, padding: "10px 140px 30px 195px", background: "#fafafa" }}>
        <Button onClick={() => { drawerHandler() }} variant='secondary' size={'large'}>Zatvori</Button>
      </Box>
    </TargetGroupDrawer>
  )
}

export default GroupDrawer;