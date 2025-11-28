import React, { useEffect, useState } from "react";
import { AddCircleOutline, East, Delete, Edit } from "@mui/icons-material";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { set_all_vendors } from "../redux/slices/vendorSlice";

const Vendors = () => {
    const nav = useNavigate();
    const permissions = JSON.parse(sessionStorage.getItem('permissions'));
    const [vendors, setVendors] = useState({});
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const dispatch = useDispatch();
    const theme = useSelector(state => state.theme.theme);

    const filteredVendors = Object.values(vendors).filter(
        (vendor) =>
            vendor.vendor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            vendor.vendor_id.toString().includes(searchTerm) ||
            (vendor.vendor_email && vendor.vendor_email.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const getAllVendors = async () => {
        setLoading(true);
        try {
            const res = await axios({
                url: "http://localhost:8000/api/vendor/getAllVendors",
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${sessionStorage.getItem("accessToken")}`,
                    "Content-Type": "application/json"
                }
            });
            if (res.status === 200) {
                const vendorObj = {};
                res.data.forEach(v => {
                    vendorObj[v.vendor_id] = v;
                });
                setVendors(vendorObj);
                dispatch(set_all_vendors(vendorObj));
            }
        } catch (error) {
            console.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleRowClick = (vendor) => {
        nav(`/vendors/customers/${vendor.vendor_id}`, { state: vendor });
    };

    const handleDeleteVendor = async (vendorId, e) => {
        e.stopPropagation();
        if (deleteConfirm === vendorId) {
            try {
                const res = await axios({
                    url: `http://localhost:8000/api/auth0/delete-vendor/${vendorId}`,
                    method: "DELETE",
                    headers: {
                        "Authorization": `Bearer ${sessionStorage.getItem("accessToken")}`,
                        "Content-Type": "application/json"
                    }
                });
                if (res.status === 200) {
                    const updatedVendors = { ...vendors };
                    delete updatedVendors[vendorId];
                    setVendors(updatedVendors);
                    dispatch(set_all_vendors(updatedVendors));
                }
            } catch (error) {
                console.error("Failed to delete vendor:", error.message);
                alert("Failed to delete vendor. Please try again.");
            }
            setDeleteConfirm(null);
        } else {
            setDeleteConfirm(vendorId);
            setTimeout(() => setDeleteConfirm(null), 3000);
        }
    };

    const handleEditVendor = async (vendor, e) => {
        e.stopPropagation();
        // console.log(vendor);
        nav(`/vendors/edit/editVendor`, { state: { vendor_id: vendor.vendor_id } });
    };

    useEffect(() => {
        getAllVendors();
    }, []);

    return (
        <div className={`w-full h-full p-4 flex flex-col overflow-auto scrollbar-hide ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50'}`}>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                        Vendor Management
                    </h1>
                    <p className={`mt-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                        Manage your suppliers and partners
                    </p>
                </div>

                <div className="flex space-x-3">
                    <button
                        onClick={() => getAllVendors()}
                        className={`flex items-center px-3 py-2 rounded-md ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-100 border'
                            }`}
                    >
                        Refresh
                    </button>
                    <NavLink to={"/vendors/addVendor"}>
                        {permissions.includes('create:vendor') && <button
                            className={`flex items-center px-3 py-2 rounded-md ${theme === 'dark'
                                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                : 'bg-blue-500 hover:bg-blue-600 text-white'
                                }`}
                        >
                            <AddCircleOutline className="mr-2" /> Add Vendor
                        </button>}
                    </NavLink>
                </div>
            </div>

            {/* Admin Stats */}
            {/* <div className={`grid grid-cols-1 md:grid-cols-4 gap-4 mb-6`}>
                <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow'}`}>
                    <h3 className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>Total Vendors</h3>
                    <p className="text-2xl font-bold">{Object.keys(vendors).length}</p>
                </div>
                <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow'}`}>
                    <h3 className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>Active Partners</h3>
                    <p className="text-2xl font-bold">{Object.values(vendors).filter(v => v.status === 'active').length}</p>
                </div>
                <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow'}`}>
                    <h3 className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>Pending Approvals</h3>
                    <p className="text-2xl font-bold">{Object.values(vendors).filter(v => v.status === 'pending').length}</p>
                </div>
                <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow'}`}>
                    <h3 className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>Last Updated</h3>
                    <p className="text-md">{new Date().toLocaleDateString()}</p>
                </div>
            </div> */}

            {/* Search Bar */}
            <div className="mb-6">
                <div className={`relative ${theme === 'dark' ? 'text-white' : 'text-gray-600'}`}>
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                        </svg>
                    </span>
                    <input
                        type="text"
                        placeholder="Search vendors by name, ID, or email..."
                        className={`pl-10 pr-4 py-3 rounded-lg w-full ${theme === 'dark'
                            ? 'bg-gray-800 border-gray-700 placeholder-gray-400'
                            : 'bg-white border border-gray-300'
                            }`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Table container */}
            <div className={`rounded-lg overflow-auto scrollbar-hide`}>
                <div className="h-full overflow-auto scrollbar-hide">
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${theme === 'dark' ? 'border-blue-400' : 'border-blue-500'
                                }`}></div>
                        </div>
                    ) : filteredVendors.length > 0 ? (
                        <table className="min-w-full divide-y divide-gray-400">
                            <thead className={theme === 'dark' ? 'bg-gray-700' : 'bg-blue-50'}>
                                <tr>
                                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                                        }`}>ID</th>
                                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                                        }`}>Name</th>
                                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                                        }`}>Email</th>
                                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                                        }`}>Phone</th>
                                    {/* <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                                        }`}>Status</th> */}
                                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                                        }`}>Products</th>
                                    <th className={`px-6 py-3 text-right text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                                        }`}>Actions</th>
                                </tr>
                            </thead>
                            <tbody className={theme === 'dark' ? 'bg-gray-800 divide-y divide-gray-700' : 'divide-y divide-gray-200'}>
                                {filteredVendors.map((vendor) => (
                                    <tr
                                        key={vendor.vendor_id}
                                        className={`hover:bg-opacity-10 cursor-pointer ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-blue-50'
                                            }`}
                                    >
                                        <td className={`px-6 py-4 text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                                            {vendor.vendor_id}
                                        </td>
                                        <td className={`px-6 py-4 text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                            {vendor.vendor_name}
                                        </td>
                                        <td className={`px-6 py-4 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                                            {vendor.vendor_email || 'N/A'}
                                        </td>
                                        <td className={`px-6 py-4 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                                            {vendor.vendor_phone || 'N/A'}
                                        </td>
                                        {/* <td className="px-6 py-4 text-sm">
                                            <span className={`px-2 py-1 rounded-full text-xs ${vendor.status === 'active'
                                                    ? theme === 'dark' ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800'
                                                    : vendor.status === 'pending'
                                                        ? theme === 'dark' ? 'bg-yellow-900 text-yellow-200' : 'bg-yellow-100 text-yellow-800'
                                                        : theme === 'dark' ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800'
                                                }`}>
                                                {vendor.status || 'inactive'}
                                            </span>
                                        </td> */}
                                        <td className={`px-6 py-4 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                                            {vendor.products_count || 0}
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                                            {permissions.includes('edit:vendor') && <button
                                                onClick={(e) => handleEditVendor(vendor, e)}
                                                className={`p-1 rounded-full ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                                                    }`}
                                            >
                                                <Edit className={`text-sm ${theme === 'dark' ? 'text-blue-400' : 'text-blue-500'}`} />
                                            </button>}
                                            {permissions.includes('delete:vendor') && <button
                                                onClick={(e) => handleDeleteVendor(vendor.vendor_id, e)}
                                                className={`p-1 rounded-full ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                                                    }`}
                                            >
                                                <Delete className={`text-sm ${deleteConfirm === vendor.vendor_id
                                                    ? 'text-red-500'
                                                    : theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}
                                                />
                                            </button>}
                                            {permissions.includes('view:customers')&&<button
                                                className={`p-1 rounded-full ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                                                    }`}
                                                onClick={() => handleRowClick(vendor)}
                                            >
                                                <East className={theme === 'dark' ? 'text-gray-300' : 'text-blue-500'} />
                                            </button>}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className={`flex flex-col items-center justify-center py-16 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                            }`}>
                            <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1"
                                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 14a2 2 0 100-4 2 2 0 000 4z"></path>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1"
                                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <p className="text-xl">No vendors found</p>
                            <p className="mt-2">Try adjusting your search or add a new vendor</p>
                            <NavLink to={"/vendors/addVendor"}>
                                {permissions.includes('create:vendor') && <button className={`mt-4 px-4 py-2 rounded-md ${theme === 'dark'
                                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                                    }`}>
                                    Add Your First Vendor
                                </button>}
                            </NavLink>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Vendors;