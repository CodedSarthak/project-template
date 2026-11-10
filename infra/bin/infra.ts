import 'dotenv/config';
import * as cdk from 'aws-cdk-lib';
import { BackendStack } from '../lib/backend-stack.js';
import { FrontendStack } from '../lib/frontend-stack.js';

const app = new cdk.App();

const environmentName =
    app.node.tryGetContext('env') || process.env.NODE_ENV || 'production';

const stackEnv: cdk.Environment = {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION || process.env.AWS_REGION || 'us-east-1',
};

const backendStack = new BackendStack(app, `project-template-Backend-${environmentName}`, {
    environmentName,
    env: stackEnv,
    description: `Backend Infrastructure for project-templates (${environmentName}): Lambda, API Gateway, S3 Storage, Secrets Manager`,
});

const frontendStack = new FrontendStack(app, `project-templates-Frontend-${environmentName}`, {
    environmentName,
    apiGateway: backendStack.apiGateway,
    env: stackEnv,
    description: `Frontend Infrastructure for project-templates (${environmentName}): S3 SPA Bucket, CloudFront CDN`,
});

frontendStack.node.addDependency(backendStack);

app.synth();