import 'dotenv/config';

import app from './app.js';
import { config, isProduction } from './config/env.js';

if (!isProduction) {
  app.listen(config.PORT, () => {
    console.log(`Local server running on http://localhost:${config.PORT}`);
  });
}

export default app;
