let DashboardMap = {
  "AQ_Test_1": "",
  "AQ_Test_2": "",
  "AQ_Test_3": "",
  "AQ_Test_4": "",
  "AQ_Test_5": "f443be2474c94515a18511fadbad452a",
};
{/* <Routes>

  <Route path="/" element={<Welcome />} />
  {needsResetPassword && <Route path='/reset-password' element={<ForceResetPassword />} />}

  {customer && <Route element={<ProtectedRoute allowedRoles={['Customer']} />}>
    <Route path="/alerts" element={<Alerts />} />
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path='/devices' element={<Devices />} />
    <Route path='/notifications' element={<NotificationAdmin />} />
  </Route>}

  {vendor && <Route element={<ProtectedRoute allowedRoles={['Vendor']} />}>
    <Route path='/alerts' element={<Alerts />} />
    <Route path="/customers" element={<Customers />} />
    <Route path="/customers/devices/:customer_id" element={<Devices />} />
    <Route path="/customers/devices/:customer_id/addDevice" element={<AddDevice />} />
    <Route path='/customers/addCustomer' element={<AddCustomer />} />
    <Route path='/notifications' element={<NotificationAdmin />} />
  </Route>}


  {admin && <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
    <Route path='/vendors' element={<Vendors />} />
    <Route path='/vendors/customers/:vendor_id' element={<Customers />} />
    <Route path='/vendors/customers/:vendor_id/devices/:customer_id' element={<Devices />} />
    <Route path='/vendors/customers/:vendor_id/devices/:customer_id/addDevice' element={<AddDevice />} />
    <Route path='/vendors/addVendor' element={<AddVendor />} />
    <Route path='/vendors/edit/editVendor' element={<AddVendor />} />
    <Route path='/vendors/customers/:vendor_id/addCustomer' element={<AddCustomer />} />
    <Route path='/reports' element={<Reports />} />
    <Route path='/notifications' element={<NotificationAdmin />} />
  </Route>}
</Routes> */}
const RoutePermissions = {
  homeP: ['access:home'],
  alertP: ['access:alerts'],
  dashboardP: ['access:dashboard'],
  devicesP: ['access:devices'],
  notificationsP: ['access:notifications'],

  venCustP: ['access:customers'],
  venDevP: ['access:customers', 'access:devices'],
  venAddDevP: ['access:customers', 'access:devices', 'access:add_device'],
  venAddCustP: ['access:customers', 'access:add_customer'],

  admVenP: ['access:vendors'],
  admCustP: ['access:vendors', 'access:customers'],
  admDevP: ['access:vendors', 'access:customers', 'access:devices'],
  admAddDevP: ['access:vendors', 'access:customers', 'access:devices', 'access:add_device'],
  admAddVenP: ['access:vendors', 'access:add_vendor'],
  admEditVenP: ['access:vendors', 'access:edit_vendor'],
  admAddCustP: ['access:vendors', 'access:customers', 'access:add_customer'],
  reportsP: ['access:reports'],
};
export { DashboardMap };
