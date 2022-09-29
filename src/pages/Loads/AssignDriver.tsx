import React, { useEffect } from 'react';
import api from '../../api/base';
import { apiv1 } from '../../api/paths';
import { useDialog } from '../../context/ModalContext';
import { DefaultInput } from '../../components/common/micro/forms';
import { some } from 'lodash';
import { ReactComponent as SearchIcon } from '../../assets/icons/search.svg';
import {
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  Box,
  FormControl,
  FormLabel,
  FormControlLabel,
  RadioGroup,
  Button,
  Radio,
  Typography,
  Avatar,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';


const AssignDriver = (props: any) => {
  const { id, open, setOpen, setCargoAddedData, cargoAddedData, currentIndex, setCurrentIndex } = props;
  const [availableDrivers, setAvailableDrivers] = React.useState([]);
  const [selectedDriver, setSelectedDriver] = React.useState<any>(null);

  const fetchAvailableVehicles = async () => {
    const { status, data } = await api.get(`${apiv1}drivers/cargo/${id}/available/`);
    if (status === 200) {
      setAvailableDrivers(data.content)
    }
  };

  useEffect(() => {
    if (open) {
      fetchAvailableVehicles();
    }
    return () => {
      setSelectedDriver(null);
      setAvailableDrivers([]);
      // setCurrentIndex(null);
    }
  }, [open]);

  const changeHandler = (driver: any) => {
    if (driver?.id === selectedDriver?.id) {
      setSelectedDriver('');
    } else setSelectedDriver(driver);
  };
  

  const acceptVehicle = () => {
    const tempData = cargoAddedData;
    tempData[currentIndex].driver = selectedDriver
    setCargoAddedData(tempData);
    setOpen(false);
  };


  return (
    <Dialog open={open} onClose={setOpen}>
      <DialogTitle>Dodajte vozača</DialogTitle>
      <DialogContent dividers>
        <Box sx={{ width: "100%", padding: 1, }}>
          <DefaultInput
            icon={<SearchIcon />}
            placeholder={'Traži'}
            InputProps={{
              startAdornment: (<SearchIcon />)
            }}
            fullWidth
          />
          <FormControl sx={{ mt: 2 }}>
            <FormLabel sx={{ mb: 2 }} id="demo-radio-buttons-group-label">Lista vozača {availableDrivers?.length}</FormLabel>
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
            >
              {availableDrivers?.length > 0 ? availableDrivers?.map((d: any, i: number) => {
                const checkUsed = cargoAddedData.filter((item: any) => item.driver.id === d.id);
                if (checkUsed.length > 0) return null;
                return (
                <FormControlLabel
                  key={i} sx={{ width: '100%', mb: 2 }}
                  control={<Radio
                    checked={d.id === selectedDriver?.id ? true : false}
                    value={d.id}
                    onClick={() => changeHandler(d)}
                  />}
                  label={
                    <Box sx={{ display: 'flex', gap: '10px', alignItems: 'center', textTransform: 'capitalize' }}>
                      <Avatar sx={{ height: '40px', width: '40px', fontSize: '16px', fontWeight: 'bold', textTransform: 'uppercase' }}>
                        {d.name[0] + d.name[1]}
                      </Avatar>
                      {`${d.name} ${d.phone}`}
                    </Box>} />
              )})
                : <Typography>Nema vozača</Typography>}
            </RadioGroup>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Box sx={{ width: "100%", padding: '10px 15px', display: 'flex', gap: '10px', flexDirection: 'column', marginTop: 'auto' }}>
          <LoadingButton
            disabled={availableDrivers?.length < 1}
            size={'large'}
            onClick={() => acceptVehicle()}
            variant='contained'
          >
            Dodaj Vozača
          </LoadingButton>
          <Button size={'large'} onClick={setOpen} variant='secondary'>Zatvori</Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}

export default AssignDriver;
