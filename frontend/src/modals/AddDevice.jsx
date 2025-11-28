import React, { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import DevicesIcon from "@mui/icons-material/Devices";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SignalWifiStatusbar4BarIcon from "@mui/icons-material/SignalWifiStatusbar4Bar";
import SensorsIcon from "@mui/icons-material/Sensors";
import { useSelector } from "react-redux";
import axios from "axios";
import ArrowCircleLeftOutlinedIcon from '@mui/icons-material/ArrowCircleLeftOutlined';
import { IconButton } from "@mui/material";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AddDevice = () => {
    const theme = useSelector(state => state.theme.theme);
    const permissions = JSON.parse(sessionStorage.getItem('permissions'));
    const isDark = theme === "dark";
    const { state } = useLocation();
    const [locationCustomer, setLocationCustomer] = useState(state);
    useEffect(() => {
        setLocationCustomer(state);
    }, []);
    // console.log(locationCustomer);
    const nav = useNavigate()
    // const customer_id = window.location.pathname.split('/')[3];
    // console.log(customer_id);

    const [deviceData, setDeviceData] = useState({
        device_id: "",
        device_name: "",
        device_type: "Gateway",
        device_status: "Online",
        location: "",
        device_ip: "",
        last_time_active: new Date(Date.now()).toISOString(),
        no_of_parameters: 0
    });

    const [sensor, setSensor] = useState({
        sensor_name: "",
        sensor_parameter: "",
        sensor_status: "Online",
    });
    const [allSensors, setAllSensors] = useState([]);

    const [showSensorFeedback, setShowSensorFeedback] = useState(false);
    const [sensorError, setSensorError] = useState("");

    const deviceTypes = ["Gateway", "Controller", "Sensor Hub", "Edge Device"];
    const statusOptions = ["active", "inactive"];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDeviceData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSensorChange = (e) => {
        const { name, value } = e.target;
        setSensor(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const addSensor = () => {
        if (!sensor.sensor_name || !sensor.sensor_parameter) {
            setSensorError("Please fill in both sensor name and parameter");
            return;
        }

        const newSensor = {
            ...sensor,
            // sensor_id: `sensor${allSensors.length + 1}`,
            device_id: deviceData.device_id,
        };

        setAllSensors(prev => [...prev, newSensor]);
        // console.log(allSensors.length);
        setDeviceData(prev => ({
            ...prev,
            no_of_parameters: allSensors.length + 1
        }));

        setSensor({
            sensor_name: "",
            sensor_parameter: "",
            sensor_status: "Online"
        });

        setShowSensorFeedback(true);
        setSensorError("");

        // Hide feedback after 3 seconds
        setTimeout(() => {
            setShowSensorFeedback(false);
        }, 3000);
    };

    const removeSensor = (sensorId) => {
        setAllSensors(prev => prev.filter((_, idx) => idx !== sensorId));
    };

    const handleSubmit = async () => {
        // Generate a unique device_id
        const newDevice = {
            ...deviceData,
            customer_id: locationCustomer.customer_id,
        };
        try {
            await axios({
                url: "http://localhost:8000/api/device/insertDevice",
                method: "POST",
                data: newDevice,
                headers: {
                    "Authorization": `Bearer ${sessionStorage.getItem("accessToken")}`,
                    "Content-Type": "application/json",
                }
            }).then(res => {
                console.log(res.data);
                toast.success("Device added Successfully", {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    theme: theme === 'dark' ? 'dark' : 'light'
                });
            });
        } catch (error) {
            console.error(error);
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

        try {
            await axios({
                url: "http://localhost:8000/api/sensor/insertAllSensors",
                method: "POST",
                data: allSensors,
                headers: {
                    "Authorization": `Bearer ${sessionStorage.getItem("accessToken")}`,
                    "Content-Type": "application/json",
                }
            }).then(res => {
                console.log(res.data)
                toast.success("Sensors added Successfully", {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    theme: theme === 'dark' ? 'dark' : 'light'
                });
                nav(-1);
            })
        } catch (error) {
            console.error(error);
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
    };

    return (
        <div className="flex-1 overflow-auto scrollbar-hide">
            <div className={`p-2 ${isDark ? "bg-gray-900 text-white" : "bg-orange-200 text-black"} flex items-center`}>
                <IconButton onClick={_ => nav(-1)} title="Back to Devices">
                    <ArrowCircleLeftOutlinedIcon sx={{ color: "blue" }} />
                </IconButton>
                <DevicesIcon className="mr-2 ml-2" />
                <h5 className="text-xl font-semibold">Add New Device</h5>
            </div>

            <div className={`p-2 ${isDark ? "bg-gray-800" : "bg-gray-100"}`}>
                <div className={`p-2 mb-4 ${isDark ? "bg-gray-700 text-gray-100" : "bg-blue-100"} shadow-sm`}>
                    <p className="text-sm">
                        Fill out the device information and add any connected sensors. All fields marked with * are required.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h6 className={`flex items-center font-medium ml-1 ${isDark ? "text-blue-300" : "text-blue-600"}`}>
                            <DevicesIcon className="mr-2" /> Device Information
                        </h6>

                        <div className="mt-3">
                            <label className={`block text-sm font-medium mb-1 ml-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                                Device Id*
                            </label>
                            <input
                                type="text"
                                name="device_id"
                                value={deviceData.device_id}
                                onChange={handleChange}
                                placeholder="Enter device name"
                                required
                                className={`w-full px-3 py-2 border rounded-md ${isDark
                                    ? "bg-gray-700 text-white border-gray-600 focus:border-blue-500"
                                    : "border-gray-400 focus:border-blue-500"
                                    } focus:outline-none focus:ring-1 focus:ring-blue-500`}
                            />
                        </div>
                        <div className="mt-3">
                            <label className={`block text-sm font-medium mb-1 ml-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                                Device Name*
                            </label>
                            <input
                                type="text"
                                name="device_name"
                                value={deviceData.device_name}
                                onChange={handleChange}
                                placeholder="Enter device name"
                                required
                                className={`w-full px-3 py-2 border rounded-md ${isDark
                                    ? "bg-gray-700 text-white border-gray-600 focus:border-blue-500"
                                    : "border-gray-400 focus:border-blue-500"
                                    } focus:outline-none focus:ring-1 focus:ring-blue-500`}
                            />
                        </div>

                        <div className="mt-3">
                            <label className={`block text-sm font-medium mb-1 ml-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                                Device Type
                            </label>
                            <select
                                name="device_type"
                                value={deviceData.device_type}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border rounded-md ${isDark
                                    ? "bg-gray-700 text-white border-gray-600"
                                    : "border-gray-400"
                                    } focus:outline-none focus:ring-1 focus:ring-blue-500`}
                            >
                                {deviceTypes.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>

                        <div className="mt-3">
                            <label className={`block text-sm font-medium mb-1 ml-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                                Device Status
                            </label>
                            <select
                                name="device_status"
                                value={deviceData.device_status}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border rounded-md ${isDark
                                    ? "bg-gray-700 text-white border-gray-600"
                                    : "border-gray-400"
                                    } focus:outline-none focus:ring-1 focus:ring-blue-500`}
                            >
                                {statusOptions.map(status => (
                                    <option key={status} value={status}>{status}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <h6 className={`flex items-center font-medium ml-1 ${isDark ? "text-blue-300" : "text-blue-600"}`}>
                            <LocationOnIcon className="mr-1" /> Location & Network
                        </h6>

                        <div className="mt-3">
                            <label className={`block text-sm font-medium mb-1 ml-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                                Location
                            </label>
                            <input
                                type="text"
                                name="location"
                                value={deviceData.location}
                                onChange={handleChange}
                                placeholder="Building name, floor, etc."
                                className={`w-full px-3 py-2 border rounded-md ${isDark
                                    ? "bg-gray-700 text-white border-gray-600"
                                    : "border-gray-400"
                                    } focus:outline-none focus:ring-1 focus:ring-blue-500`}
                            />
                        </div>

                        <div className="mt-3">
                            <label className={`block text-sm font-medium mb-1 ml-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                                IP Address
                            </label>
                            <input
                                type="text"
                                name="device_ip"
                                value={deviceData.device_ip}
                                onChange={handleChange}
                                placeholder="192.168.1.1"
                                className={`w-full px-3 py-2 border rounded-md ${isDark
                                    ? "bg-gray-700 text-white border-gray-600"
                                    : "border-gray-400"
                                    } focus:outline-none focus:ring-1 focus:ring-blue-500`}
                            />
                        </div>

                        <div className="flex items-center mt-3">
                            <SignalWifiStatusbar4BarIcon className={`mr-2 ${isDark ? "text-blue-300" : "text-blue-600"}`} />
                            <span className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                                Last Active: {deviceData.last_time_active}
                            </span>
                        </div>
                    </div>
                </div>

                <div className={`my-6 h-px ${isDark ? "bg-gray-600" : "bg-gray-200"}`}></div>

                <div>
                    <h6 className={`flex items-center font-medium mb-4 ml-1 ${isDark ? "text-blue-300" : "text-blue-600"}`}>
                        <SensorsIcon className="mr-2" /> Connected Sensors
                    </h6>

                    <div className={`p-4 mb-4 ${isDark ? "bg-gray-700" : "bg-gray-50"} rounded-lg shadow`}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className={`block text-sm font-medium mb-1 ml-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                                    Sensor Name*
                                </label>
                                <input
                                    type="text"
                                    name="sensor_name"
                                    value={sensor.sensor_name}
                                    onChange={handleSensorChange}
                                    placeholder="Temperature Sensor"
                                    className={`w-full px-3 py-2 border rounded-md ${isDark
                                        ? "bg-gray-600 text-white border-gray-600"
                                        : "border-gray-400"
                                        } ${sensorError && !sensor.sensor_name ? "border-red-500" : ""} focus:outline-none focus:ring-1 focus:ring-blue-500`}
                                />
                            </div>

                            <div>
                                <label className={`block text-sm font-medium mb-1 ml-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                                    Parameter*
                                </label>
                                <input
                                    type="text"
                                    name="sensor_parameter"
                                    value={sensor.sensor_parameter}
                                    onChange={handleSensorChange}
                                    placeholder="Temperature"
                                    className={`w-full px-3 py-2 border rounded-md ${isDark
                                        ? "bg-gray-600 text-white border-gray-600"
                                        : "border-gray-400"
                                        } ${sensorError && !sensor.sensor_parameter ? "border-red-500" : ""} focus:outline-none focus:ring-1 focus:ring-blue-500`}
                                />
                            </div>

                            {/* <div>
                                <label className={`block text-sm font-medium mb-1 ml-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                                    Status
                                </label>
                                <select
                                    name="sensor_status"
                                    value={sensor.sensor_status}
                                    onChange={handleSensorChange}
                                    className={`w-full px-3 py-2 border rounded-md ${isDark
                                        ? "bg-gray-600 text-white border-gray-600"
                                        : "border-gray-400"
                                        } focus:outline-none focus:ring-1 focus:ring-blue-500`}
                                >
                                    {statusOptions.map(status => (
                                        <option key={status} value={status}>{status}</option>
                                    ))}
                                </select>
                            </div> */}
                        </div>

                        <div className="flex justify-between items-center">
                            <button
                                onClick={addSensor}
                                className={`px-3 py-1 flex items-center rounded-md text-sm ${isDark ? "bg-green-700" : "bg-green-600"
                                    } hover:bg-green-700 text-white`}
                                type="button"
                            >
                                <AddIcon className="mr-1" fontSize="small" /> Add Sensor
                            </button>

                            {sensorError && (
                                <p className="text-xs text-red-500">
                                    {sensorError}
                                </p>
                            )}

                            {showSensorFeedback && (
                                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full animate-pulse">
                                    Sensor added successfully!
                                </span>
                            )}
                        </div>
                    </div>

                    {allSensors.length > 0 ? (
                        <div className={`rounded-lg overflow-hidden shadow ${isDark ? "bg-gray-700" : "bg-white"}`}>
                            <div className={`p-2 ${isDark ? "bg-gray-800 text-white" : "bg-gray-100"}`}>
                                <h6 className="text-sm font-medium">Added Sensors ({deviceData.no_of_parameters})</h6>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className={isDark ? "bg-gray-800" : "bg-gray-50"}>
                                        <tr>
                                            <th className={`px-6 py-3 text-left text-xs font-medium ${isDark ? "text-gray-300" : "text-gray-500"} uppercase tracking-wider`}>ID</th>
                                            <th className={`px-6 py-3 text-left text-xs font-medium ${isDark ? "text-gray-300" : "text-gray-500"} uppercase tracking-wider`}>Sensor Name</th>
                                            <th className={`px-6 py-3 text-left text-xs font-medium ${isDark ? "text-gray-300" : "text-gray-500"} uppercase tracking-wider`}>Parameter</th>
                                            <th className={`px-6 py-3 text-left text-xs font-medium ${isDark ? "text-gray-300" : "text-gray-500"} uppercase tracking-wider`}>Status</th>
                                            <th className={`px-6 py-3 text-left text-xs font-medium ${isDark ? "text-gray-300" : "text-gray-500"} uppercase tracking-wider`}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className={`divide-y ${isDark ? "bg-gray-700 divide-gray-600" : "bg-white divide-gray-200"}`}>
                                        {allSensors.map((sensor, idx) => (
                                            <tr key={idx} className={isDark ? "hover:bg-gray-600" : "hover:bg-gray-50"}>
                                                <td className={`px-6 py-3 whitespace-nowrap text-sm ${isDark ? "text-gray-300" : "text-gray-500"}`}>{sensor.sensor_id}</td>
                                                <td className={`px-6 py-3 whitespace-nowrap text-sm ${isDark ? "text-white" : "text-gray-900"}`}>{sensor.sensor_name}</td>
                                                <td className={`px-6 py-3 whitespace-nowrap text-sm ${isDark ? "text-white" : "text-gray-900"}`}>{sensor.sensor_parameter}</td>
                                                <td className="px-6 py-3 whitespace-nowrap text-sm">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${sensor.sensor_status === 'Online' ? 'bg-green-100 text-green-800' :
                                                        sensor.sensor_status === 'Offline' ? 'bg-red-100 text-red-800' :
                                                            'bg-yellow-100 text-yellow-800'
                                                        }`}>
                                                        {sensor.sensor_status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-3 whitespace-nowrap text-sm font-medium">
                                                    <button
                                                        onClick={() => removeSensor(idx)}
                                                        className="text-red-600 hover:text-red-900"
                                                        type="button"
                                                    >
                                                        <DeleteIcon fontSize="small" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        <div className={`p-6 text-center border border-dashed rounded-lg ${isDark ? "border-gray-600 bg-gray-700" : "border-gray-400 bg-gray-50"}`}>
                            <SensorsIcon className={`text-4xl mb-2 ${isDark ? "text-gray-500" : "text-gray-400"}`} />
                            <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                                No sensors added yet. Add your first sensor above.
                            </p>
                        </div>
                    )}
                </div>

                <div className="mt-6 flex justify-end">
                    {permissions.includes('create:device') && <button
                        onClick={handleSubmit}
                        type="button"
                        className={`px-4 py-2 rounded-md ${isDark ? "bg-blue-700" : "bg-blue-600"
                            } hover:bg-blue-700 text-white ${!deviceData.device_name ? "opacity-50 cursor-not-allowed" : ""}`}
                        disabled={!deviceData.device_name}
                    >
                        Add Device
                    </button>}
                </div>
            </div>

            {showSensorFeedback && (
                <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-green-600 text-white px-4 py-2 rounded-md shadow-lg">
                        Sensor added successfully!
                    </div>
                </div>
            )}
            <Outlet />
        </div>
    );
};

export default AddDevice;