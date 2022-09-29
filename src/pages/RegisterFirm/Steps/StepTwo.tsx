import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useDialog } from '../../../context/ModalContext';
import { Formik, Field } from 'formik';

import { Box, Grid, Paper, Typography, InputLabel, Button } from '@mui/material';
import { PaperContent } from '../../../components/common/micro/theme';

import { ReactComponent as WarningIcon } from '../../../assets/icons/warning.svg';
import { ReactComponent as SuccessIcon } from '../../../assets/icons/success.svg';

import { RegisterDataProps } from '../../../types/user.types';

import { DefaultInput } from '../../../components/common/micro/forms';
import api from '../../../api/base';
interface StepOneProps {
  userData: RegisterDataProps;
  setActiveStep: Dispatch<SetStateAction<number>>;
  setUserData: Dispatch<SetStateAction<RegisterDataProps | any>>;
}

const StepTwoFirm = (props: StepOneProps) => {
  const { setActiveStep, userData, setUserData } = props;

  const { showDialog } = useDialog();

  const [input, setInput] = useState('');
  const [step, setStep] = useState(0);

  const inputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  }

  const sendCode = () => {
    api.post(process.env.REACT_APP_API + 'lead/activate', {
      email: userData.userDetails.email,
      code: input
    })
      .then((res) => {
        res.status === 200 && setStep(2);
      })
      .catch((err) => {
        showDialog(`Error - ${err.response.data.code}`, err.response.data.message);
      })
  }

  const resendCode = async () => {
    const { data, status } = await api.post(process.env.REACT_APP_API + 'lead', {
      email: userData.userDetails.email,
    });
    if (status === 200) {
      setUserData({ ...userData, leadId: data.id });
      showDialog('Uspešno', 'Kod je poslan na vašu email adresu');
    }
  }

  return (
    <Grid item md={6} lg={5} xl={7} >
      <Paper sx={{ maxWidth: '464px', margin: '0 auto', boxShadow:{xs:"0" , md:"5"} }} elevation={3}>
        <PaperContent px={{xs: 0 , md:2}} py={{xs:3, md:7}}>
          {step === 0 && <>
            <WarningIcon />
            <Typography mt={5} variant={'h1'} sx={{ fontSize: { xs: 23 } }} >Mail za Verifikaciju Poslat</Typography>
            <Box textAlign={'center'} mt={2} gap={2} width={{ xs: '128%', md: '100%' }} display={'flex'} flexDirection={'column'}>
              <Box mb={2}>
                Molimo Vas da proverite vaše sanduče
                <Typography sx={{ textDecoration: 'underline', display: 'block', ml: '5px' }} color={'primary'}>
                  {userData.userDetails.email}
                </Typography>
              </Box>
              <Button onClick={() => setStep(1)} variant='contained' fullWidth size={'large'}>
                Proveri Email i Nastavi
              </Button>
              <Button onClick={() => resendCode()} variant='secondary' fullWidth size={'large'}>
                Pošalji Ponovo
              </Button>
            </Box>
          </>
          }
          {step === 1 &&
            <>
              <Typography mb={1} color={'#C0C0C0'} variant={'body1'}>Transportna Firma</Typography>
              <Typography variant={'h1'}>Verifikuj Nalog</Typography>
              <Box mt={4} gap={2} width={'100%'} display={'flex'} flexDirection={'column'}>
                <InputLabel sx={{ textAlign: 'center' }}>
                  Unesite četvorocifreni broj koji je poslat na adresu
                  <Typography sx={{ textDecoration: 'underline', display: 'block', ml: '5px' }} color={'primary'}>
                    {userData.userDetails.email}
                  </Typography>
                </InputLabel>
                <DefaultInput onChange={inputHandler} value={input} type={'text'} />
                <Button onClick={() => sendCode()} variant='contained' fullWidth size={'large'}>
                Verifikuj
                </Button>
              </Box>
            </>
          }
          {step === 2 &&
            <>
              <SuccessIcon />
              <Typography mt={5} variant={'h1'}>Uspeša Verifikacija</Typography>
              <Box textAlign={'center'} mt={2} gap={2} width={'100%'} display={'flex'} flexDirection={'column'}>
                <Box mb={2}>
                  Uspeša Verifikacija
                  <Typography sx={{ textDecoration: 'underline', display: 'block', ml: '5px' }} color={'primary'}>
                    {userData.userDetails.email}
                  </Typography>
                </Box>
                <Button onClick={() => setActiveStep(2)} variant='contained' fullWidth size={'large'}>
                  Nastavi
                </Button>
                <Button onClick={() => setStep(1)} variant='secondary' fullWidth size={'large'}>
                  Nazad
                </Button>
              </Box>
            </>
          }
        </PaperContent>
      </Paper>
    </Grid>
  )
};


export default StepTwoFirm; 