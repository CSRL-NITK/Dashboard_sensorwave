import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AlertData, sensorData } from '../data/liveSensorData';
import DeleteIcon from '@mui/icons-material/Delete';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import FilterListIcon from '@mui/icons-material/FilterList';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import clsx from 'clsx';
import { io } from 'socket.io-client';
import axios from 'axios';
import { toast } from 'react-toastify';
import { appendAllAlerts, setAllAlerts, updateAlertStatus } from '../redux/slices/notificationSlice';
import { SheetIcon } from 'lucide-react';

const socket = io('http://localhost:8000');
// const eventSource = new EventSource('http://localhost:8000/api/aq/events');

const Alerts = () => {
  const admin = JSON.parse(sessionStorage.getItem('role'))[0] == "Admin" ? true : false;
  const vendor = JSON.parse(sessionStorage.getItem('role'))[0] == "Vendor" ? true : false;
  const customer = JSON.parse(sessionStorage.getItem('role'))[0] == "Customer" ? true : false;
  const yourDetail = JSON.parse(sessionStorage.getItem("yourDetailAsCustomer"));
  const uniqueId = sessionStorage.getItem('uniqueId');
  const [selectedAlerts, setSelectedAlerts] = useState([]);
  const allAlerts = useSelector(state => state.notification.allAlerts);
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [clickedAlerts, setClickedAlerts] = useState(new Set());
  const all_customers = useSelector((state) => state.customer.all_customers);
  const theme = useSelector((state) => state.theme.theme);
  const permissions = JSON.parse(sessionStorage.getItem('permissions'));


  const customer_email = (customer_id) => {
    const customer = all_customers[customer_id];
    return customer ? customer.customer_email : `No Name`;
  };
  const getSensorName = (sensorId) => {
    const sensor = sensorData.find(s => s.id === sensorId);
    return sensor ? sensor.name : `Sensor ${sensorId}`;
  };

  const handleCheckboxChange = (alert_id) => {
    setSelectedAlerts(prevSelected =>
      prevSelected.includes(alert_id)
        ? prevSelected.filter(i => i !== alert_id)
        : [...prevSelected, alert_id]
    );
  };

  const handleSelectAllChange = (event) => {
    setSelectedAlerts(event.target.checked ? filteredAlerts.map((_, index) => index) : []);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleDelete = async () => {
    try {
      const res = await axios({
        url: "http://localhost:8000/api/alert/deleteAlerts",
        method: "POST",
        data: {
          ids: selectedAlerts,
        },
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(res);
    } catch (error) {
      console.error(error.message);
    }
    setSelectedAlerts([]);
  };

  const handleResolve = async () => {
    const dataArray = [];
    selectedAlerts.map(alert => {
      const alertData = allAlerts[alert];
      if (alertData) {
        dataArray.push({
          alert_id: alertData.alert_id,
          sender: uniqueId,
          receiver: alertData.customer_id,
          title: alertData.parameter,
          message: 'Successfully Solved',
          type: 'success',
          created_at: new Date().toLocaleString('en-US', { timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone })
        });
      }
    });
    try {
      const res = await axios({
        url: "http://localhost:8000/api/alert/resolveAlerts",
        method: "PUT",
        data: {
          ids: selectedAlerts,
        },
        headers: {
          "Authorization": `Bearer ${sessionStorage.getItem('accessToken')}`,
          "Content-Type": "application/json",
        },
      });
      if (res.status === 200) {
        const insertNotif = await axios({
          url: "http://localhost:8000/api/notification/insertManyNotification",
          method: "POST",
          data: { dataArray: dataArray },
          headers: {
            "Authorization": `Bearer ${sessionStorage.getItem("accessToken")}`
          }
        });
        if (insertNotif.status === 200) {
          socket.emit("resolvedNotificationByVendorOnly", insertNotif.data);
        }
      }
    } catch (error) {
      console.error(error.message);
    }
    setSelectedAlerts([]);
  };

  const handleExportCSV = () => {
    const headers = ["Sensor ID", "Sensor Name", "Type", "Value", "Status", "Time"];

    const csvContent = [
      headers.join(','), // Header row
      ...filteredAlerts.map(alert => [
        alert.sensorId,
        getSensorName(alert.sensorId),
        alert.type,
        alert.value,
        alert.status,
        alert.time
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'sensor_alerts.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleStatusFilter = (status) => {
    setFilterStatus(status);
    setShowFilters(false);
  };

  const statusColor = {
    normal: 'green',
    warning: 'yellow',
    critical: 'red',
  };


  const searchRegex = new RegExp(searchQuery, 'i'); // 'i' for case-insensitive

  const filteredAlerts = Object.values(allAlerts).filter(alert => {
    const matchesSearch =
      searchRegex.test(alert.device_name) ||
      searchRegex.test(alert.parameter) ||
      searchRegex.test(alert.value) ||
      searchRegex.test(alert.alert_gen_time) ||
      (vendor && searchRegex.test(alert.customer_id));

    const matchesStatus =
      filterStatus === "all" ||
      alert.status === filterStatus;

    return matchesSearch && matchesStatus;
  });



  const handleSendNotification = async (alert) => {
    setClickedAlerts(prev => new Set([...prev, alert.alert_id]));
    const data = {
      sender: uniqueId,
      receiver: yourDetail.vendor_id,
      title: alert.parameter,
      message: `${alert.parameter} exceeded threshold in Room`,
      type: 'alert',
      created_at: new Date().toLocaleString('en-US', { timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone })
    };
    try {
      // Only send notification to vendor
      const res = await axios({
        url: "http://localhost:8000/api/notification/insertNotification",
        method: 'POST',
        data: data,
        headers: {
          "Authorization": `Bearer ${sessionStorage.getItem('accessToken')}`,
          "Accept": "application/json",
          "Content-Type": "application/json",
        }
      });

      if (res.status === 200) {
        // Emit socket event for notification
        const notificationData = { ...data, alert_id: alert.alert_id };
        socket.emit('sendNotificationFromCustomerOnly', { ...res.data, alert_id: alert.alert_id });
        // socket.emit('sendNotificationFromCustomerOnly', res.data);
        // Only update local state through Redux
        dispatch(updateAlertStatus({
          alert_id: alert.alert_id,
          resolved_status: 'Request Sent'
        }));
      }
    } catch (error) {
      console.error("Axios Error:", error.response?.data || error.message);
      toast.error("Failed to send notification to vendor");
    }
  };

  const getAlertsForUser = async () => {
    const url = "http://localhost:8000/api/alert/getAlertsForUser";
    try {
      const res = await axios({
        url: url,
        method: "GET",
        headers: {
          "Authorization": `Bearer ${sessionStorage.getItem('accessToken')}`,
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
      });
      // console.log(res.data)
      if (res.status === 200) {
        // setAllAlerts(res.data);
        dispatch(setAllAlerts(res.data));
      }
    } catch (error) {
      console.error(error);
    }
  }
  const getAlertsForVendor = async () => {
    const url = "http://localhost:8000/api/alert/getAlertsForVendor";
    try {
      const res = await axios({
        url: url,
        method: "GET",
        headers: {
          "Authorization": `Bearer ${sessionStorage.getItem('accessToken')}`,
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
      });
      // console.log(res.data);
      if (res.status === 200) {
        dispatch(setAllAlerts(res.data));
      }
    } catch (error) {
      console.error(error);
    }
  }
  function useeffectFunc() {
    if (customer) {
      // getYourVendorIfYouAreCustomer();
      getAlertsForUser();
    } else if (vendor) {
      getAlertsForVendor();
    }
  }
  useEffect(() => {
    useeffectFunc();
  }, []);
  return (
    <div className={`w-full flex-1 p-3 overflow-auto scrollbar-hide ${theme === 'light' ? 'bg-white text-black' : 'bg-gray-900 text-white'}`}>
      <div className='flex justify-between items-center'>
        <span
          style={{
            fontWeight: 'bolder',
            fontFamily: 'inter'
          }}
          className={theme === 'light' ? 'text-black' : 'text-white'}
        >
          Alerts
        </span>
        <div className='flex gap-1'>

          <button className='bg-amber-300 p-1 mb-1 rounded-lg hover:bg-amber-700 hover:text-white' onClick={() => debouncer(1000)}>Generate Alerts</button>
          <button
            className='border-2 border-blue-500 p-1 mb-1 rounded-md hover:border-blue-800 hover:text-blue-800 text-blue-500'
            onClick={() => useeffectFunc()}
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Header Section */}
      <div className={`flex justify-between items-center mb-2 p-1 rounded shadow-md ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-700'}`}>
        {/* Left Section - Buttons */}
        <div className="flex gap-1">
          <button
            onClick={handleExportCSV}
            disabled={filteredAlerts.length === 0}
            className={`flex items-center p-1 rounded cursor-pointer font-medium transition-all duration-200 
                      ${filteredAlerts.length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'} 
                      bg-green-600 text-white`}
          >
            <SheetIcon className="mr-2 text-lg" />
            Export CSV
          </button>

          {permissions.includes('delete:alert') && (
            <button
              onClick={handleDelete}
              disabled={selectedAlerts.length === 0}
              className={`flex items-center p-1 rounded cursor-pointer font-medium transition-all duration-200 
                        ${selectedAlerts.length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'} 
                        bg-red-500 text-white`}
            >
              <DeleteIcon className="mr-2 text-lg" />
              Delete
            </button>
          )}

          {permissions.includes('update:alert') && (
            <button
              onClick={handleResolve}
              disabled={selectedAlerts.length === 0}
              className={`flex items-center p-1 rounded cursor-pointer font-medium transition-all duration-200 
                        ${selectedAlerts.length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'} 
                        bg-blue-500 text-white`}
            >
              <CheckCircleIcon className="mr-2 text-lg" />
              Mark Resolved
            </button>
          )}

          <button
            onClick={toggleFilters}
            className="flex items-center p-1 rounded cursor-pointer font-medium transition-all duration-200 hover:scale-105 bg-teal-600 text-white"
          >
            <FilterListIcon className="mr-2 text-lg" />
            Filter
          </button>
        </div>

        {/* Right Section - Search */}
        <input
          type="text"
          placeholder="Search alerts..."
          value={searchQuery}
          onChange={handleSearchChange}
          className={`p-1 rounded w-64 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 
                    ${theme === 'light' ? 'border border-gray-600' : 'border border-gray-600 bg-gray-600 text-white'}`}
        />
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className={`rounded p-1 mb-2 shadow-md ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-700'}`}>
          <div className="flex gap-1">
            <div
              className={`p-1 rounded cursor-pointer transition-all duration-200 ${filterStatus === 'all'
                ? `bg-blue-500 text-white`
                : `${theme === 'light' ? 'hover:bg-gray-200' : 'hover:bg-gray-600'}`
                }`}
              onClick={() => handleStatusFilter('all')}
            >
              All
            </div>
            <div
              className={`p-1 rounded cursor-pointer transition-all duration-200 ${filterStatus === 'critical'
                ? `bg-blue-500 text-white`
                : `${theme === 'light' ? 'hover:bg-gray-200' : 'hover:bg-gray-600'}`
                }`}
              onClick={() => handleStatusFilter('critical')}
            >
              Critical
            </div>
            <div
              className={`p-1 rounded cursor-pointer transition-all duration-200 ${filterStatus === 'warning'
                ? `bg-blue-500 text-white`
                : `${theme === 'light' ? 'hover:bg-gray-200' : 'hover:bg-gray-600'}`
                }`}
              onClick={() => handleStatusFilter('warning')}
            >
              Warning
            </div>
            <div
              className={`p-1 rounded cursor-pointer transition-all duration-200 ${filterStatus === 'normal'
                ? `bg-blue-500 text-white`
                : `${theme === 'light' ? 'hover:bg-gray-200' : 'hover:bg-gray-600'}`
                }`}
              onClick={() => handleStatusFilter('normal')}
            >
              Normal
            </div>
          </div>
        </div>
      )}

      {/* Alerts Table */}
      <div className="text-sm max-h-5/6 font-sans overflow-auto scrollbar-hide shadow-md">
        {filteredAlerts.length > 0 ? (
          <table className="w-full border-collapse bg-white">
            <thead className={`top-0 ${theme === 'light' ? 'bg-blue-500' : 'bg-teal-800'} text-white`}>
              <tr>
                {vendor && (
                  <th className="p-1 text-center font-semibold">
                    <input
                      type="checkbox"
                      onChange={handleSelectAllChange}
                      checked={selectedAlerts.length === filteredAlerts.length && filteredAlerts.length > 0}
                    />
                  </th>
                )}
                <th className="p-1 text-center font-semibold">AlertId</th>
                {vendor && <th className="p-1 text-center font-semibold">User</th>}
                <th className="p-1 text-center font-semibold">Device</th>
                <th className="p-1 text-center font-semibold">Parameter</th>
                <th className="p-1 text-center font-semibold">Value</th>
                <th className="p-1 text-center font-semibold">Status</th>
                <th className="p-1 text-center font-semibold">Time</th>
                {!admin && !vendor && <th className="p-1 text-center font-semibold">Action</th>}
              </tr>
            </thead>
            <tbody>
              {filteredAlerts.map((alert, index) => (
                <tr
                  key={index}
                  className={`${theme === 'light'
                    ? index % 2 === 0 ? 'bg-gray-200' : 'bg-white'
                    : index % 2 === 0 ? 'bg-gray-700' : 'bg-gray-600'
                    }`}
                >
                  {vendor && (
                    <td className="p-1 text-center w-10">
                      <input
                        type="checkbox"
                        checked={selectedAlerts.includes(alert.alert_id)}
                        onChange={() => handleCheckboxChange(alert.alert_id)}
                      />
                    </td>
                  )}

                  <td className="p-1 text-center">{alert.alert_id}</td>
                  {vendor && <td className="p-1 text-center">{customer_email(alert.customer_id)}</td>}
                  <td className="p-1 text-center">{alert.device_name}</td>
                  <td className="p-1 text-center">{alert.parameter}</td>
                  <td className="p-1 text-center">{alert.value}</td>
                  <td className="p-1 text-center">
                    <span className={clsx(
                      alert.alert_status === 'Medium' ? 'bg-green-500/50 text-green-800' :
                        alert.alert_status === 'Critical' ? 'bg-yellow-500/50 text-yellow-800' :
                          'bg-red-500/50 text-red-800',
                      'px-1 rounded-sm'
                    )}>
                      {(alert.alert_status)}
                    </span>
                  </td>
                  <td className="p-1 text-center">
                    {new Date(alert.alert_gen_time).toLocaleString('en-US', {
                      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit'
                    })}
                  </td>
                  {!admin && !vendor && (
                    <td className="p-1 text-center flex justify-center items-center">
                      <div
                        onClick={() => !clickedAlerts.has(alert.alert_id) && handleSendNotification(alert)}
                        className={`flex justify-center items-center text-center p-1 rounded cursor-pointer w-24
                                  ${alert.resolved_status !== 'Send Request'
                            ? 'bg-gray-300 text-gray-500 italic'
                            : 'bg-green-500 text-white'}`}
                      >
                        {/* {clickedAlerts.has(alert.alert_id) ? 'Request Sent' : 'Send Request'} */}
                        {alert.resolved_status}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className={`flex justify-center items-center h-48 ${theme === 'light' ? 'bg-white text-gray-600' : 'bg-gray-700 text-gray-300'}`}>
            <p>No alerts match your search criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Alerts;