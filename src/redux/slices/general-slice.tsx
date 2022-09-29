import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/base';
import { ForgotPassword } from '../../types/user.types';
import { apiv1 } from '../../api/paths';


interface LoginState {
  loading: 'idle' | 'pending' | 'success' | 'failed';
  error: string | null;
}


export const forgotPass = createAsyncThunk(
  'general/forgotPass',
  async ({ email }: ForgotPassword, { rejectWithValue }) => {
    try {
      const response = await api.post(apiv1 + 'reset-password/init', {
        email,
      });
      const data = await response.data;
      return data;
    } catch (error: any) {
      return rejectWithValue({ error: error.message });
    }
  },
);


const initialState: LoginState = {
  loading: 'idle',
  error: null,
};

export const generalSlice = createSlice({
  name: 'general',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(forgotPass.pending, (state) => {
      state.loading = 'pending';
    });
    builder.addCase(forgotPass.fulfilled, (state, action: any) => {
      state.loading = 'success';
    });
    builder.addCase(forgotPass.rejected, (state, action: any) => {
      state.loading = 'idle';
      state.error = action.payload.error;
    })
  },
});
