import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { VehicleAdd } from './Vehicle.types';
import { RightDrawer } from '../../components/RightDrawer';
import { LoadingButton } from '@mui/lab';
import {
  Typography,
  Box,
  InputLabel,
  Radio,
  Grid,
  Button,
} from '@mui/material';
import { ControlledSelect, InputItem } from '../../components/common/micro/forms';
import { TextField } from 'formik-mui';
import { Formik, Field } from 'formik';


import { ReactComponent as AddIcon } from '../../assets/icons/add_circle_outline.svg';
import { ReactComponent as RemoveIcon } from '../../assets/icons/remove_circle_outline.svg';
import { ReactComponent as KombiIcon } from '../../assets/icons/kombi.svg';
import { ReactComponent as KamionSmall } from '../../assets/icons/kamion-small.svg';
import { ReactComponent as KamionBig } from '../../assets/icons/kamion-big.svg';
import { ReactComponent as Sleper } from '../../assets/icons/sleper.svg';
import { ReactComponent as Polu } from '../../assets/icons/polu.svg';
import { getAllVehicles } from '../../redux/slices/vehicle-slice';


export interface VehicleDrawerProps {
  open: { open: boolean, edit?: boolean };
  setOpen: ({ open }: any) => void;
  vehicleData: any;
  setVehicleData: (vehicleData: VehicleAdd) => void;
  setSelectedInput: (data: any) => void;
  selectedInput: any;
  trailerData: any;
  setTrailerData: any;
}

const VehicleDrawer = (props: VehicleDrawerProps) => {
  const bodyType = useSelector((store: RootState) => store?.vehicles?.bodyType);
  const vehicleType = useSelector((store: RootState) => store?.vehicles?.vehicleType);

  const { open, setOpen, setVehicleData, vehicleData, setSelectedInput, selectedInput, setTrailerData, trailerData } = props;
  const dispatch = useDispatch();

  const [trailer, setTrailer] = useState<boolean>(false);
  const [addTrailer, setAddTrailer] = useState<boolean>(false);

  const [matchedBodies, setMatchedBodies] = useState<any>([]);
  const [selectedType, setSelectedType] = useState<string | null>(null);


  useEffect(() => {
    const matchedType = vehicleType?.find((type: any) => type.id === selectedType);

    if (matchedType?.name === 'poluprikolica') setTrailer(true);
    else setTrailer(false);
    if (matchedType) {
      matchedType.bodyTypeIds.map((body: string) => {
        const bodies = bodyType.find((item: any) => item.id === body);
        if (bodies) {
          setMatchedBodies((prev: any) => [...prev, bodies]);
        };
        return null;
      });
    }
  }, [selectedType]);

  useEffect(() => {
    if (open && vehicleData.vehicleTypeId) { 
      setSelectedType(vehicleData.vehicleTypeId);
    }
  }, [vehicleData]);

  return (
    <RightDrawer setOpen={() => setOpen({ open: false, edit: false })} open={open.open}>
      <Typography sx={{fontSize: {xs: '24px', md: '28px'}, textAlign: {xs: 'left', md: 'center'}, padding: {xs: '20px 0'}, fontWeight: 'bold' }}>
        {open.edit ? 'Izmeni Vozilo' : 'Dodaj Vozilo'}
      </Typography>
      <Formik
        initialValues={vehicleData}
        onSubmit={(values, { setSubmitting }) => {
          const tempValues = values;
          const tempTrailerData = vehicleType.filter((item: any) => item.name === 'poluprikolica')[0];
          if (values.trailer) setTrailerData({ ...values.trailer, vehicleTypeId: tempTrailerData.id });
          delete tempValues.trailer;
          setVehicleData(values);
          dispatch(getAllVehicles({
            direction: 'DESC',
            pageNo: 0,
            pageSize: 10,
            sortBy: null,
          }))
          if (!open.edit) setOpen({ open: false, edit: null });
          else setOpen({ open: false, edit: true });
        }}
      >
        {({ submitForm, errors, values, setValues }) => (
          <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', }}>
            <InputLabel sx={{overflow: {xs: 'inherit', md: 'hidden'}}} >Tip Vozila *</InputLabel>
            <Box mb={2} display={{xs: 'flex', md:'grid'}} flexDirection={{xs: 'column'}} gridTemplateColumns={'repeat(5, 1fr)'} gap={'5px'}>
              {vehicleType.map((type: any) => {
                return (
                  <Box
                    gap={'10px'}
                    display={'flex'}
                    flexDirection={{xs:'row', md:'column'}}
                    justifyContent={'space-between'}
                    alignItems={'center'}
                    bgcolor={values?.vehicleTypeId === type.id ? '#EFFBF5' : '#F5F5F5'}
                    borderRadius={'4px'}
                    border={values?.vehicleTypeId === type.id ? '1px solid #36CB83;' : '1px solid transparent'}
                    py={3}
                    px={{xs: 2}}
                    key={type.id}
                    sx={{
                      svg: {
                        height: '30px'
                      }
                    }}
                  >
                    {type.name === 'kombi i laka dostavna vozila' && <KombiIcon />}
                    {type.name === 'kamioni do 7,5t' && <Sleper />}
                    {type.name === 'kamion preko 7,5t' && <KamionSmall />}
                    {type.name === 'šleper' && <KamionBig />}
                    {type.name === 'poluprikolica' && <Polu />}

                    <Typography
                      textAlign={'center'}
                      lineHeight={'16px'}
                      fontSize={'14px'}
                      fontWeight={'bold'}
                      textTransform={'capitalize'}
                    >
                      {type.name}
                    </Typography>
                    <Radio
                      checked={values.vehicleTypeId === type.id}
                      onChange={() => { setValues({ ...values, vehicleTypeId: type.id }); setSelectedInput({ name: type.name }); setMatchedBodies([]); setSelectedType(type.id); }}
                      value={type.id}
                      name={'vehicleTypeId'}
                      inputProps={{ 'aria-label': 'A' }}
                      sx={{
                        padding: '0',
                      }}
                    />
                  </Box>
                )
              })}
            </Box>
            <InputLabel sx={{overflow: {xs: 'inherit', md: 'hidden'}}} >Registarske Tablice *</InputLabel>
            <Field
              component={TextField}
              name={'licensePlate'}
              type={'text'}
              sx={{
                width: '100%',
                marginBottom: '20px',
              }}
              placeholder={'BG123XX'}
              inputProps={{
                sx: {
                  textAlign: {xs: 'left', md:'center'},
                  fontSize: {xs:'20px', md:'28px'},
                  lineHeight: '35px',
                  fontWeight: {xs:'none', md:'bold'},
                  padding: {xs: '5px 15px', md:'23px 0'},
                }
              }}
            />
            {selectedInput.name !== 'šleper' ? (
              <Grid mb={2} flexWrap={'wrap'} height={'auto'} sx={{display: {xs: 'contents', md: 'flex' }}} spacing={'26px'}>
                <Grid item xs={6}>
                  <Grid sx={{ mb: '28px' }} item xs={12}>
                    <InputLabel>
                      Tip {trailer ? 'Poluprikolice' : 'Karoserije'} *
                    </InputLabel>
                    <Field
                      component={ControlledSelect}
                      name={'bodyTypeId'}
                      type={'text'}
                      sx={{
                        width: '100%',
                      }}
                      value={values?.bodyTypeId || ''}
                      formControl={{ sx: { width: '100%' } }}
                      displayEmpty
                    >
                      <InputItem value={''} key={''}>Odaberi {trailer ? 'Poluprikolicu' : 'Karoseriju'} *</InputItem>
                      {matchedBodies?.map((item: any) => {
                        return (
                          <InputItem
                            value={item.id !== '' ? item.id : ''}
                            sx={{ textTransform: 'capitalize' }}
                            key={item.id}
                          >
                            {item.name}
                          </InputItem>
                        )
                      })}
                    </Field>
                  </Grid>
                  <Grid item xs={12}>
                    <InputLabel>
                      Dimenzije {trailer ? 'Poluprikolice' : 'Vozila'} *
                    </InputLabel>
                  </Grid>
                  <Grid container spacing={'15px'} rowSpacing={'15px'}>
                    <Grid item xs={6}>
                      <Field
                        component={TextField}
                        name={'length'}
                        type={'number'}
                        placeholder={'Dužina'}
                        InputProps={{
                          endAdornment: (<Typography variant={'body1'}>m</Typography>)
                        }}
                        sx={{
                          width: '100%',
                        }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <Field
                        component={TextField}
                        name={'height'}
                        type={'number'}
                        placeholder={'Visina'}
                        InputProps={{
                          endAdornment: (<Typography variant={'body1'}>m</Typography>),
                        }}
                        sx={{
                          width: '100%',
                        }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <Field
                        component={TextField}
                        name={'width'}
                        type={'number'}
                        placeholder={'Širina'}
                        InputProps={{
                          endAdornment: (<Typography variant={'body1'}>m</Typography>),
                        }}
                        sx={{
                          width: '100%',
                        }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <Field
                        component={TextField}
                        name={'volume'}
                        type={'number'}
                        placeholder={'Kubikaža'}
                        InputProps={{
                          endAdornment: (<Typography variant={'body1'}>m3</Typography>),
                        }}
                        sx={{
                          width: '100%',
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <InputLabel>
                        Nosivost {trailer ? 'Poluprikolice' : 'Vozila'} *
                      </InputLabel>
                      <Field
                        component={TextField}
                        name={'loadCapacity'}
                        type={'number'}
                        InputProps={{
                          endAdornment: (<Typography variant={'body1'}>t</Typography>),
                        }}
                        sx={{
                          width: '100%',
                        }}
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={6}>
                  <Grid spacing={'26px'} container>
                    <Grid item xs={12}>
                      <InputLabel sx={{ paddingTop: {xs: '10px'} }} >
                        Dodatna Oprema
                      </InputLabel>
                      <Field
                        component={TextField}
                        name={'additionalEquipment'}
                        type={'text'}
                        placeholder={'Dodatna Oprema'}
                        sx={{
                          width: '100%',
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <InputLabel>
                        Dodatne Beleške
                      </InputLabel>
                      <Field
                        component={TextField}
                        name={'description'}
                        type={'text'}
                        placeholder={'Dodatne Beleške'}
                        sx={{
                          width: '100%',
                          paddingBottom: {xs: '20px'}
                        }}
                        InputProps={{
                          sx: {
                            alignItems: 'flex-start',
                            minHeight: {xs: '0px', md:'195px'},
                          }
                        }}
                        multiline
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            )
              : (
                <Grid flexWrap={'wrap'} height={'auto'} sx={{display: {xs: 'contents', md: 'grid'}}} spacing={{xs: 0, md:'26px'}}>
                  <Grid item xs={6} >
                    <InputLabel>
                      Dodatna Oprema
                    </InputLabel>
                    <Field
                      component={TextField}
                      name={'additionalEquipment'}
                      type={'text'}
                      placeholder={'Dodatna Oprema'}
                      sx={{
                        width: '100%',
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <InputLabel sx={{ paddingTop: {xs:'20px', md:'10px'} }}>
                      Dodatne Beleške
                    </InputLabel>
                    <Field
                      component={TextField}
                      name={'description'}
                      type={'text'}
                      placeholder={'Dodatne Beleške'}
                      sx={{
                        width: '100%',
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button sx={{ p: 0, py: {xs: 3, md: 2} }} startIcon={!addTrailer ? <AddIcon /> : <RemoveIcon />} onClick={() => setAddTrailer(!addTrailer)} variant={'text'}>
                      Dodaj poluprikolicu
                    </Button>
                  </Grid>
                  {addTrailer && (
                    <>
                      <Grid item xs={12}>
                        <Typography variant={'h4'} >
                          Podaci o Poluprikolici
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sx={{pt: {xs: 3, md: 0}}} >
                        <InputLabel>Registarske Tablice *</InputLabel>
                        <Field
                          component={TextField}
                          name={'licensePlate'}
                          type={'text'}
                          sx={{
                            width: '100%',
                            marginBottom: '20px',
                          }}
                          placeholder={'BG123XX'}
                          inputProps={{
                            sx: {
                              textAlign: {xs: 'left', md:'center'},
                              fontSize: {xs:'20px', md:'28px'},
                              lineHeight: '35px',
                              fontWeight: {xs:'none', md:'bold'},
                              padding: {xs: '5px 15px', md:'23px 0'},
                            }
                          }}
                        />
                      </Grid>
                      <Grid flexWrap={'wrap'} height={'auto'}  sx={{display: {xs: 'contents', md: 'flex'}}} spacing={{xs: 0, md:'26px'}}>
                        <Grid item xs={6}>
                          <Grid sx={{ mb: '28px' }} item xs={12}>
                            <InputLabel>
                              Tip {trailer ? 'Poluprikolice' : 'Karoserije'} *
                            </InputLabel>
                            <Field
                              component={ControlledSelect}
                              name={'trailer.bodyTypeId'}
                              type={'text'}
                              sx={{
                                width: '100%',
                              }}
                              formControl={{ sx: { width: '100%' } }}
                              displayEmpty
                            >
                              <InputItem value={''}>Odaberi {trailer ? 'Poluprikolicu' : 'Karoseriju'} *</InputItem>
                              {bodyType?.filter((item: any) => vehicleType.filter((vehicle: any) => vehicle.name === 'poluprikolica')[0].bodyTypeIds.includes(item.id))?.map((item: any) => {
                                return (
                                  <InputItem
                                    value={item.id}
                                    sx={{ textTransform: 'capitalize' }}
                                    key={item.id}
                                  >
                                    {item.name}
                                  </InputItem>
                                )
                              })}
                            </Field>
                          </Grid>
                          <Grid item xs={12}>
                            <InputLabel>
                              Dimenzije {trailer ? 'Poluprikolice' : 'Vozila'} *
                            </InputLabel>
                          </Grid>
                          <Grid container spacing={'15px'} rowSpacing={'15px'}>
                            <Grid item xs={6}>
                              <Field
                                component={TextField}
                                name={'trailer.length'}
                                type={'number'}
                                placeholder={'Dužina'}
                                InputProps={{
                                  endAdornment: (<Typography variant={'body1'}>m</Typography>)
                                }}
                                sx={{
                                  width: '100%',
                                }}
                              />
                            </Grid>
                            <Grid item xs={6}>
                              <Field
                                component={TextField}
                                name={'trailer.height'}
                                type={'number'}
                                placeholder={'Visina'}
                                InputProps={{
                                  endAdornment: (<Typography variant={'body1'}>m</Typography>),
                                }}
                                sx={{
                                  width: '100%',
                                }}
                              />
                            </Grid>
                            <Grid item xs={6}>
                              <Field
                                component={TextField}
                                name={'trailer.width'}
                                type={'number'}
                                placeholder={'Širina'}
                                InputProps={{
                                  endAdornment: (<Typography variant={'body1'}>m</Typography>),
                                }}
                                sx={{
                                  width: '100%',
                                }}
                              />
                            </Grid>
                            <Grid item xs={6}>
                              <Field
                                component={TextField}
                                name={'trailer.volume'}
                                type={'number'}
                                placeholder={'Kubikaža'}
                                InputProps={{
                                  endAdornment: (<Typography variant={'body1'}>m3</Typography>),
                                }}
                                sx={{
                                  width: '100%',
                                }}
                              />
                            </Grid>
                            <Grid item xs={12}>
                              <InputLabel>
                                Nosivost {trailer ? 'Poluprikolice' : 'Vozila'} *
                              </InputLabel>
                              <Field
                                component={TextField}
                                name={'trailer.loadCapacity'}
                                type={'number'}
                                InputProps={{
                                  endAdornment: (<Typography variant={'body1'}>t</Typography>),
                                }}
                                sx={{
                                  width: '100%',
                                }}
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid item xs={6}>
                          <Grid spacing={'26px'} container>
                            <Grid item xs={12}>
                              <InputLabel sx={{pt: {xs: 2}}} >
                                Dodatna Oprema
                              </InputLabel>
                              <Field
                                component={TextField}
                                name={'trailer.additionalEquipment'}
                                type={'text'}
                                placeholder={'Dodatna Oprema'}
                                sx={{
                                  width: '100%',
                                }}
                              />
                            </Grid>
                            <Grid item xs={12}>
                            <InputLabel>
                              Dodatne Beleške
                            </InputLabel>
                            <Field
                              component={TextField}
                              name={'description'}
                              type={'text'}
                              placeholder={'Dodatne Beleške'}
                              sx={{
                                width: '100%',
                                paddingBottom: {xs: '20px'}
                              }}
                              InputProps={{
                                sx: {
                                  alignItems: 'flex-start',
                                  minHeight: {xs: '0px', md:'195px'},
                                }
                              }}
                              multiline
                            />
                          </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </>
                  )}
                </Grid>
              )}
            <LoadingButton
              type={'submit'}
              variant={'contained'}
              onClick={submitForm}
              sx={{ marginTop: 'auto' }}
              size={'large'}
            >
              {open?.edit ? 'Izmeni Vozilo' : 'Dodaj Vozilo'}
            </LoadingButton>
            <Button onClick={() => setOpen({ open: false, edit: false })} sx={{ mt: 1 }} size={'large'} variant={'secondary'}>
              Zatvori
            </Button>
          </Box>
        )}
      </Formik>
    </RightDrawer>
  )
};


export default VehicleDrawer;