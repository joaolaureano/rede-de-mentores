import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { SnackbarProvider } from 'notistack';
import App from './App';
// import Login from './pages/login/Login';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  <SnackbarProvider
    style={{ margin: '70px 0' }}
    maxSnack={3}
    preventDuplicate
    anchorOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
  >
    <App />
  </SnackbarProvider>,

  document.getElementById('root'),
);

serviceWorker.unregister();
