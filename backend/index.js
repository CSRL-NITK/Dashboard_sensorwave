const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const { auth } = require('express-oauth2-jwt-bearer');
// Routes
const vendorRoutes = require('./src/routes/vendorRoutes');
const auth0Routes = require('./src/routes/auth0Routes');
const sensorRoutes = require('./src/routes/sensorRoutes');
const notificationRoutes = require('./src/routes/notificationRoutes');
const logRoutes = require('./src/routes/logRoutes');
const customerRoutes = require('./src/routes/customerRoutes');
const devicesRoutes = require('./src/routes/devicesRoutes');
const alertRoutes = require('./src/routes/alertRoutes');
const socketMain = require('./src/sockets/index');
const aqRoutes = require('./src/routes/aqRoutes');
const PORT = process.env.PORT || 8000;
require('dotenv').config();
const app = express();
const server = http.createServer(app);

app.use(helmet());
app.use(express.json());
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true,
}));

const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN,
    methods: ['GET', 'POST'],
  }
});
socketMain(io);


const jwtCheck = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
  tokenSigningAlg: 'RS256',
});

// app.use(jwtCheck);


// app.use('/api/aq', aqRoutes);
app.use('/api/notification', jwtCheck, notificationRoutes);
app.use('/api/logs', jwtCheck, logRoutes);
app.use('/api/customer', jwtCheck, customerRoutes);
app.use('/api/device', jwtCheck, devicesRoutes);
app.use('/api/alert', jwtCheck, alertRoutes);
app.use('/api/sensor', jwtCheck, sensorRoutes);
app.use('/api/auth0', jwtCheck, auth0Routes);
app.use('/api/vendor', jwtCheck, vendorRoutes);


app.get('/authorized', function (req, res) {
  res.send('Secured Resource');
});

app.get('/ping', (req, res) => {
  res.send(req);
});


app.get('/', (req, res) => {
  res.status(200).json({ message: 'all perfect' });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
