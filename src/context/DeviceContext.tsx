import React, { createContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { userNotifications, userData } from '../redux/slices/user-slice';
import useWindowSize from '../hooks/useWindowSize';
import { RootState } from '../redux/store';

export const Device = createContext({
  mobile: false,
  showSidebar: false,
  setShowSidebar: (prop: any) => prop,
});

export const DeviceContext = ({ children }: any) => {
  const tokens = useSelector((state: RootState) => state?.user?.tokens.token);
  const userRole = useSelector((state: RootState) => state?.user?.user?.companyRoles[0]);
  const deviceWidth = useWindowSize().width as number;
  const [showSidebar, setShowSidebar] = useState<boolean>(false);

  const dispatch = useDispatch();

  useEffect(() => {
    document.body.style.overflow = showSidebar ? 'hidden' : '';
  }, [showSidebar]);


  useEffect(() => {
    const storageTokens = localStorage.getItem('token');
    if (tokens) dispatch(userData());
    if (storageTokens) dispatch(userNotifications({}));
    if (storageTokens) dispatch(userData());
    if (userRole !== 'TRADING' && tokens) {
      dispatch(userNotifications({}));
    }
  }, [tokens, userRole]);


  return (
    <Device.Provider value={{
      mobile: deviceWidth <= 1439 as boolean,
      showSidebar,
      setShowSidebar,
    }}>
      {children}
    </Device.Provider>
  );
};
