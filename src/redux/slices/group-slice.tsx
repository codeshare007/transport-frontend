import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../api/base';
import { apiv1 } from '../../api/paths';

export interface GroupFilters {
  pageNo: number | 0;
  pageSize: number | 10;
  filter?: string | null;
  vehicleTypeId?: string | null;
  sortBy?: 'ID' | 'LICENSE_PLATE' | null;
  direction?: 'ASC' | 'DESC' | null;
}

export interface GroupProps {
  group: any,
  content: any;
  totalElements: number;
  loading?: 'idle' | 'pending' | 'success' | 'failed';
  error?: string | null;
}

export interface AddGroupProps {
  companyId: string;
  name: string;
  description: string;
}

export interface EditGroupProps {
  id: string;
  name: string;
  description: string;
  collaborators: any;
}

export const getAllGroups = createAsyncThunk(
  'groups/all',
  async (params: any, { rejectWithValue }) => {
    try {
      const response = await api.get(apiv1 + 'target-group/companies/' + params.companyId, {
        params: {
          ...params.params,
          pageNo: params.params.pageNo + 1,
        }
      });
      const data = await response.data;
      return data;
    } catch (error: any) {
      return rejectWithValue({ error: error.message });
    }
  },
);

export const getGroup = createAsyncThunk(
  'groups/get',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.get(apiv1 + 'target-group/' + id);
      const data = await response.data;
      return data;
    } catch (error: any) {
      return rejectWithValue({ error: error.message });
    }
  },
);

export const addGroupAction = createAsyncThunk(
  'groups/add',
  async (groupInfo: AddGroupProps, { rejectWithValue }) => {
    try {
      const response = await api.post(apiv1 + 'target-group/companies/' + groupInfo.companyId, groupInfo);
      const data = await response.data;
      return data;
    } catch (error: any) {
      return rejectWithValue({ error: error.message });
    }
  },
);

export const editGroupAction = createAsyncThunk(
  'groups/edit',
  async (groupInfo: EditGroupProps, { rejectWithValue }) => {
    try {
      const response = await api.put(apiv1 + 'target-group/' + groupInfo.id, groupInfo);
      const data = await response.data;
      return data;
    } catch (error: any) {
      return rejectWithValue({ error: error.message });
    }
  },
);

export const removeGroup = createAsyncThunk(
  'groups/remove',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.put(`${apiv1 + 'target-group/'}${id}/disable`);
      return id;
    } catch (error: any) {
      return rejectWithValue({ error: error.message });
    }
  },
);

const initialState: GroupProps = {
  group: null,
  content: [],
  totalElements: 0,
  loading: 'idle',
  error: null,
};

export const groupSlice = createSlice({
  name: 'groups',
  initialState,
  reducers: {
    removeGroupAction: (state: GroupProps, action: PayloadAction<{id: string}>) => {
      const { id } = action.payload;
      const newContent = state.content.filter((group: any) => group.id !== id);
      state.content = newContent;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getAllGroups.pending, (state) => {
      state.loading = 'pending';
    });
    builder.addCase(getAllGroups.fulfilled, (state, action: any) => {
      state.loading = 'success';
      state.content = action.payload.content;
      state.totalElements = action.payload.totalElements;
    });
    builder.addCase(getAllGroups.rejected, (state, action: any) => {
      state.loading = 'idle';
      state.error = action.payload.error;
    });
    builder.addCase(getGroup.fulfilled, (state: GroupProps, action: any) => {
      state.loading = 'success';
      state.group =  action.payload;
    });
    builder.addCase(getGroup.pending, (state) => {
      state.loading = 'pending';
    });
    builder.addCase(addGroupAction.fulfilled, (state: GroupProps, action: any) => {
      state.loading = 'success';
      state.content =  [...state.content, action.payload];
    });
    builder.addCase(addGroupAction.rejected, (state, action: any) => {
      state.loading = 'idle';
      state.error = action.payload.error;
    });
    builder.addCase(editGroupAction.fulfilled, (state, action: any) => {
      const tempGroups = state.content.map((group: any) => {
        if (group.id === action.payload.id) {
          return { ...group, ...action.payload };
        }
        return group;
      })
      state.loading = 'success';
      state.content = tempGroups;
    });
    builder.addCase(editGroupAction.rejected, (state, action: any) => {
      state.loading = 'idle';
      state.error = action.payload.error;
    });
    builder.addCase(removeGroup.pending, (state) => {
      state.loading = 'pending';
    });
    builder.addCase(removeGroup.fulfilled, (state, action: any) => {
      state.loading = 'success';
      state.content = state.content.filter((group: any) => group.id !== action.payload);
      state.totalElements = state.totalElements - 1;
    });
    builder.addCase(removeGroup.rejected, (state, action: any) => {
      state.loading = 'idle';
      state.error = action.payload.error;
    });
  }
});

export const groupReducer = groupSlice.reducer;