import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/base';
import { apiv1 } from '../../api/paths';

export interface CompanyProps {
  name: string;
  id: string;
}

interface CompanyInitialState {
  result: CompanyProps[];
  totalElements: number;
  loading: 'idle' | 'pending' | 'success' | 'failed';
  error: string | null;
}


interface CompanySorting {
  status?: 'PENDING' | 'VERIFIED' | 'DECLINED'
}


interface CompanySearch {
  name:          string;
  status:        string;
  sortDirection: string;
  pageNo:        number;
  pageSize:      number;
}


export const getAllCompanies = createAsyncThunk(
  'companies/all',
  async (props: CompanySorting, { rejectWithValue }) => {
    try {
      const response = await api.get(apiv1 + 'companies/status', {
        params: props
      });
      const data = await response.data;
      return data;
    } catch (error: any) {
      return rejectWithValue({ error: error.message });
    }
  },
);

export const searchCompanies = createAsyncThunk(
  'companies/search',
  async (props: CompanySearch, { rejectWithValue }) => {
    try {
      const response = await api.get(apiv1 + 'companies/search', {
        params: {
          ...props,
          pageNo: props.pageNo + 1,
        }
      });
      const data = await response.data;
      return data;
    } catch (error: any) {
      return rejectWithValue({ error: error.message });
    }
  },
);


const initialState: CompanyInitialState = {
  result: [],
  totalElements: 0,
  loading: 'idle',
  error: null,
};

export const companySlice = createSlice({
  name: 'companies',
  initialState,
  reducers: {
    approveCompany: (state: any, action: any) => {
      const newContent = state.result.filter((company: CompanyProps) => company.id !== action.payload);
      state.result = newContent;
    },
    deleteCompany: (state: any, action: any) => {
      const newContent = state.result.filter((company: CompanyProps) => company.id === action.payload);
      state.result = newContent;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getAllCompanies.pending, (state) => {
      state.loading = 'pending';
    });
    builder.addCase(getAllCompanies.fulfilled, (state, action: any) => {
      state.loading = 'success';
      state.result = action.payload;
      state.totalElements = action.payload.totalElements;
    });
    builder.addCase(getAllCompanies.rejected, (state, action: any) => {
      state.loading = 'idle';
      state.error = action.payload.error;
    });
    builder.addCase(searchCompanies.fulfilled, (state, action: any) => {
      state.loading = 'success';
      state.result = action.payload.content;
      state.totalElements = action.payload.totalElements;
    });
    builder.addCase(searchCompanies.rejected, (state, action: any) => {
      state.loading = 'idle';
      state.error = action.payload.error;
    })
  },
});


export const companyReducer = companySlice.reducer;
export const { approveCompany, deleteCompany } = companySlice.actions;