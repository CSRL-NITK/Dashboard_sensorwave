const { poolforCommon } = require("../config/database");

const getLogs = async (req, res) => {
    try {
        const { startDate, endDate, limit, offset } = req.query;

        let query = "SELECT * FROM all_logs";
        let params = [];

        // Add filtering conditions if startDate or endDate exist
        if (startDate || endDate) {
            query += " WHERE";
            if (startDate) {
                params.push(startDate);
                query += ` timestamp >= $${params.length}`;
            }
            if (endDate) {
                params.push(endDate);
                query += `${startDate ? " AND" : ""} timestamp <= $${params.length}`;
            }
        }

        // Add pagination
        if (limit) {
            params.push(parseInt(limit));
            query += ` LIMIT $${params.length}`;
        }
        if (offset) {
            params.push(parseInt(offset));
            query += ` OFFSET $${params.length}`;
        }

        const result = await poolforCommon.query(query, params);
        res.status(200).json({ rows: result.rows });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const deleteLogs = async (req, res) => {
    const { ids } = req.body;
    try {
        const query = "DELETE FROM logs WHERE id = ANY($1::int[]) RETURNING *";
        const result = await poolforCommon.query(query, [ids]);
        if (result.rows.length === 0) {
            res.status(404).json({ message: "No logs found to delete" });
        } else {
            res.status(200).json({ data: result.rows });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = { getLogs, deleteLogs };