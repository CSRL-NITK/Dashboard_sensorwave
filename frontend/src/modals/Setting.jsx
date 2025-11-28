import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
// Import MUI icons
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import DeleteIcon from '@mui/icons-material/Delete';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SearchIcon from '@mui/icons-material/Search';

const Settings = () => {
  // Redux theme state
  const theme = useSelector((state) => state.theme.theme);
  
  // Vendor form state
  const [vendorForm, setVendorForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    serviceType: '',
    accessLevel: 'standard'
  });
  
  // List of assigned vendors
  const [assignedVendors, setAssignedVendors] = useState([]);
  
  // Search and filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  
  // Load vendors from localStorage on component mount
  useEffect(() => {
    const savedVendors = localStorage.getItem('assignedVendors');
    if (savedVendors) {
      setAssignedVendors(JSON.parse(savedVendors));
    }
  }, []);
  
  // Save vendors to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('assignedVendors', JSON.stringify(assignedVendors));
  }, [assignedVendors]);
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setVendorForm(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!vendorForm.name || !vendorForm.email) {
      alert('Name and email are required');
      return;
    }
    
    // Add new vendor with unique ID
    const newVendor = {
      id: Date.now().toString(),
      ...vendorForm,
      dateAdded: new Date().toISOString()
    };
    
    setAssignedVendors(prev => [...prev, newVendor]);
    
    // Reset form
    setVendorForm({
      name: '',
      email: '',
      phone: '',
      company: '',
      serviceType: '',
      accessLevel: 'standard'
    });
  };
  
  // Delete vendor
  const deleteVendor = (id) => {
    setAssignedVendors(prev => prev.filter(vendor => vendor.id !== id));
  };
  
  // Filter vendors based on search term
  const filteredVendors = assignedVendors.filter(vendor => 
    vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.serviceType.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className={`min-h-screen w-full transition-colors duration-200 ease-in-out ${theme === 'dark' ? 'bg-gray-900 text-gray-200' : 'bg-gray-50 text-gray-800'}`}>
      {/* Header */}
      <div className={`p-3 border-b ${theme === 'dark' ? 'border-gray-700' : 'bg-orange-200 border-gray-200'} flex justify-between items-center`}>
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>
      
      {/* Main content */}
      <div className="max-w-6xl mx-auto p-2">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Settings navigation */}
          <div className="col-span-1">
            <nav className="space-y-1">
              <button className={`w-full flex items-center px-4 py-3 text-left rounded-lg ${theme === 'dark' ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-50 text-blue-700'} font-medium`}>
                Vendor Setting
              </button>
              <button className={`w-full flex items-center px-4 py-3 text-left rounded-lg ${theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}>
                General Settings
              </button>
              <button className={`w-full flex items-center px-4 py-3 text-left rounded-lg ${theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}>
                Notifications
              </button>
              <button className={`w-full flex items-center px-4 py-3 text-left rounded-lg ${theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}>
                Security
              </button>
            </nav>
          </div>
          
          {/* Main settings area */}
          <div className={`col-span-1 lg:col-span-3 rounded-xl overflow-auto scrollbar-none shadow-sm p-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className="text-xl font-semibold mb-6">Vendor Setting</h2>
            
            {/* Add vendor form */}
            <div className={`mb-8 border-b pb-8 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
              <h3 className="text-lg font-medium mb-4">Add New Vendor</h3>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Vendor Name*
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={vendorForm.name}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        theme === 'dark' 
                          ? 'border-gray-600 bg-gray-700' 
                          : 'border-gray-300 bg-white'
                      }`}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Email Address*
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={vendorForm.email}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        theme === 'dark' 
                          ? 'border-gray-600 bg-gray-700' 
                          : 'border-gray-300 bg-white'
                      }`}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={vendorForm.phone}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        theme === 'dark' 
                          ? 'border-gray-600 bg-gray-700' 
                          : 'border-gray-300 bg-white'
                      }`}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Company
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={vendorForm.company}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        theme === 'dark' 
                          ? 'border-gray-600 bg-gray-700' 
                          : 'border-gray-300 bg-white'
                      }`}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Service Type
                    </label>
                    <div className="relative">
                      <button
                        type="button"
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-left flex justify-between items-center ${
                          theme === 'dark' 
                            ? 'border-gray-600 bg-gray-700' 
                            : 'border-gray-300 bg-white'
                        }`}
                        onClick={() => setShowDropdown(!showDropdown)}
                      >
                        {vendorForm.serviceType || 'Select Service Type'}
                        <KeyboardArrowDownIcon style={{ fontSize: 20 }} />
                      </button>
                      
                      {showDropdown && (
                        <div className={`absolute z-10 mt-1 w-full border rounded-md shadow-lg ${
                          theme === 'dark'
                            ? 'bg-gray-700 border-gray-600' 
                            : 'bg-white border-gray-300'
                        }`}>
                          {['Maintenance', 'IT Support', 'Supplies', 'Consulting', 'Other'].map((service) => (
                            <button
                              key={service}
                              type="button"
                              className={`block w-full text-left px-4 py-2 ${
                                theme === 'dark'
                                  ? 'hover:bg-gray-600'
                                  : 'hover:bg-gray-100'
                              }`}
                              onClick={() => {
                                setVendorForm(prev => ({ ...prev, serviceType: service }));
                                setShowDropdown(false);
                              }}
                            >
                              {service}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Access Level
                    </label>
                    <div className="flex space-x-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="accessLevel"
                          value="limited"
                          checked={vendorForm.accessLevel === 'limited'}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span className="ml-2 text-sm">Limited</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="accessLevel"
                          value="standard"
                          checked={vendorForm.accessLevel === 'standard'}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span className="ml-2 text-sm">Standard</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="accessLevel"
                          value="full"
                          checked={vendorForm.accessLevel === 'full'}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span className="ml-2 text-sm">Full</span>
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <PersonAddIcon style={{ fontSize: 20, marginRight: 8 }} />
                    Add Vendor
                  </button>
                </div>
              </form>
            </div>
            
            {/* Vendor list */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Current Vendors</h3>
                <div className="relative">
                  <SearchIcon style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: theme === 'dark' ? '#9ca3af' : '#9ca3af', fontSize: 18 }} />
                  <input
                    type="text"
                    placeholder="Search vendors..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      theme === 'dark' 
                        ? 'border-gray-600 bg-gray-700' 
                        : 'border-gray-300 bg-white'
                    }`}
                  />
                </div>
              </div>
              
              {filteredVendors.length > 0 ? (
                <div className="space-y-4">
                  {filteredVendors.map((vendor) => (
                    <div
                      key={vendor.id}
                      className={`p-4 border rounded-lg transition-colors ${
                        theme === 'dark'
                          ? 'border-gray-700 hover:bg-gray-750'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-lg">{vendor.name}</h4>
                          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                            {vendor.company}
                          </p>
                        </div>
                        <button
                          onClick={() => deleteVendor(vendor.id)}
                          className={`p-1 rounded-full ${
                            theme === 'dark'
                              ? 'text-gray-400 hover:text-red-500 hover:bg-gray-700'
                              : 'text-gray-400 hover:text-red-500 hover:bg-gray-100'
                          }`}
                        >
                          <DeleteIcon style={{ fontSize: 18 }} />
                        </button>
                      </div>
                      
                      <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>Email:</span> {vendor.email}
                        </div>
                        <div>
                          <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>Phone:</span> {vendor.phone || 'N/A'}
                        </div>
                        <div>
                          <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>Service:</span> {vendor.serviceType || 'N/A'}
                        </div>
                        <div>
                          <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>Access:</span>{' '}
                          <span className={`capitalize ${
                            vendor.accessLevel === 'limited' 
                              ? theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'
                              : vendor.accessLevel === 'full'
                                ? theme === 'dark' ? 'text-green-400' : 'text-green-600'
                                : theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                          }`}>
                            {vendor.accessLevel}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={`text-center py-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  {searchTerm ? 'No vendors match your search' : 'No vendors added yet'}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;