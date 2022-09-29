import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../api/base';
import { apiv1 } from '../../api/paths';

export interface DriverProps {
  content: any;
  totalElements: number;
  loading?: 'idle' | 'pending' | 'success' | 'failed';
  error?: string | null;
}

export interface Content {
  name: string;
  id: string;
  phone: string;
}

export interface AddDriverProps {
  name: string;
  phone: string;
  pin: string;
}



export interface SearchProps {
  pageNo: number | 1;
  pageSize: number | 10;
  sortBy: string | 'ID';
  nameFilter: string | null;
  direction: string;
}


export const driversAll = createAsyncThunk(
  'drivers/all',
  async (searchProps: SearchProps, { rejectWithValue }) => {
    try {
      const response = await api.get(apiv1 + 'drivers/search', {
        params: {
          ...searchProps,
          pageNo: searchProps.pageNo + 1,
        },
      });
      const data = await response.data;
      return data;
    } catch (error: any) {
      return rejectWithValue({ error: error.message });
    }
  },
);


export const cargoAll = createAsyncThunk(
  'drivers/cargo',
  async (data, { rejectWithValue }) => {
    try {
      //const response = await api.get(apiv1 + 'cargo/search');
      // const data = await response.data;
      return {};
    } catch (error: any) {
      return rejectWithValue({ error: error.message });
    }
  },
);

export const addDriver = createAsyncThunk(
  'drivers/add',
  async (driverInfo: AddDriverProps, { rejectWithValue }) => {
    try {
      const response = await api.post(apiv1 + 'drivers', driverInfo);
      const data = await response.data;
      return data;
    } catch (error: any) {
      return rejectWithValue({ error: error.message });
    }
  },
);


const initialState: DriverProps = {
  content: [],
  totalElements: 0,
  loading: 'idle',
  error: null,
};

export const driversSlice = createSlice({
  name: 'drivers',
  initialState,
  reducers: {
      removeDriver: (state: DriverProps, action: PayloadAction<{id: string}>) => {
        const { id } = action.payload;
        const newContent = state.content.filter((driver: any) => driver.id !== id);
        state.content = newContent;
      }
  },
  extraReducers: (builder) => {
    builder.addCase(driversAll.pending, (state) => {
      state.loading = 'pending';
    });
    builder.addCase(driversAll.fulfilled, (state: DriverProps, action: any) => {
      state.loading = 'success';
      state.content = action.payload.content;
      state.totalElements = action.payload.totalElements;
    });
    builder.addCase(driversAll.rejected, (state, action: any) => {
      state.loading = 'idle';
      state.error = action.payload.error;
    });
    builder.addCase(addDriver.fulfilled, (state: DriverProps, action: any) => {
      state.loading = 'success';
      state.content =  [...state.content, action.payload];
    });
    builder.addCase(addDriver.rejected, (state, action: any) => {
      state.loading = 'idle';
      state.error = action.payload.error;
    })
  },
});

export const driversReducer = driversSlice.reducer;
export const { removeDriver } = driversSlice.actions;