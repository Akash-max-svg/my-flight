import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

// Load environment variables
dotenv.config();

// Import routes
import authRoutes from './routes/auth.routes.js'; // User authentication (legacy)
import userAuthRoutes from './routes/user-auth.routes.js'; // User authentication (new)
import userRoutes from './routes/user.routes.js';
import flightRoutes from './routes/flight.routes.js';
import bookingRoutes from './routes/booking.routes.js';
import flightsApiRoutes from './routes/flights-api.routes.js';
import oauthRoutes from './routes/oauth.routes.js';
import oauthDevRoutes from './routes/oauth-dev.routes.js';
import quickLoginRoutes from './routes/quick-login.routes.js';
import adminRoutes from './routes/admin.routes.js'; // Admin data management
import adminAuthRoutes from './routes/admin-auth.routes.js'; // Admin authentication
import passwordResetRoutes from './routes/password-reset.routes.js';
import userSessionRoutes from './routes/user-session.routes.js';
import csvMealsRoutes from './routes/csv-meals.routes.js'; // CSV meals data
import passport from './config/passport.config.js';
import session from 'express-session';

// Initialize Express app
const app = express();

// Security middleware
app.use(helmet());

// CORS configuration - Allow ports 5173, 5174, and 5175
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-admin-password', 'x-admin-session', 'x-session-token'],
  exposedHeaders: ['x-admin-password', 'x-admin-session', 'x-session-token']
}));

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Session middleware for OAuth
app.use(session({
  secret: process.env.SESSION_SECRET || 'flight-booking-session-secret-2026',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Compression middleware
app.use(compression());

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW) * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS),
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Flight Booking API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// API Routes
// User Authentication Routes
app.use('/api/auth', authRoutes); // User login/register (legacy)
app.use('/api/user-auth', userAuthRoutes); // User login/register (new dedicated endpoint)
app.use('/api/auth', quickLoginRoutes); // Quick login route
app.use('/api/user-session', userSessionRoutes); // User session management

// Admin Authentication Routes (Separate from user auth)
app.use('/api/admin-auth', adminAuthRoutes); // Admin login/logout/session
app.use('/api/admin', adminRoutes); // Admin data management (users, bookings, stats)

// OAuth routes - use dev mode if enabled
if (process.env.OAUTH_DEV_MODE === 'true') {
  console.log('🔧 OAuth Development Mode: ENABLED');
  console.log('   Using simulated OAuth (no real credentials needed)');
  app.use('/api/auth', oauthDevRoutes); // Development OAuth routes
} else {
  console.log('🔐 OAuth Production Mode: ENABLED');
  console.log('   Using real OAuth providers');
  app.use('/api/auth', oauthRoutes); // Production OAuth routes
}

app.use('/api/users', userRoutes);
app.use('/api/flights', flightRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/flights-api', flightsApiRoutes);
app.use('/api/password-reset', passwordResetRoutes); // Password reset routes
app.use('/api/csv-meals', csvMealsRoutes); // CSV meals data

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Route ${req.originalUrl} not found`
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  res.status(statusCode).json({
    status: 'error',
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// MongoDB connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

// Start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Connect to database
    await connectDB();
    
    // Start listening
    app.listen(PORT, () => {
      console.log('');
      console.log('🚀 ========================================');
      console.log(`✈️  Flight Booking API Server`);
      console.log(`🌐 Environment: ${process.env.NODE_ENV}`);
      console.log(`🔗 Server: http://localhost:${PORT}`);
      console.log(`💚 Health: http://localhost:${PORT}/health`);
      console.log(`📡 API Base: http://localhost:${PORT}/api`);
      console.log('🚀 ========================================');
      console.log('');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

// Start the server
startServer();

export default app;
