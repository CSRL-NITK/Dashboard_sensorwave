const { Pool } = require('pg');
require('dotenv').config();

const poolforGrafana = new Pool({
  host: process.env.DB_HOST_LAB,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD_LAB,
  database: process.env.DB_NAME_GRAFANA,
  port: process.env.DB_PORT,
});

const poolforCommon = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME_COMMON,
  port: process.env.DB_PORT,
});

module.exports = { poolforGrafana, poolforCommon };
