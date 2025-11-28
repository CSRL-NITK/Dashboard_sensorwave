import React, { useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Topbar from './components/Topbar';
import Dashboard from './scenes/Dashboard.jsx';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from './redux/store/store.jsx';
import { toggleTheme } from './redux/slices/themeSlice.jsx';
import Welcome from './scenes/Welcome.jsx';
import Alerts from './scenes/Alerts.jsx';
import LeftBar from './components/LeftBar.jsx';
import Devices from './scenes/Devices.jsx';
import { useAuth0 } from "@auth0/auth0-react";
import Introduction from './scenes/Introduction.jsx';
import Loading from './components/Loading.jsx';
import { jwtDecode } from 'jwt-decode';
import Customers from './scenes/Customers.jsx';
import AddDevice from './modals/AddDevice.jsx';
import Settings from './modals/Setting.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import AddCustomer from './modals/AddCustomer.jsx';
import Vendors from './scenes/Vendors.jsx';
import AddVendor from './modals/AddVendor.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import ForceResetPassword from './modals/ForceResetPassword.jsx';
import Reports from './scenes/Reports.jsx';
import NotificationAdmin from './scenes/NotificationAdmin.jsx';
import { setAllFilteredNotifs, setAllNotifs, setNotifCount } from './redux/slices/notificationSlice.jsx';
import SSEListener from './modals/SSEListener.jsx';
import PermitRoute from './components/Permission.jsx';



const App = () => {
  const { isAuthenticated, isLoading, error, getAccessTokenSilently } = useAuth0();
  const theme = useSelector((state) => state.theme.theme);
  const dispatch = useDispatch();
  const [tokenReady, setTokenReady] = useState(false); // New state
  // const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) return;

    if (isAuthenticated) {
      getAccessTokenSilently().then(token => {
        if (!token) {
          console.error('Token is empty or undefined.');
          return;
        }

        sessionStorage.setItem('accessToken', token);
        // console.log('Access token:', token);

        try {
          const decodedToken = jwtDecode(token);
          const roles = decodedToken['https://sensor-wave-app.com/roles'];
          const uniqueId = decodedToken['sub'];
          const needsReset = decodedToken['https://sensor-wave-app.com/needsResetPassword'];
          sessionStorage.setItem('needsReset', needsReset);
          sessionStorage.setItem('permissions', JSON.stringify(decodedToken['permissions']));
          console.log(decodedToken);

          sessionStorage.setItem('uniqueId', uniqueId);
          sessionStorage.setItem('role', JSON.stringify(roles));

          setTokenReady(true); // ✅ Token and role now ready
          fetchNotifications(token);
        } catch (error) {
          console.error('Error decoding token:', error.message);
        }
      }).catch(err => {
        console.error('Error getting token:', err.message);
      });
    }

  }, [isAuthenticated, isLoading]);


  const isReady = isAuthenticated && tokenReady;
  const roles = JSON.parse(sessionStorage.getItem('role'));
  const customer = roles && roles.includes("Customer");
  const needsResetPassword = sessionStorage.getItem("needsReset") === 'true';
  const [sensorData, setSensorData] = useState(null);

  // Callback function to handle incoming data
  const handleNewData = (data) => {
    setSensorData(data); // Update state or trigger other actions
  };
  const muiTheme = createTheme({
    palette: {
      mode: theme,
    },
  });

  const fetchNotifications = async (token) => {
    const uniqueId = sessionStorage.getItem("uniqueId");
    const accessToken = sessionStorage.getItem("accessToken");
    try {
      const res = await axios.post(
        'http://localhost:8000/api/notification/getNotificationsForUser',
        { receiver: uniqueId },
        {
          headers: {
            Authorization: `Bearer ${token || accessToken}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        }
      );

      if (res.status === 200) {
        const filtered = res.data.filter(n => !n.is_read);
        dispatch(setAllFilteredNotifs(filtered));
        dispatch(setNotifCount(filtered.length));
        dispatch(setAllNotifs(res.data));
      }
    } catch (err) {
      console.error('Notification Fetch Error:', err.response?.data || err.message);
    }
  };
  const getYourVendorIfYouAreCustomer = async () => {
    const uniqueId = sessionStorage.getItem("uniqueId");
    try {
      const res = await axios({
        url: "http://localhost:8000/api/customer/getYourVendorIfYouAreCustomer",
        method: "POST",
        data: { customer_id: uniqueId },
        headers: {
          "Authorization": `Bearer ${sessionStorage.getItem('accessToken')}`,
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
      });
      if (res.status === 200) {
        sessionStorage.setItem("yourDetailAsCustomer", JSON.stringify(res.data));
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if (customer) getYourVendorIfYouAreCustomer();
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider theme={muiTheme}>
          <CssBaseline />
          <Router>

            <div className="App overflow-auto scrollbar-hide">
              <>
                {error && <div>Error: {error.message}</div>}
                {!error && (isLoading || (isAuthenticated && !tokenReady)) && <Loading />}
                {!error && isReady && (
                  <>
                    {!needsResetPassword && <LeftBar />}
                    <main className="content overflow-auto scrollbar-hide">
                      {!needsResetPassword && <Topbar toggleTheme={() => dispatch(toggleTheme())} />}
                      <Routes>

                        <Route
                          path='/'
                          element={<PermitRoute permission="access:home" element={<Welcome />} />}
                        />
                        {needsResetPassword && <Route path='/reset-password' element={<ForceResetPassword />} />}
                        <Route
                          path='/alerts'
                          element={<PermitRoute permission="access:alerts" element={<Alerts />} />}
                        />
                        <Route
                          path='/dashboard'
                          element={<PermitRoute permission="access:dashboard" element={<Dashboard />} />}
                        />
                        <Route
                          path='/notifications'
                          element={<PermitRoute permission="access:notifications" element={<NotificationAdmin />} />}
                        />
                        <Route
                          path='/customers'
                          element={<PermitRoute permission="access:customers" element={<Customers />} />}
                        />
                        <Route
                          path='/vendors/customers/:vendor_id'
                          element={<PermitRoute permission="access:adm_cust" element={<Customers />} />}
                        />
                        <Route
                          path='/vendors'
                          element={<PermitRoute permission="access:vendors" element={<Vendors />} />}
                        />

                        <Route
                          path='/devices'
                          element={<PermitRoute permission="access:devices" element={<Devices />} />}
                        />
                        <Route
                          path='/customers/devices/:customer_id'
                          element={<PermitRoute permission="access:ven_dev" element={<Devices />} />}
                        />
                        <Route
                          path='/vendors/customers/:vendor_id/devices/:customer_id'
                          element={<PermitRoute permission="access:adm_dev" element={<Devices />} />}
                        />
                        <Route
                          path='/customers/devices/:customer_id/addDevice'
                          element={<PermitRoute permission="access:ven_add_dev" element={<AddDevice />} />}
                        />
                        <Route
                          path='/vendors/customers/:vendor_id/devices/:customer_id/addDevice'
                          element={<PermitRoute permission="access:adm_add_dev" element={<AddDevice />} />}
                        />
                        <Route
                          path='/customers/addCustomer'
                          element={<PermitRoute permission="access:ven_add_cust" element={<AddCustomer />} />}
                        />
                        <Route
                          path='/vendors/customers/:vendor_id/addCustomer'
                          element={<PermitRoute permission="access:adm_add_cust" element={<AddCustomer />} />}
                        />
                        <Route
                          path='/vendors/addVendor'
                          element={<PermitRoute permission="access:adm_add_ven" element={<AddVendor />} />}
                        />
                        <Route
                          path='/vendors/edit/editVendor'
                          element={<PermitRoute permission="access:adm_edit_ven" element={<AddVendor />} />}
                        />
                        <Route
                          path='/reports'
                          element={<PermitRoute permission="access:reports" element={<Reports />} />}
                        />
                      </Routes>
                    </main>
                  </>

                )}
                {!error && !isAuthenticated && !isLoading && (
                  <Routes>
                    <Route path="/introduction" element={<Introduction />} />
                    <Route path="/" element={<Navigate to="/introduction" />} />
                  </Routes>
                )}
              </>
              <ToastContainer />
              {customer && <SSEListener />}
            </div>
          </Router>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;