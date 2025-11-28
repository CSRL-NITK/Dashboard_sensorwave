const { poolforCommon } = require("../config/database");

const testConnection = async (req, res) => {
    try {
        const result = await poolforCommon.query('SELECT NOW()');
        console.log(result.rows[0]);
    } catch (error) {
        console.log(error);
    }
};
testConnection();
const showAllTables = async (req, res) => {
    try {
        const result = await poolforCommon.query(`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`);
        console.log(result.rows);

    } catch (error) {
        console.error(error.message);
    }
}
showAllTables();


const insertNotification = async (req, res) => {
    const { sender, receiver, title, message, type, created_at } = req.body;
    const query = "INSERT INTO all_notifications (sender, receiver, title, message, type, is_read, created_at) VALUES ($1, $2, $3, $4, $5, false, $6) RETURNING *";

    try {
        const result = await poolforCommon.query(query, [sender, receiver, title, message, type, created_at]);
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
const insertManyNotification = async (req, res) => {
    const { dataArray } = req.body;

    if (!Array.isArray(dataArray) || dataArray.length === 0) {
        return res.status(400).json({ error: 'dataArray data must be a non-empty array' });
    }

    const query = `INSERT INTO all_notifications (sender, receiver, title, message, type, is_read, created_at) VALUES ${dataArray.map((_, i) => `
        ($${i * 6 + 1}, $${i * 6 + 2}, $${i * 6 + 3}, $${i * 6 + 4}, $${i * 6 + 5}, false, $${i * 6 + 6})
        `).join(", ")} RETURNING *`;

    const values = dataArray.flatMap(data => [
        data.sender,
        data.receiver,
        data.title,
        data.message,
        data.type,
        data.created_at
    ])
    try {
        const result = await poolforCommon.query(query, values);
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json(error);
    }
}

const getNotificationsForUser = async (req, res) => {
    const { receiver } = req.body;
    try {
        const query = `
            SELECT an.*, 
                   COALESCE(v.vendor_name, c.customer_name) AS sender_name
            FROM all_notifications an
            LEFT JOIN all_vendors v ON an.sender = v.vendor_id
            LEFT JOIN all_customers c ON an.sender = c.customer_id
            WHERE an.receiver = $1
        `;
        const result = await poolforCommon.query(query, [receiver]);
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json(error);
    }
}


const readNotification = async (req, res) => {
    const { notification_id } = req.body;
    try {
        const query = "UPDATE all_notifications SET is_read = true WHERE notification_id = $1 RETURNING *";
        const result = await poolforCommon.query(query, [notification_id]);
        if (result.rows.length === 0) {
            return res.status(200).json({ message: "No unread notifications found" });
        } else {
            res.status(200).json({ message: "Notifications marked as read" });
        }
    } catch (error) {
        res.status(500).json(error);
    }
}

const sendReplyTo = async (req, res) => {
    const { notification_id, replytext, replydate } = req.body;
    try {
        const query = "UPDATE all_notifications SET replied = true, replytext = $1, replydate = $2 WHERE notification_id = $3 RETURNING *";
        const result = await poolforCommon.query(query, [replytext, replydate, notification_id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Notification not found" });
        } else {
            res.status(200).json(result.rows[0]);
        }
    } catch (error) {
        res.status(500).json(error);
    }
}
const readMany = async (req, res) => {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ error: 'ids data must be a non-empty array' });
    }
    try {
        const query = `UPDATE all_notifications SET is_read = true WHERE notification_id = ANY($1::text[]) RETURNING *`;
        const result = await poolforCommon.query(query, [ids]);
        if (result.rows.length === 0) {
            return res.status(200).json({ message: "No unread notifications found" });
        } else {
            res.status(200).json({ message: "Notifications marked as read" });
        }
    } catch (error) {
        res.status(500).json(error);
    }
}

const deleteNotification = async (req, res) => {
    const { ids } = req.body;

    if (!ids || (Array.isArray(ids) && ids.length === 0)) {
        return res.status(400).json({ error: 'ids must be a non-empty array or a single value' });
    }

    try {
        const query = Array.isArray(ids)
            ? `DELETE FROM all_notifications WHERE notification_id = ANY($1::text[]) RETURNING *`
            : `DELETE FROM all_notifications WHERE notification_id = $1 RETURNING *`;

        const values = Array.isArray(ids) ? [ids] : [ids];
        const result = await poolforCommon.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "No notifications found to delete" });
        } else {
            res.status(200).json({ message: "Notifications deleted successfully", deleted: result.rows });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    insertNotification,
    insertManyNotification,
    getNotificationsForUser,
    readNotification,
    sendReplyTo,
    readMany,
    deleteNotification,
}