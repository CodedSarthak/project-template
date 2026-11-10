import * as cdk from 'aws-cdk-lib';
import {
    aws_s3 as s3,
    aws_apigateway as apigateway,
    aws_cloudfront as cloudfront,
    aws_cloudfront_origins as origins,
} from 'aws-cdk-lib';
import { Construct } from 'constructs';

export interface FrontendStackProps extends cdk.StackProps {
    environmentName?: string;
    apiGateway?: apigateway.RestApi;
}

export class FrontendStack extends cdk.Stack {
    public readonly frontendBucket: s3.Bucket;
    public readonly distribution: cloudfront.Distribution;

    constructor(scope: Construct, id: string, props?: FrontendStackProps) {
        super(scope, id, props);

        const envName = props?.environmentName || process.env.NODE_ENV || 'production';
        const isProd = envName === 'production';

        this.frontendBucket = new s3.Bucket(this, 'FrontendBucket', {
            blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
            encryption: s3.BucketEncryption.S3_MANAGED,
            enforceSSL: true,
            removalPolicy: isProd ? cdk.RemovalPolicy.RETAIN : cdk.RemovalPolicy.DESTROY,
            autoDeleteObjects: !isProd,
        });

        const s3Origin = origins.S3BucketOrigin.withOriginAccessControl(this.frontendBucket);

        this.distribution = new cloudfront.Distribution(this, 'AppDistribution', {
            defaultBehavior: {
                origin: s3Origin,
                viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
                allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD,
                cachedMethods: cloudfront.CachedMethods.CACHE_GET_HEAD,
            },
            defaultRootObject: 'index.html',
            errorResponses: [
                {
                    httpStatus: 403,
                    responseHttpStatus: 200,
                    responsePagePath: '/index.html',
                    ttl: cdk.Duration.minutes(0),
                },
                {
                    httpStatus: 404,
                    responseHttpStatus: 200,
                    responsePagePath: '/index.html',
                    ttl: cdk.Duration.minutes(0),
                },
            ],
        });

        if (props?.apiGateway) {
            this.distribution.addBehavior(
                '/api/*',
                new origins.RestApiOrigin(props.apiGateway),
                {
                    viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
                    allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
                    cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
                    originRequestPolicy:
                        cloudfront.OriginRequestPolicy.ALL_VIEWER_EXCEPT_HOST_HEADER,
                }
            );
        }

        new cdk.CfnOutput(this, 'FrontendBucketName', {
            value: this.frontendBucket.bucketName,
            description: 'S3 bucket for frontend Vite deployment',
            exportName: `${id}-FrontendBucketName`,
        });

        new cdk.CfnOutput(this, 'CloudFrontUrl', {
            value: `https://${this.distribution.distributionDomainName}`,
            description: 'CloudFront Distribution URL (Frontend SPA + /api/* routing)',
            exportName: `${id}-CloudFrontUrl`,
        });
    }
}