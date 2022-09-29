import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/base';
import { CargoFilters } from '../../types/cargo.types';
import { apiv1 } from '../../api/paths';


interface LoginState {
  cargoData: any | [];
  loading: 'idle' | 'pending' | 'success' | 'failed';
  error: string | null;
}


export const getCargo = createAsyncThunk(
  'cargo/all',
  async (filters: CargoFilters, { rejectWithValue }) => {
    try {
      const status = filters.status?.toLowerCase();
      if (status === 'published') {
        const response = await api.get(apiv1 + `cargo/search/${status}`, {
          params: {
            ...filters,
            status: null,
          },
        });
        const data = await response.data;
        return data;
      } else {
        const response = await api.get(apiv1 + `cargo/companies/current-company/${status}`, {
          params: {
            ...filters,
            status: null,
          },
        });
        const data = await response.data;
        return data;
      }
    } catch (error: any) {
      return rejectWithValue({ error: error.message });
    }
  },
);

export const getTransportCargo = createAsyncThunk(
  'cargo/all/transport',
  async (filters: CargoFilters, { rejectWithValue }) => {
    try {
      const status = filters.status?.toLowerCase();
      if (status === 'published') {
        const response = await api.get(apiv1 + `cargo/search/${status}`, {
          params: {
            ...filters,
            status: null,
          },
        });
        const data = await response.data;
        return data;
      } else {
        const response = await api.get(apiv1 + `cargo/companies/current-company/${status}`, {
          params: {
            ...filters,
            status: null,
          },
        });
        const data = await response.data;
        return data;
      }
    } catch (error: any) {
      return rejectWithValue({ error: error.message });
    }
  },
);

export const adminGetCargo = createAsyncThunk(
  'cargo/all/admin',
  async (filters: CargoFilters, { rejectWithValue }) => {
    try {
      const response = await api.get(apiv1 + 'cargo/admin/search', {
        params: filters,
      });
      const data = await response.data;
      return data;
    } catch (error: any) {
      return rejectWithValue({ error: error.message });
    }
  },
);


const initialState: LoginState = {
  cargoData: [],
  loading: 'idle',
  error: null,
};

export const cargoSlice = createSlice({
  name: 'cargo',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getCargo.pending, (state) => {
      state.loading = 'pending';
    });
    builder.addCase(getCargo.fulfilled, (state, action: any) => {
      state.loading = 'success';
      state.cargoData = action.payload;
    });
    builder.addCase(getCargo.rejected, (state, action: any) => {
      state.loading = 'idle';
      state.cargoData = [];
      state.error = action.payload.error;
    });
    builder.addCase(adminGetCargo.fulfilled, (state, action: any) => {
      state.loading = 'success';
      state.cargoData = action.payload;
    });
    builder.addCase(getTransportCargo.fulfilled, (state, action: any) => {
      state.loading = 'success';
      state.cargoData = action.payload;
    });
    builder.addCase(adminGetCargo.rejected, (state, action: any) => {
      state.loading = 'idle';
      state.cargoData = [];
      state.error = action.payload.error;
    });
    builder.addCase(getTransportCargo.rejected, (state, action: any) => {
      state.loading = 'idle';
      state.cargoData = [];
      state.error = action.payload.error;
    });
  },
});


export const cargoReducer = cargoSlice.reducer;
