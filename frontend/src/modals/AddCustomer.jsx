import { CopyAllOutlined } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { generateTempPassword } from '../utils/tempPass';
import { toast } from 'react-toastify';

const AddCustomer = () => {
    const vendor = useLocation().state;
    const theme = useSelector(state => state.theme.theme);
    const admin = JSON.parse(sessionStorage.getItem("role")).includes("Admin");
    const permissions = JSON.parse(sessionStorage.getItem("permissions"));
    const isDarkMode = theme === 'dark';
    const nav = useNavigate();
    const user = JSON.parse(sessionStorage.getItem('user'));
    const [formData, setFormData] = useState({
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        password: generateTempPassword(),
        no_of_devices: 0,
        vendor_id: admin ? vendor.vendor_id : user.sub,
        vendor_name: user?.name || '',
        plan_purchased: '',
        payment_status: 'Pending',
        expiry_plan_date: '',
    });
    const [errors, setErrors] = useState({});

    const paymentStatusOptions = [
        { value: 'Pending', label: 'Pending' },
        { value: 'Paid', label: 'Paid' },
        { value: 'Failed', label: 'Failed' },
        { value: 'Refunded', label: 'Refunded' }
    ];

    const planOptions = [
        { value: 'Basic', label: 'Basic Plan' },
        { value: 'Standard', label: 'Standard Plan' },
        { value: 'Premium', label: 'Premium Plan' },
        { value: 'Enterprise', label: 'Enterprise Plan' }
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.customer_name.trim()) {
            newErrors.customer_name = 'Customer name is required';
        }

        if (!formData.customer_email.trim()) {
            newErrors.customer_email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.customer_email)) {
            newErrors.customer_email = 'Email is invalid';
        }

        if (!formData.password.trim()) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (!formData.customer_phone.trim()) {
            newErrors.customer_phone = 'Phone number is required';
        }

        if (formData.no_of_devices < 0) {
            newErrors.no_of_devices = 'Number of devices cannot be negative';
        }

        if (!formData.plan_purchased) {
            newErrors.plan_purchased = 'Plan selection is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                const res = await axios({
                    url: "http://localhost:8000/api/auth0/create-user",
                    method: "POST",
                    data: formData,
                    headers: {
                        "Authorization": `Bearer ${sessionStorage.getItem('accessToken')}`,
                        "Content-Type": "application/json",
                    }
                });
                if (res.status === 200) {
                    toast.success("Successfully Added", {
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
                console.error(error);
                toast.error("Adding Failed", {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    theme: theme === 'dark' ? 'dark' : 'light'
                });
            }
            resetForm();
        }
    };

    const resetForm = () => {
        setFormData({
            customer_name: '',
            customer_email: '',
            customer_phone: '',
            password: '',
            no_of_devices: 0,
            vendor_id: admin ? vendor.vendor_id : user.sub,
            vendor_name: user?.name || '',
            plan_purchased: '',
            payment_status: 'Pending',
            expiry_plan_date: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0]
        });
        setErrors({});
        nav('/customers');
    };

    // Set default expiry date on component mount
    useEffect(() => {
        setFormData(prev => ({
            ...prev,
            expiry_plan_date: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0]
        }));
    }, []);

    return (
        <div className={`overflow-auto h-full shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
            <div className={`px-6 py-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200  bg-orange-200'}`}>
                <h2 className={`text-xl font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Add New Customer</h2>
            </div>

            <div className={`p-6`}>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Customer Name */}
                        <div>
                            <label htmlFor="customer_name" className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                Customer Name
                            </label>
                            <input
                                type="text"
                                id="customer_name"
                                name="customer_name"
                                placeholder='Enter customer name'
                                autoComplete="off"
                                value={formData.customer_name}
                                onChange={handleChange}
                                className={`w-full p-2 border rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 ${errors.customer_name ? 'border-red-500' : isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white'
                                    }`}
                            />
                            {errors.customer_name && (
                                <p className="mt-1 text-sm text-red-500">{errors.customer_name}</p>
                            )}
                        </div>

                        {/* Customer Email */}
                        <div>
                            <label htmlFor="customer_email" className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                Customer Email
                            </label>
                            <input
                                type="email"
                                id="customer_email"
                                name="customer_email"
                                placeholder='Enter customer email'
                                autoComplete="off"
                                value={formData.customer_email}
                                onChange={handleChange}
                                className={`w-full p-2 border rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 ${errors.customer_email ? 'border-red-500' : isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white'
                                    }`}
                            />
                            {errors.customer_email && (
                                <p className="mt-1 text-sm text-red-500">{errors.customer_email}</p>
                            )}
                        </div>

                        {/* Customer Phone */}
                        <div>
                            <label htmlFor="customer_phone" className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                Customer Phone
                            </label>
                            <input
                                type="tel"
                                id="customer_phone"
                                name="customer_phone"
                                placeholder='Enter customer phone'
                                autoComplete="off"
                                value={formData.customer_phone}
                                onChange={handleChange}
                                className={`w-full p-2 border rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 ${errors.customer_phone ? 'border-red-500' : isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white'
                                    }`}
                            />
                            {errors.customer_phone && (
                                <p className="mt-1 text-sm text-red-500">{errors.customer_phone}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                Generated Password
                            </label>
                            <div className={`flex items-center justify-between px-1 ${isDarkMode ? 'bg-gray-700 border-gray-600' : ' border-gray-300 bg-white'} border rounded-md`}>
                                <input
                                    type="text"
                                    id="password"
                                    name="password"
                                    disabled
                                    value={formData.password}
                                    className={`w-full p-2 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 ${errors.password ? 'border-red-500' : isDarkMode ? 'bg-gray-700 text-gray-400' : 'text-gray-400'
                                        }`}
                                />
                                <IconButton size='small' onClick={() => {
                                    navigator.clipboard.writeText(formData.password);
                                }}>
                                    <CopyAllOutlined />
                                </IconButton>
                            </div>
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                            )}
                        </div>

                        {/* Number of Devices */}
                        <div>
                            <label htmlFor="no_of_devices" className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                Number of Devices
                            </label>
                            <input
                                type="number"
                                id="no_of_devices"
                                name="no_of_devices"
                                value={formData.no_of_devices}
                                onChange={handleChange}
                                className={`w-full p-2 border rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 ${errors.no_of_devices ? 'border-red-500' : isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white'
                                    }`}
                            />
                            {errors.no_of_devices && (
                                <p className="mt-1 text-sm text-red-500">{errors.no_of_devices}</p>
                            )}
                        </div>

                        {/* Plan Selection */}
                        <div>
                            <label htmlFor="plan_purchased" className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                Plan
                            </label>
                            <select
                                id="plan_purchased"
                                name="plan_purchased"
                                value={formData.plan_purchased}
                                onChange={handleChange}
                                className={`w-full p-2 border rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 ${errors.plan_purchased ? 'border-red-500' : isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white'
                                    }`}
                            >
                                <option value="">Select a plan</option>
                                {planOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                            {errors.plan_purchased && (
                                <p className="mt-1 text-sm text-red-500">{errors.plan_purchased}</p>
                            )}
                        </div>

                        {/* Payment Status */}
                        <div>
                            <label htmlFor="payment_status" className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                Payment Status
                            </label>
                            <select
                                id="payment_status"
                                name="payment_status"
                                value={formData.payment_status}
                                onChange={handleChange}
                                className={`w-full p-2 border rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white'
                                    }`}
                            >
                                {paymentStatusOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Expiry Date */}
                        <div>
                            <label htmlFor="expiry_plan_date" className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                Plan Expiry Date
                            </label>
                            <input
                                type="date"
                                id="expiry_plan_date"
                                name="expiry_plan_date"
                                value={formData.expiry_plan_date}
                                onChange={handleChange}
                                className={`w-full p-2 border rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white'
                                    }`}
                            />
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={resetForm}
                            className={`px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isDarkMode
                                ? 'text-gray-200 bg-gray-700 border border-gray-600 hover:bg-gray-600'
                                : 'text-gray-700 border border-gray-300 bg-white hover:bg-gray-50'
                                }`}
                        >
                            Cancel
                        </button>
                        {permissions.includes('create:customer') && <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Add Customer
                        </button>}
                    </div>
                </form>
            </div>
            <Outlet />
        </div>
    );
};

export default AddCustomer;