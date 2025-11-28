import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from './redux/store/store.jsx';
import { Auth0Provider } from '@auth0/auth0-react';

const onRedirectCallback = (appState) => {
  window.history.replaceState({}, document.title, appState?.returnTo || '/');
};
createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <Auth0Provider
        domain={import.meta.env.VITE_DOMAIN}
        clientId={import.meta.env.VITE_CLIENT_ID}
        authorizationParams={{
          redirect_uri: window.location.origin,
          audience: "https://sensor-wave-api",
          scope: "openid profile email"
        }}
        onRedirectCallback={(appState) => {
          window.history.replaceState({}, document.title, appState?.returnTo || window.location.pathname);
        }}
      >
        <App />
      </Auth0Provider>
    </PersistGate>
  </Provider>,
)
