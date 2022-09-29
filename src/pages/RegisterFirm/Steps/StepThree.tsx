import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useDialog } from '../../../context/ModalContext';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { exchangeTokens } from '../../../redux/slices/user-slice';
import { Formik, Field } from 'formik';
import { useDropzone, } from 'react-dropzone';

import { Box, Grid, Paper, Typography, InputLabel, Button, styled } from '@mui/material';
import { PaperContent } from '../../../components/common/micro/theme';

import { ReactComponent as PreveziLogo } from '../../../assets/icons/prevezi-logo.svg';
import { ReactComponent as DropIcon } from '../../../assets/icons/file_copy.svg';
import { ReactComponent as TrashIcon } from '../../../assets/icons/delete_outline.svg';

import { CompanyDetails, RegisterDataProps } from '../../../types/user.types';

import { CompanyDetailsSchema } from '../../../schema/loginSchema';

import { TextField } from 'formik-mui';
import { LoadingButton } from '@mui/lab';


import api from '../../../api/base';
import { apiv1 } from '../../../api/paths';

interface ExchangeProps {
  company: {
    id: number;
    name: string;
  },
  name?: {
    id: string;
    name: string;
  },
  exchangeToken: string;
}

const StyledDropzone = styled(Box)(({ theme }) => ({
  border: '1px dashed #CDCDCD',
  display: 'flex',
  justifyContent: 'space-between',
  borderRadius: '4px',
  backgroundColor: '#fafafa',
  padding: '30px',
  span: {
    color: theme.palette.primary.main,
    textDecoration: 'underline',
  },
  zIndex: '1',
}));

interface StepOneProps {
  userData: RegisterDataProps;
  setActiveStep: Dispatch<SetStateAction<number>>;
  setUserData: Dispatch<SetStateAction<RegisterDataProps | any>>;
}

const StepThreeFirm = (props: StepOneProps) => {
  const { userData, setActiveStep, setUserData } = props;

  const { showDialog } = useDialog();

  const [registerCompanyId, setRegisterCompanyId] = useState('');
  const [businessRegisterDecision, setBusinessRegisterDecision] = useState<File | null>(null);
  const [businessRegisterDigest, setBusinessRegisterDigest] = useState<File | null>(null);
  const [taxpayerRegister, setTaxpayerRegister] = useState<File | null>(null);


  const [docData, setDocData] = useState<{ }>({
    taxpayerRegister: '',
    businessRegisterDigest: '',
    businessRegisterDecision: '',
  });

  const convertBase64 = (file: any) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file)
      fileReader.onload = () => {
        resolve(fileReader.result);
      }
      fileReader.onerror = (error) => {
        reject(error);
      }
    })
  }

  const { getRootProps: getRootfileProps, getInputProps: getInputfileProps } = useDropzone({
    maxFiles: 1,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc', '.docx'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    onDrop: (acceptedFile) => {
      setDocData({ ...docData, taxpayerRegister: convertBase64(acceptedFile[0]) })
      setBusinessRegisterDecision(
        Object.assign(acceptedFile[0], {
          preview: URL.createObjectURL(acceptedFile[0]),
        }),
      );
    },
  });
  const { getRootProps: getBusinessFile, getInputProps: getBusinessInputFile } = useDropzone({
    maxFiles: 1,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc', '.docx'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    onDrop: (acceptedFile) => {
      setBusinessRegisterDigest(
        Object.assign(acceptedFile[0], {
          preview: URL.createObjectURL(acceptedFile[0]),
        }),
      );
    },
  });
  const { getRootProps: getTaxpayer, getInputProps: getTaxpayerInput } = useDropzone({
    maxFiles: 1,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc', '.docx'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    onDrop: (acceptedFile) => {
      setTaxpayerRegister(
        Object.assign(acceptedFile[0], {
          preview: URL.createObjectURL(acceptedFile[0]),
        })
      );
    },
  });

  const [step, setStep] = useState<number>(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const initialCompany: CompanyDetails = {
    name: '',
    registrationNumber: '',
    taxpayerRegisterNumber: '',
    address: '',
    city: '',
    country: '',
    phoneNumber: '',
    faxNumber: '',
    email: '',
    website: ''
  };

  const postHandler = (companyData?: RegisterDataProps) => {
    api.post(process.env.REACT_APP_API + '/api/v1/companies/register', companyData, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
    })
      .then((res) => {
        if (res.status === 201 && res.data && res.data.exchangeToken && res.data.company) {
          setRegisterCompanyId(res.data.company.id);
          setStep(1);
          // const { exchangeToken, company } = res.data;
          // dispatch(exchangeTokens({ token: exchangeToken, company: company?.id }));
        };
      })
      .catch((err) => {
        showDialog(`Error - ${err.response.data.code}`, err.response.data.message);
      });
  };

  const sendCompanyDocs = async () => {
    try {
      const { data } = await api.post(`${apiv1}files/companies/${registerCompanyId}/lead/${userData.leadId}/company-documents`, {
        businessRegisterDecision: await convertBase64(businessRegisterDecision),
        businessRegisterDigest: await convertBase64(businessRegisterDigest),
        taxpayerRegister: await convertBase64(taxpayerRegister),
      });
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (step === 1 && taxpayerRegister !== null && businessRegisterDecision !== null && businessRegisterDigest !== null) sendCompanyDocs();
  }, [step]);


  return (
    <Grid sx={{ paddingBottom: 5 }} item md={12} lg={12} xl={12}>
      <Paper sx={{ maxWidth: '700px', margin: '0 auto' }} elevation={3}>
        <PaperContent py={7}>
          {step === 0 && (
            <>
              <Typography mb={1} color={'#C0C0C0'} variant={'body1'}>Transportna Firma</Typography>
              <Typography variant={'h1'}>Unesite Podatke Firme</Typography>
              <Box mt={4} width={'100%'} display={'flex'} flexDirection={'column'}>
                <Formik
                  validationSchema={CompanyDetailsSchema}
                  initialValues={initialCompany}
                  onSubmit={(values, { setSubmitting }) => {
                    const allDetails = { ...userData, companyDetails: values } as RegisterDataProps;
                    postHandler(allDetails);
                    setUserData(allDetails);
                    setSubmitting(false);
                  }}
                >
                  {({ submitForm, isSubmitting, errors }) => (
                    <form style={{ width: '100%', height: '100%' }} onSubmit={submitForm}>
                      <Grid container rowSpacing={'10px'} spacing={'50px'}>
                      <Grid item md={6}>
                      <InputLabel>Naziv Firme *</InputLabel>
                      <Field
                        name={'name'}
                        type={'text'}
                        component={TextField}
                        errors={errors.name}
                      />
                      </Grid>
                      <Grid item md={6}>
                      <InputLabel>Adresa *</InputLabel>
                          <Field
                            name={'address'}
                            type={'text'}
                            component={TextField}
                            errors={errors.address}
                          />
                          </Grid>
                          
                  
                        <Grid item md={6}>
                        <InputLabel sx={{ mt: 2 }}>PIB *</InputLabel>
                          <Field
                            name={'taxpayerRegisterNumber'}
                            type={'text'}
                            component={TextField}
                          />
                        </Grid>
                        <Grid item md={6}>
                        <InputLabel sx={{ mt: 2 }}>Grad *</InputLabel>
                          <Field
                            name={'city'}
                            type={'text'}
                            component={TextField}
                          />
                        </Grid>
                        <Grid item md={6}>
                        <InputLabel sx={{ mt: 2 }}>Telefon *</InputLabel>
                          <Field
                            name={'phoneNumber'}
                            type={'text'}
                            component={TextField}
                          />
                        </Grid>
                        <Grid item md={6}>
                        <InputLabel sx={{ mt: 2 }}>Država *</InputLabel>
                          <Field
                            name={'country'}
                            type={'text'}
                            component={TextField}
                          />
                        </Grid>
                        <Grid item md={6}>
                        <InputLabel sx={{ mt: 2 }}>Fax</InputLabel>
                          <Field
                            name={'faxNumber'}
                            type={'text'}
                            component={TextField}
                          />
                        </Grid>
                        <Grid item md={6}>
                        <InputLabel sx={{ mt: 2 }}>Matični Broj *</InputLabel>
                          <Field
                            name={'registrationNumber'}
                            type={'text'}
                            component={TextField}
                          />
                        </Grid>
                        <Grid item md={6}>
                        <InputLabel sx={{ mt: 2 }}>E-Mail *</InputLabel>
                          <Field
                            name={'email'}
                            type={'email'}
                            component={TextField}
                          />
                        </Grid>
                        <Grid item md={6}>
                          <InputLabel sx={{ mt: 2 }}>Website</InputLabel>
                          <Field
                            name={'website'}
                            type={'website'}
                            component={TextField}
                          />
                        </Grid>
                        <Grid sx={{ mt: 2 }} item md={12}>
                          <Typography variant={'h2'}>
                            Dokumentacija
                          </Typography>
                        </Grid>
                        <Grid item md={12}>
                          <StyledDropzone {...getRootfileProps()}>
                            <input {...getInputfileProps()} />
                            <Typography sx={{ display: 'flex', alignItems: 'center', gap: '12px' }} variant={'body1'}>
                              <DropIcon />Rešenje iz APR-a *
                            </Typography>
                            {!businessRegisterDecision?.name ? (
                              <Typography variant={'subtitle2'}>
                                Spusti dokument ovde ili <span>Ubaci Rucno</span>
                              </Typography>
                            ) : (
                              <Button sx={{ zIndex: '500' }} onClick={() => setBusinessRegisterDecision(null)} endIcon={<TrashIcon />} variant={'text'}>
                                {businessRegisterDecision.name}
                              </Button>
                            )}
                          </StyledDropzone>
                        </Grid>
                        <Grid item md={12}>
                          <StyledDropzone {...getBusinessFile()}>
                            <input {...getBusinessInputFile()} />
                            <Typography sx={{ display: 'flex', alignItems: 'center', gap: '12px' }} variant={'body1'}>
                              <DropIcon />
                              Potvrda o Izvršenoj Registraciji (PIB) *
                            </Typography>
                            {!businessRegisterDigest?.name ? (
                              <Typography variant={'subtitle2'}>
                                Spusti dokument ovde ili <span>Ubaci Rucno</span>
                              </Typography>
                            ) : (
                              <Button sx={{ zIndex: '500' }} onClick={() => setBusinessRegisterDigest(null)} endIcon={<TrashIcon />} variant={'text'}>
                                {businessRegisterDigest.name}
                              </Button>
                            )}
                          </StyledDropzone>
                        </Grid>
                        <Grid item md={12}>
                          <StyledDropzone {...getTaxpayer()}>
                            <input {...getTaxpayerInput()} />
                            <Typography sx={{ display: 'flex', alignItems: 'center', gap: '12px' }} variant={'body1'}>
                              <DropIcon />
                              Izvod iz PDV-a *
                            </Typography>
                            {!taxpayerRegister?.name ? (
                              <Typography variant={'subtitle2'}>
                                Spusti dokument ovde ili <span>Ubaci Rucno</span>
                              </Typography>
                            ) : (
                              <Button sx={{ zIndex: '500' }} onClick={() => setTaxpayerRegister(null)} endIcon={<TrashIcon />} variant={'text'}>
                                {taxpayerRegister.name}
                              </Button>
                            )}
                          </StyledDropzone>
                        </Grid>
                      </Grid>
                      <LoadingButton loading={isSubmitting} sx={{ mt: '21px', mb: '10px' }} variant='contained' fullWidth size={'large'} onClick={submitForm}>
                        Sledeće
                      </LoadingButton>
                    </form>
                  )}
                </Formik>
                <Button onClick={() => setActiveStep(1)} variant='secondary' fullWidth size={'large'}>
                  Nazad
                </Button>
              </Box>
            </>
          )}
          {step === 1 && (
            <Box sx={{ maxWidth: '464px', margin: '0 auto' }} display={'flex'} flexDirection={'column'}>
              <PreveziLogo />
              <Typography mt={'55px'} maxWidth={'70%'} variant={'h1'}>
                Dobrodošli u Prevezi "{userData?.companyDetails?.name}"
              </Typography>
              <Typography mt={3}>
                Vaša registracija je uspešna i čeka odobrenje od administratora. Bićete obavešteni kada registracija bude odobrena.
              </Typography>
              <Box mt={4} width={'100%'} display={'flex'} flexDirection={'column'}>
                <Box display={'grid'} gridTemplateColumns={'60% 1fr'}>
                  <Typography>
                    Korisničko Ime:
                  </Typography>
                  <Typography fontWeight={'bold'}>
                    {userData?.companyDetails?.name}
                  </Typography>
                </Box>
              </Box>
              <Button sx={{ mt: '21px', mb: '10px' }} variant='contained' fullWidth size={'large'} onClick={() => navigate('/')}>
                Idite na početnu stranu
              </Button>
            </Box>
          )}
        </PaperContent>
      </Paper>
    </Grid>
  )
};


export default StepThreeFirm;