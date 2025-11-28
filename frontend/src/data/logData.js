const logData = [
    {
        id: 1,
        timestamp: new Date().toISOString(),
        level: 'info',
        source: 'system',
        message: 'System initialized successfully.'
    },
    {
        id: 2,
        timestamp: new Date().toISOString(),
        level: 'warning',
        source: 'sensor',
        message: 'Sensor temperature is above the threshold.'
    },
    {
        id: 3,
        timestamp: new Date().toISOString(),
        level: 'error',
        source: 'user',
        message: 'User authentication failed.'
    },
    {
        id: 4,
        timestamp: new Date().toISOString(),
        level: 'info',
        source: 'system',
        message: 'Scheduled maintenance completed.'
    },
    {
        id: 5,
        timestamp: new Date().toISOString(),
        level: 'warning',
        source: 'sensor',
        message: 'Low battery warning for sensor 12.'
    },
    {
        id: 6,
        timestamp: new Date().toISOString(),
        level: 'error',
        source: 'system',
        message: 'Database connection lost.'
    },
    {
        id: 7,
        timestamp: new Date().toISOString(),
        level: 'info',
        source: 'user',
        message: 'User logged in successfully.'
    },
    {
        id: 8,
        timestamp: new Date().toISOString(),
        level: 'warning',
        source: 'sensor',
        message: 'Humidity levels are outside the acceptable range.'
    },
    {
        id: 9,
        timestamp: new Date().toISOString(),
        level: 'error',
        source: 'user',
        message: 'Failed to update user profile.'
    },
    {
        id: 10,
        timestamp: new Date().toISOString(),
        level: 'info',
        source: 'system',
        message: 'Backup completed successfully.'
    },
    {
        id: 11,
        timestamp: new Date().toISOString(),
        level: 'info',
        source: 'system',
        message: 'Backup completed successfully.'
    },
    {
        id: 12,
        timestamp: new Date().toISOString(),
        level: 'info',
        source: 'system',
        message: 'Backup completed successfully.'
    },
    {
        id: 13,
        timestamp: new Date().toISOString(),
        level: 'info',
        source: 'system',
        message: 'Backup completed successfully.'
    },
    {
        id: 14,
        timestamp: new Date().toISOString(),
        level: 'info',
        source: 'system',
        message: 'Backup completed successfully.'
    },
    {
        id: 15,
        timestamp: new Date().toISOString(),
        level: 'info',
        source: 'system',
        message: 'Backup completed successfully.'
    },
    {
        id: 16,
        timestamp: new Date().toISOString(),
        level: 'info',
        source: 'system',
        message: 'Backup completed successfully.'
    },
    {
        id: 17,
        timestamp: new Date().toISOString(),
        level: 'info',
        source: 'system',
        message: 'Backup completed successfully.'
    },
    {
        id: 18,
        timestamp: new Date().toISOString(),
        level: 'info',
        source: 'system',
        message: 'Backup completed successfully.'
    },
    {
        id: 19,
        timestamp: new Date().toISOString(),
        level: 'info',
        source: 'system',
        message: 'Backup completed successfully.'
    },
];

const userData = [
    { id: 1, name: 'John Doe', email: 'john.doe@example.com', role: 'Admin', status: 'Active', lastLogin: '2025-03-30' },
    { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', role: 'Editor', status: 'Active', lastLogin: '2025-03-29' },
    { id: 3, name: 'Robert Johnson', email: 'robert.j@example.com', role: 'Viewer', status: 'Inactive', lastLogin: '2025-03-15' },
    { id: 4, name: 'Sarah Williams', email: 'sarah.w@example.com', role: 'Editor', status: 'Active', lastLogin: '2025-03-28' },
    { id: 5, name: 'Michael Brown', email: 'michael.b@example.com', role: 'Viewer', status: 'Active', lastLogin: '2025-03-27' },
    { id: 5, name: 'Michael Brown', email: 'michael.b@example.com', role: 'Viewer', status: 'Active', lastLogin: '2025-03-27' },
    { id: 5, name: 'Michael Brown', email: 'michael.b@example.com', role: 'Viewer', status: 'Active', lastLogin: '2025-03-27' },
    { id: 5, name: 'Michael Brown', email: 'michael.b@example.com', role: 'Viewer', status: 'Active', lastLogin: '2025-03-27' },
    { id: 5, name: 'Michael Brown', email: 'michael.b@example.com', role: 'Viewer', status: 'Active', lastLogin: '2025-03-27' },
    { id: 5, name: 'Michael Brown', email: 'michael.b@example.com', role: 'Viewer', status: 'Active', lastLogin: '2025-03-27' },
];

export { logData, userData };