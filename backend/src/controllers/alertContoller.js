const { poolforCommon } = require("../config/database");

const updateAlerts = async (req, res) => {
    const { alert_id } = req.body;
    const query = "UPDATE all_alerts SET resolved_status = 'Request Sent' WHERE alert_id = $1 RETURNING *";

    try {
        const result = await poolforCommon.query(query, [alert_id]);
        if (result.rows.length === 0) {
            res.status(404).json({ message: "No alerts found to update" });
        } else {
            res.status(200).json(result.rows[0]);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const resolveAlerts = async (req, res) => {
    const { ids } = req.body;
    try {
        const query = "UPDATE all_alerts SET resolved_status = 'Cleared' WHERE alert_id = ANY($1::text[]) RETURNING *";
        const result = await poolforCommon.query(query, [ids]);

        if (result.rows.length === 0) {
            res.status(404).json({ message: "No alerts found to update" });
        } else {
            res.status(200).json({ data: result.rows });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteAlerts = async (req, res) => {
    const { ids } = req.body;
    try {
        const query = "DELETE FROM all_alerts WHERE alert_id = ANY($1::text[])";
        const result = await poolforCommon.query(query, [ids]);
        if (result.rows.length === 0) {
            res.status(404).json({ message: "No alerts found to delete" });
        } else {
            res.status(200).json({ data: result.rows });
        }

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// const getAlerts = async (req, res) => {
//     try {
//         const query = "SELECT * FROM alerts";
//         const result = await poolforCommon.query(query);
//         // if (result.rows.length === 0) {
//         //     return res.status(404).json({ error: "No alerts found" });
//         // } else {
//         res.status(200).json(result.rows);
//         // }
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// }
const getAlertsForUser = async (req, res) => {
    const customer_id = req.auth.payload.sub;
    try {
        const query = "SELECT * FROM all_alerts WHERE customer_id = $1";
        const result = await poolforCommon.query(query, [customer_id]);
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const getAlertsForVendor = async (req, res) => {
    const vendor_id = req.auth.payload.sub;
    try {
        const query = "SELECT * FROM all_alerts WHERE vendor_id = $1 AND resolved_status != 'Cleared'";
        const result = await poolforCommon.query(query, [vendor_id]);
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const insertAlerts = async (req, res) => {
    const { alerts } = req.body; // expecting an array of alert objects

    if (!Array.isArray(alerts) || alerts.length === 0) {
        return res.status(400).json({ error: 'Alert data must be a non-empty array' });
    }

    const query = `
      INSERT INTO all_alerts (alert_id, device_id, customer_id, vendor_id, device_name, parameter, value, alert_status, resolved_status, alert_gen_time)
      VALUES ${alerts.map((_, i) =>
        `($${i * 10 + 1}, $${i * 10 + 2}, $${i * 10 + 3}, $${i * 10 + 4}, $${i * 10 + 5}, $${i * 10 + 6}, $${i * 10 + 7}, $${i * 10 + 8}, $${i * 10 + 9}, $${i * 10 + 10})`
    ).join(', ')}`;

    const values = alerts.flatMap(alert => [
        alert.alert_id,
        alert.device_id,
        alert.customer_id,
        alert.vendor_id,
        alert.device_name,
        alert.parameter,
        alert.value,
        alert.alert_status,
        alert.resolved_status,
        alert.alert_gen_time,
    ]);

    try {
        const result = await poolforCommon.query(query, values);
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



module.exports = {
    updateAlerts,
    getAlertsForUser,
    getAlertsForVendor,
    resolveAlerts,
    deleteAlerts,
    insertAlerts
}