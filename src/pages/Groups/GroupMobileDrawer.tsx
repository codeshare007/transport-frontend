import { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useDialog } from "../../context/ModalContext";
import { RootState } from '../../redux/store';
import { DefaultInput } from "../../components/common/micro/forms";
import { RightDrawer } from "../../components/RightDrawer";
import { Box, Typography, Divider, Button, IconButton } from "@mui/material";
import { ReactComponent as SearchIcon } from "../../assets/icons/search.svg";
import { ReactComponent as DeleteIcon } from "./icons/delete-icon.svg";
import { ReactComponent as PlusIcon } from "./icons/plus-blue-icon.svg";
import api from "../../api/base";
import { apiv1 } from "../../api/paths";
import { getGroup } from "../../redux/slices/group-slice";

const GroupMobileDrawer = (props: any) => {
  const { open, setGroupOpen } = props;
  const { showDialog } = useDialog();
  const [search, setSearch] = useState("");
  const dispatch = useDispatch();
  const companies = useSelector((state: RootState) => state?.companies?.result);
  const selectedGroup = useSelector((store: RootState) => store?.groups?.group);
  const [collaborators, setCollaborators] = useState<any[]>([]);
  const [mode, setMode] = useState('removing');
  const [collaboratorIds, setCollaboratorIds] = useState([]);

  useEffect(() => {
    if (selectedGroup && companies && mode) {
      setCollaboratorIds(selectedGroup.collaboratingCompanies.map((item: any) => item.companyId));
      if (mode == 'removing') {
        setCollaborators(selectedGroup.collaboratingCompanies);
      } else if (mode == 'adding') {
        const ids = selectedGroup.collaboratingCompanies.map((item: any) => { return item.companyId });
        const temp = companies.filter((company: any) => ids.indexOf(company.id) < 0);
        setCollaborators(temp.map((item: any) => { return { companyId: item.id, companyName: item.name, country: item.addressDetails.country, city: item.addressDetails.city } }));
      }
    }
  }, [selectedGroup, companies, mode]);

  useEffect(() => {
    if (mode == 'removing') {
      if (!search) {
        if (selectedGroup) {
          setCollaborators(selectedGroup.collaboratingCompanies);
        }
      } else {
        const temp = selectedGroup.collaboratingCompanies.filter((item: any) => item.companyName.toLowerCase().includes(search.toLowerCase()));
        setCollaborators(temp);
      }
    } else if (mode == 'adding') {
      if (!search) {
        if (selectedGroup) {
          const ids = selectedGroup.collaboratingCompanies.map((item: any) => { return item.companyId });
          const temp = companies.filter((company: any) => ids.indexOf(company.id) < 0);
          setCollaborators(temp.map((item: any) => { return { companyId: item.id, companyName: item.name, country: item.addressDetails.country, city: item.addressDetails.city } }));
        }
      } else {
        if (selectedGroup) {
          const ids = selectedGroup.collaboratingCompanies.map((item: any) => { return item.companyId });
          const temp = companies.filter((company: any) => ids.indexOf(company.id) < 0).map((item: any) => { return { companyId: item.id, companyName: item.name, country: item.addressDetails.country, city: item.addressDetails.city } });
          setCollaborators(temp.filter((item: any) => item.companyName.toLowerCase().includes(search.toLowerCase())));
        }
      }
    }

  }, [search]);

  const onChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const onRemoveHandler = async (id: string) => {
    const ids = collaboratorIds.filter((item: any) => item != id);
    const response = await api.put(apiv1 + 'target-group/' + selectedGroup.id, {
      name: selectedGroup.name,
      description: selectedGroup.description,
      collaborators: ids
    });
    if (response.status === 200) {
      dispatch(getGroup(selectedGroup.id));
    } else {
      showDialog(`Error - ${response.data.code}`, response.data.message);
    }
  }

  const onAddHandler = async (id: string) => {
    const ids = [...collaboratorIds, id];
    const response = await api.put(apiv1 + 'target-group/' + selectedGroup.id, {
      name: selectedGroup.name,
      description: selectedGroup.description,
      collaborators: ids
    });
    if (response.status === 200) {
      dispatch(getGroup(selectedGroup.id));
    } else {
      showDialog(`Error - ${response.data.code}`, response.data.message);
    }
  }

  return (
    <RightDrawer open={open} setOpen={() => setGroupOpen()}>
      <Box sx={{ py: "13px" }}>
        <Typography fontSize={"18px"} fontWeight={"700"}>Saradnici</Typography>
      </Box>
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
          sx={{ maxWidth: { xs: 'auto', md: '280px' }, width: { xs: '100%', md: '280px' }, paddingBottom: { xs: '16px', md: 0 }, ml: { xs: '0px', md: '20px' } }}
        />
      </Box>
      <Box sx={{ py: "13px", textAlign: "center" }}>
        <Typography fontSize={"16px"} fontWeight={"500"} lineHeight={"24px"}>{mode == 'removing' ? 'Grupa Saradnika ' : 'Dodaj u Grupu Saradnika '}{selectedGroup?.name}</Typography>
      </Box>
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-start', flexDirection: 'column' }}>
        {
          collaborators?.map((item: any) => (
            <Box key={item?.companyId}>
              <Box sx={{ display: 'flex', padding: '10px 0', flexDirection: 'row' }}>
                <Typography sx={{ width: '163px', fontSize: '14px', lineHeight: '22px' }}>Ime Kompanije:</Typography>
                <Box sx={{ maxWidth: '200px', fontWeight: '700', fontSize: '14px', lineHeight: '22px' }}>{item.companyName}</Box>
              </Box>
              <Divider />
              <Box sx={{ display: 'flex', padding: '10px 0', flexDirection: 'row' }}>
                <Typography sx={{ width: '163px', fontSize: '14px', lineHeight: '22px' }}>Zemlja:</Typography>
                <Box sx={{ maxWidth: '200px', fontWeight: '700', fontSize: '14px', lineHeight: '22px' }}>{item.country}</Box>
              </Box>
              <Divider />
              <Box sx={{ display: 'flex', padding: '10px 0', flexDirection: 'row' }}>
                <Typography sx={{ width: '163px', fontSize: '14px', lineHeight: '22px' }}>Grad:</Typography>
                <Box sx={{ maxWidth: '200px', fontWeight: '700', fontSize: '14px', lineHeight: '22px' }}>{item.city}</Box>
              </Box>
              <Divider />
              <Box sx={{ display: 'flex', padding: '0 0', flexDirection: 'row', justifyContent: 'center' }}>
                {
                  mode == 'removing' ? (
                    <IconButton onClick={() => { onRemoveHandler(item.companyId) }}>
                      <DeleteIcon />
                    </IconButton>
                  ) : (
                    <IconButton onClick={() => { onAddHandler(item.companyId) }}>
                      <PlusIcon />
                    </IconButton>
                  )
                }
              </Box>
              <Divider sx={{ height: '2px', backgroundColor: '#36CB83' }} />
            </Box>
          ))
        }
        <Box sx={{ pt: '10px', display: 'flex', flexDirection: 'column', gap: 1 }}>
          {
            mode == 'removing' ? (
              <><Button variant='contained' fullWidth size={'large'} onClick={() => { setMode('adding'); }}>
                Dodaj
              </Button><Button onClick={() => { setGroupOpen(false); setMode('removing'); }} variant='secondary' fullWidth size={'large'}>
                  Zatvori
                </Button></>
            ) : (
              <Button onClick={() => { setMode('removing'); }} variant='secondary' fullWidth size={'large'}>
                Zatvori
              </Button>
            )
          }
        </Box>
      </Box>
    </RightDrawer>
  )
}

export default GroupMobileDrawer;