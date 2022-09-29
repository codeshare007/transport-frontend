import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { store } from './redux/store';
import { PersistGate } from 'redux-persist/integration/react'
import { Provider } from 'react-redux';
import { MainTheme } from './theme';
import { DialogProvider } from './context/ModalContext';
import { SnackBarProvider } from './context/SnackContext';
import { DeviceContext } from './context/DeviceContext';

ReactDOM.render(
  <Provider store={store}>
    <MainTheme>
      <SnackBarProvider>
        <DialogProvider>
          <DeviceContext>
            <App />
          </DeviceContext>
        </DialogProvider>
      </SnackBarProvider>
    </MainTheme>
  </Provider>,
  document.getElementById('root')
);
