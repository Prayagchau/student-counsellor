import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import routes from './routes';
import { errorHandler, notFoundHandler } from './middlewares';

// Load environment variables
dotenv.config();

/**
 * Create Express Application
 */
const createApp = (): Application => {
  const app = express();

  // ========================================
  // SECURITY MIDDLEWARE
  // ========================================

  // Helmet - Secure HTTP headers
  app.use(helmet());

  // CORS - Cross-Origin Resource Sharing
  app.use(
    cors({
      origin: process.env.FRONTEND_URL || 'http://localhost:5173',
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  // Rate Limiting - Prevent brute force attacks
  const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'), // 100 requests per window
    message: {
      success: false,
      message: 'Too many requests. Please try again later.',
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use(limiter);

  // ========================================
  // BODY PARSING MIDDLEWARE
  // ========================================

  app.use(express.json({ limit: '10kb' })); // Limit body size
  app.use(express.urlencoded({ extended: true, limit: '10kb' }));

  // ========================================
  // LOGGING MIDDLEWARE
  // ========================================

  if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  } else {
    app.use(morgan('combined'));
  }

  // ========================================
  // API ROUTES
  // ========================================

  app.use('/api', routes);

  // ========================================
  // ERROR HANDLING
  // ========================================

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};

export default createApp;
