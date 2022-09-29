import { configureStore, Store } from '@reduxjs/toolkit';
import { 
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
import { useDispatch } from 'react-redux'
import { userReducer } from './slices/user-slice';
import { usersReducer } from './slices/users-slice';
import { vehicleReducer } from './slices/vehicle-slice';
import { driversReducer } from './slices/driver-slice';
import { companyReducer } from './slices/transport-slice';
import { cargoReducer } from './slices/cargo-slice';
import { groupReducer } from './slices/group-slice';
import { combineReducers } from '@reduxjs/toolkit';
import { axiosMiddleware } from './axiosSettings';

const devToolsCompose = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;



const rootReducer = combineReducers({
  user: userReducer,
  users: usersReducer,
  vehicles: vehicleReducer,
  drivers: driversReducer,
  companies: companyReducer,
  cargo: cargoReducer,
  groups: groupReducer
});

// const persistedReducer = persistReducer(persistConfig, rootReducer);


const store = configureStore({
  reducer: rootReducer,
  devTools: { trace: true, traceLimit: 25 },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
    },
  }).concat([axiosMiddleware]),
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>();

export { store };
