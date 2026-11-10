export const FILE_CONFIG = {
  MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5 MB
  MAX_PDF_SIZE: 20 * 1024 * 1024, // 20 MB

  ALLOWED_IMAGE_TYPES: [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
  ] as const,

  ALLOWED_DOCUMENT_TYPES: [
    'application/pdf',
  ] as const,

  PRESIGNED_UPLOAD_EXPIRY: 60 * 5, // 5 minutes
  PRESIGNED_DOWNLOAD_EXPIRY: 60 * 15, // 15 minutes
  PRESIGNED_URL_EXPIRY: 60 * 5, // Backward compatibility
} as const;

export const ALL_ALLOWED_MIME_TYPES = [
  ...FILE_CONFIG.ALLOWED_IMAGE_TYPES,
  ...FILE_CONFIG.ALLOWED_DOCUMENT_TYPES,
] as const;

export type AllowedMimeType = (typeof ALL_ALLOWED_MIME_TYPES)[number];