const { poolforCommon } = require("../config/database");

// const getAllSensors = async (device_id) => {
//     try {
//         const query = "SELECT * FROM all_sensors WHERE device_id";
//         const result = await poolforCommon.query(query, [device_id]);
//         res.status(200).json(result.rows)
//     } catch (error) {
//         res.status(500).json(error);
//     }
// }

const insertAllSensors = async (req, res) => {
    const sensors = req.body; // expecting an array of sensors
    if (!Array.isArray(sensors) || sensors.length === 0) {
        return res.status(400).json({ error: "Input must be a non-empty array of sensors" });
    }

    const query = `
        INSERT INTO all_sensors (sensor_id, sensor_name, device_id, sensor_parameter)
        VALUES 
        ${sensors.map((_, i) => `($${i * 4 + 1}, $${i * 4 + 2}, $${i * 4 + 3}, $${i * 4 + 4})`).join(', ')}
        RETURNING *;
    `;

    const values = sensors.flatMap(sensor => [
        sensor.sensor_id,
        sensor.sensor_name,
        sensor.device_id,
        sensor.sensor_parameter
    ]);

    try {
        const result = await poolforCommon.query(query, values);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Insert Sensor Error:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });

    }
};


module.exports = { insertAllSensors };