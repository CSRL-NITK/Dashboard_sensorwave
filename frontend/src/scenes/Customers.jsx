import React, { useEffect, useState } from "react";
import { AddCircleOutline, East } from "@mui/icons-material";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { set_all_customers } from "../redux/slices/customerSlice";
import { IconButton } from "@mui/material";
import ArrowCircleLeftOutlinedIcon from '@mui/icons-material/ArrowCircleLeftOutlined';
import { toast } from "react-toastify";


const Customers = () => {
    const theme = useSelector(state => state.theme.theme);
    const uniqueId = sessionStorage.getItem("uniqueId")
    const nav = useNavigate();
    const locationVendor = useLocation().state;
    const permissions = JSON.parse(sessionStorage.getItem('permissions'));
    const admin = sessionStorage.getItem("role").includes("Admin");
    const [customers, setCustomers] = useState({});
    const [searchTerm, setSearchTerm] = useState("");
    const dispatch = useDispatch();
    const [selectedCustomer, setSelectedCustomer] = useState([]);

    const handleSelectCustoemr = (e, customer_id) => {
        e.stopPropagation();
        setSelectedCustomer(prev => {
            if (prev.includes(customer_id)) {
                return prev.filter(id => id !== customer_id);
            } else {
                return [...prev, customer_id];
            }
        });
    }
    const handleSelectAll = (e) => {
        e.stopPropagation();
        setSelectedCustomer(e.target.checked ? [...Object.keys(filteredCustomers)] : []);
    }

    const filteredCustomers = Object.values(customers).filter(
        (customer) =>
            customer.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.customer_id.toString().includes(searchTerm)
    );

    const getAllCustomers = async () => {
        let id = "";
        if (admin) {
            id = locationVendor.vendor_id;
        } else {
            id = uniqueId;
        }
        try {
            const res = await axios({
                url: `http://localhost:8000/api/customer/getAllCustomers/${id}`,
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${sessionStorage.getItem("accessToken")}`,
                    "Content-Type": "application/json"
                }
            });
            if (res.status === 200) {
                const customerObj = {};
                res.data.forEach(c => {
                    customerObj[c.customer_id] = c;
                });
                setCustomers(customerObj);
                dispatch(set_all_customers(customerObj));
            }
        } catch (error) {
            console.error(error.message);
        }
    }

    async function handleDeleteCustomers() {
        try {
            const res = await axios({
                url: "http://localhost:8000/api/auth0/delete-user",
                method: "POST",
                data: { ids: selectedCustomer },
                headers: {
                    "Authorization": `Bearer ${sessionStorage.getItem("accessToken")}`,
                    "Content-Type": "application/json"
                }
            });
            if (res.status === 200) {
                toast.success("Customers deleted successfully!", {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    theme: theme === 'dark' ? 'dark' : 'light'
                });
            }
        } catch (error) {
            console.error(error.response?.data || error.message);
        }
    }

    const handleRowClick = (customer) => {
        nav(`devices/${customer.customer_id}`, { state: customer });
    };
    useEffect(() => {
        getAllCustomers();
    }, [])

    return (
        <div className={`w-full h-9/10 p-2 flex flex-col overflow-auto scrollbar-hide ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"}`}>
            <div className="flex justify-between items-center mb-4">
                <span className="text-2xl font-bold flex items-center">
                    {admin && <IconButton sx={{ color: theme === "dark" ? 'lightblue' : 'blue' }}>
                        <ArrowCircleLeftOutlinedIcon onClick={_ => nav(-1)} title="Back to Vendors" />
                    </IconButton>}

                    Customer Management{admin && (" : " + locationVendor.vendor_name)}
                </span>
                <div className="flex items-center space-x-2">
                    {permissions.includes('delete:customer') && <button
                        onClick={handleDeleteCustomers}
                        className="bg-red-700 text-white px-2 py-1 rounded-md hover:bg-red-600"
                    >
                        Delete Selected
                    </button>}

                    <NavLink to={"addCustomer"} state={locationVendor}>
                        {permissions.includes('create:customer') && <button
                            className="flex items-center bg-green-700 text-white px-2 py-1 rounded-md hover:bg-green-600"
                        >
                            <AddCircleOutline className="mr-2" /> Add Customer
                        </button>}
                    </NavLink>
                    <button
                        className='border-2 border-blue-500 p-1 mb-1 rounded-md hover:border-blue-800 hover:text-blue-800 text-blue-500'
                        onClick={() => getAllCustomers()}
                    >
                        Refresh
                    </button>
                </div>
            </div>
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search customers..."
                    className={`px-4 py-2 border rounded-lg w-full ${theme === "dark" ? "bg-gray-700 text-white" : "bg-white text-black"}`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className={`shadow rounded-lg overflow-auto scrollbar-hide ${theme === "dark" ? "bg-gray-700" : "bg-white"}`}>
                <div className="h-full overflow-y-auto scrollbar-none">
                    <table className="min-w-full divide-y divide-gray-400">
                        <thead className={`${theme === "dark" ? "bg-gray-800" : "bg-red-100"}`}>
                            <tr>
                                {permissions.includes('select:customer') && <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === "dark" ? "text-gray-300" : "text-gray-500"}`}>
                                    <input
                                        type="checkbox"
                                        name="check-customer"
                                        id="check-customer"
                                        value={selectedCustomer.length === filteredCustomers.length}
                                        onChange={e => handleSelectAll(e)}
                                    />
                                </th>}
                                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === "dark" ? "text-gray-300" : "text-gray-500"}`}>ID</th>
                                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === "dark" ? "text-gray-300" : "text-gray-500"}`}>Name</th>
                                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === "dark" ? "text-gray-300" : "text-gray-500"}`}>Email</th>
                                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === "dark" ? "text-gray-300" : "text-gray-500"}`}>Phone</th>
                                <th className={`px-6 py-3 text-center text-xs font-medium uppercase tracking-wider ${theme === "dark" ? "text-gray-300" : "text-gray-500"}`}># Devices</th>
                                <th className={`px-6 py-3 text-center text-xs font-medium uppercase tracking-wider ${theme === "dark" ? "text-gray-300" : "text-gray-500"}`}>All Devices</th>
                            </tr>
                        </thead>
                        <tbody className={`divide-y ${theme === "dark" ? "divide-gray-600" : "divide-gray-400"}`}>
                            {filteredCustomers.map((customer) => (
                                <tr
                                    key={customer.customer_id}
                                    className={`cursor-pointer ${theme === "dark" ? "hover:bg-gray-600" : "hover:bg-gray-50"}`}
                                >
                                    {permissions.includes('select:customer')&& <td className={`px-6 py-2 text-sm font-medium ${theme === "dark" ? "text-gray-200" : "text-gray-900"}`}>
                                        <input
                                            type="checkbox"
                                            name="check-customer"
                                            id="check-customer"
                                            checked={selectedCustomer.includes(customer.customer_id)}
                                            onChange={(e) => handleSelectCustoemr(e, customer.customer_id)}
                                        />
                                    </td>}
                                    <td className={`px-6 py-2 text-sm font-medium ${theme === "dark" ? "text-gray-200" : "text-gray-900"}`} >{customer.customer_id}</td>
                                    <td className={`px-6 py-2 text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-500"}`} >{customer.customer_name}</td>
                                    <td className={`px-6 py-2 text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-500"}`} >{customer.customer_email}</td>
                                    <td className={`px-6 py-2 text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-500"}`} >{customer.customer_phone ? customer.customer_phone : 'null'}</td>
                                    <td className={`px-6 py-2 text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-500"} text-center`} >{customer.no_of_devices}</td>
                                    <td className="px-6 py-2 text-sm text-center">
                                        <IconButton onClick={() => handleRowClick(customer)}>
                                            <East sx={{ color: theme === "dark" ? "white" : "black" }} />
                                        </IconButton>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredCustomers.length === 0 && (
                        <div className={`text-center py-2 ${theme === "dark" ? "text-gray-300" : "text-gray-500"}`}>No customers found.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Customers;