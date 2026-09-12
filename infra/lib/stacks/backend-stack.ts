import * as cdk from 'aws-cdk-lib';
import * as path from 'path';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import { Construct } from 'constructs';

import type { BackendStackConfig } from '../config/backend.js';

export class BackendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, config: BackendStackConfig, props?: cdk.StackProps) {
    super(scope, id, props);

    const environment: Record<string, string> = {
      ...(config.lambda?.environment ?? {}),
    };

    for (const [index, secretConfig] of (config.secrets ?? []).entries()) {
      const secret = secretsmanager.Secret.fromSecretNameV2(
        this,
        `BackendSecret${index}`,
        secretConfig.secretName,
      );

      for (const [environmentKey, secretKey] of Object.entries(secretConfig.environmentKeys)) {
        environment[environmentKey] = secret.secretValueFromJson(secretKey).unsafeUnwrap();
      }
    }

    const backendFunction = new lambda.Function(this, 'BackendFunction', {
      runtime: lambda.Runtime.NODEJS_22_X,

      handler: 'lambda.handler',

      code: lambda.Code.fromAsset(path.join(__dirname, '../../../backend/dist')),

      memorySize: config.lambda?.memorySize ?? 512,

      timeout: cdk.Duration.seconds(config.lambda?.timeoutSeconds ?? 30),

      environment,
    });

    const api = new apigateway.RestApi(this, 'BackendApi', {
      restApiName: config.apiName,

      deployOptions: {
        stageName: 'prod',
      },

      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
      },
    });

    api.root.addProxy({
      defaultIntegration: new apigateway.LambdaIntegration(backendFunction),
      anyMethod: true,
    });

    new cdk.CfnOutput(this, 'BackendApiUrl', {
      value: api.url,
    });
  }
}
