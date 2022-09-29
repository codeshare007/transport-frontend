import api from '../api/base';
import axios from 'axios';
import {
  setRefreshedToken,
  logoutUser,
} from './slices/user-slice';
import { Store, Action } from 'redux';
import { history } from '../App';

const UNAUTHORIZED = 401;
const FORBIDDEN = 403;

export const axiosMiddleware = (store: any) => (next: any) => (action: Action) => {
  const token = localStorage.getItem('token');
  const refreshToken = localStorage.getItem('refreshToken');

  if (action.type === 'user/login/fulfilled') {
    setInterceptors(store)
  };
  if (action.type === 'user/exchangeTokens/fulfilled') {
    setInterceptors(store)
  }

  if (token && refreshToken) {
    setInterceptors(store);
  }

  if (action.type === 'user/logoutUser') {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    setInterceptors(store, action.type);
  }

  return next(action)
}

export const setInterceptors = (store: Store, action?: string) => {
  if (!store) {
    return
  };


  // Interceptor added after login
  const tokInterceptor = api.interceptors.request.use(
    (response: any) => {
      const token = localStorage.getItem('token');
      const storeToken = store.getState().user.tokens.token;
      if (token) response.headers.AuthToken = token;
      if (storeToken) response.headers.AuthToken = storeToken;
      if (!token && !storeToken) delete response.headers.AuthToken;
      return response;
    },
    (error) => {
      return Promise.reject(error)
    },
  );

  // Interceptor for unauthorized requests or forbidden requests
  const refInterceptor = api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      const { status } = error.response;
      const refresh_token = localStorage.getItem('refreshToken');

      if ((status === UNAUTHORIZED && refresh_token) && !originalRequest._retry) {
        try {
          // insert path to refresh token
          const tokens = await axios.post(`test/token_refresh/`, {
            refreshToken: refresh_token,
          });
          store.dispatch(setRefreshedToken({
            token: tokens.data.token,
            refreshToken: tokens.data.refreshToken,
          }));

          originalRequest._retry = true;

          api.defaults.headers.common.AuthToken = tokens.data.token;

          return api(originalRequest);
        } catch (err: any) {
          store.dispatch(logoutUser());
          history.replace('/');
        }
      }
      return Promise.reject(error);
    },
  );

  if (action) {
    delete api.defaults.headers.common.AuthToken
    api.interceptors.request.eject(tokInterceptor);
    api.interceptors.response.eject(refInterceptor);
  }
}