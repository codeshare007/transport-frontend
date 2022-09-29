import React, { Dispatch, useEffect, useState } from 'react';
import { Box, Typography, styled, Grid, InputAdornment } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { SetStateAction } from 'react';
import { ControlledSelect, InputItem, DefaultInput } from '../../components/common/micro/forms';

import InputLabel from '@mui/material/InputLabel';

import { Formik, Field } from 'formik';
import { TextField } from 'formik-mui';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { Cargo, PriceDetails } from '../../types/cargo.types';
import { PriceDetailsShema } from '../../schema/loginSchema';

import api from '../../api/base';
import { apiv1 } from '../../api/paths';
interface RegisterCargoTypes {
  cargoData: Cargo;
  setActiveStep: Dispatch<SetStateAction<number>>;
  setCargoData: Dispatch<SetStateAction<Cargo>>
}

export const CostsCargo = (props: RegisterCargoTypes) => {
  const { cargoData, setCargoData, setActiveStep } = props;
  const goodsType = useSelector((state: RootState) => state?.vehicles?.goodsType);
  const [calculatedPrice, setCalculatedPrice] = useState<number>(0);


  useEffect(() => {
    if (cargoData.originId && cargoData.destinationId) {
      api.get(`${apiv1}price-list/origin/${cargoData?.originId}/destination/${cargoData?.destinationId}`, {
        params: {
          weight: cargoData?.goodsDetails?.weight,
          vehicleTypeId: cargoData?.transportDetails?.vehicleTypeId,
        }
      })
        .then(res => {
          if (res.status === 200 || res.status === 201) {
            setCalculatedPrice(res.data.calculatedPrice)
          }
        })
        .catch(err => {
          console.log(err);
        })
    }
  }, [cargoData.originId, cargoData.destinationId]);

  return (
    <Box sx={{ bgcolor: '#fff', padding: {xs:'10px', md:'50px'}, boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.05)' }}>
      <Typography  sx={{ textAlign: "center", fontSize: "28px", mb:{xs:1, md:6} }} variant="h5" gutterBottom component="div">
        Troškovi Transporta
      </Typography>
      <Formik
        validationSchema={PriceDetailsShema}
        initialValues={{
          customPrice: 0,
          customPricePerUnit: 0,
          currency: 'RSD',
          method: '',
        }}
        onSubmit={(values: PriceDetails, { setSubmitting }) => {
          setSubmitting(true);
          setCargoData((prevState: Cargo) => ({ ...prevState, priceDetails: values }));
          setSubmitting(false);
          setTimeout(() => {
            setActiveStep(3)
          }, 1000);
        }}
      >
        {({ submitForm, errors, touched, values }) => {
          console.log(values);
          return (
          <Grid container rowSpacing={'15px'} columnSpacing={'50px'}>
            <Grid item xs={12} md={4}>
              <InputLabel>Kalkulisana Cena</InputLabel>
              <DefaultInput disabled value={`RSD ${calculatedPrice.toFixed(2)}`} sx={{
                input: {
                  color: '#000',
                  bgcolor: '#ead9464d',
                  WebkitTextFillColor: '#000!important',
                  fontWeight: '600',
                },
              }} helperText={'* troskovi putarine nisu ukljuceni u kalkulisnu cenu'} />
            </Grid>
            <Grid item xs={12} md={4}>
              <InputLabel>Moja Cena *</InputLabel>
              <Field
                component={TextField}
                name={'customPrice'}
                type={'number'}
                value={values.customPrice.toFixed(2)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='start'>
                      RSD
                    </InputAdornment>
                  )
                }}
              />
              <Field
                component={TextField}
                name={'currency'}
                type={'hidden'}
                value={'RSD'}
                InputProps={{
                  sx: { display: 'none' }
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <InputLabel>Moja Cena po Toni*</InputLabel>
              <Field
                component={TextField}
                name={'customPricePerUnit'}
                type={'number'}
                value={values.customPricePerUnit.toFixed(2)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='start'>
                      RSD
                    </InputAdornment>
                  )
                }}
              />
              <Field
                component={TextField}
                name={'currency'}
                type={'hidden'}
                value={'RSD'}
                InputProps={{
                  sx: { display: 'none' }
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <InputLabel>Način Plaćanja *</InputLabel>
              <Field
                component={ControlledSelect}
                name={'method'}
                displayEmpty
              >
                <InputItem value={''} key={''} disabled>Odaberite</InputItem>
                <InputItem value={'INVOICE'} key={'INVOICE'}>Po fakturi</InputItem>
              </Field>
            </Grid>
            <Grid item xs={12}>
              <LoadingButton
                type={'submit'}
                variant={'contained'}
                onClick={submitForm}
                loading={false}
                fullWidth
                size={'large'}
              >
                {'Sledeće'}
              </LoadingButton>
            </Grid>
            <Grid item xs={12}>
              <LoadingButton
                variant={'secondary'}
                onClick={() => setActiveStep(1)}
                loading={false}
                fullWidth
                size={'large'}
              >
                {'Nazad'}
              </LoadingButton>
            </Grid>
          </Grid>
        )}}
      </Formik>
    </Box>
  )
}