import express, { type Express } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { env } from './config/env.js';
import { authenticateToken } from './middleware/authMiddleware.js';
import { errorHandler } from './middleware/errorMiddleware.js';

const app: Express = express();

app.use(helmet());

const allowedOrigins = env.CORS_ORIGIN.split(',').map((origin) => origin.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, server-to-server, curl)
      if (!origin) return callback(null, true);

      // In local development, allow all origins or subdomain patterns
      if (!env.isProduction) {
        return callback(null, true);
      }

      // Check explicit CORS_ORIGIN list from environment
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Example protected endpoint demonstrating authenticateToken middleware
app.get('/api/example/protected', authenticateToken, (req, res) => {
  res.json({
    success: true,
    message: 'Access granted to protected business resource',
    user: req.user,
  });
});

// Mount application business routes here

app.use(errorHandler);

export default app;
