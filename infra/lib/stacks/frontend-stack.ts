import * as path from 'node:path';

import * as cdk from 'aws-cdk-lib';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import { Construct } from 'constructs';

import type { FrontendStackConfig } from '../config/frontend.js';

export class FrontendStack extends cdk.Stack {
  constructor(
    scope: Construct,
    id: string,
    config: FrontendStackConfig = {},
    props?: cdk.StackProps,
  ) {
    super(scope, id, props);

    const frontendBucket = new s3.Bucket(this, 'FrontendBucket', {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,

      encryption: s3.BucketEncryption.S3_MANAGED,

      enforceSSL: true,

      versioned: true,

      removalPolicy: config.removalPolicy ?? cdk.RemovalPolicy.RETAIN,

      autoDeleteObjects: config.autoDeleteObjects ?? false,
    });

    const bucket = frontendBucket as s3.IBucket;

    const distribution = new cloudfront.Distribution(this, 'FrontendDistribution', {
      defaultRootObject: 'index.html',

      // React SPA routing
      errorResponses: [
        {
          httpStatus: 403,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
          ttl: cdk.Duration.seconds(0),
        },
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
          ttl: cdk.Duration.seconds(0),
        },
      ],

      defaultBehavior: {
        origin: origins.S3BucketOrigin.withOriginAccessControl(bucket),

        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,

        // index.html should not be aggressively cached
        cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
      },

      // Vite generates hashed assets
      additionalBehaviors: {
        'assets/*': {
          origin: origins.S3BucketOrigin.withOriginAccessControl(bucket),

          viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,

          cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
        },
      },

      minimumProtocolVersion: cloudfront.SecurityPolicyProtocol.TLS_V1_2_2021,

      priceClass: config.priceClass ?? cloudfront.PriceClass.PRICE_CLASS_100,

      enableLogging: false,
    });

    new s3deploy.BucketDeployment(this, 'FrontendDeployment', {
      sources: [s3deploy.Source.asset(path.join(__dirname, '../../../frontend/dist'))],

      destinationBucket: bucket,
      distribution,

      distributionPaths: ['/*'],
    });

    // ----------------------------------------
    // Outputs
    // ----------------------------------------

    new cdk.CfnOutput(this, 'FrontendBucketName', {
      value: bucket.bucketName,
      description: 'S3 bucket containing the frontend build',
    });

    new cdk.CfnOutput(this, 'FrontendCloudFrontDistributionId', {
      value: distribution.distributionId,
      description: 'CloudFront distribution ID',
    });

    new cdk.CfnOutput(this, 'FrontendUrl', {
      value: `https://${distribution.domainName}`,
      description: 'CloudFront URL',
    });
  }
}
