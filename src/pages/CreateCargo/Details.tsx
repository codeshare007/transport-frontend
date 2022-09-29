import { useState, useEffect, Dispatch, SetStateAction, useCallback } from 'react';
import { RootState } from '../../redux/store';
import { useSelector } from 'react-redux';
import {
  Box,
  styled,
  Typography,
  Paper,
  Grid,
  InputLabel,
  Button,
  SelectChangeEvent,
  useMediaQuery,
} from '@mui/material';
import { ControlledSelect, InputItem, DefaultInput } from '../../components/common/micro/forms';
import { Formik, Field } from 'formik';
import { TextField, Autocomplete, CheckboxWithLabel } from 'formik-mui';
import { DatePicker, TimePicker } from 'formik-mui-lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { Cargo } from '../../types/cargo.types';
import debounce from 'lodash/debounce';

import { ReactComponent as OutboundIcon } from '../../assets/icons/outbond.svg';
import { ReactComponent as MapIcon } from '../../assets/icons/location.svg';
import moment from 'moment';
import api from '../../api/base';
import { apiv1 } from '../../api/paths';
import axios from 'axios';

export const StyledBox = styled(Box)(() => ({
}));

interface RegisterCargoTypes {
  cargoData: Cargo;
  setActiveStep: Dispatch<SetStateAction<number>>;
  setCargoData: Dispatch<SetStateAction<Cargo>>
}

export const Details = (props: RegisterCargoTypes) => {
  const vehicleType = useSelector((state: RootState) => state?.vehicles?.vehicleType);
  const vehicleBody = useSelector((state: RootState) => state?.vehicles?.bodyType);

  const { cargoData, setCargoData, setActiveStep } = props;

  const [availableType, setAvailableType] = useState<any[] | null>(null);

  const [selectedBodyTypeIds, setSelectedBodyTypeIds] = useState<any[]>([]);
  const [availableTrailers, setAvailableTrailers] = useState<any[]>([]);

  const [originFirm, setOriginFirm] = useState<any>([]);
  const [destinationFirm, setDestinationFirm] = useState<any>([]);

  const [origin, setOrigin] = useState<any>([]);
  const [destination, setDestination] = useState<any>([]);


  const hereMapsOriginHandler = debounce(async (val: string) => {
    const response = await axios.get('https://autocomplete.search.hereapi.com/v1/autocomplete', {
      params: {
        apiKey: process.env.REACT_APP_HERE_MAPS,
        q: val,
        limit: 5,
        in: 'countryCode:SRB,ALB,MNE,BIH',
      }
    });
    const data = response.data.items.map((item: any) => {
      return {
        street: item.address.street,
        city: item.address.city,
        houseNumber: item.address.houseNumber,
        address: item.address,
      }
    });
    setOrigin(data);
  });

  const hereMapsDestinationHandler = debounce(async (val: string) => {
    const response = await axios.get('https://autocomplete.search.hereapi.com/v1/autocomplete', {
      params: {
        apiKey: process.env.REACT_APP_HERE_MAPS,
        q: val,
        limit: 5,
        in: 'countryCode:SRB,ALB,MNE,BIH',
      }
    });
    const data = response.data.items.map((item: any) => {
      return {
        street: item.address.street,
        city: item.address.city,
        houseNumber: item.address.houseNumber,
        address: item.address,
      }
    })
    setDestination(data);
  });

  const debounceOriginFirm = debounce((value) => {
    api.get(apiv1 + 'locations/search', {
      params: {
        query: value,
        pageSize: 10,
        pageNo: 1,
      }
    })
      .then((res: any) => {
        if (res.status === 200 && res.data.content.length) {
          setOriginFirm(res.data.content);
        }
      })
      .catch((err: any) => {
        console.log(err.response.data);
      });
  }, 1000);

  const matches = useMediaQuery("(max-width:767px)");

  const debounceDestinationFirm = debounce((value) => {
    api.get(apiv1 + 'locations/search', {
      params: {
        query: value,
        pageSize: 10,
        pageNo: 1,
      }
    })
      .then((res: any) => {
        if (res.status === 200 && res.data.content.length) {
          setDestinationFirm(res.data.content);
        }
      })
      .catch((err: any) => {
        console.log(err.response.data);
      });
  }, 1000);


  const handleOrigin = (e: React.ChangeEvent<HTMLInputElement>) => {
    hereMapsOriginHandler(e.target.value);
  }
  const handleDestination = (e: React.ChangeEvent<HTMLInputElement>) => {
    hereMapsDestinationHandler(e.target.value);
  }

  const handleOriginSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    debounceOriginFirm(e.target.value);
  }
  const handleDestinationSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    debounceDestinationFirm(e.target.value);
  }

  useEffect(() => {
    const filteredBodies = vehicleBody?.filter((item: any) => item?.goodTypeIds?.includes(cargoData?.goodsDetails?.goodsTypeId)).filter((cargo: any) => {
      const filteredTypes = vehicleType?.filter((item: any) => item.bodyTypeIds?.includes(cargo.id));
      setAvailableType(filteredTypes);
    });
  }, [cargoData]);

  return (
    <Box sx={{ bgcolor: '#fff', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.05)' }}>
      <Box py={6} px={4}>
        <Typography mb={6} textAlign={'center'} variant='h2'>Detalji Transporta</Typography>
        {
          matches ? null
          : (
          <Box mb={4} display={'grid'} gridTemplateColumns={'1fr 1fr'}>
          <Typography display={'flex'} gap={'20px'} alignItems={'center'} variant='h3'>
            <OutboundIcon />
            Utovarno Mesto
          </Typography>
          <Typography display={'flex'} gap={'20px'} alignItems={'center'} variant='h3'>
            <OutboundIcon style={{ transform: 'rotate(-90deg)' }} />
            Istovarno Mesto
          </Typography>
        </Box>
          )
        }
        
        <Formik
          initialValues={{
            origin: {
              companyName: '',
              phoneNumbers: '',
              date: '',
              location: {
                street: '',
                city: '',
                houseNumber: '',
                locationId: '',
                address: {}
              }
            },
            destination: {
              companyName: '',
              phoneNumbers: '',
              date: '',
              location: {
                street: '',
                city: '',
                houseNumber: '',
                locationId: '',
                address: {}
              }
            },
            transportDetails: {
              vehicleTypeId: '',
              vehiclesRequired: 1,
              note: '',
              bodyTypes: [],
            },
          }}
          onSubmit={async (values, { setSubmitting }) => {
            setSubmitting(true);
            const tempValues = values;
            if (!values.origin.location.locationId) {
              const originId = await api.post(apiv1 + 'locations', {
                companyName: values.origin.companyName,
                city: values.origin.location.city,
                address: values.origin.location.houseNumber ? values.origin.location.street + ' ' + values.origin.location.houseNumber : values.origin.location.street,
                phoneNumber: values.origin.phoneNumbers[0],
              });
              tempValues.origin.location.locationId = originId.data.locationId;
            }
            if (!values.destination.location.locationId) {
              const destinationId = await api.post(apiv1 + 'locations', {
                companyName: values.destination.companyName,
                city: values.destination.location.city,
                address: values.destination.location.houseNumber ? values.destination.location.street + ' ' + values.destination.location.houseNumber : values.destination.location.street,
                phoneNumber: values.destination.phoneNumbers[0],
              });
              tempValues.destination.location.locationId = destinationId.data.locationId;
            }
            setCargoData({
              ...cargoData,
              originId: tempValues.origin.location.locationId,
              destinationId: tempValues.destination.location.locationId,
              transportDetails: tempValues.transportDetails,
              loadingDate: moment(tempValues.origin.date).format('YYYY-MM-DD'),
              unloadingDate: moment(tempValues.destination.date).format('YYYY-MM-DD'),
            });
            setTimeout(() => {
              setActiveStep(2)
            }, 800);
          }}
        >
          {({ submitForm, values, isSubmitting, setFieldValue }) => {
            return (

              <Grid container rowSpacing={'20px'} columnSpacing={'50px'}>
                {/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                  matches ? (
                      <>
                      <Grid display={'flex'} gap={'20px'} sx={{pl:'20px'}} alignItems={'center'} >
                      <Typography display={'flex'} gap={'10px'} sx={{pl:'20px'}} alignItems={'center'} variant='h3'>
                          <OutboundIcon />
                          Utovarno Mesto
                      </Typography>
                      </Grid>
                      
                      <Grid item xs={12} md={6}>
                  <InputLabel>Ime Firme *</InputLabel>
                  <Field
                    component={Autocomplete}
                    options={originFirm}
                    name={'origin'}
                    type={'text'}
                    noOptionsText={'Nema rezultata'}
                    freeSolo
                    disableClearable
                    onChange={(event: any, value: any) => {
                      event.preventDefault();
                      const {
                        companyName,
                        phoneNumbers,
                        city,
                        street,
                        streetNumber,
                        locationId,
                      } = value;
                      const formOriginAddress = streetNumber ? street + ' ' + streetNumber : street;
                      setFieldValue('origin.companyName', companyName);
                      setFieldValue('origin.phoneNumbers', phoneNumbers);
                      setFieldValue('origin.location.city', city);
                      setFieldValue('origin.location.street', formOriginAddress);
                      setFieldValue('origin.location.address.label', formOriginAddress);
                      setFieldValue('origin.location.locationId', locationId);
                    }}
                    getOptionLabel={(origin: any) => origin?.companyName || ''}
                    renderInput={(params: any) => (
                      <DefaultInput
                        {...params}
                        // We have to manually set the corresponding fields on the input component
                        name={'origin.companyName'}
                        placeholder={'Lokacija utovara'}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          handleOriginSearch(e);
                          setFieldValue('origin.companyName', e.target.value);
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <InputLabel>Lokacija Utovarnog Mesta *</InputLabel>
                  <Field
                    component={Autocomplete}
                    options={origin}
                    type={'text'}
                    noOptionsText={'Nema rezultata'}
                    name={'origin.location'}
                    filterSelectedOptions
                    freeSolo
                    getOptionLabel={(origin: any) => origin?.address.label || ''}
                    renderInput={(params: any) => (
                      <DefaultInput
                        {...params}
                        placeholder={'Lokacija utovara'}
                        onChange={handleOrigin}
                        name={'street'}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <InputLabel>Kontakt Telefon na Utovaru *</InputLabel>
                  <Field
                    component={TextField}
                    name={'origin.phoneNumbers[0]'}
                    type={'number'}
                    InputProps={{
                      startAdornment: (<Typography pr={1} borderRight={'1px solid #D7D7D7'}>
                        +381
                      </Typography>)
                    }}
                  />
                </Grid>
                <Grid display={'flex'} gap={'20px'} sx={{pl:'20px', pt:'30px'}} alignItems={'center'} >
                      <Typography display={'flex'} gap={'10px'} sx={{pl:'20px'}} alignItems={'center'} variant='h3'>
                      <OutboundIcon style={{ transform: 'rotate(-90deg)' }} />
                         Istovarno Mesto
                      </Typography>
                      </Grid>
                <Grid item xs={12} md={6}>
                  <InputLabel>Ime Firme *</InputLabel>
                  <Field
                    component={Autocomplete}
                    options={destinationFirm}
                    name={'destination'}
                    type={'text'}
                    noOptionsText={'Nema rezultata'}
                    freeSolo
                    disableClearable
                    onChange={(event: any, value: any) => {
                      event.preventDefault();
                      const {
                        companyName,
                        phoneNumbers,
                        city,
                        street,
                        streetNumber,
                        locationId,
                      } = value;
                      const formDestinationAddress = streetNumber ? street + ' ' + streetNumber : street;
                      setFieldValue('destination.companyName', companyName);
                      setFieldValue('destination.phoneNumbers', phoneNumbers);
                      setFieldValue('destination.location.city', city);
                      setFieldValue('destination.location.street', formDestinationAddress);
                      setFieldValue('destination.location.address.label', formDestinationAddress);
                      setFieldValue('destination.location.locationId', locationId);
                    }}
                    getOptionLabel={(destination: any) => destination?.companyName || ''}
                    renderInput={(params: any) => (
                      <DefaultInput
                        {...params}
                        // We have to manually set the corresponding fields on the input component
                        name={'destination.companyName'}
                        placeholder={'Lokacija utovara'}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          handleDestinationSearch(e);
                          setFieldValue('destination.companyName', e.target.value);
                        }}
                      />
                    )}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <InputLabel>Lokacija Istovarnog Mesta *</InputLabel>
                  <Field
                    component={Autocomplete}
                    options={destination}
                    type={'text'}
                    name={'destination.location'}
                    noOptionsText={'Nema rezultata'}
                    filterSelectedOptions
                    freeSolo
                    disableClearable
                    getOptionLabel={(destination: any) => destination?.address.label || ''}
                    renderInput={(params: any) => {
                      return (
                        <DefaultInput
                          {...params}
                          placeholder={'Lokacija istovara'}
                          onChange={handleDestination}
                          name={'street'}
                        />
                      )
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <InputLabel>Kontakt Telefon na Istovaru *</InputLabel>
                  <Field
                    component={TextField}
                    name={'destination.phoneNumbers[0]'}
                    type={'number'}
                    InputProps={{
                      startAdornment: (<Typography pr={1} borderRight={'1px solid #D7D7D7'}>
                        +381
                      </Typography>)
                    }}
                  />
                </Grid>
                      </>
                  )
                  :
                  (
                    <>
                      <Grid item xs={12} md={6}>
                  <InputLabel>Ime Firme *</InputLabel>
                  <Field
                    component={Autocomplete}
                    options={originFirm}
                    name={'origin'}
                    type={'text'}
                    noOptionsText={'Nema rezultata'}
                    freeSolo
                    disableClearable
                    onChange={(event: any, value: any) => {
                      event.preventDefault();
                      const {
                        companyName,
                        phoneNumbers,
                        city,
                        street,
                        streetNumber,
                        locationId,
                      } = value;
                      const formOriginAddress = streetNumber ? street + ' ' + streetNumber : street;
                      setFieldValue('origin.companyName', companyName);
                      setFieldValue('origin.phoneNumbers', phoneNumbers);
                      setFieldValue('origin.location.city', city);
                      setFieldValue('origin.location.street', formOriginAddress);
                      setFieldValue('origin.location.address.label', formOriginAddress);
                      setFieldValue('origin.location.locationId', locationId);
                    }}
                    getOptionLabel={(origin: any) => origin?.companyName || ''}
                    renderInput={(params: any) => (
                      <DefaultInput
                        {...params}
                        // We have to manually set the corresponding fields on the input component
                        name={'origin.companyName'}
                        placeholder={'Lokacija utovara'}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          handleOriginSearch(e);
                          setFieldValue('origin.companyName', e.target.value);
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <InputLabel>Ime Firme *</InputLabel>
                  <Field
                    component={Autocomplete}
                    options={destinationFirm}
                    name={'destination'}
                    type={'text'}
                    noOptionsText={'Nema rezultata'}
                    freeSolo
                    disableClearable
                    onChange={(event: any, value: any) => {
                      event.preventDefault();
                      const {
                        companyName,
                        phoneNumbers,
                        city,
                        street,
                        streetNumber,
                        locationId,
                      } = value;
                      const formDestinationAddress = streetNumber ? street + ' ' + streetNumber : street;
                      setFieldValue('destination.companyName', companyName);
                      setFieldValue('destination.phoneNumbers', phoneNumbers);
                      setFieldValue('destination.location.city', city);
                      setFieldValue('destination.location.street', formDestinationAddress);
                      setFieldValue('destination.location.address.label', formDestinationAddress);
                      setFieldValue('destination.location.locationId', locationId);
                    }}
                    getOptionLabel={(destination: any) => destination?.companyName || ''}
                    renderInput={(params: any) => (
                      <DefaultInput
                        {...params}
                        // We have to manually set the corresponding fields on the input component
                        name={'destination.companyName'}
                        placeholder={'Lokacija utovara'}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          handleDestinationSearch(e);
                          setFieldValue('destination.companyName', e.target.value);
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <InputLabel>Lokacija Utovarnog Mesta *</InputLabel>
                  <Field
                    component={Autocomplete}
                    options={origin}
                    type={'text'}
                    noOptionsText={'Nema rezultata'}
                    name={'origin.location'}
                    filterSelectedOptions
                    freeSolo
                    getOptionLabel={(origin: any) => origin?.address.label || ''}
                    renderInput={(params: any) => (
                      <DefaultInput
                        {...params}
                        placeholder={'Lokacija utovara'}
                        onChange={handleOrigin}
                        name={'street'}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <InputLabel>Lokacija Istovarnog Mesta *</InputLabel>
                  <Field
                    component={Autocomplete}
                    options={destination}
                    type={'text'}
                    name={'destination.location'}
                    noOptionsText={'Nema rezultata'}
                    filterSelectedOptions
                    freeSolo
                    disableClearable
                    getOptionLabel={(destination: any) => destination?.address.label || ''}
                    renderInput={(params: any) => {
                      return (
                        <DefaultInput
                          {...params}
                          placeholder={'Lokacija istovara'}
                          onChange={handleDestination}
                          name={'street'}
                        />
                      )
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <InputLabel>Kontakt Telefon na Utovaru *</InputLabel>
                  <Field
                    component={TextField}
                    name={'origin.phoneNumbers[0]'}
                    type={'number'}
                    InputProps={{
                      startAdornment: (<Typography pr={1} borderRight={'1px solid #D7D7D7'}>
                        +381
                      </Typography>)
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <InputLabel>Kontakt Telefon na Istovaru *</InputLabel>
                  <Field
                    component={TextField}
                    name={'destination.phoneNumbers[0]'}
                    type={'number'}
                    InputProps={{
                      startAdornment: (<Typography pr={1} borderRight={'1px solid #D7D7D7'}>
                        +381
                      </Typography>)
                    }}
                  />
                </Grid>
                    </>
                  )
                }
                








                <Grid mt={2} item xs={12}>
                  <Typography variant='h3'>
                    Vreme Transporta
                  </Typography>
                </Grid>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <Grid item xs={12} md={6}>
                    <InputLabel>Vreme Utovara *</InputLabel>
                    <Box gap={'11px'} sx={{ display: 'flex' }}>
                      <Field
                        component={DatePicker}
                        name={'origin.date'}
                        inputFormat={'dd/MM/yyyy'}
                        minDate={new Date()}
                      />
                      <Field
                        component={TimePicker}
                        inputFormat={'HH:mm'}
                        amPm={false}
                        dirty
                        name={'origin.time'}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <InputLabel>Vreme Istovara *</InputLabel>
                    <Box gap={'11px'} sx={{ display: 'flex' }}>
                      <Field
                        component={DatePicker}
                        name={'destination.date'}
                        inputFormat={'dd/MM/yyyy'}
                        minDate={values.origin.date}
                      />
                      <Field
                        component={TimePicker}
                        inputFormat={'HH:mm'}
                        amPm={false}
                        dirty
                        name={'destination.time'}
                      />
                    </Box>
                  </Grid>
                </LocalizationProvider>
                <Grid mt={2} item xs={12}>
                  <Typography variant='h3'>
                    Odaberi Vozilo
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <InputLabel>Tip vozila *</InputLabel>
                  <Field
                    component={ControlledSelect}
                    name={'transportDetails.vehicleTypeId'}
                    displayEmpty
                  >
                    <InputItem value={''} key={''} disabled>Odaberi</InputItem>
                    {vehicleType?.map((item: any) => {
                      if (item.name !== 'poluprikolica') {
                        return (
                          <InputItem
                            key={item.id}
                            value={item.id}
                            disabled={!item.available}
                            onClick={() => {
                              setSelectedBodyTypeIds(item.bodyTypeIds);
                            }}
                          >
                            {item.name}
                          </InputItem>
                        );
                      }
                    }
                    )}
                  </Field>
                </Grid>
                <Grid item xs={12} md={6}>
                  <InputLabel>Broj Vozila *</InputLabel>
                  <Field
                    component={ControlledSelect}
                    name={'transportDetails.vehiclesRequired'}
                    displayEmpty
                    formHelperText={{ children: '* broj vozila odgovornost narucioca' }}
                  >
                    <InputItem value={'1'} key={''} disabled>Odaberi</InputItem>
                    {Array.from(Array(10).keys()).map((item: any) => (
                      <InputItem key={item} value={item + 1}>
                        {item + 1}
                      </InputItem>
                    ))}
                  </Field>
                </Grid>
                <Grid item xs={12} md={6}>
                  {values.transportDetails.vehicleTypeId && (
                    <>
                      <InputLabel>Vrsta Karoserije *</InputLabel>
                      <Box display={'grid'} gridTemplateColumns={'1fr 1fr'}>
                        {vehicleBody?.filter((item: any) => item?.goodTypeIds?.includes(cargoData?.goodsDetails?.goodsTypeId) && selectedBodyTypeIds.includes(item.id))?.map((item: any) => {
                          return (
                            <Field
                              key={item.id}
                              component={CheckboxWithLabel}
                              type="checkbox"
                              name="transportDetails.bodyTypes"
                              Label={{ label: item.name }}
                              value={item.id}
                            />
                          )
                        })}
                      </Box>
                    </>
                  )}
                </Grid>
                <Grid item alignSelf={'end'} xs={12} md={6}>
                  <InputLabel>Dodatne beleske</InputLabel>
                  <Field
                    component={TextField}
                    name={'transportDetails.note'}
                    type={'text'}
                  />
                </Grid>
                <Grid item xs={12} md={12}>
                  <Button disabled={isSubmitting} variant={'contained'} fullWidth size={'large'} onClick={submitForm}>
                    Sledeće
                  </Button>
                </Grid>
                <Grid item xs={12} md={12}>
                  <Button variant={'secondary'} fullWidth size={'large'} onClick={() => setActiveStep(0)}>
                    Nazad
                  </Button>
                </Grid>
              </Grid>
            )
          }}
        </Formik>
      </Box>
    </Box >
  )
}
