import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import CloseIcon from '@mui/icons-material/Close';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DevicesIcon from '@mui/icons-material/Devices';
import InventoryIcon from '@mui/icons-material/Inventory';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PhoneIcon from '@mui/icons-material/Phone';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import axios from 'axios';

const ProfileModal = ({ isOpen, onClose }) => {
    const { user, logout } = useAuth0();

    // Save user data to session storage
    if (user) {
        sessionStorage.setItem('user', JSON.stringify(user));
    }

    // Get role from session storage
    const roleData = JSON.parse(sessionStorage.getItem('role'));
    const role = roleData ? roleData[0] : 'Customer';
    const [profileUser, setProfileUser] = useState({});
    const getInfoCustomer = async () => {
        try {
            const res = await axios({
                url: "http://localhost:8000/api/customer/getInfoCustomer",
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${sessionStorage.getItem("accessToken")}`,
                    "Content-Type": "application/json",
                }
            });
            if (res.status === 200) {
                setProfileUser(res.data);
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
    const getInfoVendor = async () => {
        try {
            const res = await axios({
                url: "http://localhost:8000/api/vendor/getInfoVendor",
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${sessionStorage.getItem("accessToken")}`,
                    "Content-Type": "application/json",
                }
            });
            if (res.status === 200) {
                setProfileUser(res.data);
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

    // Get current theme from Redux store
    const theme = useSelector(state => state.theme.theme);
    const isDark = theme === 'dark';
    useEffect(() => {
        if (role === 'Customer') getInfoCustomer();
        else if (role === 'Vendor') getInfoVendor();
    }, [])
    // Handle modal closure
    if (!isOpen) {
        return null;
    }

    // Determine role-specific data to display
    const isVendor = role === 'Vendor';

    return (
        <div className={`fixed top-12 right-3 z-50 w-72 rounded-xl p-6 shadow-lg border ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-800'
            } flex flex-col gap-4 animate-slideIn`}>

            {/* Close button */}
            <CloseIcon
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 cursor-pointer"
                fontSize="small"
            />

            {/* Profile header */}
            <div className={`flex items-center gap-4 pb-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                <img
                    src={user.picture}
                    alt="Profile"
                    className="w-14 h-14 rounded-full object-cover border-2 border-blue-300 shadow-md"
                />
                <div className="flex flex-col gap-1">
                    <span className="text-lg font-semibold">{user.nickname}</span>
                    <span className="text-sm opacity-80">{user.email}</span>
                </div>
            </div>

            {/* Role information */}
            <div className="flex flex-col gap-3">
                <div className={`flex items-center gap-2 p-2 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <AccountCircleIcon fontSize="small" className={isVendor ? 'text-emerald-500' : 'text-blue-500'} />
                    <span className="text-sm font-medium">Role:</span>
                    <span className={`text-sm font-semibold ${isVendor ? 'text-emerald-600 dark:text-emerald-400' : 'text-blue-600 dark:text-blue-400'
                        }`}>
                        {role}
                    </span>
                </div>

                {/* Role-specific information */}
                {isVendor ? (
                    <div className={`grid grid-cols-1 gap-2 p-3 rounded-lg ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                        <div className="flex justify-between items-center">
                            <span className="text-xs opacity-70">Vendor ID:</span>
                            <span className="text-xs font-medium">{user.sub.split("|")[1] || '---'}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-1">
                                <InventoryIcon fontSize="small" className="text-gray-400" />
                                <span className="text-xs opacity-70">Products:</span>
                            </div>
                            <span className="text-xs font-medium">{profileUser?.products_count || '0'}</span>
                        </div>
                        {profileUser?.vendor_phone && (
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-1">
                                    <PhoneIcon fontSize="small" className="text-gray-400" />
                                    <span className="text-xs opacity-70">Contact:</span>
                                </div>
                                <span className="text-xs font-medium">{profileUser.vendor_phone}</span>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className={`grid grid-cols-1 gap-2 p-3 rounded-lg ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                        <div className="flex justify-between items-center">
                            <span className="text-xs opacity-70">Customer ID:</span>
                            <span className="text-xs font-medium">{user.sub?.split("|")[1] || '---'}</span>
                        </div>
                        {profileUser?.no_of_devices && (
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-1">
                                    <DevicesIcon fontSize="small" className="text-gray-400" />
                                    <span className="text-xs opacity-70">Devices:</span>
                                </div>
                                <span className="text-xs font-medium">{profileUser.no_of_devices}</span>
                            </div>
                        )}
                        {profileUser?.plan_purchased && (
                            <div className="flex justify-between items-center">
                                <span className="text-xs opacity-70">Plan:</span>
                                <span className="text-xs font-medium">{profileUser.plan_purchased}</span>
                            </div>
                        )}
                        {profileUser?.expiry_plan_date && (
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-1">
                                    <CalendarTodayIcon fontSize="small" className="text-gray-400" />
                                    <span className="text-xs opacity-70">Expires:</span>
                                </div>
                                <span className="text-xs font-medium">{new Date(profileUser.expiry_plan_date).toLocaleDateString()}</span>
                            </div>
                        )}
                    </div>
                )}

                {/* Logout button */}
                <button
                    onClick={() => logout()}
                    className="mt-2 py-3 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-all duration-200 
                  transform hover:-translate-y-0.5 shadow-md hover:shadow-lg"
                >
                    Logout
                </button>
            </div>

            {/* Animation styles */}
            <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideIn {
          animation: slideIn 0.2s ease-out;
        }
      `}</style>
        </div>
    );
};

export default ProfileModal;