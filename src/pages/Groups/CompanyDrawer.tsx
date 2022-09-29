import React, { useState, useEffect, ChangeEvent } from "react";
import { useSelector } from 'react-redux';
import { useAppDispatch, RootState } from '../../redux/store';
import { searchCompanies } from '../../redux/slices/transport-slice';
import { getGroup } from '../../redux/slices/group-slice';
import { TargetGroupDrawer } from '../../components/TargetGroupDrawer';
import { Typography, Box, Button, Divider, Paper, List } from '@mui/material';
import CompanyGroup from "./CompanyGroup";
import SelectedGroup from "./SelectedGroup";
import { DefaultInput } from "../../components/common/micro/forms";
import { ReactComponent as SearchIcon } from "../../assets/icons/search.svg";
import api from '../../api/base';
import { apiv1 } from '../../api/paths';
import { useDialog } from '../../context/ModalContext';


const CompanyDrawer = (props: any) => {
  const { setCompanyDrawerOpen, open } = props;
  const { showDialog } = useDialog();
  const companies = useSelector((state: RootState) => state?.companies?.result);
  const group = useSelector((state: RootState) => state?.groups?.group);
  const [collaborators, setCollaborators] = useState([]);
  const [targetCompanies, setTargetCompanies] = useState<any[]>([]);
  const dispatch = useAppDispatch();
  const [searchFilters, setSearchFilters] = useState<any>({
    sortDirection: 'ASC',
    status: '',
    pageNo: 0,
    pageSize: 100,
    name: ''
  });

  useEffect(() => {
    if (group) {
      const temp = group.collaboratingCompanies.map((item: any) => { return { id: item.companyId, name: item.companyName } });
      setCollaborators(temp);
    }
  }, [group])

  useEffect(() => {
    const temp: any[] = companies?.map((company: any) => {
      const isSelected = collaborators.findIndex((collaborator: any) => company.id == collaborator.id) != -1;
      return { ...company, isSelected }
    });
    setTargetCompanies(temp);
  }, [collaborators, companies])

  const inputHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchFilters({
      ...searchFilters,
      [e.target.name]: e.target.value
    });
  };

  useEffect(() => {
    dispatch(searchCompanies(searchFilters));
  }, [searchFilters])

  const drawerHandler = () => {
    setCompanyDrawerOpen(!open);
  };

  const addCompanies = async () => {
    const response = await api.put(apiv1 + 'target-group/' + group.id, {
      name: group.name,
      description: group.description,
      collaborators: collaborators.map((item: any) => item.id)
    });
    if (response.status === 200) {
      dispatch(getGroup(group.id))
    }
    if (response.status !== 200) {
      showDialog(`Error - ${response.data.code}`, response.data.message);
    }
  };

  return (
    <TargetGroupDrawer setOpen={() => { setCompanyDrawerOpen(false); }} open={open}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row", sm: 'column-reverse' },
          gap: { xs: 0, md: "10px" },
          padding: { xs: "0 16px", md: "0 38px" },
          alignItems: "flex-end",
          marginBottom: "20px"
        }}
      >
        <Box
          bgcolor={"#fafafa"}
          sx={{ alignItems: 'flex-start', width: { xs: "100%", md: "50%" }, py: { xs: 2, md: 4 }, px: { xs: 2, md: 4 }, padding: { xs: "0 0", md: "0 0" } }}
          display={"flex"}
          justifyContent={"start"}
          alignItems={"center"}
          marginBottom={"10px"}

        >
          <DefaultInput
            placeholder={"Traži"}
            value={searchFilters.name}
            name={'name'}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => { inputHandler(e) }}
            InputProps={{
              startAdornment: <SearchIcon />,
            }}
            sx={{ maxWidth: { xs: 'auto', md: '500px' }, width: { xs: '100%', md: '422px' }, paddingBottom: { xs: '16px', md: 0 } }}
          />
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
            {group?.name}
          </Typography>
        </Box>
      </Box>
      <Box sx={{ padding: '20px 106px 20px 21px', bgcolor: '#fafafa', width: { xs: '100%', md: 'auto' }, mb: "20px", maxHeight: 'calc(100vh - 380px)'}}>
        <Box
          sx={{
            maxWidth: { xs: '100%', md: '100%' },
            width: { xs: '100%', md: '100%' },            
            height: { xs: '50%', md: '50%' },
          }}
        >
          <Paper style={{ width: '100%', maxHeight: '100%', background: '#fafafa', overflow: 'auto', borderRadius: '0px', boxShadow: 'none', padding: "0px 0px 0px 56px" }}>
            <CompanyGroup collaborators={collaborators} setCollaborators={setCollaborators} targetCompanies={targetCompanies} />
          </Paper>
        </Box>
        <Divider sx={{ width: '940px', border: '2px solid #EBEBEB', backgroundColor: '#EBEBEB' }} />
        <Box
          sx={{
            width: { xs: '100%', md: '100%' },
            height: { xs: '50%', md: '50%' },
          }}
        >
          <Typography sx={{ textTransform: 'uppercase', fontSize: { xs: '13px', md: '13px' }, textAlign: { xs: 'left', md: 'left' }, fontWeight: '700', padding: '10px 10px 10px 22px', lineHeight: '19px', color: '#999999' }}>
            Odabrane kompanije
          </Typography>
          <Paper style={{ maxHeight: '100%', background: '#fafafa', overflow: 'auto', borderRadius: '0px', boxShadow: 'none', padding: "0px 0px 0px 56px" }}>
            <SelectedGroup collaborators={collaborators} setCollaborators={setCollaborators} />
          </Paper>
        </Box>
      </Box>
      <Box style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10, padding: '20px 20%' }}>
        <Button variant='contained' fullWidth size={'large'} onClick={() => { addCompanies(); drawerHandler(); }}>Dodaj Kompanije</Button>
        <Button variant='secondary' fullWidth size={'large'} onClick={() => { drawerHandler(); }} >Zatvori</Button>
      </Box>
    </TargetGroupDrawer >
  )
}

export default CompanyDrawer;