import {
  FILE_CONFIG,
  ALL_ALLOWED_MIME_TYPES,
  type AllowedMimeType,
} from './s3Constants.js';
import { BadRequestException } from '../../errors/index.js';

export { BadRequestException };

export function validateMimeType(mimeType: string): asserts mimeType is AllowedMimeType {

  if (!ALL_ALLOWED_MIME_TYPES.includes(mimeType as AllowedMimeType)) {
    throw new BadRequestException(
      `Unsupported file type: ${mimeType}. Allowed types: ${ALL_ALLOWED_MIME_TYPES.join(', ')}`
    );
  }
}

export function validateFileSize(mimeType: string, fileSize: number): void {
  const isImage = (FILE_CONFIG.ALLOWED_IMAGE_TYPES as readonly string[]).includes(mimeType);
  const isDocument = (FILE_CONFIG.ALLOWED_DOCUMENT_TYPES as readonly string[]).includes(mimeType);

  if (isImage && fileSize > FILE_CONFIG.MAX_IMAGE_SIZE) {
    throw new BadRequestException(
      `Image size (${(fileSize / (1024 * 1024)).toFixed(1)} MB) exceeds maximum limit of ${FILE_CONFIG.MAX_IMAGE_SIZE / (1024 * 1024)} MB`
    );
  }

  if (isDocument && fileSize > FILE_CONFIG.MAX_PDF_SIZE) {
    throw new BadRequestException(
      `Document size (${(fileSize / (1024 * 1024)).toFixed(1)} MB) exceeds maximum limit of ${FILE_CONFIG.MAX_PDF_SIZE / (1024 * 1024)} MB`
    );
  }
}

export function validateFileUpload(mimeType: string, fileSize: number): asserts mimeType is AllowedMimeType {
  validateMimeType(mimeType);
  validateFileSize(mimeType, fileSize);
}