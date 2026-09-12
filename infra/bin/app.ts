import * as cdk from 'aws-cdk-lib';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';

import { FrontendStack } from '../lib/stacks/frontend-stack.js';
import { BackendStack } from '../lib/stacks/backend-stack.js';

const app = new cdk.App();

const env: cdk.Environment = {
  account: process.env.CDK_DEFAULT_ACCOUNT ?? '123456',
  region: process.env.CDK_DEFAULT_REGION ?? 'ap-south-1',
};

new FrontendStack(
  app,
  'FrontendStack',
  {
    priceClass: cloudfront.PriceClass.PRICE_CLASS_100,

    removalPolicy: cdk.RemovalPolicy.RETAIN,

    autoDeleteObjects: false,
  },
  {
    env,
  },
);

new BackendStack(
  app,
  'BackendStack',
  {
    apiName: 'projectName-api',

    lambda: {
      memorySize: 512,
      timeoutSeconds: 30,

      environment: { // Add any additional environment variables here
        NODE_ENV: 'production',
      },
    },

    secrets: [ // Add SecretsManager secrets here
      {
        secretName: 'projectName/database',

        environmentKeys: {
          DATABASE_URL: 'DATABASE_URL',
          DIRECT_URL: 'DIRECT_URL',
        },
      },
    ],
  },
  {
    env,
  },
);