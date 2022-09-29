import React from 'react';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../redux/store';
import { Box, Button, Typography } from '@mui/material';
import moment from 'moment';
import api from '../../api/base';

import { apiv1 } from '../../api/paths';
import { useLocation, useNavigate } from 'react-router-dom';
import { userNotifications } from '../../redux/slices/user-slice';
import { useSnackBar } from '../../context/SnackContext';

interface NotificationProps {
  id?: string,
  active?: boolean;
  name: string;
  time: string;
  cargoId: string;
  companyId: string;
}

export const Notification = ({ active, name, time, id, cargoId, companyId }: NotificationProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { showSnackBar } = useSnackBar();


  const readNotification = async () => {
    await api.put(apiv1 + `notifications/${id}/read`)
      .then((res: any) => {
        dispatch(userNotifications({}));
        showSnackBar(
          'Uspešno',
          'success',
        )
      })
      .catch(err => {
        showSnackBar(
          err.response.data.message,
          'error',
          'Neuspešno'
        )
      });
  };


  return (
    <Box sx={{
      borderLeft: active ? 'solid 3px #36CB83' : 'none',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: '20px 15px',
      borderRadius: '4px',
      opacity: active ? 1 : '.5',
      maxWidth: '700px',
      width: '100%',
      backgroundColor: '#fff',
      alignItems: 'center',
    }}>
      <Typography sx={{ fontSize: '16px', fontWeight: '700', textAlign: 'left', span: { display: 'block', fontSize: '14px', color: '#999' }, flex: 1 }}>
        {name}
        <span>
          {moment(time).fromNow(true)}
        </span>
      </Typography>
      {active
        && (
          <Box display={'flex'} flexDirection={'column'} alignItems={'flex-end'} flex={1} gap={1} justifyContent={'center'}>
            <Button onClick={() => readNotification()} variant={'outlined'}>Oznaci kao procitano</Button>
            {cargoId && (<Button onClick={() => navigate('/objave', {
              state: {
                id: cargoId,
              }
            })} variant={'contained'}>Vidi Objavu</Button>)}
            {companyId && (<Button onClick={() => navigate('/kompanije', {
              state: {
                id: companyId,
              }
            })} variant={'contained'}>Vidi Kompaniju</Button>)}
          </Box>
        )
      }
    </Box>
  );
};