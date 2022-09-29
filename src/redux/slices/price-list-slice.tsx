import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/base';
import { apiv1 } from '../../api/paths';


interface PricesState {
  prices: [];
  loading: 'idle' | 'pending' | 'success' | 'failed';
  error: string | null;
}


export const getPrices = createAsyncThunk(
  'prices/all',
  async (props, { rejectWithValue }) => {
    try {
      const response = await api.get(apiv1 + 'price-list');
      const data = await response.data;
      return data;
    } catch (error: any) {
      return rejectWithValue({ error: error.message });
    }
  },
);


const initialState: PricesState = {
  prices: [],
  loading: 'idle',
  error: null,
};

export const pricesClice = createSlice({
  name: 'prices',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getPrices.pending, (state) => {
      state.loading = 'pending';
    });
    builder.addCase(getPrices.fulfilled, (state, action: any) => {
      state.loading = 'success';
    });
    builder.addCase(getPrices.rejected, (state, action: any) => {
      state.loading = 'idle';
      state.error = action.payload.error;
    })
  },
});
