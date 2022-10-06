import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from './redux/store';
import { Routes, Route, unstable_HistoryRouter as HistoryRouter, useSearchParams } from 'react-router-dom';
import { RegisterFirm } from './pages/RegisterFirm';
import { ForgotPasswordPage } from './pages/LandingPages/ForgotPasswordPage';
import { ForgotPasswordPageTwo } from './pages/LandingPages/ForgotPasswordPageTwo';
import { LoginPage } from './pages/LandingPages/LoginPage';
import { RegisterPage } from './pages/LandingPages/RegisterPage';
import { DriversPage } from './pages/Drivers';
import LoadsPage from './pages/Loads';
import NotificationsPage from './pages/Notifications';
import SettingsPage from './pages/Settings';
import ProfilePage from './pages/ProfilePage';
import CompaniesPage from './pages/Companies';
import VehiclesPage from './pages/Vehicles';
import UsersPage from './pages/Users';
import GroupsPage from './pages/Groups';
import { RequireAuth } from './ReqireAuth';
import { CreateCargo } from './pages/CreateCargo/Stepper';
import GoodsType from './pages/GoodsType';
import Prices from './pages/Prices';
import { createBrowserHistory } from 'history';
import '@here/maps-api-for-javascript/bin/mapsjs-ui.css';
import UIfx from 'uifx';
import mp3File from './assets/sounds/notification.mp3';

export const history = createBrowserHistory();

function NotificationSound(props: any) {
  const notifications = useSelector(
    (store: RootState) => store?.user?.notifications
  );

  const [searchParams] = useSearchParams();

  const bell = new UIfx(
    mp3File,
    {
      volume: 1, // number between 0.0 ~ 1.0
      throttleMs: 100
    }
  )

  useEffect(() => {
    if (searchParams.get('loggedIn') && !notifications.content.every((el: { read: boolean; }) => el.read)) {
      bell.play();
    }
  }, [notifications]);

  return props.children;
}

const App = () => {
  return (
    <HistoryRouter history={history}>
      <NotificationSound>
        <Routes>
          <Route path='/' element={<LoginPage />} />
          <Route path='/register' element={<RegisterPage />} />
          <Route path='/reset-password' element={<ForgotPasswordPage />} />
          <Route path='/reset-password/:id/:key' caseSensitive={false} element={<ForgotPasswordPageTwo />} />
          <Route path='/register/transport-company' element={<RegisterFirm type="transport" />} />
          <Route path='/register/trading-company' element={<RegisterFirm type="trading" />} />
          <Route path='/registracija-tereta' element={
            <RequireAuth>
              <CreateCargo />
            </RequireAuth>
          } />
          <Route path='/vozaci' element={
            <RequireAuth>
              <DriversPage />
            </RequireAuth>
          } />
          <Route path='/teret' element={
            <RequireAuth>
              <GoodsType />
            </RequireAuth>
          } />
          <Route path='/cene' element={
            <RequireAuth>
              <Prices />
            </RequireAuth>
          } />
          <Route path='/korisnici' element={
            <RequireAuth>
              <UsersPage />
            </RequireAuth>
          } />
          <Route path='/vozila' element={
            <RequireAuth>
              <VehiclesPage />
            </RequireAuth>
          } />
          <Route path='/objave' element={
            <RequireAuth>
              <LoadsPage />
            </RequireAuth>
          } />
          <Route path='/notifikacije' element={
            <RequireAuth>
              <NotificationsPage />
            </RequireAuth>
          } />
          <Route path='/podesavanja' element={
            <RequireAuth>
              <SettingsPage />
            </RequireAuth>
          } />
          <Route path='/profil' element={
            <RequireAuth>
              <ProfilePage />
            </RequireAuth>
          } />
          <Route path='/kompanije' element={
            <RequireAuth>
              <CompaniesPage />
            </RequireAuth>
          } />
          <Route path='/saradnici' element={
            <RequireAuth>
              <GroupsPage />
            </RequireAuth>
          } />
        </Routes>
      </NotificationSound>
    </HistoryRouter>
  );
}

export default App;
