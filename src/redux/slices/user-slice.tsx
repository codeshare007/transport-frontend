import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { NavigateFunction } from 'react-router-dom';
import api from '../../api/base';
import { LoginDetails } from '../../types/user.types';
import { apiv1, registerCompany, notifications } from '../../api/paths';
import { Pagination } from '../../types/common.types';
import { useSnackBar } from '../../context/SnackContext';
import { RootState } from '../store';


interface LoginState {
  notifications: any | null;
  tokens: {
    token: string | null;
    refreshToken: string | null;
  },
  user: any | null;
  loading: 'idle' | 'pending' | 'success' | 'failed';
  error: string | null;
}


export const userLogin = createAsyncThunk(
  'user/login',
  async ({ email, password, save }: LoginDetails, { rejectWithValue }) => {
    try {
      const response = await api.post(apiv1 + 'auth', {
        email,
        password,
      });
      const data = await response.data;
      return data;
    } catch (error: any) {
      return rejectWithValue({ error: error.response.data.message });
    }
  },
);

export const userData = createAsyncThunk(
  'user/data',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.get(apiv1 + 'users/profile-info');
      const data = await response.data;
      return data;
    } catch (error: any) {
      return rejectWithValue({ error: error.response.data.message });
    }
  },
);



export const exchangeTokens = createAsyncThunk(
  'user/exchangeTokens',
  async ({ token, company }: any, { rejectWithValue }) => {
    try {
      const response = await api.post(registerCompany + company + '/exchange', {
        exchangeToken: token,
      });
      const data = await response.data;
      return data;
    } catch (error: any) {
      return rejectWithValue({ error: error.message });
    }
  },
);


export const userNotifications = createAsyncThunk(
  'user/notifications',
  async (reqData: Pagination, { getState, rejectWithValue }) => {
    try {
      const response = await api.get(notifications, {
        params: {
          pageNo: 1,
          pageSize: 10,
          filter: 'ALL',
        },
      });
      const data = await response.data;
      return data;

    } catch (error: any) {
      return rejectWithValue({ error: error.message });
    }
  }
);


const initialState: LoginState | null = {
  notifications: {
    content: [],
    totalElements: 0
  },
  tokens: {
    token: null,
    refreshToken: null,
  },
  user: {
    companyRoles: [],
  },
  loading: 'idle',
  error: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    removeError: (state: LoginState) => {
      state.error = null;
      state.loading = 'idle';
    },
    logoutUser: (state: LoginState) => {
      localStorage.clear();
      state.error = null;
      state.loading = 'idle';
      state.tokens = {
        token: null,
        refreshToken: null,
      };
      state.user = null;
    },
    setRefreshedToken: (state: LoginState, action: any) => {
      state.tokens.token = action.payload.token;
      state.tokens.refreshToken = action.payload.refreshToken;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(userLogin.pending, (state) => {
      state.loading = 'pending';
    });
    builder.addCase(userLogin.fulfilled, (state, action: any) => {
      state.loading = 'success';
      state.tokens.token = action.payload.token;
      state.tokens.refreshToken = action.payload.refreshToken;
    });
    builder.addCase(userLogin.rejected, (state, action: any) => {
      state.loading = 'idle';
      state.error = action.payload.error;
    });
    builder.addCase(userNotifications.pending, (state) => {
      state.loading = 'pending';
    });
    builder.addCase(userNotifications.fulfilled, (state, action: any) => {
      state.loading = 'success';
      state.notifications = action.payload;
    });
    builder.addCase(userNotifications.rejected, (state, action: any) => {
      state.loading = 'idle';
      //state.error = action.payload.error;
    });
    builder.addCase(exchangeTokens.fulfilled, (state, action: any) => {
      state.loading = 'success';
      state.tokens = action.payload;
    });
    builder.addCase(exchangeTokens.rejected, (state, action: any) => {
      state.loading = 'idle';
      //state.error = action.payload.error;
    })
    builder.addCase(userData.rejected, (state, action: any) => {
      state.loading = 'idle';
      state.error = action.payload.error;
    });
    builder.addCase(userData.fulfilled, (state, action: any) => {
      state.loading = 'success';
      state.user = action.payload;
    });
  },
});

export const { logoutUser, removeError, setRefreshedToken } = userSlice.actions;
export const userReducer = userSlice.reducer;