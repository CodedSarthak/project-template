import express, { type Express } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { env } from './config/env.js';
import { errorHandler } from './middleware/errorMiddleware.js';

const app: Express = express();

app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, server-to-server, curl)
      if (!origin) return callback(null, true);

      // In local development, allow all origins
      if (!env.isProduction) {
        return callback(null, true);
      }

      // Check explicit CORS_ORIGIN from environment
      if (origin === env.CORS_ORIGIN) {
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

// Add Routes Here

app.use(errorHandler);

export default app;
