import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as cdk from 'aws-cdk-lib';
import {
  aws_s3 as s3,
  aws_lambda as lambda,
  aws_apigateway as apigateway,
  aws_secretsmanager as secretsmanager,
} from 'aws-cdk-lib';
import { NodejsFunction, OutputFormat } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface BackendStackProps extends cdk.StackProps {
  environmentName?: string;
  corsOrigin?: string;
}

export class BackendStack extends cdk.Stack {
  public readonly storageBucket: s3.Bucket;
  public readonly appSecret: secretsmanager.Secret;
  public readonly backendLambda: NodejsFunction;
  public readonly apiGateway: apigateway.LambdaRestApi;

  constructor(scope: Construct, id: string, props?: BackendStackProps) {
    super(scope, id, props);

    const envName = props?.environmentName || process.env.NODE_ENV || 'production';
    const isProd = envName === 'production';
    const corsOrigin = (props?.corsOrigin ?? process.env.CORS_ORIGIN ?? '').trim();
    const corsOrigins = corsOrigin
      .split(',')
      .map((origin) => origin.trim())
      .filter(Boolean);

    this.storageBucket = new s3.Bucket(this, 'StorageBucket', {
      encryption: s3.BucketEncryption.S3_MANAGED,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      enforceSSL: true,
      cors: [
        {
          allowedMethods: [
            s3.HttpMethods.GET,
            s3.HttpMethods.POST,
            s3.HttpMethods.PUT,
            s3.HttpMethods.DELETE,
            s3.HttpMethods.HEAD,
          ],
          allowedOrigins: ['*'],
          allowedHeaders: ['*'],
          exposedHeaders: ['ETag'],
          maxAge: 3000,
        },
      ],
      removalPolicy: isProd ? cdk.RemovalPolicy.RETAIN : cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: !isProd,
    });

    this.appSecret = new secretsmanager.Secret(this, 'AppSecret', {
      secretName: `project-templates/${envName}/app-secrets`,
      description: `Application secrets for Express backend (${envName})`,
      generateSecretString: {
        secretStringTemplate: JSON.stringify({
          DATABASE_URL: 'postgresql://placeholder:placeholder@localhost:5432/mydb',
          JWT_ACCESS_SECRET: 'placeholder_jwt_access_secret_key_minimum_32_characters_long',
        }),
        generateStringKey: 'dummy',
      },
    });

    const entryFile = path.resolve(__dirname, '../../backend/src/handler.ts');

    this.backendLambda = new NodejsFunction(this, 'BackendLambda', {
      entry: entryFile,
      handler: 'handler',
      runtime: lambda.Runtime.NODEJS_22_X,
      memorySize: 1024,
      timeout: cdk.Duration.seconds(30),
      bundling: {
        minify: isProd,
        sourceMap: true,
        format: OutputFormat.ESM,
        mainFields: ['module', 'main'],
        banner: "import { createRequire } from 'module'; const require = createRequire(import.meta.url);",
      },
      environment: {
        NODE_ENV: envName,
        PORT: process.env.PORT || '3000',
        ...(corsOrigin ? { CORS_ORIGIN: corsOrigin } : {}),
        S3_BUCKET: this.storageBucket.bucketName,
        SECRET_NAME: this.appSecret.secretName,
        SECRET_ARN: this.appSecret.secretArn,
        DATABASE_URL: this.appSecret.secretValueFromJson('DATABASE_URL').unsafeUnwrap(),
        JWT_ACCESS_SECRET: this.appSecret.secretValueFromJson('JWT_ACCESS_SECRET').unsafeUnwrap(),
      },
    });

    this.storageBucket.grantReadWrite(this.backendLambda);
    this.appSecret.grantRead(this.backendLambda);

    this.apiGateway = new apigateway.LambdaRestApi(this, 'BackendApi', {
      handler: this.backendLambda,
      proxy: true,
      restApiName: `BackendApi-${envName}`,
      description: `API Gateway proxying requests to Express server on Lambda (${envName})`,
      deployOptions: {
        stageName: 'prod',
        tracingEnabled: true,
      },
      ...(corsOrigins.length === 1
        ? {
            defaultCorsPreflightOptions: {
              allowOrigins: corsOrigins,
              allowMethods: apigateway.Cors.ALL_METHODS,
              allowHeaders: [
                'Content-Type',
                'Authorization',
                'X-Requested-With',
                'Accept',
                'Cookie',
              ],
              allowCredentials: true,
            },
          }
        : {}),
    });

    new cdk.CfnOutput(this, 'ApiGatewayUrl', {
      value: this.apiGateway.url,
      description: 'Direct API Gateway endpoint URL',
      exportName: `${id}-ApiGatewayUrl`,
    });

    new cdk.CfnOutput(this, 'StorageBucketName', {
      value: this.storageBucket.bucketName,
      description: 'S3 bucket for user uploads and media storage',
      exportName: `${id}-StorageBucketName`,
    });

    new cdk.CfnOutput(this, 'BackendLambdaArn', {
      value: this.backendLambda.functionArn,
      description: 'Backend Express Lambda Function ARN',
      exportName: `${id}-BackendLambdaArn`,
    });

    new cdk.CfnOutput(this, 'AppSecretArn', {
      value: this.appSecret.secretArn,
      description: 'AWS Secrets Manager Secret ARN',
      exportName: `${id}-AppSecretArn`,
    });
  }
}
