const { poolforCommon } = require("../config/database");

const getAllCustomers = async (req, res) => {
    const { vendor_id } = req.params;
    try {
        const query = "SELECT * FROM all_customers WHERE vendor_id = $1";
        const result = await poolforCommon.query(query, [vendor_id]);
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json(error)
    }
}

const getYourVendorIfYouAreCustomer = async (req, res) => {
    const { customer_id } = req.body;
    try {
        const result = await poolforCommon.query("SELECT * FROM all_customers WHERE customer_id = $1", [customer_id]);
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json(error)
    }
}

// {
//     customer_id: '',
//     customer_name: '',
//     customer_email: '',
//     no_of_devices: 0,
//     reg_date: getDate(),
//     vendor_id: user.sub,
//     vendor_name: user.nickname,
//     plan_purchased: '',
//     payment_status: 'Pending',
//     expiry_plan_date: getDate(),
// }

async function insertCustomer(cust_data) {
    const {
        customer_id,
        customer_name,
        customer_email,
        customers_phone,
        no_of_devices,
        reg_date,
        vendor_id,
        vendor_name,
        plan_purchased,
        payment_status,
        expiry_plan_date,
    } = cust_data;
    const values = [
        customer_id,
        customer_name,
        customer_email,
        customers_phone,
        no_of_devices,
        reg_date,
        vendor_id,
        vendor_name,
        plan_purchased,
        payment_status,
        expiry_plan_date
    ];
    try {
        const query = "INSERT INTO all_customers (customer_id, customer_name, customer_email, customer_phone, no_of_devices, reg_date, vendor_id, vendor_name, plan_purchased, payment_status, expiry_plan_date) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *";
        const result = await poolforCommon.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.error("Error inserting customer:", error);
        throw error;
    }
}

async function deleteCustomer(customer_id) {
    try {
        const query = "DELETE FROM all_customers WHERE customer_id = $1 RETURNING *";
        const result = await poolforCommon.query(query, [customer_id]);

        if (result.rowCount === 0) {
            console.warn("No customer found with ID:", customer_id);
            return null;
        }

        return result.rows[0]; // return the deleted customer data (optional)
    } catch (error) {
        console.error("Error deleting customer:", error);
        throw error;
    }
}
const getInfoCustomer = async (req, res) => {
    const customer_id = req.auth.payload?.sub;
    try {
        const result = await poolforCommon.query("SELECT * FROM all_customers WHERE customer_id = $1", [customer_id]);
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json(error);
    }
}

module.exports = {
    getAllCustomers,
    getYourVendorIfYouAreCustomer,
    insertCustomer,
    deleteCustomer,
    getInfoCustomer,
};