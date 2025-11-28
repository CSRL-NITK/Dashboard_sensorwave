const axios = require('axios');
const { getManagementToken } = require('../utils/auth0Utils');
const { insertCustomer, deleteCustomer } = require('./customerController');
const { insertVendor, insertProductsOfVendor, deleteVendorFromDatabase } = require('./vendorController');


async function assignRoleToUser(userId, roleId) {
    const token = await getManagementToken();

    await axios.post(`https://${process.env.AUTH0_DOMAIN}/api/v2/users/${userId}/roles`, {
        roles: [roleId]
    }, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}

const createUser = async (req, res) => {
    try {
        const token = await getManagementToken();
        const { customer_email, customer_name, password, vendor_name, customer_phone, expiry_plan_date, payment_status, plan_purchased, no_of_devices, vendor_id } = req.body;

        const result = await axios.post(
            `https://${process.env.AUTH0_DOMAIN}/api/v2/users`,
            {
                email: customer_email,
                password,
                name: customer_name,
                connection: 'Username-Password-Authentication',
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        await assignRoleToUser(result.data.user_id, process.env.AUTH0_ROLE_ID);
        await axios.patch(
            `https://${process.env.AUTH0_DOMAIN}/api/v2/users/${encodeURIComponent(result.data.user_id)}`,
            { app_metadata: { needsResetPassword: true } },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        const cust_data = {
            customer_id: result.data.user_id,
            customer_name: customer_name,
            customer_email: customer_email,
            customers_phone: customer_phone,
            no_of_devices: no_of_devices,
            reg_date: result.data.created_at,
            vendor_id: vendor_id,
            vendor_name: vendor_name,
            plan_purchased: plan_purchased,
            payment_status: payment_status,
            expiry_plan_date: expiry_plan_date,
        }
        await insertCustomer(cust_data);
        res.status(200).json(result.data);
    } catch (error) {
        console.error('User creation error:', error.response?.data || error.message);
        res.status(500).json({ error: 'User creation failed' });
    }
};

const deleteUser = async (req, res) => {
    try {
        const token = await getManagementToken();
        const { ids } = req.body;

        // 1. Delete from Auth0
        ids.map(async user_id => {
            await axios.delete(
                `https://${process.env.AUTH0_DOMAIN}/api/v2/users/${encodeURIComponent(user_id)}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            // 2. Delete from your database
            await deleteCustomer(user_id);
        })

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('User deletion error:', error.response?.data || error.message);
        res.status(500).json({ error: 'User deletion failed' });
    }
};

const createVendor = async (req, res) => {
    try {
        const token = await getManagementToken();
        const { vendor_email, vendor_name, password, vendor_phone, contact_person, address, city, country, zip_code, state, gstin, website, notes, products_count } = req.body;

        const result = await axios.post(
            `https://${process.env.AUTH0_DOMAIN}/api/v2/users`,
            {
                email: vendor_email,
                password,
                name: vendor_name,
                connection: 'Username-Password-Authentication',
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        await assignRoleToUser(result.data.user_id, process.env.AUTH0_VENDOR_ROLE_ID);
        await axios.patch(
            `https://${process.env.AUTH0_DOMAIN}/api/v2/users/${encodeURIComponent(result.data.user_id)}`,
            { app_metadata: { needsResetPassword: true } },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        const vendor_data = {
            vendor_id: result.data.user_id,
            admin_id: req.auth.payload.sub,
            vendor_name: vendor_name,
            vendor_email: vendor_email,
            vendor_phone: vendor_phone,
            contact_person: contact_person,
            address: address,
            city: city,
            state: state,
            zip_code: zip_code,
            country: country,
            gstin: gstin,
            website: website,
            notes: notes,
            products_count: products_count,
        };
        await insertVendor(vendor_data);
        await insertProductsOfVendor(result.data.user_id, req.body.products);
        res.status(201).json(result.data);
    } catch (error) {
        console.error('Vendor creation error:', error.response?.data || error.message);
        res.status(500).json({ error: 'Vendor creation failed' });
    }
}
const deleteVendor = async (req, res) => {
    try {
        const token = await getManagementToken();
        const { vendor_id } = req.params;

        // 1. Delete from Auth0
        await axios.delete(
            `https://${process.env.AUTH0_DOMAIN}/api/v2/users/${encodeURIComponent(vendor_id)}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        // 2. Delete from your database
        await deleteVendorFromDatabase(vendor_id);

        res.status(200).json({ message: 'Vendor deleted successfully' });
    } catch (error) {
        console.error('Vendor deletion error:', error.response?.data || error.message);
        res.status(500).json({ error: 'Vendor deletion failed' });
    }
};

async function updateAppMetadata(userId) {
    const token = await getManagementToken();
    try {
        const result = await axios.patch(
            `https://${process.env.AUTH0_DOMAIN}/api/v2/users/${encodeURIComponent(userId)}`,
            {
                app_metadata: {
                    needsResetPassword: false
                }
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        )
        return true;
    } catch (error) {
        console.error("Failed to update metadata")
        return false;
    }

}

const resetPassword = async (req, res) => {
    if (req.need) {
        return res.status(404).json({ error: "error", message: "Forbidden to reset" });
    }
    const token = await getManagementToken();
    const { newPassword } = req.body;
    const userId = req.auth.payload.sub
    console.log(req.body);
    try {
        const result = await axios.patch(
            `https://${process.env.AUTH0_DOMAIN}/api/v2/users/${encodeURIComponent(userId)}`,
            {
                password: newPassword
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        const success = await updateAppMetadata(req.auth.payload.sub);
        if (success) {
            res.status(200).json(result.data);
        } else {
            res.status(501).json({ message: "Something went Wrong" });
        }

    } catch (error) {
        res.status(500).json({ message: error.response?.data || error.message });
    }
}

module.exports = {
    createUser,
    deleteUser,
    createVendor,
    deleteVendor,
    resetPassword,
};