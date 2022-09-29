import { useState } from 'react';
import { Typography, Button, InputLabel, Box, Grid } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { PaperContent } from '../../components/common/micro/theme';
import { StyledGrid } from './LoginPage';
import { Formik, Field } from 'formik';
import { TextField } from 'formik-mui';

import { useNavigate, useParams } from 'react-router-dom';
import * as Yup from 'yup';

import logo from './prevezi.png';
import api from '../../api/base';
import { apiv1 } from '../../api/paths';
import { useDialog } from '../../context/ModalContext';


export const ForgotPasswordPageTwo = () => {
  const navigate = useNavigate();
  const params = useParams();
  const { showDialog } = useDialog();
  const handleSubmit = async (newPassword: string) => {
    const response = await api.post(apiv1 + 'reset-password/finish', {
      key: params.key,
      newPassword
    });
    if (response.status === 200) {
      showDialog('Promena lozinke', 'Lozinka je uspešno promenjena. Uskoro cete biti redirektovani na login stranicu.');
      setTimeout(() => {
        navigate('/');
      }, 3000);
    }
    if (response.status !== 200) {
      showDialog(`Error - ${response.data.code}`, response.data.message);
    }
  };


  return (
    <StyledGrid container spacing={0}>
      <Grid item xs={12}>
        <PaperContent sx={{ maxWidth: '464px', margin: 'auto' }} py={8}>
          <img src={logo} alt="Logo" />
          <Typography mt={5} variant={'h1'}>
            {'Izmenite Lozinku'}
          </Typography>
          <Formik
            initialValues={{
              newPassword: '',
              confirmPassword: '',
            }}
            onSubmit={(values: any, { setSubmitting }) => {
              handleSubmit(values.newPassword);
            }}
          >
            {({ submitForm, isSubmitting }) => (
              <Box mt={4} sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                <InputLabel sx={{ mt: 2 }}>Nova lozinka</InputLabel>
                <Field
                  component={TextField}
                  name={'newPassword'}
                  type={'password'}
                  InputProps={{
                    placeholder: 'Unesite novu lozinku.',
                  }}
                />
                <InputLabel sx={{ mt: 2 }}>Potvrdite novu lozinku</InputLabel>
                <Field
                  component={TextField}
                  name={'confirmPassword'}
                  type={'password'}
                  InputProps={{
                    placeholder: 'Potvrdite novu lozinku.',
                  }}
                />
                <LoadingButton
                  type={'submit'}
                  variant={'contained'}
                  onClick={() => submitForm()}
                  loading={isSubmitting}
                  sx={{ mt: 2 }}
                  size={'large'}
                >
                  {'Pošalji'}
                </LoadingButton>
              </Box>
            )}
          </Formik>
          <Button size={'large'} onClick={() => navigate('/')} sx={{ marginTop: '10px' }} fullWidth variant={'secondary'}>{'Nazad'}</Button>
        </PaperContent>
      </Grid>
    </StyledGrid>
  )
}