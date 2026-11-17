import serverless from 'serverless-http';
import app from './app.js';
import { initSecrets } from './config/secrets.js';

const serverlessHandler = serverless(app);

export const handler = async (event: unknown, context: unknown) => {
  // Ensure secrets from AWS Secrets Manager are loaded into process.env on cold start
  await initSecrets();
  return serverlessHandler(event as any, context as any);
};

export default handler;
