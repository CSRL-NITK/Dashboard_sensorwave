const { poolforCommon } = require("../config/database");

const getAllVendors = async (req, res) => {
    try {
        const query = 'SELECT * FROM all_vendors';
        const result = await poolforCommon.query(query);
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json(error);
    }
}

async function insertVendor(vendor_data) {
    const {
        vendor_id,
        admin_id,
        vendor_name,
        vendor_email,
        vendor_phone,
        contact_person,
        address,
        city,
        state,
        zip_code,
        country,
        gstin,
        website,
        notes,
        products_count
    } = vendor_data;
    const values = [
        vendor_id,
        admin_id,
        vendor_name,
        vendor_email,
        vendor_phone,
        contact_person,
        address,
        city,
        state,
        zip_code,
        country,
        gstin,
        website,
        notes,
        products_count
    ];
    const query = `INSERT INTO all_vendors (vendor_id, admin_id, vendor_name, vendor_email, vendor_phone, contact_person, address, city, state, zip_code, country, gstin, website, notes, products_count) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING *`;
    try {
        const result = await poolforCommon.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.error('Error inserting vendor:', error);
        throw error;
    }
}
async function deleteVendorFromDatabase(vendor_id) {
    const query = 'DELETE FROM all_vendors WHERE vendor_id = $1';
    try {
        const result = await poolforCommon.query(query, [vendor_id]);
        return result.rows[0];
    } catch (error) {
        console.error('Error deleting vendor:', error);
        throw error;
    }
}

const insertProductsOfVendor = async (vendor_id, products) => {
    if (!vendor_id || !Array.isArray(products) || products.length === 0) {
        throw new Error('Vendor ID and products array are required.');
    }

    const values = [];
    const placeholders = [];

    for (let i = 0; i < products.length; i++) {
        const product = products[i];
        const { name, category, price } = product;

        // Add to values array
        values.push(vendor_id, name, category, price);

        // Build placeholders group for this row
        const idx = i * 4;
        placeholders.push(`($${idx + 1}, $${idx + 2}, $${idx + 3}, $${idx + 4})`);
    }

    const query = `
        INSERT INTO vendor_products (vendor_id, name, category, price)
        VALUES ${placeholders.join(', ')}
    `;

    try {
        const result = await poolforCommon.query(query, values);
        return { message: 'All products inserted successfully.', rowCount: result.rowCount };
    } catch (error) {
        console.error('Error inserting vendor products:', error);
        throw error;
    }
};
const getInfoVendor = async (req, res) => {
    const vendor_id = req.auth.payload?.sub;
    try {
        const result = await poolforCommon.query("SELECT * FROM all_vendors WHERE vendor_id = $1", [vendor_id]);
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json(error);
    }
}
const getParticularVendor = async (req, res) => {
    const { vendor_id } = req.body;
    try {
        const query = `SELECT v.*, 
                       COALESCE(json_agg(row_to_json(vp)) FILTER (WHERE vp.product_id IS NOT NULL), '[]') AS products 
                       FROM all_vendors v
                       LEFT JOIN vendor_products vp ON v.vendor_id = vp.vendor_id
                       WHERE v.vendor_id = $1
                       GROUP BY v.vendor_id`;
        const result = await poolforCommon.query(query, [vendor_id]);
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json(error);
    }
}

const updateVendor = async (req, res) => {
    const {
        vendor_id,
        admin_id,
        vendor_name,
        vendor_email,
        vendor_phone,
        contact_person,
        address,
        city,
        state,
        zip_code,
        country,
        gstin,
        website,
        notes,
        products_count,
        products
    } = req.body;
    const values = [
        vendor_id,
        admin_id,
        vendor_name,
        vendor_email,
        vendor_phone,
        contact_person,
        address,
        city,
        state,
        zip_code,
        country,
        gstin,
        website,
        notes,
        products_count
    ];
    const query = `UPDATE all_vendors 
                   SET admin_id = $2, vendor_name = $3, vendor_email = $4, vendor_phone = $5, contact_person = $6, address = $7, city = $8, state = $9, zip_code = $10, country = $11, gstin = $12, website = $13, notes = $14, products_count = $15 
                   WHERE vendor_id = $1`;

    const values1 = [];
    const placeholders = [];

    for (let i = 0; i < products.length; i++) {
        const product = products[i];
        const { name, category, price } = product;

        values.push(vendor_id, name, category, price);

        const idx = i * 4;
        placeholders.push(`($${idx + 1}, $${idx + 2}, $${idx + 3}, $${idx + 4})`);
    }

    const query1 = `
                    INSERT INTO vendor_products (vendor_id, name, category, price)
                    VALUES ${placeholders.join(', ')}
                `;
    try {
        const result = await poolforCommon.query(query, values);
        const result1 = await poolforCommon.query(query1, values1);
        res.status(200).json({message: "Successfull edit"});
    } catch (error) {
        console.error('Error editing vendor:', error);
        res.status(500).json(error);
    }
}
module.exports = {
    getAllVendors,
    insertVendor,
    deleteVendorFromDatabase,
    insertProductsOfVendor,
    getInfoVendor,
    getParticularVendor,
    updateVendor,
};