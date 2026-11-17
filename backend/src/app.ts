import express, { type Express } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { env } from './config/env.js';
import { authenticateToken } from './middleware/authMiddleware.js';
import { errorHandler } from './middleware/errorMiddleware.js';

const app: Express = express();

app.use(helmet());

// Rate limiting — applied globally. Tune windowMs / limit per route as needed.
// In production behind API Gateway or a load balancer, set `trustProxy: true` and
// configure a shared store (e.g. Redis) so limits are enforced across Lambda instances.
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

      const allowedOrigins = env.CORS_ORIGIN.split(',').map((o) => o.trim());
      const isAllowed = allowedOrigins.some((allowed) => {
        if (allowed === origin) return true;
        if (allowed.includes('*.')) {
          try {
            const allowedUrl = new URL(allowed.replace('*.', 'subdomain-placeholder.'));
            const originUrl = new URL(origin);

            if (allowedUrl.protocol !== originUrl.protocol) return false;
            if (allowedUrl.port !== originUrl.port) return false;

            const domainSuffix = allowedUrl.hostname.replace('subdomain-placeholder.', '.');
            return originUrl.hostname.endsWith(domainSuffix) || originUrl.hostname === domainSuffix.slice(1);
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
