import React, { useEffect, useState } from 'react';
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
} from '@mui/material';
import { LoadingButton } from '@mui/lab';


const AssignVehicle = (props: any) => {
  const { id, open, setOpen, currentIndex, setCargoAddedData, cargoAddedData, vehicleType } = props;
  const [availableVehicles, setAvailableVehicles] = useState([]);
  const [addedSleper, setAddedSleper] = useState(false);
  const [sleper, setSleper] = useState([]);
  const [poluprikolica, setPoluprikolica] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = React.useState<any>('');
  const [selectedSleper, setSelectedSleper] = React.useState<any>('');
  const [selectedPolu, setSelectedPolu] = React.useState<any>('');

  const fetchAvailableVehicles = async () => {
    const { status, data } = await api.get(`${apiv1}vehicle/cargo/${id}/available/`);
    if (status === 200) {
      const tempAvailableVehicles: any = [];
      const tempSleper: any = [];
      const tempPoluprikolica: any = [];
      data.map((item: any) => {
        if (item.persistenceType === 'VEHICLE_WITH_TRAILER') tempSleper.push(item);
        else if (item.persistenceType === 'TRAILER') tempPoluprikolica.push(item);
        else tempAvailableVehicles.push(item);
      });
      setAvailableVehicles(tempAvailableVehicles);
      setSleper(tempSleper);
      setPoluprikolica(tempPoluprikolica);
    }
  };

  useEffect(() => {
    if (open) {
      fetchAvailableVehicles();
    }
    return () => {
      setSelectedVehicle('');
      setAvailableVehicles([]);
      // setCurrentIndex(null);
    }
  }, [open]);

  const changeHandler = (vehicle: any) => {
    if (vehicle === selectedVehicle) {
      setSelectedVehicle('');
    } else setSelectedVehicle(vehicle);
  };


  const acceptVehicle = () => {
    const tempData = cargoAddedData;
    tempData[currentIndex].vehicle = selectedVehicle
    setCargoAddedData(tempData);
    setOpen(false);
  };

  const addSleper = () => {
    setAddedSleper(true);
    setSelectedSleper(selectedVehicle)
  }

  const addPoluprikolica = () => {
    const tempData = cargoAddedData;
    tempData[currentIndex].vehicle = selectedSleper
    tempData[currentIndex].trailer = selectedVehicle
    setCargoAddedData(tempData);
    setAddedSleper(false)
    setOpen(false);
  }

  return (
    <Dialog open={open} onClose={setOpen}>
      <DialogTitle>Dodajte {addedSleper === true ? 'poluprikolicu' : 'vozilo'}</DialogTitle>
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
            <FormLabel sx={{ mb: 2 }} id="demo-radio-buttons-group-label">Lista vozila {availableVehicles?.length}</FormLabel>
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
            >
              {vehicleType?.name === 'šleper' && !addedSleper && sleper?.map((d: any, i: number) => {
                const checkUsed = cargoAddedData.filter((item: any) => item.vehicle.id === d.id);
                if (checkUsed.length > 0) return null;
                console.log(d.licensePlate);
                return (
                  <FormControlLabel
                    key={i} sx={{ width: '100%', mb: 2 }}
                    control={<Radio
                      checked={d === selectedVehicle}
                      value={d}
                      onClick={() => changeHandler(d)}
                    />}
                    label={
                      <Box sx={{ display: 'flex', gap: '10px', alignItems: 'center', textTransform: 'capitalize' }}>
                        {`${d?.type?.name !== '' ? d?.type?.name + ` - (${d?.licensePlate})` : ''}`}
                      </Box>}
                  />
                )
              })}
              {vehicleType?.name === 'šleper' && addedSleper && poluprikolica?.map((d: any, i: number) => {
                const checkUsed = cargoAddedData.filter((item: any) => item.trailer.id === d.id);
                if (checkUsed.length > 0) return null;
                return (
                  <FormControlLabel
                    key={i} sx={{ width: '100%', mb: 2 }}
                    control={<Radio
                      checked={d === selectedVehicle}
                      value={d}
                      onClick={() => changeHandler(d)}
                    />}
                    label={
                      <Box sx={{ display: 'flex', gap: '10px', alignItems: 'center', textTransform: 'capitalize' }}>
                        {`${d?.type?.name !== '' ? d?.type?.name + ` - (${d?.licensePlate})` : ''}`}
                      </Box>}
                  />
                )
              })}
              {vehicleType?.name === 'šleper' && !addedSleper && sleper?.length === 0 && (<Typography>Nema vozila</Typography>)}
              {vehicleType?.name === 'šleper' && addedSleper && poluprikolica?.length === 0 && (<Typography>Nema vozila</Typography>)}
              {vehicleType?.name !== 'šleper' && availableVehicles?.length === 0 && (<Typography>Nema vozila</Typography>)}
              {vehicleType?.name !== 'šleper' && availableVehicles?.map((d: any, i: number) => {
                const checkUsed = cargoAddedData.filter((item: any) => item.vehicle.id === d.id);
                if (checkUsed.length > 0) return null;
                return (
                  <FormControlLabel
                    key={i} sx={{ width: '100%', mb: 2 }}
                    control={<Radio
                      checked={d === selectedVehicle}
                      value={d}
                      onClick={() => changeHandler(d)}
                    />}
                    label={
                      <Box sx={{ display: 'flex', gap: '10px', alignItems: 'center', textTransform: 'capitalize' }}>
                        <Typography>
                          {`${d?.type?.name !== '' ? d?.type?.name + ` - (${d?.licensePlate})` : ''}`}
                        </Typography>
                      </Box>} />
                )
              })}
            </RadioGroup>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Box sx={{ width: "100%", padding: '10px 15px', display: 'flex', gap: '10px', flexDirection: 'column', marginTop: 'auto' }}>
          {vehicleType?.name === 'šleper' && (
            <LoadingButton
              disabled={sleper?.length < 1}
              size={'large'}
              onClick={() => { if (addedSleper) addPoluprikolica(); else addSleper() }}
              variant='contained'
            >
              Dodaj {addedSleper ? 'poluprikolicu' : 'šleper'}
            </LoadingButton>)}
          {vehicleType?.name !== 'šleper' && (
            <LoadingButton
              disabled={availableVehicles?.length < 1}
              size={'large'}
              onClick={() => acceptVehicle()}
              variant='contained'
            >
              Dodaj Vozilo
            </LoadingButton>)}
          <Button size={'large'} onClick={setOpen} variant='secondary'>Zatvori</Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}

export default AssignVehicle;
