import {
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import { s3Client } from '../../config/s3.js';
import { env } from '../../config/env.js';
import { FILE_CONFIG } from './s3Constants.js';
import { generateFileKey } from './s3FileKey.js';
import {
  validateMimeType,
  validateFileSize,
  BadRequestException,
} from './s3ValidMimeTypes.js';

export interface UploadPresignedUrlParams {
  userId: string;
  fileName: string;
  mimeType: string;
  fileSize?: number;
  folder?: string;
}

export interface UploadPresignedUrlResponse {
  uploadUrl: string;
  fileKey: string;
}

export async function getUploadPresignedUrl(
  params: UploadPresignedUrlParams
): Promise<UploadPresignedUrlResponse> {
  const { userId, fileName, mimeType, fileSize, folder = 'uploads' } = params;

  if (!userId || !fileName || !mimeType) {
    throw new BadRequestException('userId, fileName, and mimeType are required');
  }

  validateMimeType(mimeType);

  if (fileSize !== undefined) {
    validateFileSize(mimeType, fileSize);
  }

  const fileKey = generateFileKey(userId, fileName, folder);

  try {
    const command = new PutObjectCommand({
      Bucket: env.S3_BUCKET,
      Key: fileKey,
      ContentType: mimeType,
    });

    const uploadUrl = await getSignedUrl(s3Client, command, {
      expiresIn: FILE_CONFIG.PRESIGNED_UPLOAD_EXPIRY,
    });

    return { uploadUrl, fileKey };
  } catch (error) {
    if (error instanceof BadRequestException) {
      throw error;
    }
    throw new Error(
      `Failed to generate S3 upload URL: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

export async function getDownloadPresignedUrl(
  fileKey: string,
  expiresIn = FILE_CONFIG.PRESIGNED_DOWNLOAD_EXPIRY
): Promise<string> {
  if (!fileKey) {
    throw new BadRequestException('fileKey is required');
  }

  try {
    const command = new GetObjectCommand({
      Bucket: env.S3_BUCKET,
      Key: fileKey,
    });

    return await getSignedUrl(s3Client, command, { expiresIn });
  } catch (error) {
    if (error instanceof BadRequestException) {
      throw error;
    }
    throw new Error(
      `Failed to generate S3 download URL: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}
export async function deleteFile(fileKey: string): Promise<void> {
  if (!fileKey) {
    throw new BadRequestException('fileKey is required');
  }

  try {
    const command = new DeleteObjectCommand({
      Bucket: env.S3_BUCKET,
      Key: fileKey,
    });

    await s3Client.send(command);
  } catch (error) {
    if (error instanceof BadRequestException) {
      throw error;
    }
    throw new Error(
      `Failed to delete file from S3: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

export async function checkFileExists(fileKey: string): Promise<boolean> {
  if (!fileKey) return false;

  try {
    const command = new HeadObjectCommand({
      Bucket: env.S3_BUCKET,
      Key: fileKey,
    });

    await s3Client.send(command);
    return true;
  } catch (error: unknown) {
    const errorRecord = error as { name?: string; $metadata?: { httpStatusCode?: number } };
    if (errorRecord.name === 'NotFound' || errorRecord.$metadata?.httpStatusCode === 404) {
      return false;
    }
    throw new Error(
      `Failed to verify file existence in S3: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

export const uploadFile = getUploadPresignedUrl;
export const downloadFile = getDownloadPresignedUrl;
export const deleteObject = deleteFile;
export const fileExists = checkFileExists;