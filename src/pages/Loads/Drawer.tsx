import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../redux/store';
import { RootState } from '../../redux/store';
import { Button, Drawer, styled, Typography, Checkbox, IconButton, Tabs, Tab, useMediaQuery } from '@mui/material';
import { ReactComponent as CancelIcon } from '../../assets/icons/cancel.svg';
import { Box } from '@mui/material';
import { ReactComponent as CloseIcon } from './icons/close.svg';
import { ReactComponent as RightArrow } from './icons/right-arrow.svg';
import AssignDriver from './AssignDriver';
import { LoadingButton } from '@mui/lab';
import HereMap from './VehicleMap';
import { adminGetCargo, getCargo } from '../../redux/slices/cargo-slice';
import api from '../../api/base';
import { apiv1 } from '../../api/paths';
import { CargoData } from './Loads.types';
import { useDialog } from '../../context/ModalContext';
import AssignVehicle from './AssignVehicle';
import { TabPanel } from '../../components/common/PageTab';
import { useLocation, useParams } from 'react-router-dom';
import { AxiosError, AxiosResponse } from 'axios';
import { data } from '@here/maps-api-for-javascript';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { useSnackBar } from '../../context/SnackContext';
import { isNull } from 'lodash';


interface DrawerProps {
  isOpen: boolean;
  close: Function;
  data: any;
}

const StyledBox = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between'
}));

const cancelButton = {
  color: '#fff',
  backgroundColor: 'rgba(241, 64, 75, 1)',
  ':hover': {
    color: '#fff',
    backgroundColor: 'rgba(241, 64, 75, 1)',
    opacity: 0.6,
  }
};

const TranspordDetails = styled(Box)(({ theme }) => ({
  display: 'flex',
  fontFamily: 'Overpass',
  backgroundColor: '#FAFAFA',
  flexWrap: 'wrap',
  padding: '30px',
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    padding: '20px'
  }
}));


const LeftLoadDetails = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'left',
  justifyContent: 'left',
  gap: '10px',
  marginTop: '15px',
  'div': {
    flexDirection: 'row',
    justifyContent: 'space-between',
    display: 'flex',
    'div': {
      display: 'inline-block'
    },
    ':nth-of-type(3)': {
      flexDirection: 'row',
      'div': {
        display: 'flex',
        flexDirection: 'column',
      }
    },
  },
  [theme.breakpoints.down('md')]: {
    width: '130%',
  }
}));
const RightLoadDetails = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  gap: '10px',
  height: '100%',
  borderLeft: '1px solid #E0E0E0',
  paddingLeft: '30px',
  [theme.breakpoints.down('md')]: {
    padding: '0',
    fontWeight: '800',
    borderTop: '1px solid #E0E0E0',
    borderLeft: 'none',
    width: '100%',
    paddingTop: '20px'
  },
}));

const SingleTranspordDetails = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  alignItems: 'left',
  justifyContent: 'left',
  gap: '10px',
  [theme.breakpoints.down('md')]: {
    gap: '0px',
  },
}));

interface DetailsProps {
  city: string,
  company: string,
  date: string,
  status: string,
  street: string,
  houseNum: number | null;
  cargoCompanyId: string;
}
const Details = ({ city, company, date, status, street, houseNum, cargoCompanyId }: DetailsProps) => {
  const companyRole = useSelector((state: RootState) => state?.user?.user?.companyRoles[0]);
  const userRole = useSelector((state: RootState) => state?.user?.user?.role);
  const companyId = useSelector((state: RootState) => state?.user?.user?.company?.id);

  const shouldShowDetailes = () => {
    if (companyRole === 'TRANSPORT') {
      if (status === 'PUBLISHED') return false;
      if (status === 'ACCEPTED') return true;
      if (status === 'IN_PROGRESS') return true;
      if (status === 'EXPIRED') return true;
      if (status === 'CLOSED') return true;
    }
    if (companyRole === 'TRADING') {
      return true
    }
    if (companyRole === 'OWNER') {
      if (status === 'PENDING') return true;
      if (status === 'PUBLISHED') {
        if (companyId === cargoCompanyId) return true;
        else return false;
      }
      if (status === 'ACCEPTED') return true;
      if (status === 'IN_PROGRESS') return true;
      if (status === 'EXPIRED') return true;
      if (status === 'CLOSED') return true;
    }
    if (userRole === 'ADMINISTRATOR') {
      return true
    }
  }

  return (<SingleTranspordDetails>
    <Box  ><Typography variant={'h3'} >{city}</Typography></Box>
    {shouldShowDetailes() && <Box><Typography variant={'h5'}>{company}, {street} {houseNum}</Typography></Box>}
    <Box><Typography color={'#999'} variant={'body2'}>{date}</Typography></Box>
  </SingleTranspordDetails>)
}

interface LoadDetailsProps {
  type: string;
  load: string;
  weight: number;
  price: number;
  body: any;
  status: string;
  pricePerUnit?: number;
  totalCarried?: number;
  customPricePerUnit?: number;
  totalPrice?: number;
  customPrice?: number;
  remainingSpots?: number;
}
const StyledLoadDetails = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  alignItems: 'center',
  fontFamily: 'Overpass',
  borderBottom: '1px solid #EBEBEB',
  width: '100%',
  padding: '30px',
  gap: '30px',
  [theme.breakpoints.down('md')]: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: '20px',
  },
}));
const LoadDetails = ({ type, load, weight, price, body, status, pricePerUnit, totalCarried, totalPrice, customPricePerUnit, customPrice, remainingSpots }: LoadDetailsProps) => {
  const userRole = useSelector((state: RootState) => state?.user?.user?.role);
  const companyRole = useSelector((state: RootState) => state?.user?.user?.companyRoles[0]);

  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  useEffect(() => {
    if (status === 'CLOSED') setValue(1)
  }, [status])


  return (<StyledLoadDetails>
    <Box>
      <Tabs sx={{ gap: 10 }} value={value} onChange={handleChange} aria-label="basic tabs example">
        <Tab sx={{ fontSize: 16, padding: 0, marginRight: 2 }} label="Informacije o Teretu" {...a11yProps(0)} />
        {status === 'CLOSED' && <Tab sx={{ fontSize: 16, padding: 0 }} label="Rezime Tereta" {...a11yProps(1)} />}
      </Tabs>
      <TabPanel value={value} index={0} >
        <LeftLoadDetails >
          <Box>
            <Box>Tip Vozila</Box>
            <Box sx={{ fontWeight: '800', textTransform: 'capitalize', textAlign: 'right' }}>{type}</Box>
          </Box>
          <Box display={'flex'} flexDirection={'column'} >
            <Box>Tip Karoserije</Box>
            <Box sx={{ fontWeight: '800', textTransform: 'capitalize', textAlign: 'right' }}>
              {body?.map((item: any, i: number, row: any) => {
                if (i + 1 === row.length) return <Typography key={i + 1} fontWeight={'bold'}>{item.name}</Typography>
                return <Typography key={i + 1} fontWeight={'bold'}>{item.name + ', '}</Typography>
              })}
            </Box>
          </Box>
          <Box>
            <Box>Vrsta Tereta</Box>
            <Box sx={{ fontWeight: '800', textTransform: 'capitalize', textAlign: 'right' }}>{load}</Box>
          </Box>
          <Box>
            <Box><Typography display={'inline'} fontSize={16}>Težina Tereta</Typography></Box>
            <Box sx={{ fontWeight: '800', textTransform: 'capitalize', textAlign: 'right' }}>{weight}t</Box>
          </Box>
        </LeftLoadDetails>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <LeftLoadDetails>
          <Box>
            <Box>Tip Vozila</Box>
            <Box sx={{ fontWeight: '800', textTransform: 'capitalize', textAlign: 'right' }}>{type}</Box>
          </Box>
          <Box display={'flex'} flexDirection={'column'}>
            <Box>Tip Karoserije</Box>
            <Box sx={{ fontWeight: '800', textTransform: 'capitalize', textAlign: 'right' }}>
              {body?.map((item: any, i: number, row: any) => {
                if (i + 1 === row.length) return <Typography key={i + 1} fontWeight={'bold'}>{item.name}</Typography>
                return <Typography key={i + 1} fontWeight={'bold'}>{item.name + ', '}</Typography>
              })}
            </Box>
          </Box>
          <Box>
            <Box>Vrsta Tereta</Box>
            <Box sx={{ fontWeight: '800', textTransform: 'capitalize', textAlign: 'right' }}>{load}</Box>
          </Box>
          <Box>
            <Box><Typography display={'inline'} fontSize={16}>Ukupna Težina Tereta</Typography></Box>
            <Box sx={{ fontWeight: '800', textTransform: 'capitalize', textAlign: 'right' }}>{totalCarried}t</Box>
          </Box>
        </LeftLoadDetails>
      </TabPanel>
    </Box>
    <RightLoadDetails>
      {userRole === 'ADMINISTRATOR' && (
        <>
          <Box>{customPrice === 0 && customPricePerUnit === 0 ? 'Cena transporta po toni' : (customPrice !== 0 ? 'Cena transporta po teretu' : 'Cena transporta po toni')}</Box>
          <Box sx={{ color: '#36CB83', fontSize: '24px', width: 'max-content', fontWeight: '800' }}>
            {customPrice === 0 && customPricePerUnit === 0 ? pricePerUnit?.toFixed(2).toLocaleString() : (customPrice !== 0 ? customPrice?.toFixed(2).toLocaleString() : customPricePerUnit?.toFixed(2).toLocaleString())} RSD
          </Box>
        </>
      )}
      {userRole === 'ADMINISTRATOR' && status === 'CLOSED' && (
        <>
          <Box>Ukupna Cena Transporta</Box>
          <Box sx={{ color: '#36CB83', fontSize: '24px', width: 'max-content', fontWeight: '800' }}>
            {totalPrice?.toFixed(2).toLocaleString()} RSD
          </Box>
        </>
      )}
      {((companyRole?.includes('TRANSPORT') || companyRole?.includes('OWNER') || companyRole?.includes('TRADING')) && (status === 'EXPIRED' || status !== 'CLOSED')) && (
        <>
          <Box>{customPrice === 0 && customPricePerUnit === 0 ? 'Cena transporta po toni' : (customPrice !== 0 ? 'Cena transporta po teretu' : 'Cena transporta po toni')}</Box>
          <Box sx={{ color: '#36CB83', fontSize: '24px', width: 'max-content', fontWeight: '800' }}>
            {customPrice === 0 && customPricePerUnit === 0 ? pricePerUnit?.toFixed(2).toLocaleString() : (customPrice !== 0 ? customPrice?.toFixed(2).toLocaleString() : customPricePerUnit?.toFixed(2).toLocaleString())} RSD
          </Box>
        </>
      )}
      {((companyRole?.includes('TRANSPORT') || companyRole?.includes('OWNER') || companyRole?.includes('TRADING')) && (status === 'CLOSED')) && (
        <Box flex={1} display={'flex'} flexDirection={'column'} justifyContent={'space-between'}>
          <Box>
            <Box>{customPrice === 0 && customPricePerUnit === 0 ? 'Cena transporta po toni' : (customPrice !== 0 ? 'Cena transporta po teretu' : 'Cena transporta po toni')}</Box>
            <Box sx={{ color: '#36CB83', fontSize: '24px', width: 'max-content', fontWeight: '800' }}>
              {customPrice === 0 && customPricePerUnit === 0 ? pricePerUnit?.toFixed(2).toLocaleString() : (customPrice !== 0 ? customPrice?.toFixed(2).toLocaleString() : customPricePerUnit?.toFixed(2).toLocaleString())} RSD
            </Box>
          </Box>
          <Box>
            <Box>Ukupna Cena Transporta</Box>
            <Box sx={{ color: '#36CB83', fontSize: '24px', width: 'max-content', fontWeight: '800' }}>
              {totalPrice?.toFixed(2).toLocaleString()} RSD
            </Box>
          </Box>
        </Box>
      )}
    </RightLoadDetails>
  </StyledLoadDetails>)
}
export const CustomDrawer = (props: DrawerProps) => {
  const { isOpen, close, data } = props;
  const dispatch = useAppDispatch();
  const userRole = useSelector((state: RootState) => state?.user?.user?.role);
  const companyId = useSelector((state: RootState) => state?.user?.user?.company?.id);
  const companyRole = useSelector((state: RootState) => state?.user?.user?.companyRoles);

  const [cargoData, setCargoData] = useState({} as CargoData);
  const [driver, setDriver] = useState<{ name: string, phone: string, id: string }[] | []>([]);
  const [assignVehicle, setAssignVehicle] = useState<boolean>(false);
  const [assignDriverModal, setAssignDriverModal] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const { state }: any = useLocation();
  const [cargoAddedData, setCargoAddedData] = useState<any>([]);
  const matches = useMediaQuery("(max-width:767px)");

  const { showSnackBar } = useSnackBar();


  const { showDialog } = useDialog();

  const fetchCargoData = async () => {
    try {
      const response = await api.get(`${apiv1}cargo/${data.id}/`);
      setCargoData(response.data);
      const tempCargoAdd = Array.from({ length: /*response.data.transportDetails.vehiclesRequired */ response.data.cargoOrders.length + response.data.remainingSpots }).map((item, i) => {
        return {
          status: '',
          id: '',
          vehicle: {
            licensePlate: '',
          },
          driver: {
            name: '',
            id: '',
          },
          trailer: {
            id: '',
          },
          transferedCargo: 0,
          companyId: '',
          companyName: '',
          checked: false,
        }
      });
      response.data.cargoOrders.map((item: any, i: number) => {
        tempCargoAdd[i].status = item?.status ? item?.status : null;
        tempCargoAdd[i].id = item?.id ? item?.id : null;
        tempCargoAdd[i].companyId = item?.company?.id ? item?.company?.id : null;
        tempCargoAdd[i].companyName = item?.company?.name ? item?.company?.name : null;
        tempCargoAdd[i].driver.name = item?.driver?.name ? item?.driver?.name : null;
        tempCargoAdd[i].driver.id = item?.driver?.id ? item?.driver?.id : null;
        tempCargoAdd[i].vehicle.licensePlate = item?.vehicle?.licencePlate ? item?.vehicle?.licencePlate : null;
        tempCargoAdd[i].vehicle.licensePlate = item?.vehicle?.licencePlate ? item?.vehicle?.licencePlate : null;
        tempCargoAdd[i].transferedCargo = item?.totalCarriedWeight ? item?.totalCarriedWeight : 0;
      });
      setCargoAddedData(tempCargoAdd);
    } catch (error: any) {
      showDialog(
        'Greška',
        error?.response?.data?.message
      );
    }
  };

  const acceptCargoAdmin = async () => {
    try {
      await api.put(`${apiv1}cargo/admin/approve/${data.id}`);
      close();
      dispatch(adminGetCargo({ status: 'PENDING' }));
    }
    catch (err) {
      showDialog(
        'Greška',
        'Došlo je do greške prilikom prihvatanja tereta. Molimo Vas da pokušate ponovo.'
      );
    }
  }

  const cancelCargo = async () => {
    try {
      await api.put(`${apiv1}cargo/${data.id}/cancel`);
      close();
      dispatch(adminGetCargo({ status: 'PENDING' }));
    }
    catch (err) {
      showDialog(
        'Greška',
        'Došlo je do greške prilikom otkazivanja tereta. Molimo Vas da pokušate ponovo.'
      );
    }
  }

  const acceptCargo = async () => {
    await cargoAddedData?.map(async (cargo: any) => {
      if (cargo?.vehicle?.id && cargo?.driver?.id) {
        try {
          await api.post(`${apiv1}cargo-order/cargo/${data.id}/accept/`, {
            vehicleId: cargo.vehicle.id,
            driverId: cargo.driver.id,
            trailerId: cargo.trailer.id !== '' ? cargo?.trailer?.id : null,
          });
          close();
          dispatch(getCargo({ status: 'PENDING' }));
        }
        catch (err) {
          showDialog(
            'Greška',
            'Došlo je do greške prilikom prihvatanja tereta. Molimo Vas da pokušate ponovo.'
          );
        }
      }
    })
  };

  const removeCargoOrder = (cargoOrderId: string) => {
    api.put(apiv1 + `cargo-order/${cargoOrderId}/cancel`)
      .then((res: AxiosResponse) => {
        if (res.status === 200) {
          showSnackBar('Uspešno obrisan Cargo Order', 'error');
          close();
          dispatch(adminGetCargo({ status: 'PENDING' }));
        };
      })
      .catch((err) => {
        const { response } = err;
        showDialog(
          `${response.status}: ${response.statusText}`,
          response.data.message,
        );
      })
  };

  useEffect(() => {
    if (data && isOpen) {
      fetchCargoData();
    }
  }, [data, state]);

  const handleAssignVehicle = (index: number) => {
    setCurrentIndex(index);
    setAssignVehicle(true);
  };

  const handleAssignDriver = (index: number) => {
    setCurrentIndex(index);
    setAssignDriverModal(true);
  };

  const handleRemoveDriver = (index: number) => {
    const tempCargoAdd = cargoAddedData;
    tempCargoAdd[index].driver = { name: '', id: '' };
    setCargoAddedData([...tempCargoAdd]);
  }

  const handleRemoveVehicle = (index: number) => {
    const tempCargoAdd = cargoAddedData;
    tempCargoAdd[index].vehicle = { licensePlate: '' };
    tempCargoAdd[index].trailer = { id: '' };
    setCargoAddedData([...tempCargoAdd]);
  }

  return (
    <Drawer
      anchor='right'
      open={isOpen}
      onClose={() => close()}
      sx={{
        overflow: 'scroll',
      }}
      PaperProps={{
        sx: {
          maxWidth: '750px',
          position: { xs: 'unset', md: 'fixed' }
        }
      }}
    >
      <AssignVehicle
        id={cargoData?.id}
        open={assignVehicle}
        setOpen={() => setAssignVehicle(!assignVehicle)}
        currentIndex={currentIndex}
        setCurrentIndex={setCurrentIndex}
        cargoAddedData={cargoAddedData}
        setCargoAddedData={setCargoAddedData}
        vehicleType={cargoData?.transportDetails?.vehicleType}
      />
      <AssignDriver
        id={cargoData?.id}
        open={assignDriverModal}
        setOpen={() => setAssignDriverModal(!assignDriverModal)}
        cargoAddedData={cargoAddedData}
        setCargoAddedData={setCargoAddedData}
        currentIndex={currentIndex}
        setCurrentIndex={setCurrentIndex}
      />
      <Box sx={{ padding: { xs: '25px 15px', md: '50px 30px' }, fontFamily: 'Overpass' }}>
        <StyledBox>
          {cargoData?.registrationNumber}
          <Box sx={{
            ':hover': {
              cursor: 'pointer'
            },
          }} onClick={() => close()}>
            <CloseIcon />
          </Box>
        </StyledBox>
      </Box>
      {
        matches ?
          (<Box>
            <HereMap data={cargoData} containerHeight={'200px'} />
          </Box>) :
          (<Box>
            <HereMap data={cargoData} containerHeight={'270px'} />
          </Box>)
      }
      <TranspordDetails>
        <Typography sx={{
          textTransform: { xs: 'uppercase' }, color: { xs: '#888888' }, fontSize: { xs: '12px' }, letterSpacing: { xs: '1px' },
          flex: { xs: '0', md: '1 1 100%' }
        }} mb={2} variant={'button'}   >
          Detalji Transporta
        </Typography>
        <Details
          status={cargoData?.status}
          date={cargoData?.loadingDate}
          city={cargoData?.origin?.city}
          street={cargoData?.origin?.street}
          company={cargoData?.origin?.companyName}
          houseNum={cargoData?.origin?.houseNumber}
          cargoCompanyId={cargoData?.publisher?.companyId}
        />
        <Box margin={{ xs: '15px 0 15px 0px', md: '0 40px 0 40px' }} display={'flex'} mt={1} alignItems={'flex-start'}>
          {matches ? <ArrowDownwardIcon sx={{ color: '#36CB83' }} /> : <RightArrow />}

        </Box>
        <Details
          status={cargoData?.status}
          date={cargoData?.unloadingDate}
          city={cargoData?.destination?.city}
          street={cargoData?.destination?.street}
          company={cargoData?.destination?.companyName}
          houseNum={cargoData?.destination?.houseNumber}
          cargoCompanyId={cargoData?.publisher?.companyId}
        />
      </TranspordDetails>
      <LoadDetails
        body={cargoData?.transportDetails?.bodyTypes}
        type={cargoData?.transportDetails?.vehicleType?.name}
        load={cargoData?.goodsDetails?.goodsType?.name}
        weight={cargoData?.goodsDetails?.weight}
        price={cargoData?.price?.customPrice !== 0 ? cargoData?.price?.customPrice : cargoData?.price?.calculatedPrice}
        status={cargoData?.status}
        pricePerUnit={cargoData?.price?.pricePerUnit}
        totalCarried={cargoData?.totalCarriedWeight}
        totalPrice={cargoData?.totalPrice}
        customPricePerUnit={cargoData?.price?.customPricePerUnit}
        customPrice={cargoData?.price?.customPrice}
        remainingSpots={cargoData?.remainingSpots}
      />
      {(userRole === 'ADMINISTRATOR' && cargoData?.status !== 'PENDING') && (
        <Box p={4}>
          <Typography mb={2} variant={'h2'}>Prijavljena vozila i vozači</Typography>
          <Box display={'flex'} flexDirection={'column'} gap={2}>
            {cargoAddedData?.map((item: any, i: number) => {
              return (

                <Box key={i} p={3} sx={{ display: 'flex', border: '1px solid #CDCDCD', borderRadius: 1, justifyContent: 'flex-start', alignItems: 'center', gap: '15px' }}>
                  {(userRole === 'ADMINISTRATOR' && ( cargoData?.status === 'ACCEPTED' || cargoData?.status === 'IN_PROGRESS')) && (item?.vehicle?.licencePlate || item?.driver?.name) && (<LoadingButton
                    onClick={() => removeCargoOrder(item?.id)}
                    size={'large'}
                    variant='contained'
                  >
                    Otkazi Vozilo
                  </LoadingButton>)}
                  {(userRole === 'ADMINISTRATOR' && cargoData?.status !== 'ACCEPTED') && (
                    <Checkbox disabled checked={(item?.vehicle?.licensePlate !== '' && item?.driver?.id !== '') ? true : false} />)}
                  <Typography>{`#${i + 1}`}</Typography>
                  <Typography>{item?.vehicle?.licensePlate}</Typography>
                  <Typography>{(item?.vehicle?.licencePlate || item?.driver?.name) && '●'}</Typography>
                  {(cargoData?.status === 'CLOSED' || cargoData?.status === 'IN_PROGRESS') && item?.transferedCargo !== 0 ? item?.transferedCargo + ' t' : null}
                  <Typography>{item?.driver?.name}</Typography>
                  <Typography>{item?.companyName}</Typography>

                </Box>
              )
            })}
          </Box>
        </Box>
      )}
      {(((companyRole?.includes('TRADING') || companyRole?.includes('TRANSPORT') || companyRole?.includes('OWNER')) && (cargoData.status !== 'PENDING' && cargoData?.status !== 'EXPIRED')) ||
        ((companyRole?.includes('TRANSPORT', 1) || companyRole?.includes('TRADING', 0)) && (cargoData.status !== 'PENDING' && cargoData?.status !== 'EXPIRED'))
      ) && (
          <Box p={{ xs: 2, md: 4 }}>
            <Typography mb={2} variant={'h2'}>Prijavljena vozila i vozači</Typography>
            <Box display={'flex'} flexDirection={'column'} gap={2}>
              {cargoAddedData?.map((item: any, i: number) => {
                return (
                  <Box key={i} p={3} sx={{
                    display: 'flex',
                    border: '1px solid #CDCDCD',
                    borderRadius: 1,
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    gap: '15px',
                    width: '100%',
                  }}>

                    <Checkbox disabled checked={(item?.vehicle?.licensePlate !== '' && item?.driver?.id !== '') ? true : false} />
                    <Typography>{`#${i + 1}`}</Typography>
                    {item?.vehicle?.licensePlate === '' && data?.status === 'PUBLISHED' && !data.fullyAccepted && data?.publisher?.companyId !== companyId && (companyRole?.includes('TRANSPORT') || companyRole?.includes('OWNER')) && (
                      <Button sx={{ ml: 'auto' }} onClick={() => handleAssignVehicle(i)} variant={'text'}>
                        Dodaj Vozilo
                      </Button>
                    )}
                    <Box display={'flex'} sx={{ flexDirection: { xs: 'column', md: 'row' } }} gap={{ xs: 0, md: 2 }}>
                      {item?.vehicle?.licensePlate !== '' && (data?.publisher?.companyId === companyId || userRole !== 'ADMINISTRATOR')
                        && (
                          <Typography>
                            {(item?.companyId === companyId || item?.companyId === '') && item.vehicle.licensePlate}
                            {item?.companyId === '' && item.vehicle.licensePlate !== '' && data?.status === 'PUBLISHED' && !data.fullyAccepted
                              && <IconButton onClick={() => handleRemoveVehicle(i)}><CancelIcon />
                              </IconButton>
                            }
                          </Typography>
                        )}
                      {item?.vehicle?.licensePlate !== '' && data?.publisher?.companyId === companyId && userRole !== 'ADMINISTRATOR'
                        && (
                          <Typography>
                            {item.vehicle.licensePlate}
                          </Typography>
                        )}
                      {(cargoData?.status === 'CLOSED' || cargoData?.status === 'IN_PROGRESS') && item?.transferedCargo !== 0 ? item?.transferedCargo + ' t' : null}
                      {item?.driver?.name === '' && data?.status === 'PUBLISHED' && !data.fullyAccepted && data?.publisher?.companyId !== companyId && (companyRole?.includes('TRANSPORT') || companyRole?.includes('OWNER')) && (
                        <Button onClick={() => handleAssignDriver(i)} variant={'text'}>
                          Dodaj vozača
                        </Button>
                      )}
                      {item?.driver?.name !== '' && (data?.publisher?.companyId === companyId || userRole !== 'ADMINISTRATOR')
                        && (
                          <Typography>
                            {(item?.companyId === companyId || item?.companyId === '') && item?.driver?.name}
                            {item?.companyId === '' && item?.driver?.name !== '' && data?.status === 'PUBLISHED' && !data.fullyAccepted
                              && <IconButton onClick={() => handleRemoveDriver(i)}><CancelIcon />
                              </IconButton>}
                          </Typography>
                        )}
                      {item?.driver?.name !== '' && data?.publisher?.companyId === companyId && userRole !== 'ADMINISTRATOR'
                        && (
                          <Typography>
                            {item?.driver?.name}
                          </Typography>
                        )}
                      {item?.companyName !== '' && (data?.publisher?.companyId === companyId || userRole !== 'ADMINISTRATOR')
                        && (
                          <Typography>
                            {(item?.companyId === companyId || item?.companyId === '') && item?.companyName}
                          </Typography>
                        )}
                      {item?.companyName !== '' && data?.publisher?.companyId === companyId && userRole !== 'ADMINISTRATOR'
                        && (
                          <Typography>
                            {item?.companyName}
                          </Typography>
                        )}
                    </Box>
                  </Box>
                )
              })}
            </Box>
          </Box>
        )}
      {/* <Drivers /> */}
      <Box sx={{ padding: { xs: 2, md: '10px 30px' }, display: 'flex', gap: '10px', flexDirection: 'column', marginTop: 'auto' }}>
        {userRole === 'ADMINISTRATOR' && data?.status === 'PENDING' && (
          <LoadingButton
            onClick={() => acceptCargoAdmin()}
            size={'large'}
            variant='contained'>
            Odobri Objavu
          </LoadingButton>
        )}
        {(((companyRole?.includes('TRADER') || companyRole?.includes('OWNER') || userRole === 'ADMINISTRATOR') && (data?.status === 'PENDING' || data?.status === 'PUBLISHED') && (companyId === data?.publisher?.companyId || !companyId)) || (userRole === 'ADMINISTRATOR' && data?.status === 'ACCEPTED')) && (
          <LoadingButton
            onClick={() => cancelCargo()}
            size={'large'}
            style={cancelButton}
          >
            Otkazi Objavu
          </LoadingButton>
        )}
        {(companyRole?.includes('TRANSPORT') || companyRole?.includes('OWNER')) && data?.status === 'PUBLISHED' && companyId !== data?.publisher?.companyId && (
          <LoadingButton
            onClick={() => acceptCargo()}
            size={'large'}
            variant='contained'
            disabled={data?.publisher?.companyId === companyId}
          >
            Prihvati Objavu
          </LoadingButton>
        )}
        <Button onClick={() => close()} size={'large'} variant='secondary'>Zatvori</Button>
      </Box>
    </Drawer>
  );
}