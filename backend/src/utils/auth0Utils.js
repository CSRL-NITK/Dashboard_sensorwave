const nodemailer = require("nodemailer");
const axios = require('axios');

let tokenCache = null;

async function getManagementToken() {
    if (tokenCache) return tokenCache;

    const options = {
        method: 'POST',
        url: `https://${process.env.AUTH0_DOMAIN}/oauth/token`,
        headers: { 'content-type': 'application/json' },
        data: {
            client_id: process.env.AUTH0_CLIENT_ID,
            client_secret: process.env.AUTH0_CLIENT_SECRET,
            audience: process.env.AUTH0_MGMT_AUDIENCE,
            grant_type: 'client_credentials'
        }
    };

    const response = await axios.request(options);
    tokenCache = response.data.access_token;

    setTimeout(() => (tokenCache = null), 10 * 60 * 1000);

    return tokenCache;
}


module.exports = { getManagementToken };
