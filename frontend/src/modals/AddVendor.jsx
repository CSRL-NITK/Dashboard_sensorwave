import React, { useEffect, useState } from "react";
import { ArrowBack, Save, Add, Remove, CopyAllOutlined } from "@mui/icons-material";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import { generateTempPassword } from "../utils/tempPass";
import { IconButton } from "@mui/material";
import { toast } from "react-toastify";

const AddVendor = () => {
    const { state } = useLocation();
    const permissions = JSON.parse(sessionStorage.getItem('permissions'));
    const navigate = useNavigate();
    const theme = useSelector(state => state.theme.theme);
    const [loading, setLoading] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const [isEditMode, setIsEditMode] = useState(false);
    const [productFields, setProductFields] = useState([{ name: "", category: "", price: "" }]);

    const [formData, setFormData] = useState({
        password: generateTempPassword(),
        vendor_name: "",
        vendor_email: "",
        vendor_phone: "",
        contact_person: "",
        address: "",
        city: "",
        state: "",
        zip_code: "",
        country: "India",
        gstin: "",
        website: "",
        notes: ""
    });

    // payment_terms: "30 days",
    // status: "pending",
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });

        // Clear error for this field if it exists
        if (formErrors[name]) {
            setFormErrors({
                ...formErrors,
                [name]: null
            });
        }
    };

    const handleProductChange = (index, field, value) => {
        const updatedProducts = [...productFields];
        updatedProducts[index][field] = value;
        setProductFields(updatedProducts);
    };

    const addProductField = () => {
        setProductFields([...productFields, { name: '', category: '', price: '' }]);
    };

    const removeProductField = (index) => {
        if (productFields.length === 1) return;
        const updatedProducts = [...productFields];
        updatedProducts.splice(index, 1);
        setProductFields(updatedProducts);
    };

    const copyPasswordToClipboard = () => {
        navigator.clipboard.writeText(formData.password);
        toast.info("Password copied to clipboard!", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: theme === 'dark' ? 'dark' : 'light'
        });
    };

    const validateForm = () => {
        const errors = {};

        if (!formData.vendor_name.trim()) {
            errors.vendor_name = "Vendor name is required";
        }

        if (formData.vendor_email && !/^\S+@\S+\.\S+$/.test(formData.vendor_email)) {
            errors.vendor_email = "Invalid email format";
        }

        if (formData.vendor_phone && !/^\d{10}$/.test(formData.vendor_phone.replace(/[^0-9]/g, ''))) {
            errors.vendor_phone = "Phone number should have 10 digits";
        }

        if (formData.website && !/^(https?:\/\/)?(www\.)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,}(:[0-9]{1,5})?(\/.*)?$/.test(formData.website)) {
            errors.website = "Invalid website URL";
        }

        // Validate products if any
        const productErrors = [];
        productFields.forEach((product, index) => {
            if (product.name.trim() && (!product.category.trim() || !product.price.trim())) {
                productErrors[index] = "All product fields are required";
            }
            if (product.price && isNaN(parseFloat(product.price))) {
                productErrors[index] = "Price must be a number";
            }
        });

        if (productErrors.length > 0) {
            errors.products = productErrors;
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error("Please correct the errors in the form", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: theme === 'dark' ? 'dark' : 'light'
            });
            return;
        }

        setLoading(true);

        // Filter out empty product fields
        const products = productFields.filter(product =>
            product.name.trim() && product.category.trim() && product.price.trim()
        );
        // setAllProducts(products);

        try {
            const vendorData = {
                ...formData,
                products: products.length > 0 ? products : undefined,
                products_count: products.length,
            };

            // Add vendor_id to data if in edit mode
            if (isEditMode && state?.vendor_id) {
                vendorData.vendor_id = state.vendor_id;
            }

            const endpoint = isEditMode
                ? "http://localhost:8000/api/vendor/updateVendor"
                : "http://localhost:8000/api/auth0/create-vendor";

            const res = await axios({
                url: endpoint,
                method: isEditMode ? "PUT" : "POST",
                headers: {
                    "Authorization": `Bearer ${sessionStorage.getItem("accessToken")}`,
                    "Content-Type": "application/json"
                },
                data: vendorData
            });

            if (res.status === 200 || res.status === 201) {
                toast.success(`Vendor ${isEditMode ? 'updated' : 'added'} successfully!`, {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    theme: theme === 'dark' ? 'dark' : 'light'
                });
                navigate(-1);
            }
        } catch (error) {
            console.error(`Error ${isEditMode ? 'updating' : 'adding'} vendor:`, error.response?.data?.message || error.message);
            const errorMessage = error.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'add'} vendor. Please try again.`;

            toast.error(errorMessage, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: theme === 'dark' ? 'dark' : 'light'
            });

            setFormErrors({
                ...formErrors,
                submit: errorMessage
            });
        } finally {
            setLoading(false);
        }
    };
    const particularVendor = async (vendor_id) => {
        try {
            const res = await axios({
                url: "http://localhost:8000/api/vendor/getParticularVendor",
                method: "POST",
                data: { vendor_id: vendor_id },
                headers: {
                    "Authorization": `Bearer ${sessionStorage.getItem("accessToken")}`,
                    "Content-Type": "application/json"
                }
            });
            if (res.status === 200) {
                const vendorData = res.data;
                setFormData({
                    ...vendorData,
                    password: formData.password
                });
                if (vendorData.products && Array.isArray(vendorData.products) && vendorData.products.length > 0) {
                    setProductFields(vendorData.products);
                }
            }
        } catch (error) {
            console.error(error.repsonse?.data || error.message);
        }
    }
    useEffect(() => {
        if (state?.vendor_id !== undefined) {
            setIsEditMode(true);
            particularVendor(state.vendor_id);
        }
    }, [state]);
    return (
        <div className={`w-full h-full overflow-auto p-4 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50'}`}>
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center mb-6">
                    <button
                        onClick={() => navigate("/vendors")}
                        className={`mr-4 p-2 rounded-full ${theme === 'dark'
                            ? 'bg-gray-800 hover:bg-gray-700'
                            : 'bg-white hover:bg-gray-100 border border-gray-200'
                            }`}
                    >
                        <ArrowBack />
                    </button>
                    <div>
                        <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                            {isEditMode ? 'Edit Vendor' : 'Add New Vendor'}
                        </h1>
                        <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                            Fill in the details to {isEditMode ? 'update the' : 'add a new'} vendor to your system
                        </p>
                    </div>
                </div>

                {/* Form Error Message */}
                {formErrors.submit && (
                    <div className="mb-6 p-4 rounded-lg bg-red-100 border border-red-300 text-red-800">
                        {formErrors.submit}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <div className={`rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow'} p-6 mb-6`}>
                        <h2 className={`text-xl font-semibold mb-4 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                            Vendor Information
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Vendor Name */}
                            <div>
                                <label className={`block mb-2 text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Vendor Name * (Be Careful not editable)
                                </label>
                                <input
                                    type="text"
                                    disabled={isEditMode}
                                    name="vendor_name"
                                    value={formData.vendor_name}
                                    onChange={handleInputChange}
                                    className={`w-full px-3 py-2 rounded-md transition ${theme === 'dark'
                                        ? 'bg-gray-700 border-gray-600 text-white'
                                        : 'border border-gray-300 bg-white'
                                        } ${formErrors.vendor_name ? 'border-red-500' : ''} 
        ${isEditMode ? 'opacity-60 cursor-not-allowed' : ''}`}
                                    required
                                />
                                {formErrors.vendor_name && (
                                    <p className="mt-1 text-sm text-red-500">{formErrors.vendor_name}</p>
                                )}
                            </div>

                            {/* Email */}
                            <div>
                                <label className={`block mb-2 text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Email * (Be Careful not editable)
                                </label>
                                <input
                                    type="email"
                                    name="vendor_email"
                                    disabled={isEditMode}
                                    value={formData.vendor_email}
                                    onChange={handleInputChange}
                                    className={`w-full px-3 py-2 rounded-md transition ${theme === 'dark'
                                        ? 'bg-gray-700 border-gray-600 text-white'
                                        : 'border border-gray-300 bg-white'
                                        } ${formErrors.vendor_email ? 'border-red-500' : ''} 
        ${isEditMode ? 'opacity-60 cursor-not-allowed' : ''}`}
                                />
                                {formErrors.vendor_email && (
                                    <p className="mt-1 text-sm text-red-500">{formErrors.vendor_email}</p>
                                )}
                            </div>


                            {/* Phone */}
                            <div>
                                <label className={`block mb-2 text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Phone
                                </label>
                                <input
                                    type="text"
                                    name="vendor_phone"
                                    value={formData.vendor_phone}
                                    onChange={handleInputChange}
                                    className={`w-full px-3 py-2 rounded-md ${theme === 'dark'
                                        ? 'bg-gray-700 border-gray-600 text-white'
                                        : 'border border-gray-300'
                                        } ${formErrors.vendor_phone ? 'border-red-500' : ''}`}
                                    placeholder="(123) 456-7890"
                                />
                                {formErrors.vendor_phone && (
                                    <p className="mt-1 text-sm text-red-500">{formErrors.vendor_phone}</p>
                                )}
                            </div>

                            {/* Contact Person */}
                            <div>
                                <label className={`block mb-2 text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Contact Person
                                </label>
                                <input
                                    type="text"
                                    name="contact_person"
                                    value={formData.contact_person}
                                    onChange={handleInputChange}
                                    className={`w-full px-3 py-2 rounded-md ${theme === 'dark'
                                        ? 'bg-gray-700 border-gray-600 text-white'
                                        : 'border border-gray-300'
                                        }`}
                                />
                            </div>

                            {/* Website */}
                            <div>
                                <label className={`block mb-2 text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Website
                                </label>
                                <input
                                    type="text"
                                    name="website"
                                    value={formData.website}
                                    onChange={handleInputChange}
                                    className={`w-full px-3 py-2 rounded-md ${theme === 'dark'
                                        ? 'bg-gray-700 border-gray-600 text-white'
                                        : 'border border-gray-300'
                                        } ${formErrors.website ? 'border-red-500' : ''}`}
                                    placeholder="https://example.com"
                                />
                                {formErrors.website && (
                                    <p className="mt-1 text-sm text-red-500">{formErrors.website}</p>
                                )}
                            </div>

                            {/* Tax ID */}
                            <div>
                                <label className={`block mb-2 text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                    GSTIN
                                </label>
                                <input
                                    type="text"
                                    name="gstin"
                                    value={formData.gstin}
                                    onChange={handleInputChange}
                                    className={`w-full px-3 py-2 rounded-md ${theme === 'dark'
                                        ? 'bg-gray-700 border-gray-600 text-white'
                                        : 'border border-gray-300'
                                        }`}
                                />
                            </div>

                            {!isEditMode && (
                                <div>
                                    <label htmlFor="password" className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Generated Password
                                    </label>
                                    <div className={`flex items-center justify-between px-1 ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : ' border-gray-300 bg-white'} border rounded-md`}>
                                        <input
                                            type="text"
                                            id="password"
                                            name="password"
                                            disabled
                                            value={formData.password}
                                            className={`w-full p-2 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 ${formErrors.password ? 'border-red-500' : theme === 'dark' ? 'bg-gray-700 text-gray-400' : 'text-gray-400'
                                                }`}
                                        />
                                        <IconButton size='small' onClick={copyPasswordToClipboard}>
                                            <CopyAllOutlined />
                                        </IconButton>
                                    </div>
                                    {formErrors.password && (
                                        <p className="mt-1 text-sm text-red-500">{formErrors.password}</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Address Information */}
                    <div className={`rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow'} p-6 mb-6`}>
                        <h2 className={`text-xl font-semibold mb-4 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                            Address Information (Optional)
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Address */}
                            <div className="md:col-span-2">
                                <label className={`block mb-2 text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Address
                                </label>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    className={`w-full px-3 py-2 rounded-md ${theme === 'dark'
                                        ? 'bg-gray-700 border-gray-600 text-white'
                                        : 'border border-gray-300'
                                        }`}
                                />
                            </div>

                            {/* City */}
                            <div>
                                <label className={`block mb-2 text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                    City
                                </label>
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleInputChange}
                                    className={`w-full px-3 py-2 rounded-md ${theme === 'dark'
                                        ? 'bg-gray-700 border-gray-600 text-white'
                                        : 'border border-gray-300'
                                        }`}
                                />
                            </div>

                            {/* State */}
                            <div>
                                <label className={`block mb-2 text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                    State
                                </label>
                                <input
                                    type="text"
                                    name="state"
                                    value={formData.state}
                                    onChange={handleInputChange}
                                    className={`w-full px-3 py-2 rounded-md ${theme === 'dark'
                                        ? 'bg-gray-700 border-gray-600 text-white'
                                        : 'border border-gray-300'
                                        }`}
                                />
                            </div>

                            {/* Zip Code */}
                            <div>
                                <label className={`block mb-2 text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Zip Code
                                </label>
                                <input
                                    type="text"
                                    name="zip_code"
                                    value={formData.zip_code}
                                    onChange={handleInputChange}
                                    className={`w-full px-3 py-2 rounded-md ${theme === 'dark'
                                        ? 'bg-gray-700 border-gray-600 text-white'
                                        : 'border border-gray-300'
                                        }`}
                                />
                            </div>

                            {/* Country */}
                            <div>
                                <label className={`block mb-2 text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Country
                                </label>
                                <select
                                    name="country"
                                    value={formData.country}
                                    onChange={handleInputChange}
                                    className={`w-full px-3 py-2 rounded-md ${theme === 'dark'
                                        ? 'bg-gray-700 border-gray-600 text-white'
                                        : 'border border-gray-300'
                                        }`}
                                >
                                    <option value="USA">United States</option>
                                    <option value="Canada">Canada</option>
                                    <option value="Mexico">Mexico</option>
                                    <option value="UK">United Kingdom</option>
                                    <option value="Germany">Germany</option>
                                    <option value="France">France</option>
                                    <option value="Japan">Japan</option>
                                    <option value="China">China</option>
                                    <option value="India">India</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Products Section */}
                    <div className={`rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow'} p-6 mb-6`}>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                                Products {!isEditMode && '(Optional)'}
                            </h2>
                            <button
                                type="button"
                                onClick={addProductField}
                                className={`flex items-center px-3 py-1 rounded ${theme === 'dark'
                                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                                    }`}
                            >
                                <Add fontSize="small" className="mr-1" /> Add Product
                            </button>
                        </div>

                        {productFields.map((product, index) => (
                            <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4 items-end">
                                <div className="md:col-span-5">
                                    <label className={`block mb-2 text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Product Name
                                    </label>
                                    <input
                                        type="text"
                                        value={product.name}
                                        onChange={(e) => handleProductChange(index, 'name', e.target.value)}
                                        className={`w-full px-3 py-2 rounded-md ${theme === 'dark'
                                            ? 'bg-gray-700 border-gray-600 text-white'
                                            : 'border border-gray-300'
                                            }`}
                                    />
                                </div>
                                <div className="md:col-span-4">
                                    <label className={`block mb-2 text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Category
                                    </label>
                                    <input
                                        type="text"
                                        value={product.category}
                                        onChange={(e) => handleProductChange(index, 'category', e.target.value)}
                                        className={`w-full px-3 py-2 rounded-md ${theme === 'dark'
                                            ? 'bg-gray-700 border-gray-600 text-white'
                                            : 'border border-gray-300'
                                            }`}
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className={`block mb-2 text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Price
                                    </label>
                                    <input
                                        type="text"
                                        value={product.price}
                                        onChange={(e) => handleProductChange(index, 'price', e.target.value)}
                                        className={`w-full px-3 py-2 rounded-md ${theme === 'dark'
                                            ? 'bg-gray-700 border-gray-600 text-white'
                                            : 'border border-gray-300'
                                            }`}
                                    />
                                </div>
                                <div className="md:col-span-1 flex justify-end">
                                    <button
                                        type="button"
                                        onClick={() => removeProductField(index)}
                                        disabled={productFields.length === 1}
                                        className={`p-2 rounded-full ${productFields.length === 1
                                            ? theme === 'dark' ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            : theme === 'dark' ? 'bg-red-900 text-red-300 hover:bg-red-800' : 'bg-red-100 text-red-500 hover:bg-red-200'
                                            }`}
                                    >
                                        <Remove fontSize="small" />
                                    </button>
                                </div>
                                {formErrors.products && formErrors.products[index] && (
                                    <div className="md:col-span-12">
                                        <p className="text-sm text-red-500">{formErrors.products[index]}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Notes Section */}
                    <div className={`rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow'} p-6 mb-6`}>
                        <h2 className={`text-xl font-semibold mb-4 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                            Additional Notes (Optional)
                        </h2>

                        <div>
                            <label className={`block mb-2 text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                Notes
                            </label>
                            <textarea
                                name="notes"
                                value={formData.notes}
                                onChange={handleInputChange}
                                rows="4"
                                className={`w-full px-3 py-2 rounded-md ${theme === 'dark'
                                    ? 'bg-gray-700 border-gray-600 text-white'
                                    : 'border border-gray-300'
                                    }`}
                                placeholder="Add any additional information about this vendor..."
                            ></textarea>
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={() => {
                                toast.info("Operation canceled", {
                                    position: "top-right",
                                    autoClose: 2000,
                                    hideProgressBar: false,
                                    closeOnClick: true,
                                    pauseOnHover: true,
                                    draggable: true,
                                    theme: theme === 'dark' ? 'dark' : 'light'
                                });
                                navigate("/vendors");
                            }}
                            className={`px-4 py-2 rounded-md ${theme === 'dark'
                                ? 'bg-gray-700 hover:bg-gray-600 text-white'
                                : 'bg-white hover:bg-gray-100 text-gray-800 border border-gray-300'
                                }`}
                        >
                            Cancel
                        </button>
                        {permissions.includes('edit:vendor') && <button
                            type="submit"
                            disabled={loading}
                            className={`flex items-center px-6 py-2 rounded-md ${loading
                                ? theme === 'dark' ? 'bg-blue-800 text-gray-300 cursor-not-allowed' : 'bg-blue-300 cursor-not-allowed'
                                : theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'
                                }`}
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2" /> Save Vendor
                                </>
                            )}
                        </button>}
                    </div>
                </form>
            </div >
            {/* <Outlet /> */}
        </div >
    );
};

export default AddVendor;