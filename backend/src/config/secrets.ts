import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from '@aws-sdk/client-secrets-manager';

let initPromise: Promise<void> | null = null;

/**
 * Loads secrets from AWS Secrets Manager and injects them into process.env.
 *
 * This allows adding/updating arbitrary environment variables directly in the
 * AWS Secrets Manager console, and making them immediately available to the
 * Lambda function as `process.env[KEY]`.
 *
 * Results are cached in memory so this only executes once per Lambda cold start.
 */
export async function initSecrets(): Promise<void> {
  if (initPromise) {
    return initPromise;
  }

  initPromise = (async () => {
    const secretId = process.env.SECRET_NAME || process.env.SECRET_ARN;

    // In local development or if no secret ID is configured, skip AWS Secrets Manager
    if (!secretId || process.env.NODE_ENV === 'development') {
      return;
    }

    try {
      const region = process.env.AWS_REGION || process.env.CDK_DEFAULT_REGION || 'us-east-1';
      const client = new SecretsManagerClient({ region });
      const command = new GetSecretValueCommand({ SecretId: secretId });
      const response = await client.send(command);

      if (response.SecretString) {
        const secrets = JSON.parse(response.SecretString);

        for (const [key, value] of Object.entries(secrets)) {
          // If the key is 'dummy' (used by CDK during initial secret creation), skip it
          if (key === 'dummy') continue;

          if (typeof value === 'string') {
            process.env[key] = value;
          } else if (value !== null && value !== undefined) {
            process.env[key] = JSON.stringify(value);
          }
        }
      }
    } catch (err) {
      console.error('[SecretsManager] Failed to load secrets from AWS Secrets Manager:', err);
      // Re-throw in production so the Lambda invocation fails fast with a clear error
      // rather than continuing with missing secrets and producing confusing downstream failures.
      if (process.env.NODE_ENV !== 'development') {
        throw err;
      }
    }
  })();

  return initPromise;
}
