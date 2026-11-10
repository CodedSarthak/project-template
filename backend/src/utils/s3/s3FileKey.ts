import path from 'path';
import crypto from 'crypto';

export function generateFileKey(
  userId: string,
  originalFileName: string,
  folder?: string
): string {
  const ext = path.extname(originalFileName);
  const randomId = crypto.randomUUID();

  if (folder) {
    return `users/${userId}/${folder}/${randomId}${ext}`;
  }

  return `users/${userId}/${randomId}${ext}`;
}