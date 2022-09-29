import React, { Dispatch } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, styled, Grid, InputAdornment, Button } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { SetStateAction } from 'react';
import { useDialog } from '../../context/ModalContext';

import { ReactComponent as AddIcon } from '../../assets/icons/add-contact.svg';
import { ReactComponent as RemoveIcon } from '../../assets/icons/person_remove.svg';

import InputLabel from '@mui/material/InputLabel';

import { Formik, Field, FieldArray } from 'formik';
import { TextField } from 'formik-mui';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { Cargo, ContactDetail } from '../../types/cargo.types';


import api from '../../api/base';
import { apiv1 } from '../../api/paths';

interface RegisterCargoTypes {
  cargoData: Cargo;
  setActiveStep: Dispatch<SetStateAction<number>>;
  setCargoData: Dispatch<SetStateAction<Cargo>>
}

export const ContactCargo = (props: RegisterCargoTypes) => {
  const { setActiveStep, cargoData } = props;
  const navigate = useNavigate();
  const { showDialog } = useDialog();
  const companyId = useSelector((state: RootState) => state?.user?.user?.company?.id);

  return (
    <Box sx={{ bgcolor: '#fff', padding: {xs:'15px', md:'50px'}, boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.05)' }}>
      <Typography  sx={{ textAlign: "center", fontSize: "28px", mb:{xs:1, md:4} }} variant="h5" gutterBottom component="div">
        Kontakt Podaci
      </Typography>
      <Formik
        initialValues={{
          contactDetails: [
            {
              fullName: '',
              phone: '',
              email: '',
            },
          ],
        }}
        onSubmit={(values: any, { setSubmitting }) => {
          setSubmitting(true);
          setTimeout(() => {
            const tempDetails = values.contactDetails.map((contact: any) => {
              return {
                fullname: contact.fullName,
                phone: '+381' + contact.phone,
                email: contact.email,
              }
            });
            api.post(`${apiv1}cargo/companies/${companyId}`, {
              ...cargoData,
              contactDetails: tempDetails,
            })
              .then(res => {
                if (res.status === 200 || res.status === 201) {
                  navigate('/objave');
                };
              })
              .catch((err: any) => {
                const { response } = err;
                showDialog(
                  `${response.status}: ${response.statusText}`,
                  response.data.message,
                );
              })
            setSubmitting(false);
          }, 1000);
        }}
      >
        {({ submitForm, values }) => (
          <Box>
            <FieldArray name="contactDetails">
              {({ insert, remove, push }) => (
                <React.Fragment>
                  {values.contactDetails.length > 0 &&
                    values.contactDetails.map((friend: any, index: number) => (
                      <Grid key={index + 1} sx={{ mt: 2 }} container rowSpacing={'15px'} columnSpacing={'50px'}>
                        <Grid item xs={12}>
                          {`Kontakt #${index + 1}`}
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <InputLabel>Ime i Prezime *</InputLabel>
                          <Field
                            component={TextField}
                            name={`contactDetails.${index}.fullName`}
                            type={'text'}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <InputLabel>Telefon *</InputLabel>
                          <Field
                            component={TextField}
                            name={`contactDetails.${index}.phone`}
                            type={'text'}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position='start'>
                                  +381
                                </InputAdornment>
                              )
                            }}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <InputLabel>Email Adresa *</InputLabel>
                          <Field
                            component={TextField}
                            name={`contactDetails.${index}.email`}
                            type={'email'}
                          />
                        </Grid>
                        {index > 0 && (
                          <Grid display={'flex'} justifyContent={'flex-end'} item xs={12}>
                            <Button
                              onClick={() => remove(index)}
                              startIcon={<RemoveIcon />}
                              variant={'text'}
                            >
                              Izbrisi Kontakt
                            </Button>
                          </Grid>
                        )}
                      </Grid>
                    ))}
                  <Button
                    onClick={() => push({ fullName: '', phone: '', email: '' })}
                    startIcon={<AddIcon />}
                    variant={'text'}
                    sx={{
                      my: 2
                    }}
                  >
                    Dodaj Kontakt
                  </Button>
                </React.Fragment>
              )}
            </FieldArray>
            <Grid container rowSpacing={'15px'} columnSpacing={'50px'}>
              <Grid item xs={12}>
                <LoadingButton
                  type={'submit'}
                  variant={'contained'}
                  onClick={submitForm}
                  loading={false}
                  fullWidth
                  size={'large'}
                >
                  {'Objavi Ponudu'}
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
          </Box>
        )}
      </Formik>
    </Box>
  )
}