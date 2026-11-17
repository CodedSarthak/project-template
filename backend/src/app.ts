import express, { type Express } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { env } from './config/env.js';
import { authenticateToken } from './middleware/authMiddleware.js';
import { errorHandler } from './middleware/errorMiddleware.js';

const app: Express = express();

app.use(helmet());

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      if (!env.isProduction) {
        return callback(null, true);
      }

      const allowedOrigins = env.CORS_ORIGIN.split(',').map((o) => o.trim());
      const isAllowed = allowedOrigins.some((allowed) => {
        if (allowed === origin) return true;
        if (allowed.includes('*.')) {
          const domainSuffix = allowed.replace(/^https?:\/\/\*\./, '.');
          try {
            const originHost = new URL(origin).hostname;
            return originHost.endsWith(domainSuffix) || originHost === domainSuffix.slice(1);
          } catch {
            return false;
          }
        }
        return false;
      });

      if (isAllowed) {
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
