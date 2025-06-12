require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const pollRoutes = require('./routes/pollRoutes');


const app = express();
const server = http.createServer(app);

// backend/server.js
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));


app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

const connectWithRetry = () => {
  mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/realtimepoll', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000
  })
  .then(() => console.log(' MongoDB Connected'))
  .catch(err => {
    console.error(' MongoDB Connection Error:', err.message);
    setTimeout(connectWithRetry, 5000);
  });
};
connectWithRetry();

app.use('/api/polls', pollRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    uptime: process.uptime()
  });
});

const io = socketIo(server, {
  cors: corsOptions,
  pingTimeout: 60000,
  pingInterval: 25000
});
require('./services/socketService')(io);

app.use((err, req, res, next) => {
  console.error(' Server Error:', {
    path: req.path,
    method: req.method,
    error: err.stack || err.message
  });
  
  res.status(err.status || 500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
  console.log(` CORS enabled for: ${corsOptions.origin}`);
});

process.on('unhandledRejection', (err) => {
  console.error(' Unhandled Rejection:', err);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});