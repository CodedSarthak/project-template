import express, { type Express } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { env } from './config/env.js';
import { authenticateToken } from './middleware/authMiddleware.js';
import { errorHandler } from './middleware/errorMiddleware.js';
import { NotFoundException } from './errors/index.js';

const app: Express = express();

if (env.isProduction) {
  app.set('trust proxy', 1);
}

app.use(helmet());

// Rate limiting — applied globally. Tune windowMs / limit per route as needed.
const globalRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 300,                // max 300 requests per window per IP
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    success: false,
    code: 'TOO_MANY_REQUESTS',
    message: 'Too many requests, please try again later.',
  },
  skip: () => !env.isProduction, // disabled in development for convenience
});

app.use(globalRateLimit);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      if (!env.isProduction) {
        return callback(null, true);
      }

      const allowedOrigins = env.CORS_ORIGIN.split(',').map((o) => o.trim()).filter(Boolean);
      const isAllowed = allowedOrigins.some((allowed) => {
        if (allowed === origin) return true;

        // Secure wildcard matching, e.g. "https://*.myapp.com" or "http://*.myapp.test:5173"
        if (allowed.includes('://*.')) {
          const [protocol, rest] = allowed.split('://*.');
          if (protocol && rest) {
            // Escape dots and special regex characters in the domain/port
            const escapedRest = rest.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            // Matches apex domain (e.g. https://myapp.com) or any subdomain (e.g. https://app.myapp.com)
            const regex = new RegExp(`^${protocol}:\\/\\/([a-zA-Z0-9-]+\\.)*${escapedRest}$`, 'i');
            return regex.test(origin);
          }
        }

        return false;
      });

      if (isAllowed) {
        return callback(null, true);
      }

      // Reject origin cleanly by omitting Access-Control-Allow-Origin header (prevents 500 errors)
      callback(null, false);
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: true, limit: '100kb' }));
app.use(cookieParser());

app.get('/api/example/protected', authenticateToken, (req, res) => {
  res.json({
    success: true,
    message: 'Access granted to protected business resource',
    user: req.user,
  });
});

// Mount application business routes here

// Catch-all 404 handler for unregistered routes (returns structured JSON ApiErrorResponse)
app.use((req, _res, next) => {
  next(new NotFoundException(`Route ${req.method} ${req.originalUrl} not found`));
});

app.use(errorHandler);

export default app;
