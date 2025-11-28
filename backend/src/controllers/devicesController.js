const { poolforCommon } = require("../config/database");

const getAllDevices = async (req, res) => {
    const { customer_id } = req.params;
    try {
        const query = `SELECT d.*, 
                       COALESCE(json_agg(row_to_json(s)) FILTER (WHERE s.sensor_id IS NOT NULL), '[]') AS sensors 
                       FROM all_devices d
                       LEFT JOIN all_sensors s ON d.device_id = s.device_id
                       WHERE d.customer_id = $1
                       GROUP BY d.device_id`;
        const result = await poolforCommon.query(query, [customer_id]);
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json(error.stack);
    }
}

const insertDevice = async (req, res) => {
    const { device_id, device_name, customer_id, location, no_of_parameters, device_status, device_ip, device_type, last_time_active } = req.body;
    try {
        const query = "INSERT INTO all_devices (device_id, device_name, customer_id, location, no_of_parameters, device_status, device_ip, device_type, last_time_active) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *";
        const result = await poolforCommon.query(query, [device_id, device_name, customer_id, location, no_of_parameters, device_status, device_ip, device_type, last_time_active]);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Insert Device Error:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
}

const deleteDevices = async (req, res) => {
    const { ids } = req.body;
    try {
        const query = "DELETE FROM all_devices WHERE device_id = ANY($1::text[])";
        const result = await poolforCommon.query(query, ids);
        if (result.rowCount === 0) {
            res.status(500).json({ message: "No Device to be deleted" });
        } else {
            res.status(200).json({ message: "SuccessFully Deleted" });
        }
    } catch (error) {
        res.status(500).json(error);
    }
}

module.exports = { getAllDevices, insertDevice, deleteDevices };