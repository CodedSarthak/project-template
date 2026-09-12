import * as cdk from 'aws-cdk-lib';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';

export interface FrontendStackConfig {
  priceClass?: cloudfront.PriceClass;

  removalPolicy?: cdk.RemovalPolicy;

  /**
   * Whether to automatically delete all objects
   * when the S3 bucket is destroyed.
   *
   * Recommended:
   * - false for production
   * - true for temporary/dev environments
   */
  autoDeleteObjects?: boolean;
}
