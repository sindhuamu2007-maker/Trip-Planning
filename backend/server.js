const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const axios = require('axios');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);

// Socket.io configuration
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  }
});

// Connect to Database
connectDB();

// Security Middlewares
app.use(helmet({
  crossOriginResourcePolicy: false,
}));
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // Limit each IP to 500 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes'
  }
});
app.use('/api', limiter);

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Make io accessible in request objects
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Root & Health check endpoints
app.get('/', (req, res) => {
  res.json({
    name: 'TripSync AI API Gateway',
    version: '1.0.0',
    status: 'online',
    tagline: 'Plan Together. Travel Smarter. Explore Better.'
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'tripsync-backend',
    timestamp: new Date().toISOString()
  });
});

// Microservice Communication Health Check
app.get('/api/health', async (req, res) => {
  const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://127.0.0.1:8000';
  let aiStatus = 'unreachable';
  let aiData = null;

  try {
    const aiResponse = await axios.get(`${aiServiceUrl}/health`, { timeout: 3000 });
    aiStatus = aiResponse.data.status || 'healthy';
    aiData = aiResponse.data;
  } catch (err) {
    aiStatus = 'offline / connecting (' + err.message + ')';
  }

  const mongoose = require('mongoose');
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';

  res.json({
    status: 'healthy',
    backend: 'online',
    database: dbStatus,
    aiService: {
      url: aiServiceUrl,
      status: aiStatus,
      details: aiData
    },
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Modular API Routes
const authRoutes = require('./routes/auth.routes');
const tripRoutes = require('./routes/trip.routes');
const aiRoutes = require('./routes/ai.routes');
const hotelRoutes = require('./routes/hotel.routes');

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/trips', tripRoutes);
app.use('/api/v1/ai', aiRoutes);
app.use('/api/v1/hotels', hotelRoutes);

// Socket.io Real-Time Collaboration Setup
io.on('connection', (socket) => {
  console.log(`[Socket] Client connected: ${socket.id}`);

  // Join trip collaboration room
  socket.on('join-trip', ({ tripId, user }) => {
    socket.join(`trip:${tripId}`);
    console.log(`[Socket] User ${user?.name || socket.id} joined trip:${tripId}`);
    
    // Broadcast user presence
    socket.to(`trip:${tripId}`).emit('user-joined', {
      socketId: socket.id,
      user,
      joinedAt: new Date().toISOString()
    });
  });

  // Leave trip collaboration room
  socket.on('leave-trip', ({ tripId, user }) => {
    socket.leave(`trip:${tripId}`);
    console.log(`[Socket] User ${user?.name || socket.id} left trip:${tripId}`);
    
    socket.to(`trip:${tripId}`).emit('user-left', {
      socketId: socket.id,
      user,
      leftAt: new Date().toISOString()
    });
  });

  // Typing indicator
  socket.on('typing', ({ tripId, user, isTyping }) => {
    socket.to(`trip:${tripId}`).emit('user-typing', {
      user,
      isTyping
    });
  });

  // Real-time chat message relay
  socket.on('send-message', ({ tripId, message }) => {
    io.in(`trip:${tripId}`).emit('new-message', message);
  });

  // Real-time activity sync relay
  socket.on('activity-change', ({ tripId, changeType, activity, version }) => {
    socket.to(`trip:${tripId}`).emit('activity-updated', {
      changeType,
      activity,
      version,
      updatedAt: new Date().toISOString()
    });
  });

  // Real-time vote update relay
  socket.on('vote-cast', ({ tripId, voteData }) => {
    io.in(`trip:${tripId}`).emit('vote-updated', voteData);
  });

  socket.on('disconnect', () => {
    console.log(`[Socket] Client disconnected: ${socket.id}`);
  });
});

// Global 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Resource not found - ${req.originalUrl}`
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('[Backend Error]', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
});

const PORT = process.env.PORT || 5000;

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`[Server Error] Port ${PORT} is already in use by another node process.`);
    console.warn(`[Server Solution] An old instance was still open. Kill it or close background terminals.`);
    process.exit(1);
  } else {
    console.error('[Server Error]', err);
  }
});

process.on('SIGTERM', () => {
  server.close(() => {
    console.log('[Server] Gracefully closed on SIGTERM');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  server.close(() => {
    console.log('[Server] Gracefully closed on SIGINT');
    process.exit(0);
  });
});

server.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(` TripSync AI Backend Service running on port ${PORT}`);
  console.log(` Health check: http://localhost:${PORT}/api/health`);
  console.log(` Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`====================================================`);
});

module.exports = { app, server, io };
