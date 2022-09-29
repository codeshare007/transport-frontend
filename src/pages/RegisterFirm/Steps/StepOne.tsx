import React, { Dispatch, SetStateAction } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDialog } from '../../../context/ModalContext';
import { Formik, Field } from 'formik';

import { Box, Grid, Paper, Typography, InputLabel, Button, useMediaQuery } from '@mui/material';
import { PaperContent } from '../../../components/common/micro/theme';

import { UserDetails, RegisterDataProps } from '../../../types/user.types';

import { FirmRegisterSchema } from '../../../schema/loginSchema';

import { TextField } from 'formik-mui';
import { LoadingButton } from '@mui/lab';
import VisibilityIcon from '@mui/icons-material/Visibility';

import api from '../../../api/base';

interface StepOneProps {
  userData: RegisterDataProps;
  setActiveStep: Dispatch<SetStateAction<number>>;
  setUserData: Dispatch<SetStateAction<RegisterDataProps | any>>;
}

const StepOneFirm = (props: StepOneProps) => {
  const { setActiveStep, setUserData } = props;
  const navigate = useNavigate();
  const matches = useMediaQuery("(max-width:767px)");

  const { showDialog } = useDialog();

  const postHandler = async (email: string, values: UserDetails) => {
    await api.post(process.env.REACT_APP_API + 'lead', {
      email,
    })
    .then((res) => {
      if (res.status === 200) {
        setUserData({ userDetails: {
          ...values,
          phone: '+381' + values.phone,
        }, 
        leadId: res.data.id });
        setActiveStep(1);
      }
    })
    .catch((err) => {
      showDialog(`Error - ${err.response.data.code}`, err.response.data.message);
    });
  }

  return (
    <Grid item md={6} lg={5} xl={7}>
      <Paper sx={{ maxWidth: '464px', margin: '0 auto', boxShadow: { xs: 0, md: 5 } }} elevation={3}>
        <PaperContent py={{ xs: 2, md:7 }} px={{ xs: 1, md: 5 }}>
          <Typography mb={1} color={'#C0C0C0'} variant={'body1'}>Transportna Firma</Typography>
          <Typography variant={"h1"} sx={{ fontSize: { xs: 26 }}} >Registracija Novog Korisnika</Typography>
          <Box mt={4} width={'100%'} display={'flex'} flexDirection={'column'}>
            <Formik
              validationSchema={FirmRegisterSchema}
              initialValues={{
                name: '',
                phone: '',
                password: '',
                email: '',
              }}
              onSubmit={async (values: UserDetails, { setSubmitting }) => {
                setSubmitting(true);
                await postHandler(values.email, values);
              }}
            >
              {({ submitForm, isSubmitting }) => (
                <form style={{ width: '100%', height: '100%'}} onSubmit={submitForm}>
                  <InputLabel>Ime i Prezime *</InputLabel>
                  <Field
                    name={'name'}
                    type={'text'}
                    component={TextField}
                  />
                  <InputLabel sx={{ mt: 2 }}>Telefon *</InputLabel>
                  <Field
                    name={'phone'}
                    type={'numbers'}
                    component={TextField}
                    InputProps={{
                      startAdornment: (<Typography pr={1} borderRight={'1px solid #D7D7D7'}>
                        +381
                      </Typography>)
                    }}
                  />
                  <InputLabel sx={{ mt: 2 }}>Email Adresa</InputLabel>
                  <Field
                    name={'email'}
                    type={'email'}
                    component={TextField}
                  />
                  <InputLabel sx={{ mt: 2 }}>Lozinka *</InputLabel>
                  <Field
                    name="password"
                    type={'password'}
                    component={TextField}
                  />
                  <LoadingButton loading={isSubmitting} sx={{ mt: '21px', mb: '10px' }} variant='contained' fullWidth size={'large'} onClick={submitForm}>
                    Sledeće
                  </LoadingButton>
                </form>
              )}
            </Formik>
            {
              matches ?
              null 
              :
              <Button onClick={() => navigate('/')} variant='secondary' fullWidth size={'large'}>
                Nazad
              </Button>
            }
          </Box>
        </PaperContent>
      </Paper>
    </Grid>
  )
};


export default StepOneFirm;