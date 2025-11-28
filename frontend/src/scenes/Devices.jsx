import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';




import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import ArrowCircleLeftOutlinedIcon from '@mui/icons-material/ArrowCircleLeftOutlined';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import axios from 'axios';
import { IconButton } from '@mui/material';
import AreYouSureToDelete from '../modals/AreYouSureToDelete';
import { toast } from 'react-toastify';
import { setLastRecentlyDevice } from '../redux/slices/deviceSlice';

const Devices = () => {
  const { state } = useLocation();
  const [locationCustomer, setLocationCustomer] = useState(state);
  useEffect(() => {
    setLocationCustomer(state);
  }, []);
  // console.log(locationCustomer);
  const [searchTerm, setSearchTerm] = useState('');
  const [alldevices, setAllDevices] = useState([]);
  const [selectedDevices, setSelectedDevices] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const theme = useSelector((state) => state.theme.theme);
  const admin = sessionStorage.getItem('role').includes('Admin');
  const customer = sessionStorage.getItem('role').includes('Customer');
  const uniqueId = sessionStorage.getItem("uniqueId");
  const permissions = JSON.parse(sessionStorage.getItem('permissions'));
  const nav = useNavigate();
  const dispatch = useDispatch();

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle device selection
  const handleDeviceSelect = (deviceId) => {
    setSelectedDevices(prev =>
      prev.includes(deviceId)
        ? prev.filter(id => id !== deviceId)
        : [...prev, deviceId]
    );
  };

  // Handle delete selected devices
  const handleDeleteDevices = () => {
    setShowDeleteModal(true);
    setSelectedDevices([]);
  };
  const handleDelete = async () => {
    try {
      const res = await axios({
        url: "http://localhost:8000/api/device/deleteDevices",
        method: "POST",
        data: { ids, selectedDevices },
        headers: {
          "Authorization": `Bearer ${sessionStorage.getItem("accessToken")}`,
          "Content-Type": "application/json"
        }
      });
      if (res.status === 200) {
        toast.success("Devices deleted Successfully", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: theme === 'dark' ? 'dark' : 'light'
        });
      }
    } catch (error) {
      console.error(error.response?.data || error.message);
      toast.error(error.message, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: theme === 'dark' ? 'dark' : 'light'
      });
    }
  }

  // Handle export to CSV
  const handleExportJSON = () => {
    const json = JSON.stringify(alldevices, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "devices.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Filter devices based on search term
  const filteredDevices = alldevices.filter(device =>
    device.device_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    device.parameter.toLowerCase().includes(searchTerm.toLowerCase()) ||
    device.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    device.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get status class based on device status
  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-opacity-20 bg-green-500 text-green-100';
      case 'inactive':
        return 'bg-opacity-20 bg-red-500 text-red-100';
      default:
        return '';
    }
  };
  const getAllDevices = async (customer_id) => {
    // console.log(customer_id);
    try {
      const res = await axios({
        url: `http://localhost:8000/api/device/getAllDevices/${encodeURIComponent(customer_id)}`,
        method: 'GET',
        headers: {
          "Authorization": `Bearer ${sessionStorage.getItem('accessToken')}`,
          "Content-Type": "application/json",
        }
      });
      console.log(res.data);
      if (res.status === 200) {
        setAllDevices(res.data);
      }
    } catch (error) {
      console.error(error.response);
    }
  }

  async function handleDeviceClick(device_id) {
    // alert(`Device is : ${device_id}`);
    dispatch(setLastRecentlyDevice(device_id));
    nav('/dashboard', { state: device_id });
    dispatch(setLastRecentlyDevice(device_id));
  }
  function getUseEffectFunction() {
    if (customer) {
      getAllDevices(uniqueId);
    } else {
      getAllDevices(locationCustomer.customer_id);
    }
  }
  useEffect(() => {
    getUseEffectFunction();
  }, [])

  return (
    <div className={`flex-1 h-[90vh] w-full gap-2.5 flex flex-col overflow-auto scrollbar-hide ${theme === 'light' ? 'bg-white text-gray-800' : 'bg-gray-900 text-white'}`}>
      {showDeleteModal && <AreYouSureToDelete
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        itemName="Devices"
      />}
      <div className={theme === "light" ?
        "font-inter flex justify-between items-center bg-orange-200"
        : "font-inter flex justify-between items-center bg-gray-900"}>
        {(!customer) && <IconButton sx={{ color: 'blue' }}>
          <ArrowCircleLeftOutlinedIcon onClick={_ => nav(-1)} title="Back to Customers" />
        </IconButton>}
        <span className='p-2 text-2xl font-bold'>
          Devices{(!customer) && (" : " + locationCustomer.customer_name)}
        </span>
        <button
          className='border-2 border-blue-500 p-1 mr-2 rounded-md hover:border-blue-800 hover:text-blue-800 text-blue-500'
          onClick={() => getUseEffectFunction()}
        >
          Refresh
        </button>
      </div>

      <div className={`flex justify-between p-1/2 items-center shadow-md mx-1 ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-700'}`}>
        {/* Left Section - Buttons */}
        <div className="flex p-1 gap-1">
          <button onClick={handleExportJSON} className="flex items-center bg-green-700 text-white p-2 rounded text-xs font-bold hover:scale-105 hover:bg-black transition-transform duration-200">
            <FileDownloadIcon style={{ fontSize: '16px', marginRight: '4px' }} />
            Export JSON
          </button>

          {permissions.includes('delete:device') && <button
            onClick={handleDeleteDevices}
            className={`flex items-center bg-red-900 text-white p-2 rounded text-xs font-bold hover:scale-105 hover:bg-black transition-transform duration-200 ${selectedDevices.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={selectedDevices.length === 0}
          >
            <DeleteIcon style={{ fontSize: '16px', marginRight: '4px' }} />
            Delete
          </button>}
          <NavLink to={`addDevice`} state={locationCustomer}>
            {permissions.includes('create:device') && <button className="flex items-center bg-teal-700 text-white p-2 rounded text-xs font-bold hover:scale-105 hover:bg-black transition-transform duration-200">
              <AddIcon style={{ fontSize: '16px', marginRight: '4px' }} />
              Add Device
            </button>}
          </NavLink>
        </div>

        {/* Right Section - Search */}
        <input
          type="text"
          placeholder="Search devices..."
          value={searchTerm}
          onChange={handleSearchChange}
          className={`rounded mr-1 p-0.5 ${theme === 'light' ? 'border border-gray-600' : 'border border-gray-600 bg-gray-700 text-white'}`}
        />
      </div>


              {/* Map showing sensor location */}
<div style={{ height: 'calc(100vh - 150px)', marginBottom: '1rem' }}>
  <MapContainer center={[13.013125703418059, 74.79145012397925]} zoom={15} style={{ height: '100%', width: '100%' }}>
    <TileLayer
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    />

    {/* Device 1 Marker */}
    <Marker position={[13.013725729764776, 74.78831596274534]}>
      <Popup>
        <strong>NITK Device 1</strong><br />
        Latitude: 13.004480<br />
        Longitude: 74.791893
      </Popup>
    </Marker>

    {/* Device 2 Marker */}
    <Marker position={[13.013946814301905, 74.78771213044087]}>
      <Popup>
        <strong>NITK Device 2</strong><br />
        Latitude: 13.504480<br />
        Longitude: 75.291893
      </Popup>
    </Marker>
  </MapContainer>
</div>





      {/* Device Cards */}
      {filteredDevices.length > 0 ? (
        <div className="flex flex-wrap gap-2.5 overflow-y-auto p-1 scrollbar-hide">
          {filteredDevices.map(device => (
            <div
              key={device.device_id}
              className={`w-[300px] rounded-lg overflow-hidden shadow-md transition-all duration-200 flex flex-col cursor-pointer hover:translate-y-[-5px] hover:shadow-lg ${theme === 'light'
                ? 'bg-white border border-gray-300'
                : 'bg-gray-700 border border-gray-600'
                }`}
              onClick={() => handleDeviceClick(device.device_id)}
            >
              <div className={`p-2.5 flex justify-between items-center border-b ${theme === 'light' ? 'bg-gray-50 border-gray-300' : 'bg-gray-600 border-gray-500'}`}>
                <h3 className="font-bold text-base m-0">{device.device_name}</h3>
                <span className={`py-0.5 px-2 rounded-full text-xs font-bold ${getStatusClass(device.device_status)}`}>
                  {device.device_status}
                </span>
              </div>

              <div className="p-4 flex-1 flex flex-col">
                <div className="flex justify-between mb-2 text-sm">
                  <span className={theme === 'light' ? 'text-gray-600' : 'text-gray-300'}>Type:</span>
                  <span className="font-medium">{device.device_type}</span>
                </div>
                <div className="flex justify-between mb-2 text-sm">
                  <span className={theme === 'light' ? 'text-gray-600' : 'text-gray-300'}>Location:</span>
                  <span className="font-medium">{device.location}</span>
                </div>
                <div className="flex justify-between mb-2 text-sm">
                  <span className={theme === 'light' ? 'text-gray-600' : 'text-gray-300'}>IP Address:</span>
                  <span className="font-medium">{device.device_ip}</span>
                </div>
                <div className="flex justify-between mb-2 text-sm">
                  <span className={theme === 'light' ? 'text-gray-600' : 'text-gray-300'}>Last Active:</span>
                  <span className="font-medium">{new Date(device.last_time_active).toLocaleString()}</span>
                </div>
                {/* <div className="flex justify-between mb-2 text-sm">
                <span className={theme === 'light' ? 'text-gray-600' : 'text-gray-300'}>Firmware:</span>
                <span className="font-medium">{device.firmware}</span>
              </div> */}

                {/* Sensors Table */}
                {device.sensors.length > 0 && <div className="mt-4 flex flex-col flex-1">
                  <h4 className="m-0 mb-1">Connected Sensors ({device.sensors.length})</h4>
                  <div className="max-h-[120px] overflow-y-auto rounded scrollbar-hide mt-1">
                    <table className="w-full border-collapse text-xs">
                      <thead>
                        <tr>
                          <th className={`text-left p-1.5 sticky top-0 z-10 ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-600'}`}>ID</th>
                          <th className={`text-left p-1.5 sticky top-0 z-10 ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-600'}`}>Name</th>
                          <th className={`text-left p-1.5 sticky top-0 z-10 ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-600'}`}>Parameter</th>
                          {/* <th className={`text-left p-1.5 sticky top-0 z-10 ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-600'}`}>Status</th> */}
                        </tr>
                      </thead>
                      <tbody>
                        {device.sensors.map(sensor => (
                          <tr key={sensor.id}>
                            <td className={`p-1.5 ${theme === 'light' ? 'border-t border-gray-200' : 'border-t border-gray-600'}`}>{sensor.sensor_id}</td>
                            <td className={`p-1.5 ${theme === 'light' ? 'border-t border-gray-200' : 'border-t border-gray-600'}`}>{sensor.sensor_name}</td>
                            <td className={`p-1.5 ${theme === 'light' ? 'border-t border-gray-200' : 'border-t border-gray-600'}`}>{sensor.sensor_parameter}</td>
                            {/* <td className={`p-1.5 ${theme === 'light' ? 'border-t border-gray-200' : 'border-t border-gray-600'}`}>
                              <span className={getStatusClass(sensor.status)}>
                                {sensor.status}
                              </span>
                            </td> */}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>}
              </div>

              <div className={`flex justify-between p-2.5 border-t ${theme === 'light' ? 'bg-gray-50 border-gray-300' : 'bg-gray-600 border-gray-500'}`}>
                <div>
                  <input
                    type="checkbox"
                    checked={selectedDevices.includes(device.device_id)}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleDeviceSelect(device.device_id);
                    }}
                    id={`device-${device.device_id}`}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <label htmlFor={`device-${device.device_id}`} className="ml-1">Select</label>
                </div>
                {/* <div className="flex gap-2.5">
                  <button
                    className={`bg-transparent border-none cursor-pointer p-0 transition-colors duration-200 ${theme === 'light' ? 'text-gray-600 hover:text-gray-800' : 'text-gray-300 hover:text-white'}`}
                    title="Settings"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <SettingsIcon />
                  </button>
                  <button
                    className={`bg-transparent border-none cursor-pointer p-0 transition-colors duration-200 ${theme === 'light' ? 'text-gray-600 hover:text-gray-800' : 'text-gray-300 hover:text-white'}`}
                    title="Refresh"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <RefreshIcon />
                  </button>
                  <button
                    className={`bg-transparent border-none cursor-pointer p-0 transition-colors duration-200 ${theme === 'light' ? 'text-gray-600 hover:text-gray-800' : 'text-gray-300 hover:text-white'}`}
                    title="More Options"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreVertIcon />
                  </button>
                </div> */}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={`shadow-[2px_2px_2px_rgba(0,0,0,0.3)] flex flex-col m-1 items-center justify-center py-16 ${theme === 'dark' ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-500'
          }`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg" className='w-16 h-16 mb-4'>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M10 8h4v6h-4z"></path>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M8 16h8"></path>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M15 15l-9-9m3 12l9-9"></path>
          </svg>
          <p className="text-xl">No Devices found</p>
          {/* <p className="mt-2">Try adjusting your search or add a new device</p> */}
          {permissions.includes('create:device') ? (
            <NavLink to={
              admin ? `/vendors/customers/${locationCustomer.vendor_id}/devices/${locationCustomer.customer_id}/addDevice` :
                `/customers/devices/${locationCustomer.customer_id}/addDevice`
            } state={locationCustomer}>
              <button className={`mt-4 px-4 py-2 rounded-md ${theme === 'dark'
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}>
                Add The First Device
              </button>
            </NavLink>) : (
            <p className='mt-2'>Contact your Vendor for adding your first device</p>
          )
          }
        </div>
      )}
    </div>

  );

 



};

export default Devices;