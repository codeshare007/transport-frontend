import React, { useEffect, useState } from 'react';
import { RegisterDataProps } from '../../types/user.types';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import { StepLabel, Container, Box, Grid, Button, useMediaQuery } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';


import StepOneFirm from "./Steps/StepOne";
import StepTwoFirm from "./Steps/StepTwo";
import StepThreeFirm from "./Steps/StepThree";

import { ReactComponent as PreveziLogo } from "../../assets/icons/prevezi-logo.svg";
import { useNavigate } from 'react-router-dom';

const steps = ["Registracija", "Verifikacija", "Podaci Firme"];
export const RegisterFirm = ({ type }: any) => {
  const [activeStep, setActiveStep] = useState(0);
  const matches = useMediaQuery("(max-width:767px)");
  const navigate = useNavigate();

  const [userData, setUserData] = useState<RegisterDataProps>({} as RegisterDataProps);

  return (
    <Container sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', }} disableGutters> 
      {
        matches ? 
        (
        <Box display={'flex'} flexDirection={'column'} width={'100%'} justifyContent={'center'} alignItems={'flex-start'}>
          <Box borderBottom={"0.5px solid #c0c0c0"} pb={2} display={'flex'} flexDirection={'row'} width={'100%'} justifyContent={'space-around'} alignItems={'center'} pt={2}>
            <ArrowBackIcon onClick={() => navigate(-1)} sx={{ flexGrow: '2' }} />
            <PreveziLogo onClick={() => navigate('/')} style={{ display: 'flex', justifySelf: 'center', flexGrow: '8', margin: '0 20px 0 0' }} />
            <div style={{ display: 'flex', justifySelf: 'center', flexGrow: '2' }} />
          </Box>
          <Box py={2} borderBottom={"0.5px solid #c0c0c0"} display={'flex'} flexDirection={'row'} width={'100%'} justifyContent={'space-around'} alignItems={'center'}>
            <Stepper sx={{ maxWidth: '560px', width: '100%', }} alternativeLabel activeStep={activeStep}>
              {steps.map((label, index) => (
                <Step key={label} completed={index !== activeStep && index < activeStep}>
                  <StepLabel>
                    {label}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>
        </Box>)
        :
        <Box top={'0px'} left={'0'} position={'absolute'} display={'flex'} width={'100%'} justifyContent={'center'} alignItems={'center'} pt={9} >
          <PreveziLogo style={{ position: 'absolute', top: '50%', left: '15%', }} />
          <Stepper sx={{ maxWidth: '560px', width: '100%' }} alternativeLabel activeStep={activeStep}>
            {steps.map((label, index) => (
              <Step key={label} completed={index !== activeStep && index < activeStep}>
                <StepLabel>
                  {label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>
      }
      <Grid sx={{ position: { xs: 'relative', md: 'absolute'}, top: { xs: 'unset', md: '15%'}, left: '0' }} justifyContent={'center'} container spacing={0}>
        {activeStep === 0 && <StepOneFirm setActiveStep={setActiveStep} setUserData={setUserData} userData={userData} />}
        {activeStep === 1 && <StepTwoFirm setActiveStep={setActiveStep} setUserData={setUserData} userData={userData} />}
        {activeStep === 2 && <StepThreeFirm setActiveStep={setActiveStep} setUserData={setUserData} userData={userData} />}
      </Grid>
    </Container>
  );
};
