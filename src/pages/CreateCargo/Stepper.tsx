import React, { useEffect, useState } from 'react';
import { useAppDispatch } from '../../redux/store';
import { cargoAll } from '../../redux/slices/driver-slice';
import { getVehicleBody, getVehicleType, getGoodsType } from '../../redux/slices/vehicle-slice';
import { Grid, Box, useMediaQuery, Divider } from '@mui/material';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import { StepLabel } from '@mui/material';
import Button from '@mui/material/Button';
import { RegisterCargo } from './Register';
import { Details } from './Details';
import { CostsCargo } from './Costs';
import { ContactCargo } from './Contact';

import { Cargo } from '../../types/cargo.types';
import Header from '../../components/Header';


const steps = [
  'Registracija Tereta',
  'Detalji Transporta',
  'Troškovi Transporta',
  'Kontakt Podaci'
];
export const CreateCargo = () => {
  const matches = useMediaQuery("(max-width:767px)");
  const dispatch = useAppDispatch();
  const [activeStep, setActiveStep] = useState(0);
  const [cargoData, setCargoData] = useState({} as Cargo);

  useEffect(() => {
    dispatch(cargoAll());
    dispatch(getVehicleBody());
    dispatch(getVehicleType());
    dispatch(getGoodsType());
  }, []);

  return (
    <Box>
      {
        matches ? (
          <>
          <Header />
          <Grid height={'100%'} justifyContent={'center'} alignItems={'center'} flexDirection={'column'} sx={{ overflow: 'scroll', '&::-webkit-scrollbar': { display: 'none' }}} item xs={6}>
          <Stepper sx={{ width: '100%',mt:"10px", mb:"10px" }} alternativeLabel activeStep={activeStep}>
            {steps.map((label, index) => (
              <Step key={label} completed={(index) !== activeStep && (index) < activeStep}>
                <StepLabel>
                  {label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
          <Divider/>
          {activeStep === 0 && <RegisterCargo cargoData={cargoData} setActiveStep={setActiveStep} setCargoData={setCargoData} />}
          {activeStep === 1 && <Details cargoData={cargoData} setCargoData={setCargoData} setActiveStep={setActiveStep} />}
          {activeStep === 2 && <CostsCargo setActiveStep={setActiveStep} setCargoData={setCargoData} cargoData={cargoData} />}
          {activeStep === 3 && <ContactCargo setActiveStep={setActiveStep} setCargoData={setCargoData} cargoData={cargoData} />}
        </Grid>
          </>
        
        )
        : (<Grid container height={'100%'} sx={{ bgcolor: '#FAFAFA'}} alignItems={'center'} justifyContent={'center'} spacing={0}>
        <Grid height={'100%'} justifyContent={'center'} alignItems={'center'} flexDirection={'column'} sx={{ overflow: 'scroll', '&::-webkit-scrollbar': { display: 'none' }}} item xs={6}>
          <Stepper sx={{ width: '100%', minHeight: '150px', marginTop: '64px' }} alternativeLabel activeStep={activeStep}>
            {steps.map((label, index) => (
              <Step key={label} completed={(index) !== activeStep && (index) < activeStep}>
                <StepLabel>
                  {label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
          {activeStep === 0 && <RegisterCargo cargoData={cargoData} setActiveStep={setActiveStep} setCargoData={setCargoData} />}
          {activeStep === 1 && <Details cargoData={cargoData} setCargoData={setCargoData} setActiveStep={setActiveStep} />}
          {activeStep === 2 && <CostsCargo setActiveStep={setActiveStep} setCargoData={setCargoData} cargoData={cargoData} />}
          {activeStep === 3 && <ContactCargo setActiveStep={setActiveStep} setCargoData={setCargoData} cargoData={cargoData} />}
        </Grid>
      </Grid>
      )
      }
    </Box>
    
  );
}