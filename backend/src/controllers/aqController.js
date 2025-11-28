// const { poolforGrafana, poolforCommon } = require('../config/database');
// const express = require('express');
// const router = express.Router();

// // Log existing tables just once
// async function no_of_tables() {
//   try {
//     const query = `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`;
//     const result = await poolforGrafana.query(query);
//     console.log(result.rows);
//   } catch (error) {
//     console.error(error);
//   }
// }
// no_of_tables();

// // Track connected SSE clients per customer
// const clients = new Map();
// let counter = 0;

// // Shared DB listener (only once)
// (async () => {
//   const client = await poolforGrafana.connect();
//   await client.query('LISTEN sensor_channel');
//   console.log('✅ DB LISTEN on sensor_channel started');

//   client.on('notification', async (msg) => {
//     try {
//       const payload = JSON.parse(msg.payload);
//       console.log(`📋 id = ${payload.id} Table name: ${payload.device_id} and counter = ${counter}`);
//       counter++;

//       const result = await poolforCommon.query(
//         'SELECT customer_id FROM all_devices WHERE device_id = $1',
//         [payload.device_id]
//       );
//       const customerId = result.rows[0]?.customer_id;

//       if (customerId) {
//         const subs = clients.get(customerId);
//         if (subs) {
//           for (const res of subs) {
//             res.write(`data: ${JSON.stringify(payload)}\n\n`);
//           }
//         }
//       }
//     } catch (err) {
//       console.error('❌ Error parsing payload:', err);
//     }
//   });

//   client.on('error', (err) => {
//     console.error('❌ LISTEN client error:', err);
//   });
// })();

// // SSE handler for frontend
// const listenForChanges = async (req, res) => {
//   const customerId = req.query.customer_id; // frontend should pass ?customer_id=xxx

//   res.setHeader('Content-Type', 'text/event-stream');
//   res.setHeader('Cache-Control', 'no-cache');
//   res.setHeader('Connection', 'keep-alive');
//   res.flushHeaders();

//   if (!clients.has(customerId)) {
//     clients.set(customerId, new Set());
//   }
//   clients.get(customerId).add(res);

//   console.log(`👤 Connected: ${customerId}. Total clients for this ID: ${clients.get(customerId).size}`);

//   req.on('close', () => {
//     clients.get(customerId).delete(res);
//     console.log(`❌ Disconnected: ${customerId}. Remaining: ${clients.get(customerId).size}`);
//     if (clients.get(customerId).size === 0) {
//       clients.delete(customerId);
//     }
//   });
// };

// module.exports = {
//   listenForChanges
// };
