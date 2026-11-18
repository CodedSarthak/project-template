import app from './app.js';
import { env } from './config/env.js';
import { initSecrets } from './config/secrets.js';

// Initialize secrets from AWS Secrets Manager if configured in production
await initSecrets();

app.listen(env.PORT, () => {
  console.log(`Server running on http://localhost:${env.PORT}`);
});
