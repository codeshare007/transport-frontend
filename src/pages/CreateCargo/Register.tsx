import React, { Dispatch } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, styled, Grid, InputAdornment } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { SetStateAction } from 'react';
import { Input, ControlledSelect, InputItem } from '../../components/common/micro/forms';
import InputLabel from '@mui/material/InputLabel';

import { Formik, Field } from 'formik';
import { TextField } from 'formik-mui';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { GoodsTypes } from '../../types/vehicle.types';
import { Cargo, GoodsDetails } from '../../types/cargo.types';
import { AddCargoSchema } from '../../schema/loginSchema';
interface RegisterCargoTypes {
  cargoData: any;
  setActiveStep: Dispatch<SetStateAction<number>>;
  setCargoData: Dispatch<SetStateAction<Cargo>>
}

export const RegisterCargo = (props: RegisterCargoTypes) => {
  const { setCargoData, setActiveStep, cargoData } = props;
  const navigate = useNavigate();
  const goodsType = useSelector((state: RootState) => state?.vehicles?.goodsType);

  return (
    <Box sx={{ bgcolor: '#fff', padding:{xs:'0 10px 50px 10px', md:'50px'} , boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.05)' }}>
      <Typography sx={{ marginTop: "40px", textAlign: "center", fontSize: "28px" }} variant="h5" gutterBottom component="div">
        Registracija Tereta
      </Typography>
      <Formik
        validationSchema={AddCargoSchema}
        initialValues={!cargoData.goodsDetails ? {
          goodsTypeId: '',
          weight: 0,
          note: '',
        } : cargoData?.goodsDetails}
        onSubmit={async (values: GoodsDetails, { setSubmitting }) => {
          setSubmitting(true);
          setCargoData({ goodsDetails: values });
          setTimeout(() => {
            setSubmitting(false);
            setActiveStep(1);
          }, 1000);
        }}
      >
        {({ submitForm, errors, touched }) => (
          <Grid container rowSpacing={'20px'} columnSpacing={'50px'}>
            <Grid item xs={12} md={6}>
              <InputLabel>Vrsta Tereta *</InputLabel>
              <Field
                component={ControlledSelect}
                name={'goodsTypeId'}
                displayEmpty
              >
                <InputItem value={''} disabled>Odaberi</InputItem>
                {goodsType?.map((item: GoodsTypes) => (
                  <InputItem key={item.id} value={item.id} disabled={!item.available}>
                    {item.name}
                  </InputItem>
                ))}
              </Field>
            </Grid>
            <Grid item xs={12} md={6}>
              <InputLabel>Neto Težina Tereta *</InputLabel>
              <Field
                component={TextField}
                name={'weight'}
                type={'number'}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='start'>
                      t
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <InputLabel>Dodatne Beleške</InputLabel>
              <Field
                component={Input}
                name={'note'}
                type={'text'}
                multiline
                minRows={5}
              />
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
                onClick={() => navigate('/objave')}
                loading={false}
                fullWidth
                size={'large'}
              >
                {'Nazad'}
              </LoadingButton>
            </Grid>
          </Grid>
        )}
      </Formik>
    </Box>
  )
}