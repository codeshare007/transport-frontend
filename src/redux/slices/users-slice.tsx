import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../api/base';
import { apiv1 } from '../../api/paths';

export interface UsersProps {
  companyId: string;
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

export interface UsersSearchProps {
  companyId: string;
  pageNo: number | 1;
  pageSize: number | 10;
}


export interface InviteUserDetails {
    name: string;
    phone: string;
    email: string;
    companyId: string;
  }

export const usersPerCompany = createAsyncThunk(
  'users/company',
  async (searchProps: UsersSearchProps, { rejectWithValue }) => {
    try {
      const response = await api.get(apiv1 + 'users/companies/'+ searchProps.companyId, {
        params: {
          ...searchProps,
          pageNo: searchProps.pageNo + 1,
        },
      });
      const data = await response.data;
      const companyId = searchProps.companyId;
      const newdata = {...data, companyId};
      //console.log(searchProps);
      //console.log(newdata);
      return newdata;
    } catch (error: any) {
      return rejectWithValue({ error: error.message });
    }
  },
);

export const inviteUser = createAsyncThunk(
    'user/invite',
    async (userInfo: InviteUserDetails, { rejectWithValue }) => {
      try {
        const response = await api.post(apiv1 + 'users/companies/' + userInfo.companyId + '/invite', userInfo);
        const data = await response.data;
        return data;
      } catch (error: any) {
        return rejectWithValue({ error: error.response.data.message });
      }
    },
  );


const initialState: UsersProps = {
  companyId: '',
  content: [],
  totalElements: 0,
  loading: 'idle',
  error: null,
};

export const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
      removeUsers: (state: UsersProps, action: PayloadAction<{id: string}>) => {
        const { id } = action.payload;
        const newContent = state.content.filter((users: any) => users.id !== id);
        state.content = newContent;
      }
  },
  extraReducers: (builder) => {
    builder.addCase(usersPerCompany.pending, (state) => {
      state.loading = 'pending';
    });
    builder.addCase(usersPerCompany.fulfilled, (state: UsersProps, action: any) => {
      state.loading = 'success';
      state.content = action.payload.content;
      state.totalElements = action.payload.totalElements;
      state.companyId = action.payload.companyId;
    });
    builder.addCase(usersPerCompany.rejected, (state, action: any) => {
      state.loading = 'idle';
      state.error = action.payload.error;
    })
  },
});

export const usersReducer = usersSlice.reducer;
export const { removeUsers } = usersSlice.actions;