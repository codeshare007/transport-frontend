import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/base';
import { apiv1 } from '../../api/paths';

export interface VehicleProps {
  vehicleTypeId: string;
  licensePlate: string;
  bodyTypeId?: string;
  length?: number;
  width?: number;
  height?: number;
  volume?: number;
  loadCapacity?: number;
  additionalEquipment: string;
  description: string;
}
interface VehicleState {
  bodyType: any | null;
  goodsType: any | null;
  vehicleType: any | null;
  vehicles: any | null;
  loading: 'idle' | 'pending' | 'success' | 'failed';
  error: string | null;
}

export interface AddVehicle {
  type: string;
  details: any;
}

export interface EditVehicle {
  id?: string;
  type: string;
  details: any;
}

export interface VehicleFilters {
  pageNo: number | 0;
  pageSize: number | 10;
  filter?: string | null;
  vehicleTypeId?: string | null;
  sortBy?: 'ID' | 'LICENSE_PLATE' | null;
  direction?: 'ASC' | 'DESC' | null;
}



export const getVehicleBody = createAsyncThunk(
  'vehicles/body',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.get(apiv1 + 'body-type');
      const data = await response.data;
      return data;
    } catch (error: any) {
      return rejectWithValue({ error: error.message });
    }
  },
);

export const getVehicleType = createAsyncThunk(
  'vehicles/type',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.get(apiv1 + 'vehicle-type');
      const data = await response.data;
      return data;
    } catch (error: any) {
      return rejectWithValue({ error: error.message });
    }
  },
);

export const getGoodsType = createAsyncThunk(
  'goods/type',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.get(apiv1 + 'goods-type');
      const data = await response.data;
      return data;
    } catch (error: any) {
      return rejectWithValue({ error: error.message });
    }
  },
);
export const getAllVehicles = createAsyncThunk(
  'vehicles/all',
  async (params: VehicleFilters, { rejectWithValue }) => {
    try {
      const response = await api.get(apiv1 + 'vehicle/search', {
        params: {
          ...params,
          pageNo: params.pageNo + 1,
        }
      });
      const data = await response.data;
      return data;
    } catch (error: any) {
      return rejectWithValue({ error: error.message });
    }
  },
);


export const addVehicle = createAsyncThunk(
  'vehicles/add',
  async ({ details, type }: AddVehicle, { rejectWithValue }) => {
    try {
      const response = await api.post(apiv1 + `vehicle/${type}`, details);
      const data = await response.data;
      return data;
    } catch (error: any) {
      return rejectWithValue({ error: error.message });
    }
  },
);

export const removeVehicle = createAsyncThunk(
  'vehicles/remove',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.delete(`${apiv1 + 'vehicle'}/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue({ error: error.message });
    }
  },
);

export const editSingleVehicle = createAsyncThunk(
  'vehicles/edit',
  async ({ details, type, id }: EditVehicle, { rejectWithValue }) => {
    try {
      const response = await api.put(apiv1 + `vehicle/${type}/${id}`, details);
      const data = await response.data;
      return data;
    } catch (error: any) {
      return rejectWithValue({ error: error.message });
    }
  },
);

const initialState: VehicleState = {
  bodyType: null,
  goodsType: null,
  vehicleType: null,
  vehicles: null,
  loading: 'idle',
  error: null,
};

export const vehicleSlice = createSlice({
  name: 'vehicles',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getVehicleBody.pending, (state) => {
      state.loading = 'pending';
    });
    builder.addCase(getVehicleBody.fulfilled, (state, action: any) => {
      state.loading = 'success';
      state.bodyType = action.payload;
    });
    builder.addCase(getVehicleBody.rejected, (state, action: any) => {
      state.loading = 'idle';
      state.error = action.payload.error;
    });
    builder.addCase(getVehicleType.pending, (state) => {
      state.loading = 'pending';
    });
    builder.addCase(getVehicleType.fulfilled, (state, action: any) => {
      state.loading = 'success';
      state.vehicleType = action.payload;
    });
    builder.addCase(getVehicleType.rejected, (state, action: any) => {
      state.loading = 'idle';
      state.error = action.payload.error;
    });
    builder.addCase(getGoodsType.pending, (state) => {
      state.loading = 'pending';
    });
    builder.addCase(getGoodsType.fulfilled, (state, action: any) => {
      state.loading = 'success';
      state.goodsType = action.payload;
    });
    builder.addCase(getGoodsType.rejected, (state, action: any) => {
      state.loading = 'idle';
      state.error = action.payload.error;
    });
    builder.addCase(getAllVehicles.pending, (state) => {
      state.loading = 'pending';
    });
    builder.addCase(getAllVehicles.fulfilled, (state, action: any) => {
      state.loading = 'success';
      state.vehicles = action.payload;
    });
    builder.addCase(getAllVehicles.rejected, (state, action: any) => {
      state.loading = 'idle';
      state.error = action.payload.error;
    })
    builder.addCase(addVehicle.pending, (state) => {
      state.loading = 'pending';
    });
    builder.addCase(addVehicle.fulfilled, (state, action: any) => {
      state.loading = 'success';
    });
    builder.addCase(addVehicle.rejected, (state, action: any) => {
      state.loading = 'idle';
      state.error = action.payload.error;
    })
    builder.addCase(removeVehicle.pending, (state) => {
      state.loading = 'pending';
    });
    builder.addCase(removeVehicle.fulfilled, (state, action: any) => {
      state.loading = 'success';
      state.vehicles.content = state.vehicles.content.filter((vehicle: any) => vehicle.id !== action.payload);
      state.vehicles.totalElements = state.vehicles.totalElements - 1;
    });
    builder.addCase(removeVehicle.rejected, (state, action: any) => {
      state.loading = 'idle';
      state.error = action.payload.error;
    });
    builder.addCase(editSingleVehicle.pending, (state) => {
      state.loading = 'pending';
    });
    builder.addCase(editSingleVehicle.fulfilled, (state, action: any) => {
      const tempVehicles = state.vehicles.content.map((vehicle: any) => {
        if (vehicle.id === action.payload.id) {
          return { ...vehicle, ...action.payload };
        }
        return vehicle;
      })
      state.loading = 'success';
      state.vehicles.content = tempVehicles;
    });
    builder.addCase(editSingleVehicle.rejected, (state, action: any) => {
      state.loading = 'idle';
      state.error = action.payload.error;
    })
  },
});

export const vehicleReducer = vehicleSlice.reducer;