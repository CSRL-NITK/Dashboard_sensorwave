const sensorColumns = [, "Sensor ID", "Name", "Type", "Status", "Reading", "Unit", "Location", "Last Updated", "Actions"];
const sensorFieldNames = [, "id", "name", "type", "status", "reading", "unit", "location", "lastUpdated", "actions"];
const sensorData = [
    { id: 1, name: "Temp Sensor", type: "Temperature", status: "Online", reading: 22.5, unit: "°C", location: "Room A", lastUpdated: "12:30 PM" },
    { id: 2, name: "Pressure Sensor", type: "Pressure", status: "Offline", reading: 101.3, unit: "kPa", location: "Room B", lastUpdated: "12:28 PM" },
    { id: 3, name: "Humidity Sensor", type: "Humidity", status: "Online", reading: 45.2, unit: "%", location: "Room C", lastUpdated: "12:32 PM" },
    { id: 4, name: "DHT22 - Temp", type: "Temperature", status: "Online", reading: 24.1, unit: "°C", location: "Room D", lastUpdated: "12:35 PM" },
    { id: 5, name: "DHT22 - Humidity", type: "Humidity", status: "Online", reading: 50.5, unit: "%", location: "Room D", lastUpdated: "12:35 PM" },
    { id: 6, name: "MQ-2 Gas Sensor", type: "Gas Detection", status: "Online", reading: 350, unit: "ppm", location: "Room E", lastUpdated: "12:33 PM" },
    { id: 7, name: "MQ-7 CO Sensor", type: "Carbon Monoxide", status: "Warning", reading: 15, unit: "ppm", location: "Room F", lastUpdated: "12:36 PM" },
    { id: 8, name: "MQ-135 Air Quality", type: "Air Quality", status: "Critical", reading: 200, unit: "ppm", location: "Room G", lastUpdated: "12:38 PM" },
    { id: 9, name: "Temp Sensor 2", type: "Temperature", status: "Online", reading: 23.7, unit: "°C", location: "Room H", lastUpdated: "12:39 PM" },
    { id: 10, name: "Pressure Sensor 2", type: "Pressure", status: "Online", reading: 98.7, unit: "kPa", location: "Room I", lastUpdated: "12:40 PM" },
    { id: 11, name: "Humidity Sensor 2", type: "Humidity", status: "Offline", reading: 40.3, unit: "%", location: "Room J", lastUpdated: "12:41 PM" },
    { id: 12, name: "DHT22 - Temp 2", type: "Temperature", status: "Online", reading: 25.4, unit: "°C", location: "Room K", lastUpdated: "12:42 PM" },
    { id: 13, name: "DHT22 - Humidity 2", type: "Humidity", status: "Online", reading: 55.1, unit: "%", location: "Room K", lastUpdated: "12:42 PM" },
    { id: 14, name: "MQ-2 Gas Sensor 2", type: "Gas Detection", status: "Online", reading: 360, unit: "ppm", location: "Room L", lastUpdated: "12:43 PM" },
    { id: 15, name: "MQ-7 CO Sensor 2", type: "Carbon Monoxide", status: "Online", reading: 10, unit: "ppm", location: "Room M", lastUpdated: "12:44 PM" },
    { id: 16, name: "MQ-135 Air Quality 2", type: "Air Quality", status: "Online", reading: 180, unit: "ppm", location: "Room N", lastUpdated: "12:45 PM" },
    { id: 17, name: "O2 Sensor", type: "Oxygen", status: "Online", reading: 20.9, unit: "%", location: "Room O", lastUpdated: "12:46 PM" },
    { id: 18, name: "Light Sensor", type: "Light", status: "Online", reading: 1500, unit: "lux", location: "Room P", lastUpdated: "12:47 PM" },
    { id: 19, name: "Sound Sensor", type: "Sound", status: "Online", reading: 50, unit: "dB", location: "Room Q", lastUpdated: "12:48 PM" },
    { id: 20, name: "Vibration Sensor", type: "Vibration", status: "Online", reading: 5.6, unit: "mm/s", location: "Room R", lastUpdated: "12:49 PM" }
];


let AlertData = [
    {
        sensorid: 1,
        type: 'Temp',
        value: '40 °C',
        status: 'normal',
        time: '10:30 AM',
        isresolved: 'Send Request'
    },
    {
        sensorid: 3,
        type: 'Humidity',
        value: '70%',
        status: 'normal',
        time: '10:45 AM',
        isresolved: 'Send Request'
    },
    {
        sensorid: 8,
        type: 'Air Qlty',
        value: '300 ppm',
        status: 'warning',
        time: '12:13 PM',
        isresolved: 'Send Request'
    },
    {
        sensorid: 7,
        type: 'CO',
        value: '20 ppm',
        status: 'warning',
        time: '01:50 PM',
        isresolved: 'Send Request'
    },
    {
        sensorid: 14,
        type: 'Gas',
        value: '400 ppm',
        status: 'critical',
        time: '03:00 PM',
        isresolved: 'Send Request'
    },
    {
        sensorid: 17,
        type: 'Oxygen',
        value: '18%',
        status: 'normal',
        time: '03:30 PM',
        isresolved: 'Send Request'
    },
    {
        sensorid: 19,
        type: 'Sound',
        value: '70 dB',
        status: 'warning',
        time: '04:00 PM',
        isresolved: 'Send Request'
    }
]


const customers = [
    {
        customer_id: 1,
        customer_name: "Acme Corporation",
        customer_email: "contact@acmecorp.com",
        customer_phn: "+1-555-0123",
        no_of_devices: 12,
    },
    {
        customer_id: 2,
        customer_name: "TechSolutions Inc.",
        customer_email: "info@techsolutions.com",
        customer_phn: "+1-555-0456",
        no_of_devices: 8,
    },
    {
        customer_id: 3,
        customer_name: "Global Enterprises",
        customer_email: "support@globalenterprises.com",
        customer_phn: "+1-555-0789",
        no_of_devices: 23,
    },
    {
        customer_id: 4,
        customer_name: "Innovate Systems",
        customer_email: "hello@innovatesystems.com",
        customer_phn: "+1-555-1011",
        no_of_devices: 5,
    },
    {
        customer_id: 5,
        customer_name: "Digital Networks",
        customer_email: "admin@digitalnetworks.com",
        customer_phn: "+1-555-1213",
        no_of_devices: 17,
    },
    {
        customer_id: 5,
        customer_name: "Digital Networks",
        customer_email: "admin@digitalnetworks.com",
        customer_phn: "+1-555-1213",
        no_of_devices: 17,
    },
    {
        customer_id: 5,
        customer_name: "Digital Networks",
        customer_email: "admin@digitalnetworks.com",
        customer_phn: "+1-555-1213",
        no_of_devices: 17,
    },
    {
        customer_id: 5,
        customer_name: "Digital Networks",
        customer_email: "admin@digitalnetworks.com",
        customer_phn: "+1-555-1213",
        no_of_devices: 17,
    },
    {
        customer_id: 5,
        customer_name: "Digital Networks",
        customer_email: "admin@digitalnetworks.com",
        customer_phn: "+1-555-1213",
        no_of_devices: 17,
    },
    {
        customer_id: 5,
        customer_name: "Digital Networks",
        customer_email: "admin@digitalnetworks.com",
        customer_phn: "+1-555-1213",
        no_of_devices: 17,
    },
];
export { sensorColumns, sensorFieldNames, sensorData, AlertData, customers };